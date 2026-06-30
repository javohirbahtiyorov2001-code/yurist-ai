import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: false,
  args: ['--no-sandbox', '--lang=ru-RU'],
  defaultViewport: { width: 1280, height: 900 },
})

const page = await browser.newPage()

// Capture JSON responses
page.on('response', async res => {
  const url = res.url()
  const ct = res.headers()['content-type'] || ''
  if (ct.includes('json') && url.includes('lex.uz')) {
    try {
      const text = await res.text()
      console.log(`\n[JSON] ${url}\n${text.slice(0, 1000)}\n---`)
    } catch {}
  }
})

// Go to Russian search page and search for Civil Code
console.log('Loading search page...')
await page.goto('https://lex.uz/ru/search', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))

// Look for search input and search for Гражданский кодекс
const inputs = await page.evaluate(() =>
  Array.from(document.querySelectorAll('input')).map(i => ({ name: i.name, id: i.id, placeholder: i.placeholder, type: i.type }))
)
console.log('Inputs found:', JSON.stringify(inputs, null, 2))

// Try searching
await page.evaluate(() => {
  const input = document.querySelector('input[type="text"], input[name="query"], input[name="q"], .search-input input')
  if (input) { input.value = 'Гражданский кодекс'; input.dispatchEvent(new Event('input', { bubbles: true })) }
})

await new Promise(r => setTimeout(r, 1000))
const searchBtn = await page.$('button[type="submit"], .search-btn, button.btn-search')
if (searchBtn) { await searchBtn.click(); await new Promise(r => setTimeout(r, 3000)) }

// Get current page links
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href*="/docs"], a[href*="/act"], a[href*="/ru/"]'))
    .map(a => ({ text: a.innerText.trim().slice(0, 80), href: a.href }))
    .filter(l => l.text && !l.href.includes('#'))
    .slice(0, 20)
)
console.log('\nDocument links found:')
links.forEach(l => console.log(`  [${l.text}] → ${l.href}`))

// Try the catalog page
console.log('\nLoading catalog...')
await page.goto('https://lex.uz/ru/catalog', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))

const catalogLinks = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href]'))
    .map(a => ({ text: a.innerText.trim().slice(0, 80), href: a.href }))
    .filter(l => l.text && l.href.includes('lex.uz') && !l.href.endsWith('/ru/catalog'))
    .slice(0, 30)
)
console.log('\nCatalog links:')
catalogLinks.forEach(l => console.log(`  [${l.text}] → ${l.href}`))

// Try direct known Civil Code URL
console.log('\nTrying Civil Code direct URL...')
await page.goto('https://lex.uz/ru/docs/-111181', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))
console.log('Civil Code URL title:', await page.title())
console.log('Civil Code URL:', page.url())

// Try without minus sign
await page.goto('https://lex.uz/ru/docs/111181', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))
console.log('Without minus title:', await page.title())
console.log('Without minus URL:', page.url())

const preview = await page.evaluate(() => document.body.innerText.slice(0, 500))
console.log('Body preview:', preview)

await new Promise(r => setTimeout(r, 5000))
await browser.close()
