import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { getLang } from '../lib/lang.js'
import { downloadWord, printPDF } from '../lib/export.js'
import { Upload, FileText, AlertTriangle, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Lock, Pencil, Printer } from 'lucide-react'

function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

function RedlineView({ data }) {
  const edits = data.edits || []
  const additions = data.additions || []
  const sevColor = { high: 'var(--red)', medium: 'var(--amber)', low: 'var(--green)' }

  const exportHtml = () => {
    let h = data.summary ? `<p>${esc(data.summary)}</p>` : ''
    for (const e of edits) {
      h += `<h3>${esc(e.clause)} [${esc(e.severity)}]</h3>`
      h += `<p><span style="color:#b00;text-decoration:line-through">${esc(e.original)}</span></p>`
      h += `<p><span style="color:#070;text-decoration:underline">${esc(e.suggested)}</span></p>`
      h += `<p><i>${esc(e.reason)}</i></p>`
    }
    if (additions.length) {
      h += `<h2>Qo'shilishi kerak bo'lgan bandlar</h2>`
      for (const a of additions) h += `<h3>${esc(a.clause)}</h3><p><span style="color:#070;text-decoration:underline">${esc(a.suggested)}</span></p><p><i>${esc(a.reason)}</i></p>`
    }
    return h
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{data.summary}</div>
        <button onClick={() => downloadWord('Redline', exportHtml())} className="btn btn-ghost btn-sm"><FileText size={13} /> Word</button>
        <button onClick={() => printPDF('Redline', exportHtml())} className="btn btn-ghost btn-sm"><Printer size={13} /> PDF</button>
      </div>
      {edits.map((e, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{e.clause}</span>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--bg3)', color: sevColor[e.severity] || 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>{e.severity}</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--red)', textDecoration: 'line-through', marginBottom: 5, lineHeight: 1.5 }}>{e.original}</div>
          <div style={{ fontSize: 12.5, color: 'var(--green)', marginBottom: 6, lineHeight: 1.5 }}>➜ {e.suggested}</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', fontStyle: 'italic' }}>{e.reason}</div>
        </div>
      ))}
      {additions.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Qo'shilishi kerak bo'lgan bandlar</div>
          {additions.map((a, i) => (
            <div key={i} style={{ border: '1px dashed var(--border2)', borderRadius: 10, padding: 14, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5 }}>{a.clause}</div>
              <div style={{ fontSize: 12.5, color: 'var(--green)', marginBottom: 6, lineHeight: 1.5 }}>+ {a.suggested}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', fontStyle: 'italic' }}>{a.reason}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RiskBadge({ score }) {
  if (score >= 70) return <span className="badge badge-green">Low risk · {score}/100</span>
  if (score >= 40) return <span className="badge badge-amber">Medium risk · {score}/100</span>
  return <span className="badge badge-red">High risk · {score}/100</span>
}

function RiskIcon({ severity }) {
  if (severity === 'high') return <AlertTriangle size={14} color="var(--red)" />
  if (severity === 'medium') return <AlertCircle size={14} color="var(--amber)" />
  return <CheckCircle size={14} color="var(--green)" />
}

function AnalysisView({ analysis, score }) {
  const [open, setOpen] = useState({})
  const toggle = (k) => setOpen(o => ({ ...o, [k]: !o[k] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{analysis.contractType || 'Contract'}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>{analysis.summary}</div>
        </div>
        <RiskBadge score={score} />
      </div>

      {analysis.risks?.length > 0 && (
        <div>
          <button onClick={() => toggle('risks')} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, color: 'var(--text)', border: 'none', cursor: 'pointer', marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 13 }}>Risks found ({analysis.risks.length})</span>
            {open.risks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {open.risks && analysis.risks.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', marginBottom: 6 }}>
              <RiskIcon severity={r.severity} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{r.clause}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{r.issue}</div>
                {r.recommendation && <div style={{ fontSize: 11, color: 'var(--accent2)' }}>→ {r.recommendation}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {analysis.missingClauses?.length > 0 && (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}>Missing clauses</div>
          {analysis.missingClauses.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
              <AlertTriangle size={12} color="var(--amber)" /> {c}
            </div>
          ))}
        </div>
      )}

      {analysis.positives?.length > 0 && (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}>Positives</div>
          {analysis.positives.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
              <CheckCircle size={12} color="var(--green)" /> {p}
            </div>
          ))}
        </div>
      )}

      {analysis.lawComplianceIssues?.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--red)', marginBottom: 6 }}>Law compliance issues</div>
          {analysis.lawComplianceIssues.map((c, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>• {c}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Contracts() {
  const { user } = useAuth()
  const isPro = ['pro', 'entity'].includes(user?.plan)
  const [contracts, setContracts] = useState([])
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('upload')
  const [action, setAction] = useState('analyze')   // analyze | redline
  const [text, setText] = useState('')
  const [jurisdiction, setJurisdiction] = useState('UZ')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => { api.contracts.list().then(setContracts).catch(() => {}) }, [])

  // Animated staged progress for the long (~50s) analyze/redline call
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!loading) { setProgress(0); return }
    setProgress(6)
    const iv = setInterval(() => setProgress(p => Math.min(96, p + (96 - p) * 0.055)), 600)
    return () => clearInterval(iv)
  }, [loading])
  const STAGES = [
    { at: 0, label: "Hujjat o'qilmoqda…" },
    { at: 22, label: 'Bandlar tahlil qilinmoqda…' },
    { at: 48, label: "Qonunga muvofiqlik tekshirilmoqda…" },
    { at: 70, label: action === 'redline' ? 'Tuzatishlar tayyorlanmoqda…' : 'Xavflar baholanmoqda…' },
    { at: 88, label: 'Hisobot yakunlanmoqda…' },
  ]
  const stageLabel = [...STAGES].reverse().find(s => progress >= s.at)?.label

  const run = async (file) => {
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      if (file) fd.append('file', file)
      else fd.append('text', text)
      fd.append('jurisdiction', jurisdiction)
      fd.append('lang', getLang())
      if (action === 'redline') {
        const data = await api.contracts.redline(fd)
        setResult({ kind: 'redline', ...data })
      } else {
        const data = await api.contracts.analyze(fd)
        setResult({ kind: 'analyze', ...data })
        api.contracts.list().then(setContracts).catch(() => {})
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) run(file)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 240, borderRight: '1px solid var(--border)', background: 'var(--bg2)', overflow: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '16px 16px 8px', fontSize: 13, fontWeight: 500 }}>Analyzed contracts</div>
        {contracts.length === 0
          ? <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text3)' }}>No contracts yet</div>
          : contracts.map(c => (
            <button key={c.id} onClick={() => { setSelected(c.id); api.contracts.get(c.id).then(d => setResult({ analysis: d.analysis, riskScore: d.risk_score })) }}
              style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: selected === c.id ? 'var(--accent-bg)' : 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: selected === c.id ? 'var(--accent2)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{c.filename}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(c.created_at).toLocaleDateString()}</div>
            </button>
          ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Contract Analyzer</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Upload any contract — AI flags risks and scores it under CIS law.</p>

        {!isPro && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Lock size={28} color="var(--accent2)" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Pro feature</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 360, marginBottom: 28, lineHeight: 1.7 }}>
              Contract analysis is available on the <strong style={{ color: 'var(--text)' }}>Pro plan ($9.99/mo)</strong> and above. Upload contracts, get risk scores, and see which clauses violate CIS law.
            </p>
            <Link to="/" className="btn btn-primary">Upgrade to Pro</Link>
          </div>
        )}

        {isPro && !result && (
          <div className="card" style={{ marginBottom: 24 }}>
            {/* What to do */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <button onClick={() => setAction('analyze')} className={`btn ${action === 'analyze' ? 'btn-primary' : 'btn-ghost'} btn-sm`}><AlertTriangle size={13} /> Risklarni tahlil qilish</button>
              <button onClick={() => setAction('redline')} className={`btn ${action === 'redline' ? 'btn-primary' : 'btn-ghost'} btn-sm`}><Pencil size={13} /> Tuzatishlar (redline)</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
              {action === 'analyze' ? 'Xavflarni aniqlaymiz va xavf balini beramiz.' : 'Har bir xavfli bandga aniq tuzatish taklif qilamiz — tayyor tahrir.'}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['upload', 'paste'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={`btn ${mode === m ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
                  {m === 'upload' ? 'Upload file' : 'Paste text'}
                </button>
              ))}
            </div>

            {mode === 'upload' ? (
              <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', background: dragOver ? 'var(--accent-bg)' : 'transparent', transition: 'all 0.15s' }}>
                <Upload size={32} color="var(--text3)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Drop your contract here</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>PDF or TXT file, max 10MB</div>
                <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
                  Browse files
                  <input type="file" accept=".pdf,.txt,.doc" style={{ display: 'none' }} onChange={e => e.target.files[0] && run(e.target.files[0])} />
                </label>
              </div>
            ) : (
              <div>
                <textarea className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Paste your contract text here..."
                  style={{ height: 280, resize: 'vertical' }} />
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => run(null)} disabled={!text.trim() || loading}>
                  {loading ? 'Ishlanmoqda...' : (action === 'redline' ? 'Tuzatishlarni yaratish' : 'Analyze contract')}
                </button>
              </div>
            )}
          </div>
        )}

        {isPro && loading && (
          <div style={{ maxWidth: 460, margin: '48px auto', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>⚖️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{action === 'redline' ? 'Tuzatishlar tayyorlanmoqda' : 'Shartnoma tahlil qilinmoqda'}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18, minHeight: 18 }}>{stageLabel}</div>
            <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, borderRadius: 20, background: 'linear-gradient(90deg, var(--accent), #9b6dff)', transition: 'width 0.6s ease-out' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8, fontWeight: 600 }}>{Math.round(progress)}%</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Bu bir necha soniya vaqt olishi mumkin</div>
          </div>
        )}

        {isPro && error && <div style={{ color: 'var(--red)', padding: '12px 16px', background: 'var(--red-bg)', borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        {isPro && result && !loading && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setResult(null); setSelected(null); setText('') }}>← Yangi</button>
            </div>
            <div className="card">
              {result.kind === 'redline'
                ? <RedlineView data={result} />
                : <AnalysisView analysis={result.analysis} score={result.riskScore} />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
