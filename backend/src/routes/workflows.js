import { Router } from 'express'
import multer from 'multer'
import pool from '../db/pool.js'
import { requireAuth } from '../middleware/auth.js'
import { WORKFLOWS, runWorkflow } from '../services/workflows.js'
import { saveWorkspaceItem } from '../services/workspace.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 8 } })
const PRO_PLANS = ['pro', 'entity']

// List available workflow templates (metadata only, no runner logic)
router.get('/', requireAuth, (req, res) => {
  res.json(WORKFLOWS.map(w => ({
    key: w.key, title: w.title, subtitle: w.subtitle, icon: w.icon,
    description: w.description, inputs: w.inputs, acceptsFiles: w.acceptsFiles,
    steps: w.steps.map(s => ({ name: s.name, tool: s.tool })),
  })))
})

// Run a workflow
router.post('/run', requireAuth, upload.array('files', 8), async (req, res) => {
  const { rows: userRows } = await pool.query('SELECT plan FROM users WHERE id = $1', [req.user.id])
  if (!PRO_PLANS.includes(userRows[0]?.plan)) {
    return res.status(403).json({ error: 'Workflows require a Pro or Entity plan. Upgrade to access this feature.' })
  }

  const { workflowKey, lang = 'uz' } = req.body
  let inputs = {}
  try { inputs = req.body.inputs ? JSON.parse(req.body.inputs) : {} } catch { inputs = {} }

  const wf = WORKFLOWS.find(w => w.key === workflowKey)
  if (!wf) return res.status(400).json({ error: 'Unknown workflow' })

  // Validate required inputs
  for (const inp of wf.inputs) {
    if (inp.required && !inputs[inp.key]?.trim()) {
      return res.status(400).json({ error: `Missing required field: ${inp.label}` })
    }
  }

  // Extract text from uploaded files
  const fileTexts = []
  for (const f of req.files || []) {
    try {
      if (f.mimetype === 'application/pdf') {
        const data = await pdf(f.buffer)
        fileTexts.push(data.text)
      } else if (f.mimetype.startsWith('text/')) {
        fileTexts.push(f.buffer.toString('utf8'))
      }
      // images skipped in workflows for now (text-based reasoning)
    } catch { /* skip unreadable file */ }
  }

  try {
    const result = await runWorkflow(workflowKey, inputs, fileTexts, lang)
    await saveWorkspaceItem(req.user.organization_id, req.user.id, 'workflow', result.workflow?.title || 'Workflow', result)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
