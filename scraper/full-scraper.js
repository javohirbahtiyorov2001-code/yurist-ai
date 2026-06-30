/**
 * LexCIS Full Scraper — lex.uz
 * Scrapes all major Uzbek legal codes from lex.uz using confirmed document IDs
 */
import https from 'https'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Confirmed working document IDs from lex.uz
// Format: /ru/docs/<id>
const DOCUMENTS = [
  { id: '111181',  name: 'Гражданский кодекс (часть 1)',     en: 'Civil Code Part 1',            jurisdiction: 'UZ', tags: ['civil','contract','property','obligations'] },
  { id: '180550',  name: 'Гражданский кодекс (часть 2)',     en: 'Civil Code Part 2',            jurisdiction: 'UZ', tags: ['civil','contract','property','obligations'] },
  { id: '3517334', name: 'Гражданский процессуальный кодекс', en: 'Civil Procedure Code',         jurisdiction: 'UZ', tags: ['civil procedure','court','lawsuit','claim'] },
  { id: '6257291', name: 'Трудовой кодекс',                  en: 'Labor Code',                   jurisdiction: 'UZ', tags: ['labor','employment','salary','dismissal','worker rights'] },
  { id: '104723',  name: 'Семейный кодекс',                  en: 'Family Code',                  jurisdiction: 'UZ', tags: ['family','marriage','divorce','children','alimony'] },
  { id: '3523895', name: 'Экономический процессуальный кодекс', en: 'Economic Procedure Code',   jurisdiction: 'UZ', tags: ['economic','business dispute','court','arbitration'] },
  { id: '3527365', name: 'Кодекс об административном судопроизводстве', en: 'Administrative Procedure Code', jurisdiction: 'UZ', tags: ['administrative','court','government'] },
  { id: '6445147', name: 'Конституция Республики Узбекистан', en: 'Constitution of Uzbekistan',  jurisdiction: 'UZ', tags: ['constitution','rights','fundamental','state'] },
  { id: '55599',   name: 'Воздушный кодекс',                 en: 'Air Code',                     jurisdiction: 'UZ', tags: ['air','aviation','transport'] },
]

// We'll also auto-discover more codes by following links
const discovered = new Set(DOCUMENTS.map(d => d.id))

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9',
        'Referer': 'https://lex.uz/ru/',
      }
    }, res => {
      if (res.statusCode >= 300 && res.headers.location) {
        const r = res.headers.location.startsWith('http') ? res.headers.location : 'https://lex.uz' + res.headers.location
        return get(r).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', d => chunks.push(d))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }))
    }).on('error', reject)
  })
}

function parseArticles(html) {
  // Strip scripts/styles
  const clean = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean)

  const articles = []
  let current = null
  let buffer = []

  for (const line of lines) {
    // Match article headers: "Статья 1." "Статья 1-1." "Статья 1."
    const m = line.match(/^(Статья|статья)\s+(\d+[\d\-\.]*)[.\s:–—]*(.*)$/i)
    if (m) {
      if (current && buffer.length > 0) {
        articles.push({ ...current, content: buffer.join('\n').trim() })
      }
      current = {
        article_number: m[2].replace(/\.$/, ''),
        title: m[3].trim() || null,
      }
      buffer = []
    } else if (current) {
      // Skip navigation lines and copyright
      if (
        line.length > 10 &&
        !line.startsWith('©') &&
        !line.includes('lex.uz') &&
        !line.match(/^(Раздел|РАЗДЕЛ|Глава|ГЛАВА|Часть|ЧАСТЬ|Подраздел|ПОДРАЗДЕЛ)\s+[IVX\d]/i)
      ) {
        buffer.push(line)
      }
    }
  }

  if (current && buffer.length > 0) {
    articles.push({ ...current, content: buffer.join('\n').trim() })
  }

  return articles
}

async function scrapeDoc(doc) {
  const url = `https://lex.uz/ru/docs/${doc.id}`
  console.log(`\n📖 Fetching: ${doc.en || doc.name} (id=${doc.id})`)
  console.log(`   URL: ${url}`)

  let response
  try {
    response = await get(url)
  } catch (err) {
    console.log(`   ✗ Network error: ${err.message}`)
    return { saved: 0, links: [] }
  }

  if (response.status !== 200 || response.body.length < 5000) {
    console.log(`   ✗ Status ${response.status}, body=${response.body.length}`)
    return { saved: 0, links: [] }
  }

  // Extract all internal doc links for discovery
  const linkedIds = [...new Set([...response.body.matchAll(/\/ru\/docs\/(\d+)/g)].map(m => m[1]))]
    .filter(id => !discovered.has(id))

  const stCount = (response.body.match(/Статья/g) || []).length
  console.log(`   Body: ${response.body.length} chars, Статья×${stCount}, links: ${linkedIds.length} new`)

  if (stCount === 0) {
    console.log(`   ✗ No articles found in page`)
    return { saved: 0, links: linkedIds }
  }

  const articles = parseArticles(response.body)
  console.log(`   Parsed: ${articles.length} articles`)

  let saved = 0
  let skipped = 0
  for (const article of articles) {
    if (!article.content || article.content.length < 20) { skipped++; continue }

    try {
      const result = await pool.query(
        `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [
          doc.jurisdiction,
          doc.en || doc.name,
          article.article_number,
          article.title,
          article.content,
          doc.tags,
        ]
      )
      if (result.rowCount > 0) saved++
    } catch (err) {
      console.error(`   DB error article ${article.article_number}: ${err.message}`)
    }
  }

  console.log(`   ✓ Saved: ${saved} new articles (${skipped} skipped, ${articles.length - saved - skipped} duplicates)`)
  return { saved, links: linkedIds }
}

async function discoverAndTest(ids) {
  // Test unknown IDs to see if they contain articles
  const newDocs = []
  for (const id of ids.slice(0, 50)) { // limit discovery per run
    if (discovered.has(id)) continue
    discovered.add(id)

    const r = await get(`https://lex.uz/ru/docs/${id}`)
    if (r.status === 200 && r.body.length > 10000) {
      const stCount = (r.body.match(/Статья/g) || []).length
      if (stCount > 20) { // Has substantial article content
        const title = (r.body.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || '').trim()
        const cleanTitle = title.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
        console.log(`   🔍 Discovered: id=${id}, Статья×${stCount}, "${cleanTitle.slice(0, 80)}"`)
        newDocs.push({ id, name: cleanTitle, jurisdiction: 'UZ', tags: ['law', 'uzbekistan'] })
      }
    }
    await new Promise(r => setTimeout(r, 200))
  }
  return newDocs
}

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║   LexCIS Full Scraper — lex.uz        ║')
  console.log('╚══════════════════════════════════════╝')
  console.log(`Scraping ${DOCUMENTS.length} documents...\n`)

  // Check current DB state
  const { rows } = await pool.query('SELECT COUNT(*) FROM law_articles')
  console.log(`Current articles in DB: ${rows[0].count}\n`)

  let totalSaved = 0
  const allNewLinks = []

  for (const doc of DOCUMENTS) {
    const { saved, links } = await scrapeDoc(doc)
    totalSaved += saved
    allNewLinks.push(...links)
    // Polite delay between requests
    await new Promise(r => setTimeout(r, 1000))
  }

  // Discover more codes from linked IDs
  if (allNewLinks.length > 0) {
    console.log(`\n🔍 Discovering ${allNewLinks.length} linked documents...`)
    const newDocs = await discoverAndTest([...new Set(allNewLinks)])

    for (const doc of newDocs) {
      const { saved } = await scrapeDoc(doc)
      totalSaved += saved
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  const final = await pool.query('SELECT COUNT(*) FROM law_articles')
  await pool.end()

  console.log('\n╔══════════════════════════════════════╗')
  console.log(`║  Done! New articles saved: ${String(totalSaved).padEnd(9)}║`)
  console.log(`║  Total in DB: ${String(final.rows[0].count).padEnd(23)}║`)
  console.log('╚══════════════════════════════════════╝')
}

main().catch(err => {
  console.error('Fatal error:', err)
  pool.end()
  process.exit(1)
})
