import { Router } from 'express'
import multer from 'multer'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { tabularReview } from '../services/claude.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 12 } })
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const PRO_PLANS = ['pro', 'entity']

// Turn an uploaded file into a document object for the reviewer
async function toDocument(file) {
  const name = file.originalname.replace(/\.[^.]+$/, '')
  if (ALLOWED_IMAGE.includes(file.mimetype)) {
    return { name, kind: 'image', mediaType: file.mimetype, data: file.buffer.toString('base64') }
  }
  if (file.mimetype === 'application/pdf') {
    const data = await pdf(file.buffer)
    return { name, kind: 'text', text: data.text }
  }
  if (file.mimetype.startsWith('text/')) {
    return { name, kind: 'text', text: file.buffer.toString('utf8') }
  }
  return null
}

router.post('/', requireAuth, upload.array('files', 12), async (req, res) => {
  const { rows: userRows } = await pool.query('SELECT plan FROM users WHERE id = $1', [req.user.id])
  if (!PRO_PLANS.includes(userRows[0]?.plan)) {
    return res.status(403).json({ error: 'Document review requires a Pro or Entity plan. Upgrade to access this feature.' })
  }

  const files = req.files || []
  if (files.length < 2) return res.status(400).json({ error: 'Attach at least 2 documents to compare.' })

  const jurisdiction = 'UZ'
  const task = req.body.task || ''

  try {
    const documents = []
    for (const f of files) {
      const doc = await toDocument(f)
      if (!doc) return res.status(400).json({ error: `Unsupported file type: ${f.originalname}. Use PDF, image, or text.` })
      documents.push(doc)
    }

    const result = await tabularReview(documents, task, jurisdiction)
    if (result.error) return res.status(422).json(result)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
