import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import contractRoutes from './routes/contracts.js'
import documentRoutes from './routes/documents.js'
import reviewRoutes from './routes/review.js'
import workflowRoutes from './routes/workflows.js'
import orgRoutes from './routes/org.js'
import workspaceRoutes from './routes/workspace.js'
import templateRoutes from './routes/templates.js'
import complianceRoutes from './routes/compliance.js'
import lawyerRoutes from './routes/lawyers.js'
import lawyerRequestRoutes from './routes/lawyerRequests.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Railway/Netlify sit in front of the app; trust the first proxy so rate-limiting
// keys on the real client IP (X-Forwarded-For) rather than the proxy's.
app.set('trust proxy', 1)

// Exact-match CORS allowlist (auth is Bearer-token, so cookies/credentials are not needed)
const ALLOWED_ORIGINS = new Set([
  process.env.FRONTEND_URL,
  'https://relaxed-gumption-022a69.netlify.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
].filter(Boolean))

app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser clients (no Origin header) and exact-match allowlisted origins only
    if (!origin || ALLOWED_ORIGINS.has(origin)) return cb(null, origin || true)
    cb(null, false)
  },
}))

// Security headers
app.use(helmet())

// Rate limiting: a global cap, plus a strict cap on auth to slow brute force / account spam
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts, please try again later.' } }))

// Expensive LLM endpoints — stricter cap to prevent runaway Anthropic cost / abuse
const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false, message: { error: 'AI usage limit reached, please wait a few minutes.' } })
app.use('/api/workflows/run', aiLimiter)
app.use('/api/review', aiLimiter)
app.use('/api/workspace/scan', aiLimiter)
app.use('/api/contracts/analyze', aiLimiter)
app.use('/api/contracts/redline', aiLimiter)

app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/workflows', workflowRoutes)
app.use('/api/org', orgRoutes)
app.use('/api/workspace', workspaceRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/compliance', complianceRoutes)
app.use('/api/lawyers', lawyerRoutes)
app.use('/api/lawyer-requests', lawyerRequestRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Yurist AI API' }))

app.listen(PORT, () => console.log(`Yurist AI API running on http://localhost:${PORT}`))
