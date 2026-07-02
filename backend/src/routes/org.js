import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get my organization + members
router.get('/', requireAuth, async (req, res) => {
  if (!req.user.organization_id) return res.status(404).json({ error: 'No organization' })
  const { rows: orgRows } = await pool.query(
    'SELECT id, name, invite_code, plan, created_at FROM organizations WHERE id = $1',
    [req.user.organization_id]
  )
  if (!orgRows.length) return res.status(404).json({ error: 'No organization' })
  const { rows: members } = await pool.query(
    'SELECT id, full_name, email, role, created_at FROM users WHERE organization_id = $1 ORDER BY created_at ASC',
    [req.user.organization_id]
  )
  res.json({ ...orgRows[0], members, myRole: req.user.role })
})

// Rename organization (owner only)
router.patch('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Only the owner can edit the organization' })
  const { name } = req.body
  const { rows } = await pool.query(
    'UPDATE organizations SET name = COALESCE($1, name) WHERE id = $2 RETURNING id, name',
    [name?.trim() || null, req.user.organization_id]
  )
  res.json(rows[0])
})

// Regenerate invite code (owner only)
router.post('/regenerate-invite', requireAuth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Only the owner can do this' })
  const code = Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
  const { rows } = await pool.query('UPDATE organizations SET invite_code = $1 WHERE id = $2 RETURNING invite_code', [code, req.user.organization_id])
  res.json(rows[0])
})

// Join another organization by invite code
router.post('/join', requireAuth, async (req, res) => {
  const { code } = req.body
  if (!code?.trim()) return res.status(400).json({ error: 'Invite code required' })
  const { rows: orgRows } = await pool.query('SELECT id, name, plan FROM organizations WHERE invite_code = $1', [code.trim().toUpperCase()])
  if (!orgRows.length) return res.status(404).json({ error: 'Invalid invite code' })
  const org = orgRows[0]
  // Join as member; inherit org plan for feature gating
  await pool.query("UPDATE users SET organization_id = $1, role = 'member', plan = $2 WHERE id = $3", [org.id, org.plan, req.user.id])
  res.json({ ok: true, organization: { id: org.id, name: org.name } })
})

export default router
