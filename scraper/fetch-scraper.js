/**
 * lex.uz fetch-based scraper — uses realistic browser headers
 * No Puppeteer needed; mimics a real browser HTTP request
 */
import https from 'https'
import http from 'http'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Known lex.uz document IDs (negative IDs = stored legislation)
// These can be found from lex.uz URL bar when viewing a document
const DOCUMENTS = [
  { id: '-111181', name: 'Civil Code',           jurisdiction: 'UZ', tags: ['civil','contract','obligations','property'] },
  { id: '-102931', name: 'Labor Code',            jurisdiction: 'UZ', tags: ['labor','employment','salary','dismissal'] },
  { id: '-509116', name: 'Tax Code',              jurisdiction: 'UZ', tags: ['tax','VAT','income tax','business'] },
  { id: '-68-I',   name: 'Criminal Code',         jurisdiction: 'UZ', tags: ['criminal','crime','penalty','punishment'] },
  { id: '-100758', name: 'Family Code',           jurisdiction: 'UZ', tags: ['family','marriage','divorce','children'] },
  { id: '-168591', name: 'Administrative Code',   jurisdiction: 'UZ', tags: ['administrative','fine','regulation'] },
  { id: '-5350',   name: 'Civil Procedure Code',  jurisdiction: 'UZ', tags: ['civil procedure','court','lawsuit'] },
  { id: '-162584', name: 'Business Code',         jurisdiction: 'UZ', tags: ['business','entrepreneur','company'] },
]

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: HEADERS }, res => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://lex.uz${res.headers.location}`
        console.log(`  Redirect → ${redirectUrl}`)
        return fetchUrl(redirectUrl).then(resolve).catch(reject)
      }

      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const buf = Buffer.concat(chunks)
        resolve({ status: res.statusCode, body: buf.toString('utf8'), headers: res.headers })
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function parseArticles(html, docName) {
  // Remove HTML tags to get plain text
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s{3,}/g, '\n')

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const articles = []
  let current = null
  let buffer = []

  for (const line of lines) {
    // Match: "Статья 1." or "Статья 1." + optional title, or just "Статья 1"
    const m = line.match(/^(Статья|Modda|Article)\s+(\d+[\d\-\.]*)[.\s:–—]*(.*)$/i)
    if (m) {
      if (current && buffer.length > 0) {
        articles.push({ ...current, content: buffer.join(' ').trim() })
      }
      current = { article_number: m[2], title: m[3].trim() || null }
      buffer = []
    } else if (current) {
      if (
        line.length > 15 &&
        !line.includes('lex.uz') &&
        !line.startsWith('©') &&
        !line.match(/^Раздел|^РАЗДЕЛ|^Глава|^ГЛАВА|^Часть|^ЧАСТЬ/i)
      ) {
        buffer.push(line)
        // Save after collecting 200 chars of content (article may span many lines)
        if (buffer.join(' ').length > 5000) {
          // Flush to avoid unbounded memory; article content continues
          // We'll just keep building (lex.uz articles can be long)
        }
      }
    }
  }

  if (current && buffer.length > 0) {
    articles.push({ ...current, content: buffer.join(' ').trim() })
  }

  return articles
}

async function scrapeDocument(doc) {
  const url = `https://lex.uz/ru/docs/${doc.id}`
  console.log(`\nFetching ${doc.name} → ${url}`)

  let response
  try {
    response = await fetchUrl(url)
  } catch (err) {
    console.log(`  Error: ${err.message}`)
    return 0
  }

  console.log(`  Status: ${response.status}`)
  console.log(`  Body length: ${response.body.length} chars`)

  if (response.status !== 200) {
    console.log(`  Body preview: ${response.body.slice(0, 300)}`)
    return 0
  }

  // Check if it's a real document page
  const hasContent = response.body.includes('Статья') || response.body.includes('Modda')
  console.log(`  Contains articles: ${hasContent}`)
  console.log(`  Page snippet: ${response.body.slice(0, 500).replace(/\s+/g, ' ')}`)

  if (!hasContent) {
    console.log('  No article content found — possibly a login page or redirect')
    return 0
  }

  const articles = parseArticles(response.body, doc.name)
  console.log(`  Parsed ${articles.length} articles`)

  let saved = 0
  for (const article of articles) {
    if (!article.content || article.content.length < 30) continue
    try {
      const result = await pool.query(
        `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [doc.jurisdiction, doc.name, article.article_number, article.title, article.content, doc.tags]
      )
      if (result.rowCount > 0) saved++
    } catch (err) {
      console.error(`  DB error for article ${article.article_number}: ${err.message}`)
    }
  }

  console.log(`  Saved ${saved} new articles`)
  return saved
}

async function main() {
  console.log('LexCIS Fetch Scraper — lex.uz')
  console.log('================================')

  // First test: can we reach lex.uz at all?
  console.log('Testing connectivity...')
  try {
    const test = await fetchUrl('https://lex.uz/ru/')
    console.log(`Homepage: ${test.status}, body=${test.body.length}`)
    if (test.status === 200) {
      console.log('Site is reachable!')
    }
  } catch (err) {
    console.log(`Cannot reach lex.uz: ${err.message}`)
    process.exit(1)
  }

  let total = 0
  for (const doc of DOCUMENTS) {
    const n = await scrapeDocument(doc)
    total += n
    // Polite delay
    await new Promise(r => setTimeout(r, 2000))
  }

  await pool.end()
  console.log(`\nTotal new articles saved: ${total}`)
}

main().catch(console.error)
