import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/pool.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, fullName, company } = req.body
  if (!email || !password || !fullName) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, company) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, company, plan',
      [email, hash, fullName, company || null]
    )
    const user = rows[0]
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' })
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, company: user.company, plan: user.plan } })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await pool.query(
      'SELECT id, email, full_name, company, plan, questions_used FROM users WHERE id = $1', [payload.id]
    )
    res.json(rows[0])
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
