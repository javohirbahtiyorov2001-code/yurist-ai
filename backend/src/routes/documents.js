import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { draftDocument } from '../services/claude.js'
import { saveWorkspaceItem } from '../services/workspace.js'

const router = Router()

const DOCUMENT_TYPES = {
  nda: 'Non-Disclosure Agreement',
  employment: 'Employment Contract',
  partnership: 'Partnership Agreement',
  service: 'Service Agreement',
  loan: 'Loan Agreement',
  lease: 'Commercial Lease Agreement',
  supply: 'Supply Agreement',
  distribution: 'Distribution Agreement',
  agency: 'Agency Agreement',
  ip_assignment: 'Intellectual Property Assignment Agreement',
  charter: 'Company Charter (Ustav)',
  founding_decision: 'Founding Decision / Resolution',
  power_of_attorney: 'Power of Attorney (Ishonchnoma)',
  meeting_minutes: 'Meeting Minutes (Bayonnoma)',
}

router.get('/types', (req, res) => {
  res.json(Object.entries(DOCUMENT_TYPES).map(([key, label]) => ({ key, label })))
})

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, document_type, title, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  )
  res.json(rows)
})

router.post('/draft', requireAuth, async (req, res) => {
  const { type, parameters } = req.body
  const jurisdiction = 'UZ' // Uzbekistan-only for now; other regions coming soon
  if (!type || !parameters) return res.status(400).json({ error: 'type and parameters required' })
  if (!DOCUMENT_TYPES[type]) return res.status(400).json({ error: 'Unknown document type' })

  try {
    const content = await draftDocument(type, parameters, jurisdiction)
    const title = `${DOCUMENT_TYPES[type]} — ${new Date().toLocaleDateString()}`

    const { rows } = await pool.query(
      'INSERT INTO documents (user_id, document_type, title, content, parameters) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, type, title, content, JSON.stringify(parameters)]
    )
    await saveWorkspaceItem(req.user.organization_id, req.user.id, 'draft', title, { content })

    res.json({ id: rows[0].id, title, content })
  } catch (err) {
    console.error('documents/draft:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

export default router
