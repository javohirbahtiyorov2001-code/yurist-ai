import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Common Uzbek SMB compliance deadlines offered as one-click presets
const PRESETS = [
  { title: 'QQS deklaratsiyasi (VAT return)', category: 'tax', recurrence: 'monthly', notes: 'Har oy — keyingi oyning 20-sanasigacha' },
  { title: 'Foyda solig\'i (Profit tax)', category: 'tax', recurrence: 'quarterly', notes: 'Har chorak yakunidan keyin' },
  { title: 'Ijtimoiy soliq / ish haqi hisoboti', category: 'tax', recurrence: 'monthly', notes: 'Oylik ish haqi solig\'i hisoboti' },
  { title: 'Statistik hisobot', category: 'report', recurrence: 'quarterly', notes: 'Davlat statistika organiga' },
  { title: 'Litsenziya / ruxsatnoma yangilash', category: 'renewal', recurrence: 'yearly', notes: 'Faoliyat litsenziyasini yangilash' },
]

const withStatus = (rows) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return rows.map(r => {
    const due = new Date(r.due_date)
    const days = Math.round((due - today) / 86400000)
    return { ...r, days_until: days, state: r.status === 'done' ? 'done' : days < 0 ? 'overdue' : days <= 14 ? 'soon' : 'upcoming' }
  })
}

router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, category, due_date, recurrence, notes, status, created_at FROM compliance_items WHERE organization_id = $1 ORDER BY due_date ASC',
    [req.user.organization_id]
  )
  res.json(withStatus(rows))
})

router.post('/', requireAuth, async (req, res) => {
  const { title, category, dueDate, recurrence, notes } = req.body
  if (!title?.trim() || !dueDate) return res.status(400).json({ error: 'Title and due date required' })
  if (isNaN(Date.parse(dueDate))) return res.status(400).json({ error: 'Invalid due date' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO compliance_items (organization_id, title, category, due_date, recurrence, notes, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.user.organization_id, title.trim(), category || 'other', dueDate, recurrence || 'none', notes || null, req.user.id]
    )
    res.json(withStatus(rows)[0])
  } catch (err) {
    console.error('compliance/create:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { title, category, dueDate, recurrence, notes, status } = req.body
  const { rows } = await pool.query(
    `UPDATE compliance_items SET
       title = COALESCE($1, title), category = COALESCE($2, category),
       due_date = COALESCE($3, due_date), recurrence = COALESCE($4, recurrence),
       notes = COALESCE($5, notes), status = COALESCE($6, status)
     WHERE id = $7 AND organization_id = $8 RETURNING *`,
    [title ?? null, category ?? null, dueDate ?? null, recurrence ?? null, notes ?? null, status ?? null, req.params.id, req.user.organization_id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(withStatus(rows)[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM compliance_items WHERE id = $1 AND organization_id = $2', [req.params.id, req.user.organization_id])
  if (!rowCount) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// Add the common Uzbek preset deadlines (due dates default to 30 days out; user edits after)
router.post('/presets', requireAuth, async (req, res) => {
  const base = new Date(); base.setDate(base.getDate() + 30)
  const due = base.toISOString().slice(0, 10)
  const created = []
  for (const p of PRESETS) {
    const { rows } = await pool.query(
      'INSERT INTO compliance_items (organization_id, title, category, due_date, recurrence, notes, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [req.user.organization_id, p.title, p.category, due, p.recurrence, p.notes, req.user.id]
    )
    created.push(rows[0].id)
  }
  res.json({ created: created.length })
})

export default router
