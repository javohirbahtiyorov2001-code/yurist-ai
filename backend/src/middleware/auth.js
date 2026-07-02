import jwt from 'jsonwebtoken'
import pool from '../db/pool.js'

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // Attach organization + role + plan so routes can scope to the org
    const { rows } = await pool.query(
      'SELECT id, email, organization_id, role, plan FROM users WHERE id = $1',
      [payload.id]
    )
    if (!rows.length) return res.status(401).json({ error: 'Invalid token' })
    req.user = rows[0]
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
