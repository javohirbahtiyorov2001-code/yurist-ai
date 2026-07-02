# Yurist AI — Harvey-Style Citation System Spec

**Goal:** Every legal claim the AI makes is traceable to a real Uzbek law article the user can click, read, and verify. No more fabricated article numbers. This is Harvey's core moat, adapted for a consumer, Uzbek-first product.

**Status:** Spec / not yet implemented. Supersedes the prompt-only guardrail shipped in commit `493d5a6`.

---

## 1. The problem we're solving

Our live test proved the failure mode:

- Uzbek/Russian queries retrieve **0 articles** (DB text is English-only) → the model either stays vague or invents article numbers.
- Even the current anti-hallucination prompt only *suppresses* citations; it doesn't *provide verifiable* ones.
- Harvey's whole value is: **"structured, citation-backed analysis, not a black-box answer"** with **traceable citations** — click a claim, see the exact source passage, confirm it supports the conclusion.

To match that, we need three things the current system lacks:
1. **Multilingual, searchable law text** (so retrieval fires in UZ/RU/EN).
2. **Inline citation markers** the model is forced to attach to each legal claim.
3. **A verification UI** — clickable citation → source panel showing the real article text.

---

## 2. Architecture overview

```
User question (UZ/RU/EN)
   │
   ├─► [1] Query normalization + embedding
   │
   ├─► [2] Hybrid retrieval (keyword + vector) over law_articles
   │        → top-K articles, each with a stable citation id
   │
   ├─► [3] LLM answer with FORCED inline markers  [[cite:<id>]]
   │
   ├─► [4] Post-process: map markers → citation objects,
   │        drop any claim citing an id NOT in retrieved set
   │
   └─► [5] Stream answer + structured citations to UI
            → user clicks marker → source panel shows real article
```

The key discipline (Harvey's): **the model may only cite from the retrieved set**, and **every citation resolves to a real DB row** the user can open.

---

## 3. Data model changes

### 3.1 Extend `law_articles` for multilingual + verifiable sources

```sql
ALTER TABLE law_articles
  ADD COLUMN content_uz   TEXT,          -- Uzbek (latin) official text
  ADD COLUMN content_ru   TEXT,          -- Russian official text
  ADD COLUMN content_en   TEXT,          -- English (optional, for EN users)
  ADD COLUMN source_url   TEXT,          -- lex.uz / official gazette link
  ADD COLUMN source_name  TEXT,          -- e.g. "lex.uz"
  ADD COLUMN version_date  DATE,         -- which redaction/version
  ADD COLUMN embedding    vector(1536);  -- pgvector; see 3.2

-- keep existing `content` as the canonical/fallback text
```

> Migration note: backfill `content_*` from the current `content` where possible; mark rows without official text as `source_url IS NULL` so the UI can badge them "unofficial paraphrase."

### 3.2 Enable pgvector for semantic retrieval

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE INDEX idx_law_articles_embedding
  ON law_articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Railway Postgres supports `pgvector`. If unavailable, fall back to Postgres full-text search (`tsvector`) per language — still a big upgrade over `ILIKE`.

### 3.3 Citations already have a home

`messages.citations JSONB` already exists. We standardize its shape (§6).

---

## 4. Retrieval — hybrid, multilingual

Replace `searchLawArticles()` in `src/services/claude.js`.

```js
// Pseudocode
async function retrieveArticles(query, lang) {
  // 1. Vector search (semantic, language-agnostic via multilingual embeddings)
  const qVec = await embed(query);                 // OpenAI text-embedding-3-small or similar
  const vecHits = await pool.query(`
    SELECT *, 1 - (embedding <=> $1) AS score
    FROM law_articles
    WHERE jurisdiction = 'UZ' AND embedding IS NOT NULL
    ORDER BY embedding <=> $1
    LIMIT 8`, [qVec]);

  // 2. Keyword search in the user's language column (fallback + boosts exact matches)
  const col = { uz: 'content_uz', ru: 'content_ru', en: 'content_en' }[lang] || 'content';
  const kwHits = await keywordSearch(query, col);

  // 3. Merge, dedupe by id, re-rank (vector score + keyword boost), keep top 5
  return rankAndMerge(vecHits, kwHits).slice(0, 5);
}
```

**Why this fixes the test failures:**
- Vector search on multilingual embeddings retrieves the *working hours* article whether the user typed "ish vaqti", "рабочее время", or "working hours."
- Keyword search in the correct language column catches exact statute references.
- We stop returning irrelevant articles because we re-rank by relevance and threshold low scores (drop `score < 0.25`).

---

## 5. Forcing verifiable inline citations

### 5.1 System prompt contract

The model receives retrieved articles each tagged with a **stable citation id** and must attach `[[cite:<id>]]` after every legal claim.

```
RETRIEVED UZBEK LAW ARTICLES — cite ONLY these, by their id:

<article id="a1" code="Labor Code" article="100" title="Working hours">
Normal working hours cannot exceed 40 hours per week...
</article>

<article id="a2" code="Labor Code" article="80" title="Employment contract">
...
</article>

CITATION RULES:
- After EVERY sentence that states what the law says, append the exact marker [[cite:<id>]]
  using one of the ids above. Example: "...cannot exceed 40 hours per week [[cite:a1]]."
- You may ONLY use ids that appear above. NEVER invent an id, article number, or code name.
- If no retrieved article supports a claim, do NOT state it as law — give general practical
  guidance and say you don't have the exact provision.
```

### 5.2 Post-processing (the safety net)

Even with instructions, we enforce mechanically in `chat.js` after streaming:

```js
const allowedIds = new Set(retrieved.map(a => a.id));
const usedIds = [...answer.matchAll(/\[\[cite:(\w+)\]\]/g)].map(m => m[1]);

// Drop/blank any marker referencing a non-retrieved id (hallucinated)
const cleanAnswer = answer.replace(/\[\[cite:(\w+)\]\]/g,
  (full, id) => allowedIds.has(id) ? full : '');

const citations = retrieved
  .filter(a => usedIds.includes(a.id) && allowedIds.has(a.id))
  .map(toCitationObject);
```

This guarantees: **a citation shown in the UI always resolves to a real, retrieved article.** That is the Harvey property.

---

## 6. Citation object shape (stored in `messages.citations`)

```json
{
  "id": "a1",
  "code_name": "Labor Code",
  "article_number": "100",
  "title": "Working hours",
  "quote": "Normal working hours cannot exceed 40 hours per week.",
  "source_url": "https://lex.uz/docs/...#a100",
  "source_name": "lex.uz",
  "version_date": "2023-04-30",
  "lang": "uz",
  "verified": true
}
```

`verified: true` only when `source_url` is present (official). Paraphrase-only rows render with an "unofficial" badge.

---

## 7. Frontend — the verification UX

In `frontend/src/pages/Chat.jsx`:

1. **Render markers as inline chips.** Replace `[[cite:a1]]` with a small superscript pill (e.g. `⟦Labor 100⟧`).
2. **Click → source panel** (right drawer or modal) showing:
   - Code name + article number + title
   - The **exact article text** (in the user's language)
   - "Open official source" link → `source_url`
   - `version_date` so users know it's current
3. **Citations list** under each answer (already partially built) — clickable, same panel.
4. **Unverified badge** when `verified === false`.

This is the click-to-verify loop that makes the product trustworthy — and legally defensible.

---

## 8. Knowledge base growth (the real moat)

Harvey = 600+ databases. We don't need that; we need **complete, current Uzbek codes**. Priority order:

| Phase | Content | Source |
|---|---|---|
| 1 | Labor Code, Civil Code, Consumer Protection, Family Code, Administrative Liability Code (full articles, UZ + RU) | lex.uz |
| 2 | Tax Code, Housing Code, Criminal Code (info-only), Entrepreneurship law | lex.uz |
| 3 | Government decrees, ministry regulations, high-court plenums | lex.uz / official gazette |

**Ingestion pipeline** (`scraper/` — a dir already exists in the repo):
1. Scrape lex.uz article-by-article (UZ + RU versions, capture `source_url` + `version_date`).
2. Chunk at article granularity (one row per article, per our schema).
3. Generate embeddings, insert into `law_articles`.
4. Re-run on a schedule to catch amendments (bump `version_date`).

> Legal/ToS note: verify lex.uz scraping terms before automated ingestion; official Uzbek legislation is generally public but rate-limit and attribute.

---

## 9. Rollout plan

1. **M1 — Schema + FTS (no vectors yet).** Add multilingual columns, backfill, switch retrieval to Postgres full-text per language. Ships multilingual retrieval fast.
2. **M2 — Forced markers + post-processing + citation panel.** The click-to-verify loop. This is the visible Harvey-style leap.
3. **M3 — pgvector semantic retrieval.** Handles paraphrased/colloquial questions.
4. **M4 — lex.uz ingestion pipeline (Phase 1 codes).** Real coverage.
5. **M5 — Amendment tracking + "unofficial" badges cleanup.**

---

## 10. Acceptance tests (re-run the ones that failed)

| Test | Pass criteria |
|---|---|
| Uzbek "ish haqi to'lanmadi" | ≥1 real citation retrieved; every article number in the answer resolves to a DB row |
| Russian "рабочее время" | Retrieves Labor Code 100; citation panel shows RU text + lex.uz link |
| Out-of-scope (divorce, before Family Code ingested) | No fabricated citations; honest "don't have the provision" |
| Hallucination probe | 0 markers survive post-processing that reference non-retrieved ids |
| Click citation | Source panel shows exact article text + working `source_url` |

**Definition of done:** on a sample of 50 real UZ/RU questions, 100% of displayed citations resolve to a real article, and a lawyer spot-check confirms the cited article actually supports the claim ≥90% of the time (Harvey's original bar was 86%).
