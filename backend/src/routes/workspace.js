import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// List all saved items for my organization (metadata only)
router.get('/', requireAuth, async (req, res) => {
  if (!req.user.organization_id) return res.json([])
  const { kind } = req.query
  const params = [req.user.organization_id]
  let where = 'organization_id = $1'
  if (kind) { params.push(kind); where += ` AND kind = $${params.length}` }
  const { rows } = await pool.query(
    `SELECT wi.id, wi.kind, wi.title, wi.created_at, u.full_name AS author
     FROM workspace_items wi LEFT JOIN users u ON u.id = wi.user_id
     WHERE ${where} ORDER BY wi.created_at DESC LIMIT 200`,
    params
  )
  res.json(rows)
})

// Get a single item with its full data
router.get('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, kind, title, data, created_at FROM workspace_items WHERE id = $1 AND organization_id = $2',
    [req.params.id, req.user.organization_id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Delete an item
router.delete('/:id', requireAuth, async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM workspace_items WHERE id = $1 AND organization_id = $2',
    [req.params.id, req.user.organization_id]
  )
  if (!rowCount) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

export default router
