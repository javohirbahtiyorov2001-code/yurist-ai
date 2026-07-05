import { Router } from 'express'
import multer from 'multer'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { draftFromTemplate, compareToTemplate } from '../services/claude.js'
import { saveWorkspaceItem } from '../services/workspace.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
const PRO_PLANS = ['pro', 'entity']
const requirePro = (req, res, next) => PRO_PLANS.includes(req.user.plan) ? next() : res.status(403).json({ error: 'Template library requires a Pro or Entity plan.' })

// List org templates
router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, doc_type, created_at FROM templates WHERE organization_id = $1 ORDER BY created_at DESC',
    [req.user.organization_id]
  )
  res.json(rows)
})

// Standard starter templates so a new org's library isn't empty
const STARTER_TEMPLATES = [
  { title: 'Standart NDA (Maxfiylik shartnomasi)', doc_type: 'NDA', content: `MAXFIYLIK SHARTNOMASI\n\n1. TARAFLAR\nUshbu shartnoma [Taraf A] va [Taraf B] o'rtasida tuzildi.\n\n2. MAXFIY MA'LUMOT\nMaxfiy ma'lumot deganda taraflar o'rtasida oshkor qilingan har qanday texnik, tijoriy, moliyaviy ma'lumot tushuniladi.\n\n3. MAJBURIYATLAR\nQabul qiluvchi taraf maxfiy ma'lumotni uchinchi shaxslarga oshkor qilmaydi va faqat shartnoma maqsadida foydalanadi.\n\n4. MUDDAT\nUshbu shartnoma 3 (uch) yil davomida amal qiladi.\n\n5. JAVOBGARLIK\nShartnoma buzilganda aybdor taraf yetkazilgan zararni to'liq qoplaydi.\n\n6. NIZOLARNI HAL QILISH\nNizolar O'zbekiston Respublikasi qonunchiligiga muvofiq sud tartibida hal qilinadi.\n\nImzolar: ________________  ________________` },
  { title: 'Standart mehnat shartnomasi', doc_type: 'Mehnat shartnomasi', content: `MEHNAT SHARTNOMASI\n\n1. TARAFLAR\nIsh beruvchi: [Kompaniya nomi]\nXodim: [F.I.Sh.]\n\n2. LAVOZIM VA VAZIFALAR\nXodim [lavozim] lavozimiga qabul qilinadi.\n\n3. ISH VAQTI\nHaftalik ish vaqti 40 soatdan oshmaydi (Mehnat kodeksi 100-modda).\n\n4. ISH HAQI\nOylik ish haqi: [summa] so'm, har oyda kamida bir marta to'lanadi.\n\n5. TA'TIL\nXodimga yiliga kamida 21 kalendar kun to'lanadigan ta'til beriladi.\n\n6. SHARTNOMA MUDDATI\n[Muddatsiz / muddatli].\n\n7. BEKOR QILISH\nShartnoma Mehnat kodeksida nazarda tutilgan asoslar bo'yicha bekor qilinadi.\n\nImzolar: ________________  ________________` },
  { title: 'Standart xizmat ko\'rsatish shartnomasi', doc_type: 'Xizmat shartnomasi', content: `XIZMAT KO'RSATISH SHARTNOMASI\n\n1. TARAFLAR\nIjrochi: [Nomi]\nBuyurtmachi: [Nomi]\n\n2. SHARTNOMA PREDMETI\nIjrochi quyidagi xizmatlarni ko'rsatadi: [xizmatlar tavsifi].\n\n3. MUDDAT\nXizmatlar [sana]gача ko'rsatiladi.\n\n4. TO'LOV\nXizmat qiymati: [summa] so'm. To'lov [tartib] asosida amalga oshiriladi.\n\n5. TARAFLAR JAVOBGARLIGI\nMajburiyatlar bajarilmaganda aybdor taraf neustoyka to'laydi (FK 386-modda).\n\n6. NIZOLAR\nNizolar O'zbekiston sudlarida hal qilinadi.\n\nImzolar: ________________  ________________` },
]

// Load the starter pack into the org's library
router.post('/starter-pack', requireAuth, requirePro, async (req, res) => {
  const created = []
  for (const t of STARTER_TEMPLATES) {
    const { rows } = await pool.query(
      'INSERT INTO templates (organization_id, title, doc_type, content, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id, title',
      [req.user.organization_id, t.title, t.doc_type, t.content, req.user.id]
    )
    created.push(rows[0])
  }
  res.json({ created: created.length, templates: created })
})

// Create a template
router.post('/', requireAuth, requirePro, async (req, res) => {
  const { title, docType, content } = req.body
  if (!title?.trim() || !content?.trim()) return res.status(400).json({ error: 'Title and content required' })
  const { rows } = await pool.query(
    'INSERT INTO templates (organization_id, title, doc_type, content, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, doc_type, created_at',
    [req.user.organization_id, title.trim(), docType || null, content, req.user.id]
  )
  res.json(rows[0])
})

// Get one template (with content)
router.get('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM templates WHERE id = $1 AND organization_id = $2', [req.params.id, req.user.organization_id])
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM templates WHERE id = $1 AND organization_id = $2', [req.params.id, req.user.organization_id])
  if (!rowCount) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Draft a new document from a template
router.post('/:id/draft', requireAuth, requirePro, async (req, res) => {
  const { instructions, lang = 'uz' } = req.body
  if (!instructions?.trim()) return res.status(400).json({ error: 'Instructions required' })
  const { rows } = await pool.query('SELECT title, content FROM templates WHERE id = $1 AND organization_id = $2', [req.params.id, req.user.organization_id])
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  try {
    const content = await draftFromTemplate(rows[0].content, instructions, lang)
    const title = `${rows[0].title} — ${new Date().toLocaleDateString()}`
    await saveWorkspaceItem(req.user.organization_id, req.user.id, 'draft', title, { content })
    res.json({ title, content })
  } catch (err) { console.error('templates:', err); res.status(500).json({ error: 'Server error' }) }
})

// Compare an incoming document against a template (playbook review)
router.post('/:id/compare', requireAuth, requirePro, upload.single('file'), async (req, res) => {
  const { rows } = await pool.query('SELECT title, content FROM templates WHERE id = $1 AND organization_id = $2', [req.params.id, req.user.organization_id])
  if (!rows.length) return res.status(404).json({ error: 'Template not found' })

  let text = req.body.text || ''
  if (req.file) {
    if (req.file.mimetype === 'application/pdf') { text = (await pdf(req.file.buffer)).text }
    else if (req.file.mimetype.startsWith('text/')) { text = req.file.buffer.toString('utf8') }
    else return res.status(400).json({ error: 'Attach a PDF or text document' })
  }
  if (text.length < 50) return res.status(400).json({ error: 'Document too short' })

  try {
    const result = await compareToTemplate(rows[0].content, text, req.body.lang || 'uz')
    if (result.error) return res.status(422).json(result)
    await saveWorkspaceItem(req.user.organization_id, req.user.id, 'review', `Playbook review vs ${rows[0].title}`, result)
    res.json(result)
  } catch (err) { console.error('templates:', err); res.status(500).json({ error: 'Server error' }) }
})

export default router
