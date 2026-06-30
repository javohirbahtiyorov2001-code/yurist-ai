import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { Upload, FileText, AlertTriangle, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react'

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
  const [text, setText] = useState('')
  const [jurisdiction, setJurisdiction] = useState('UZ')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => { api.contracts.list().then(setContracts).catch(() => {}) }, [])

  const analyze = async (file) => {
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      if (file) fd.append('file', file)
      else fd.append('text', text)
      fd.append('jurisdiction', jurisdiction)
      const data = await api.contracts.analyze(fd)
      setResult(data)
      api.contracts.list().then(setContracts).catch(() => {})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) analyze(file)
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
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['upload', 'paste'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={`btn ${mode === m ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
                  {m === 'upload' ? 'Upload file' : 'Paste text'}
                </button>
              ))}
              <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
                style={{ marginLeft: 'auto', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '6px 10px', borderRadius: 8, fontSize: 12, outline: 'none' }}>
                <option value="UZ">Uzbekistan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="AZ">Azerbaijan</option>
              </select>
            </div>

            {mode === 'upload' ? (
              <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', background: dragOver ? 'var(--accent-bg)' : 'transparent', transition: 'all 0.15s' }}>
                <Upload size={32} color="var(--text3)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Drop your contract here</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>PDF or TXT file, max 10MB</div>
                <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
                  Browse files
                  <input type="file" accept=".pdf,.txt,.doc" style={{ display: 'none' }} onChange={e => e.target.files[0] && analyze(e.target.files[0])} />
                </label>
              </div>
            ) : (
              <div>
                <textarea className="input" value={text} onChange={e => setText(e.target.value)} placeholder="Paste your contract text here..."
                  style={{ height: 280, resize: 'vertical' }} />
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => analyze(null)} disabled={!text.trim() || loading}>
                  {loading ? 'Analyzing...' : 'Analyze contract'}
                </button>
              </div>
            )}
          </div>
        )}

        {isPro && loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text2)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Analyzing contract...</div>
            <div style={{ fontSize: 13 }}>Reading clauses, checking CIS law compliance, scoring risks</div>
          </div>
        )}

        {isPro && error && <div style={{ color: 'var(--red)', padding: '12px 16px', background: 'var(--red-bg)', borderRadius: 8, marginBottom: 16 }}>{error}</div>}

        {isPro && result && !loading && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setResult(null); setSelected(null); setText('') }}>← New analysis</button>
            </div>
            <div className="card">
              <AnalysisView analysis={result.analysis} score={result.riskScore} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
