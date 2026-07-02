import { Router } from 'express'
import multer from 'multer'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { legalChat } from '../services/claude.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const PLAN_LIMITS = { free: 3, pro: Infinity, entity: Infinity }

router.get('/conversations', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, pinned, created_at FROM conversations WHERE user_id = $1 ORDER BY pinned DESC, updated_at DESC',
    [req.user.id]
  )
  res.json(rows)
})

// Rename and/or pin a conversation
router.patch('/conversations/:id', requireAuth, async (req, res) => {
  const { title, pinned } = req.body
  const { rows } = await pool.query(
    `UPDATE conversations
     SET title = COALESCE($1, title),
         pinned = COALESCE($2, pinned)
     WHERE id = $3 AND user_id = $4
     RETURNING id, title, pinned, created_at`,
    [title ?? null, typeof pinned === 'boolean' ? pinned : null, req.params.id, req.user.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

// Delete a conversation (messages cascade)
router.delete('/conversations/:id', requireAuth, async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM conversations WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  )
  if (!rowCount) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

router.post('/conversations', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *',
    [req.user.id, req.body.title || 'New conversation']
  )
  res.json(rows[0])
})

router.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  const { rows: conv } = await pool.query('SELECT id FROM conversations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
  if (!conv.length) return res.status(404).json({ error: 'Not found' })

  const { rows } = await pool.query(
    'SELECT id, role, content, citations, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [req.params.id]
  )
  res.json(rows)
})

router.post('/conversations/:id/messages', requireAuth, upload.single('file'), async (req, res) => {
  const { content, lang } = req.body
  const jurisdiction = 'UZ' // Uzbekistan-only for now; other regions coming soon
  if (!content?.trim() && !req.file) return res.status(400).json({ error: 'Message or attachment required' })

  const { rows: conv } = await pool.query('SELECT id FROM conversations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
  if (!conv.length) return res.status(404).json({ error: 'Not found' })

  // Build attachment for Claude (image → vision, PDF → extracted text)
  let attachment = null
  let attachmentNote = ''
  if (req.file) {
    if (ALLOWED_IMAGE.includes(req.file.mimetype)) {
      attachment = { kind: 'image', mediaType: req.file.mimetype, data: req.file.buffer.toString('base64') }
    } else if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer)
      attachment = { kind: 'text', text: data.text }
    } else if (req.file.mimetype.startsWith('text/')) {
      attachment = { kind: 'text', text: req.file.buffer.toString('utf8') }
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Attach an image (JPG/PNG) or a PDF.' })
    }
    attachmentNote = `\n\n📎 ${req.file.originalname}`
  }

  const { rows: userRows } = await pool.query('SELECT plan, questions_used FROM users WHERE id = $1', [req.user.id])
  const user = userRows[0]
  const limit = PLAN_LIMITS[user.plan] || 5
  if (user.questions_used >= limit) return res.status(403).json({ error: 'Monthly question limit reached. Please upgrade your plan.' })

  await pool.query(
    'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
    [req.params.id, 'user', (content || '') + attachmentNote]
  )

  const { rows: history } = await pool.query(
    'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
    [req.params.id]
  )

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  let fullResponse = ''
  let citations = []

  try {
    const { stream, citations: foundCitations } = await legalChat(history, jurisdiction, attachment, lang)
    citations = foundCitations

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullResponse += event.delta.text
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    await pool.query(
      'INSERT INTO messages (conversation_id, role, content, citations) VALUES ($1, $2, $3, $4)',
      [req.params.id, 'assistant', fullResponse, JSON.stringify(citations)]
    )

    await pool.query('UPDATE users SET questions_used = questions_used + 1 WHERE id = $1', [req.user.id])
    await pool.query('UPDATE conversations SET updated_at = NOW(), title = COALESCE(NULLIF(title, \'New conversation\'), $2) WHERE id = $1', [req.params.id, content.slice(0, 60)])

    res.write(`data: ${JSON.stringify({ done: true, citations })}\n\n`)
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

export default router
