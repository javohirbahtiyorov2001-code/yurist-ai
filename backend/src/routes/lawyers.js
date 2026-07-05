import { Router } from 'express'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public directory (contact hidden until a request is accepted)
router.get('/', requireAuth, async (req, res) => {
  const { specialty } = req.query
  const params = []
  let where = ''
  if (specialty) { params.push(specialty); where = `WHERE $1 = ANY(specialties)` }
  const { rows } = await pool.query(
    `SELECT id, full_name, specialties, region, bio, consult_fee, verified, rating
     FROM lawyer_profiles ${where} ORDER BY verified DESC, rating DESC LIMIT 100`,
    params
  )
  res.json(rows)
})

// My lawyer profile (if I am a lawyer)
router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM lawyer_profiles WHERE user_id = $1', [req.user.id])
  res.json(rows[0] || null)
})

// Create or update my lawyer profile — this also turns the account into a lawyer account
router.post('/profile', requireAuth, async (req, res) => {
  const { fullName, specialties, region, bio, consultFee, contact } = req.body
  if (!fullName?.trim() || !contact?.trim()) return res.status(400).json({ error: 'Name and contact required' })
  const specs = Array.isArray(specialties) ? specialties : []

  const { rows: existing } = await pool.query('SELECT id FROM lawyer_profiles WHERE user_id = $1', [req.user.id])
  let profile
  if (existing.length) {
    const { rows } = await pool.query(
      `UPDATE lawyer_profiles SET full_name=$1, specialties=$2, region=$3, bio=$4, consult_fee=$5, contact=$6 WHERE user_id=$7 RETURNING *`,
      [fullName.trim(), specs, region || null, bio || null, consultFee || null, contact.trim(), req.user.id]
    )
    profile = rows[0]
  } else {
    const { rows } = await pool.query(
      `INSERT INTO lawyer_profiles (user_id, full_name, specialties, region, bio, consult_fee, contact) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, fullName.trim(), specs, region || null, bio || null, consultFee || null, contact.trim()]
    )
    profile = rows[0]
  }
  await pool.query("UPDATE users SET account_type = 'lawyer' WHERE id = $1", [req.user.id])
  res.json(profile)
})

export default router
