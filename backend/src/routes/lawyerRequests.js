import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Client creates a referral request with an auto-built case package
router.post('/', requireAuth, async (req, res) => {
  const { specialty, note, lawyerId, workspaceItemIds } = req.body
  if (!specialty && !note?.trim()) return res.status(400).json({ error: 'Add a specialty or a note' })

  // Assemble the case package from selected workspace items (scoped to the org)
  let items = []
  if (Array.isArray(workspaceItemIds) && workspaceItemIds.length) {
    const { rows } = await pool.query(
      'SELECT kind, title, data FROM workspace_items WHERE organization_id = $1 AND id = ANY($2::uuid[])',
      [req.user.organization_id, workspaceItemIds]
    )
    items = rows.map(r => ({ kind: r.kind, title: r.title, summary: r.data?.summary || '' }))
  }
  const casePackage = { note: note || '', source: req.body.source || 'manual', items }

  const { rows } = await pool.query(
    `INSERT INTO lawyer_requests (client_user_id, client_org_id, lawyer_id, specialty, case_package)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, status, created_at`,
    [req.user.id, req.user.organization_id, lawyerId || null, specialty || null, JSON.stringify(casePackage)]
  )
  res.json(rows[0])
})

// Client: my sent requests
router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT lr.id, lr.specialty, lr.status, lr.created_at, lp.full_name AS lawyer_name,
            CASE WHEN lr.status = 'accepted' THEN lp.contact ELSE NULL END AS lawyer_contact
     FROM lawyer_requests lr LEFT JOIN lawyer_profiles lp ON lp.id = lr.lawyer_id
     WHERE lr.client_user_id = $1 ORDER BY lr.created_at DESC`,
    [req.user.id]
  )
  res.json(rows)
})

// Lawyer: incoming requests (addressed to me, or broadcast matching my specialties)
router.get('/inbox', requireAuth, async (req, res) => {
  const { rows: prof } = await pool.query('SELECT id, specialties, verified FROM lawyer_profiles WHERE user_id = $1', [req.user.id])
  if (!prof.length) return res.json([])
  const me = prof[0]
  // Directed requests (client picked this lawyer) are always visible — that's client consent.
  // Broadcast requests (unassigned) expose the client's case package, so only VERIFIED lawyers
  // may see them — otherwise anyone could self-register and harvest clients' legal data.
  const { rows } = await pool.query(
    `SELECT lr.id, lr.specialty, lr.status, lr.created_at, lr.case_package,
            CASE WHEN lr.status = 'accepted' THEN u.email ELSE NULL END AS client_email
     FROM lawyer_requests lr LEFT JOIN users u ON u.id = lr.client_user_id
     WHERE lr.lawyer_id = $1 OR ($2 = TRUE AND lr.lawyer_id IS NULL AND lr.specialty = ANY($3))
     ORDER BY lr.created_at DESC LIMIT 100`,
    [me.id, me.verified, me.specialties]
  )
  res.json(rows)
})

// Update status: lawyer accepts, or either side closes
router.patch('/:id', requireAuth, async (req, res) => {
  const { status } = req.body
  if (!['viewed', 'accepted', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' })

  // A lawyer accepting a request. Directed requests (addressed to them) can be accepted by
  // that lawyer; broadcast (unassigned) requests can only be claimed by VERIFIED lawyers.
  if (status === 'accepted') {
    const { rows: prof } = await pool.query('SELECT id, verified FROM lawyer_profiles WHERE user_id = $1', [req.user.id])
    if (!prof.length) return res.status(403).json({ error: 'Not a lawyer' })
    const { rows } = await pool.query(
      `UPDATE lawyer_requests SET status='accepted', lawyer_id=$1, updated_at=NOW()
       WHERE id=$2 AND (lawyer_id=$1 OR (lawyer_id IS NULL AND $3 = TRUE)) RETURNING id, status`,
      [prof[0].id, req.params.id, prof[0].verified]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found or requires verification' })
    return res.json(rows[0])
  }

  // client (or lawyer) updates their own request status
  const { rows } = await pool.query(
    `UPDATE lawyer_requests SET status=$1, updated_at=NOW()
     WHERE id=$2 AND (client_user_id=$3 OR lawyer_id IN (SELECT id FROM lawyer_profiles WHERE user_id=$3)) RETURNING id, status`,
    [status, req.params.id, req.user.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

export default router
