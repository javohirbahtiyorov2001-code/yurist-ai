import express from 'express'
import cors from 'cors'
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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: (origin, cb) => {
    const allowed = !origin
      || origin.includes('localhost')
      || origin.includes('ngrok')
      || origin.includes('loca.lt')
      || origin.includes('netlify.app')
      || (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
    cb(null, allowed ? origin : false)
  },
  credentials: true,
}))
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

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Yurist AI API' }))

app.listen(PORT, () => console.log(`Yurist AI API running on http://localhost:${PORT}`))
