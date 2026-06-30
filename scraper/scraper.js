import puppeteer from 'puppeteer'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Known lex.uz document IDs for major codes
const DOCUMENTS = {
  civil: {
    id: '111181',
    name: 'Civil Code',
    jurisdiction: 'UZ',
    tags: ['civil', 'contract', 'obligations', 'property'],
  },
  labor: {
    id: '102931',
    name: 'Labor Code',
    jurisdiction: 'UZ',
    tags: ['labor', 'employment', 'worker rights', 'salary'],
  },
  tax: {
    id: '509116',
    name: 'Tax Code',
    jurisdiction: 'UZ',
    tags: ['tax', 'taxation', 'VAT', 'income tax', 'business'],
  },
  criminal: {
    id: '111181',
    name: 'Criminal Code',
    jurisdiction: 'UZ',
    tags: ['criminal', 'crime', 'penalty', 'punishment'],
  },
  family: {
    id: '100758',
    name: 'Family Code',
    jurisdiction: 'UZ',
    tags: ['family', 'marriage', 'divorce', 'children'],
  },
  administrative: {
    id: '168591',
    name: 'Administrative Code',
    jurisdiction: 'UZ',
    tags: ['administrative', 'fine', 'penalty', 'regulation'],
  },
}

const target = process.argv[2]
const docsToScrape = target && DOCUMENTS[target]
  ? [DOCUMENTS[target]]
  : Object.values(DOCUMENTS)

async function scrapeDocument(browser, doc) {
  const url = `https://lex.uz/ru/docs/-${doc.id}`
  console.log(`\n📖 Scraping ${doc.name} from ${url}`)

  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
  await page.setViewport({ width: 1280, height: 900 })

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    await new Promise(r => setTimeout(r, 3000))

    // Try to find article elements — lex.uz uses various structures
    const articles = await page.evaluate(() => {
      const results = []

      // Strategy 1: look for numbered paragraphs (Статья X / Modda X)
      const allText = document.body.innerText
      const lines = allText.split('\n').map(l => l.trim()).filter(Boolean)

      let currentArticle = null
      let buffer = []

      for (const line of lines) {
        const articleMatch = line.match(/^(Статья|Modda|Article)\s+(\d+[\d\.]*)[.\s]*(.*)$/i)
        if (articleMatch) {
          if (currentArticle && buffer.length > 0) {
            results.push({
              ...currentArticle,
              content: buffer.join(' ').trim(),
            })
          }
          currentArticle = {
            article_number: articleMatch[2],
            title: articleMatch[3].trim() || null,
          }
          buffer = []
        } else if (currentArticle) {
          // skip navigation/header lines
          if (line.length > 20 && !line.startsWith('©') && !line.includes('lex.uz')) {
            buffer.push(line)
          }
        }
      }

      if (currentArticle && buffer.length > 0) {
        results.push({ ...currentArticle, content: buffer.join(' ').trim() })
      }

      return results
    })

    console.log(`  Found ${articles.length} articles`)

    let saved = 0
    for (const article of articles) {
      if (!article.content || article.content.length < 30) continue

      try {
        await pool.query(
          `INSERT INTO law_articles (jurisdiction, code_name, article_number, title, content, tags)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [doc.jurisdiction, doc.name, article.article_number, article.title, article.content, doc.tags]
        )
        saved++
      } catch (err) {
        console.error(`  Error saving article ${article.article_number}:`, err.message)
      }
    }

    console.log(`  Saved ${saved} new articles to database`)
    return saved

  } catch (err) {
    console.error(`  Failed to scrape ${doc.name}: ${err.message}`)

    // Try alternative URL patterns
    const altUrls = [
      `https://lex.uz/ru/act/${doc.id}`,
      `https://lex.uz/docs/${doc.id}`,
    ]
    for (const altUrl of altUrls) {
      try {
        console.log(`  Trying ${altUrl}...`)
        await page.goto(altUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
        await new Promise(r => setTimeout(r, 2000))
        const title = await page.title()
        console.log(`  Page title: ${title}`)
      } catch {}
    }

    return 0
  } finally {
    await page.close()
  }
}

async function main() {
  console.log('LexCIS Scraper — lex.uz')
  console.log('========================')
  console.log(`Scraping ${docsToScrape.length} document(s)...`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=ru-RU'],
  })

  let totalSaved = 0
  for (const doc of docsToScrape) {
    const saved = await scrapeDocument(browser, doc)
    totalSaved += saved
    // polite delay between documents
    await new Promise(r => setTimeout(r, 2000))
  }

  await browser.close()
  await pool.end()

  console.log(`\nDone. Total articles saved: ${totalSaved}`)

  if (totalSaved === 0) {
    console.log('\nlex.uz may be blocking automated access.')
    console.log('Run: node import-manual.js  — to import from pre-downloaded text files.')
  }
}

main().catch(console.error)
