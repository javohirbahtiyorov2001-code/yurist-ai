import { Router } from 'express'
import multer from 'multer'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { analyzeContract } from '../services/claude.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, filename, risk_score, analysis->\'contractType\' as contract_type, analysis->\'summary\' as summary, created_at FROM contracts WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  )
  res.json(rows)
})

const PRO_PLANS = ['pro', 'entity']

router.post('/analyze', requireAuth, upload.single('file'), async (req, res) => {
  const { rows: userRows } = await pool.query('SELECT plan FROM users WHERE id = $1', [req.user.id])
  if (!PRO_PLANS.includes(userRows[0]?.plan)) {
    return res.status(403).json({ error: 'Contract analysis requires a Pro or Entity plan. Upgrade to access this feature.' })
  }
  const jurisdiction = 'UZ' // Uzbekistan-only for now; other regions coming soon

  let text = ''
  if (req.file) {
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer)
      text = data.text
    } else {
      text = req.file.buffer.toString('utf8')
    }
  } else if (req.body.text) {
    text = req.body.text
  } else {
    return res.status(400).json({ error: 'No file or text provided' })
  }

  if (text.length < 50) return res.status(400).json({ error: 'Contract text too short' })

  try {
    const analysis = await analyzeContract(text, jurisdiction)
    const riskScore = analysis.riskScore || 50
    const filename = req.file?.originalname || 'Pasted contract'

    const { rows } = await pool.query(
      'INSERT INTO contracts (user_id, filename, content, analysis, risk_score) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, filename, text.slice(0, 5000), JSON.stringify(analysis), riskScore]
    )

    res.json({ id: rows[0].id, analysis, riskScore })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM contracts WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

export default router
