import Anthropic from '@anthropic-ai/sdk'
import pool from '../db/pool.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function searchLawArticles(query, jurisdiction = 'UZ') {
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  if (!keywords.length) return []

  const conditions = keywords.map((_, i) => `(content ILIKE $${i + 1} OR title ILIKE $${i + 1} OR $${i + 1} = ANY(tags::text[]))`).join(' OR ')
  const params = keywords.map(k => `%${k}%`)

  const { rows } = await pool.query(
    `SELECT code_name, article_number, title, content FROM law_articles
     WHERE (jurisdiction = $${params.length + 1} OR jurisdiction = 'UZ') AND (${conditions})
     LIMIT 5`,
    [...params, jurisdiction]
  )
  return rows
}

export async function legalChat(messages, jurisdiction = 'UZ') {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || ''
  const articles = await searchLawArticles(lastUserMessage, jurisdiction)

  const hasArticles = articles.length > 0

  const lawContext = hasArticles
    ? `RETRIEVED UZBEK LAW ARTICLES (these are the ONLY articles you are allowed to cite by number):\n\n` + articles.map(a =>
        `[${a.code_name}, Article ${a.article_number}${a.title ? ` — ${a.title}` : ''}]\n${a.content}`
      ).join('\n\n---\n\n')
    : `NO LAW ARTICLES WERE RETRIEVED FOR THIS QUESTION. You do NOT have the specific legal text. You MUST NOT cite, invent, or guess any article number, code name, or statute. Instead, explain the general practical steps and clearly tell the user you don't have the exact legal provision on hand and they should verify it with a lawyer or lawyer.uz / official sources.`

  const systemPrompt = `You are Yurist AI — a friendly, plain-language legal assistant for everyday people in Uzbekistan. You cover ONLY the law of the Republic of Uzbekistan. Support for other countries is coming soon.

YOUR STYLE:
- Write like a smart, trusted friend who happens to know the law — not like a formal lawyer
- Use simple language. Avoid legal jargon. If you must use a legal term, explain it in brackets.
- Answer in the same language the user writes in (Uzbek, Russian, or English)
- Be warm, direct, and reassuring — people come to you scared and confused

SCOPE — UZBEKISTAN ONLY:
- Only answer about the law of the Republic of Uzbekistan.
- Never reference the laws of Russia, Kazakhstan, Azerbaijan, or any other country. Do NOT say "in Russia, Kazakhstan and Uzbekistan..." or ask which country the user is in — assume Uzbekistan.
- If the user explicitly asks about another country, say that Yurist AI currently covers only Uzbekistan and support for other regions is coming soon.

CITATION RULES — THIS IS THE MOST IMPORTANT RULE:
- You may cite a specific article number ONLY if that exact article appears in the RETRIEVED UZBEK LAW ARTICLES section below.
- NEVER invent, guess, or recall article numbers from memory. If the retrieved section is empty or doesn't contain a relevant article, DO NOT cite any article number at all.
- It is far better to say "I don't have the exact article for this" than to state a number that might be wrong. A wrong article number can seriously harm the user.

YOUR STRUCTURE — always follow this format:
1. **What the law says** — only cite an article if it is in the retrieved section; otherwise describe the general rule without a number
2. **What this means for you** (plain language explanation of their specific situation)
3. **What you can do right now** (3-5 concrete action steps they can take TODAY)
4. **When to get a real lawyer** (be honest about when the situation needs professional help)

- End every response with a single line: "⚠️ Bu huquqiy ma'lumot, yuridik maslahat emas." (or the same disclaimer in the user's language)
- Focus on PRACTICAL help — what can they actually DO about their situation?

${lawContext}`

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
  })

  return { stream, citations: articles.map(a => ({ code: a.code_name, article: a.article_number, title: a.title })) }
}

export async function analyzeContract(text, jurisdiction = 'UZ') {
  const prompt = `You are a senior ${jurisdiction} contract lawyer. Analyze this contract thoroughly.

Return a JSON object with this exact structure:
{
  "summary": "2-3 sentence plain language summary",
  "riskScore": <number 0-100, where 0=very risky, 100=very safe>,
  "parties": ["party1", "party2"],
  "contractType": "type of contract",
  "keyDates": [{"label": "...", "date": "..."}],
  "risks": [
    {"severity": "high|medium|low", "clause": "...", "issue": "...", "recommendation": "..."}
  ],
  "missingClauses": ["clause that should exist but doesn't"],
  "lawComplianceIssues": ["any issues with ${jurisdiction} law compliance"],
  "positives": ["things the contract does well"]
}

CONTRACT:
${text.slice(0, 8000)}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].text
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Could not parse analysis', raw }
}

export async function draftDocument(type, parameters, jurisdiction = 'UZ') {
  const templates = {
    nda: 'Non-Disclosure Agreement (NDA)',
    employment: 'Employment Contract',
    partnership: 'Partnership Agreement',
    service: 'Service Agreement',
    loan: 'Loan Agreement',
    lease: 'Commercial Lease Agreement',
  }

  const docName = templates[type] || type

  const prompt = `You are a senior ${jurisdiction} lawyer. Draft a complete, legally valid ${docName} under ${jurisdiction} law.

Parameters provided:
${Object.entries(parameters).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Requirements:
- Use proper legal language
- Include all standard clauses required under ${jurisdiction} law
- Include dispute resolution clause referencing ${jurisdiction} courts
- Include governing law clause
- Add signature blocks
- Format with clear numbered sections and subsections
- Draft in the language requested or default to English

Draft the complete document now:`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content[0].text
}
