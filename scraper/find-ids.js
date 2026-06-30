import https from 'https'

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9',
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

// Check all doc IDs linked from the Civil Code page
const linkedIds = ['111189', '3689267', '6445147', '1448771', '7599266', '104723', '6257291', '55599', '156171', '4396488', '3517334', '4193763', '180550', '1590546', '2156897', '3340556', '3523895', '1072094', '3527365']

console.log('=== Testing IDs linked from Civil Code ===')
for (const id of linkedIds) {
  const r = await get(`https://lex.uz/ru/docs/${id}`)
  if (r.status === 200 && r.body.length > 5000) {
    const stCount = (r.body.match(/Статья/g) || []).length
    const title = (r.body.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || '').trim().slice(0, 100)
    if (stCount > 0) {
      console.log(`FOUND: id=${id} → Статья×${stCount}, title="${title}"`)
    } else {
      console.log(`ok: id=${id} → len=${r.body.length}, title="${title.slice(0,60)}"`)
    }
  } else {
    console.log(`skip: id=${id} → status=${r.status}`)
  }
  await new Promise(r => setTimeout(r, 200))
}

// Also search the homepage for specific code titles
console.log('\n=== Searching for specific codes via keyword ===')
const homepage = await get('https://lex.uz/ru/')
// Extract all doc IDs from homepage
const allIds = [...new Set([...homepage.body.matchAll(/\/ru\/docs\/(-?\d+)/g)].map(m => m[1]))]
console.log('All doc IDs on homepage:', allIds.slice(0, 30))

// Look for the "klassifkator" page which might list codes
console.log('\n=== klassifkator page ===')
const klass = await get('https://lex.uz/ru/klassifkator')
const klassIds = [...new Set([...klass.body.matchAll(/\/ru\/docs\/(-?\d+)/g)].map(m => m[1]))]
console.log('Doc IDs in klassifkator:', klassIds.slice(0, 30))
const klassHrefs = [...new Set([...klass.body.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]))]
console.log('All hrefs in klassifkator:', klassHrefs.filter(h => !h.startsWith('http') && h !== '/ru/klassifkator').slice(0, 30))
