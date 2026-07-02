import Anthropic from '@anthropic-ai/sdk'
import pool from '../db/pool.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function searchLawArticles(query, jurisdiction = 'UZ', lang = 'uz') {
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  if (!keywords.length) return []

  // Search across all language columns so UZ/RU/EN queries all match
  const conditions = keywords.map((_, i) =>
    `(content ILIKE $${i + 1} OR content_uz ILIKE $${i + 1} OR content_ru ILIKE $${i + 1} OR title ILIKE $${i + 1} OR $${i + 1} = ANY(tags::text[]))`
  ).join(' OR ')
  const params = keywords.map(k => `%${k}%`)

  // Return the article text in the user's language, falling back to English
  const contentCol = { uz: 'COALESCE(content_uz, content)', ru: 'COALESCE(content_ru, content)', en: 'content' }[lang] || 'COALESCE(content_uz, content)'

  const { rows } = await pool.query(
    `SELECT code_name, article_number, title, ${contentCol} AS content, source_url, source_name FROM law_articles
     WHERE jurisdiction = 'UZ' AND (${conditions})
     LIMIT 5`,
    params
  )
  return rows
}

const LANG_NAME = { uz: "o'zbek (lotin)", ru: 'русский', en: 'English' }

export async function legalChat(messages, jurisdiction = 'UZ', attachment = null, lang = null) {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || ''
  // Include extracted PDF text in retrieval keywords so law search still works for documents
  const retrievalQuery = attachment?.kind === 'text' ? `${lastUserMessage} ${attachment.text}`.slice(0, 2000) : lastUserMessage
  const articles = await searchLawArticles(retrievalQuery, jurisdiction, lang || 'uz')

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
- ${lang && LANG_NAME[lang] ? `ALWAYS respond in ${LANG_NAME[lang]}, regardless of the language the user writes in.` : 'Answer in the same language the user writes in (Uzbek, Russian, or English)'}
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

  // Build Claude messages; attach image (vision) or extracted PDF text to the last user turn
  const claudeMessages = messages.map(m => ({ role: m.role, content: m.content }))
  if (attachment) {
    const lastUserIdx = claudeMessages.map(m => m.role).lastIndexOf('user')
    if (lastUserIdx !== -1) {
      const textPart = claudeMessages[lastUserIdx].content
      if (attachment.kind === 'image') {
        claudeMessages[lastUserIdx].content = [
          { type: 'text', text: textPart || 'Please review the attached document/image and explain it under Uzbek law.' },
          { type: 'image', source: { type: 'base64', media_type: attachment.mediaType, data: attachment.data } },
        ]
      } else if (attachment.kind === 'text') {
        claudeMessages[lastUserIdx].content = `${textPart || 'Please review this document under Uzbek law.'}\n\n--- ATTACHED DOCUMENT TEXT ---\n${attachment.text.slice(0, 12000)}`
      }
    }
  }

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: claudeMessages,
    stream: true,
  })

  return { stream, citations: articles.map(a => ({ code: a.code_name, article: a.article_number, title: a.title, sourceUrl: a.source_url, sourceName: a.source_name })) }
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

// Multi-document tabular review: compare N documents into a structured comparison table
export async function tabularReview(documents, task, jurisdiction = 'UZ', lang = null) {
  const names = documents.map(d => d.name)
  const langDirective = lang && LANG_NAME[lang] ? `Write ALL cell values and text in ${LANG_NAME[lang]}.` : 'Write cell values in the SAME language as the documents.'

  const instruction = `You are a senior ${jurisdiction} legal analyst. You are given ${documents.length} documents. Compare them and build a structured comparison table.

USER'S TASK: ${task || 'Identify every factual issue across the documents. First column = the factual issue in logical/chronological order; one remaining column per document.'}

Return ONLY a JSON object with this exact structure:
{
  "title": "short title of the review",
  "documents": ${JSON.stringify(names)},
  "rows": [
    { "issue": "the factual issue / topic / clause", "cells": { ${names.map(n => `"${n}": "what this document says about it"`).join(', ')} } }
  ],
  "conflicts": ["describe any contradictions between documents"],
  "summary": "2-3 sentence overall summary"
}

RULES:
- Use EXACTLY these document names as keys: ${JSON.stringify(names)}
- If a document does not address an issue, set its cell to "Muhokama qilinmagan" (or "Not discussed" if the documents are in English).
- Keep cell values concise (1-3 sentences). Order rows logically or chronologically.
- ${langDirective}
- Return ONLY the JSON, no prose before or after.`

  const content = [{ type: 'text', text: instruction }]
  for (const doc of documents) {
    if (doc.kind === 'image') {
      content.push({ type: 'text', text: `\n\n=== DOCUMENT: ${doc.name} (image) ===` })
      content.push({ type: 'image', source: { type: 'base64', media_type: doc.mediaType, data: doc.data } })
    } else {
      content.push({ type: 'text', text: `\n\n=== DOCUMENT: ${doc.name} ===\n${(doc.text || '').slice(0, 15000)}` })
    }
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content }],
  })

  const raw = response.content[0].text
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return { error: 'Could not parse review', raw }
  try {
    return JSON.parse(jsonMatch[0])
  } catch {
    return { error: 'Could not parse review', raw }
  }
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
