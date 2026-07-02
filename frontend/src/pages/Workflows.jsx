import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api.js'
import { getLang } from '../lib/lang.js'
import { downloadWord, printPDF } from '../lib/export.js'
import ReactMarkdown from 'react-markdown'
import { Workflow as WorkflowIcon, Sparkles, ChevronRight, ArrowLeft, Upload, X, FileText, CheckCircle2, BookOpen, ExternalLink, Printer } from 'lucide-react'

export default function Workflows() {
  const [templates, setTemplates] = useState([])
  const [active, setActive] = useState(null)      // selected workflow template
  const [inputs, setInputs] = useState({})
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const reportRef = useRef(null)

  const exportWord = () => reportRef.current && active && downloadWord(active.title, reportRef.current.innerHTML)
  const exportPDF = () => reportRef.current && active && printPDF(active.title, reportRef.current.innerHTML)

  useEffect(() => { api.workflows.list().then(setTemplates).catch(e => setError(e.message)) }, [])

  const openWorkflow = (wf) => { setActive(wf); setInputs({}); setFiles([]); setResult(null); setError('') }
  const back = () => { setActive(null); setResult(null); setError('') }

  const run = async () => {
    if (loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      fd.append('workflowKey', active.key)
      fd.append('inputs', JSON.stringify(inputs))
      fd.append('lang', getLang())
      files.forEach(f => fd.append('files', f))
      const res = await api.workflows.run(fd)
      setResult(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  // ── Template gallery ──
  if (!active) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WorkflowIcon size={17} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Workflows</h1>
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
          Tayyor huquqiy jarayonlar — bir necha bosqichда sun'iy intellekt huquqingizni aniqlaydi, hujjat tayyorlaydi va keyingi qadamlarni ko'rsatadi.
        </p>
        {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {templates.map(wf => (
            <button key={wf.key} onClick={() => openWorkflow(wf)}
              style={{ textAlign: 'left', padding: 18, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{wf.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: 'var(--text)' }}>{wf.title}</div>
              <div style={{ fontSize: 11, color: 'var(--accent2)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{wf.subtitle}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 12 }}>{wf.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {wf.steps.map((s, i) => (
                  <span key={i} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 12, background: 'var(--bg3)', color: 'var(--text3)' }}>{i + 1}. {s.name}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Workflow detail / run ──
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 24px 60px' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 18, padding: 0 }}>
        <ArrowLeft size={15} /> Barcha workflowlar
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 30 }}>{active.icon}</div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>{active.title}</h1>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{active.subtitle}</div>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>{active.description}</p>

      {/* Steps preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {active.steps.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11.5, padding: '5px 11px', borderRadius: 16, background: 'var(--accent-bg)', color: 'var(--accent2)', fontWeight: 500 }}>{s.name}</span>
            {i < active.steps.length - 1 && <ChevronRight size={13} color="var(--text3)" />}
          </span>
        ))}
      </div>

      {!result && (
        <>
          {/* Inputs */}
          {active.inputs.map(inp => (
            <div key={inp.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                {inp.label}{inp.required && <span style={{ color: 'var(--accent2)' }}> *</span>}
              </label>
              <textarea value={inputs[inp.key] || ''} onChange={e => setInputs(v => ({ ...v, [inp.key]: e.target.value }))}
                placeholder={inp.placeholder} rows={3}
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 13, lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          ))}

          {/* File upload */}
          {active.acceptsFiles && (
            <div style={{ marginBottom: 20 }}>
              <input ref={fileRef} type="file" multiple accept="application/pdf,text/plain" style={{ display: 'none' }}
                onChange={e => { setFiles(f => [...f, ...Array.from(e.target.files || [])].slice(0, 8)); e.target.value = '' }} />
              <button onClick={() => fileRef.current?.click()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, background: 'var(--bg2)', border: '1px dashed var(--border2)', color: 'var(--text2)', fontSize: 12.5, cursor: 'pointer' }}>
                <Upload size={14} /> Hujjat yuklash (PDF yoki matn, ixtiyoriy)
              </button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 9 }}>
                    <FileText size={13} color="var(--accent2)" />
                    <span style={{ fontSize: 11.5, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    <button onClick={() => setFiles(fs => fs.filter((_, idx) => idx !== i))} style={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}><X size={12} color="var(--text2)" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

          <button onClick={run} disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, border: 'none',
              background: !loading ? 'linear-gradient(135deg, var(--accent), #9b6dff)' : 'var(--bg3)', color: !loading ? '#fff' : 'var(--text3)',
              fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', boxShadow: !loading ? '0 4px 16px rgba(124,109,255,0.35)' : 'none' }}>
            <Sparkles size={15} /> {loading ? 'Bajarilmoqda…' : 'Workflowni ishga tushirish'}
          </button>

          {loading && (
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text2)', fontSize: 13 }}>
              <div style={{ width: 16, height: 16, border: '2px solid var(--border2)', borderTopColor: 'var(--accent2)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              {active.steps.length} bosqich bajarilmoqda…
            </div>
          )}
        </>
      )}

      {/* Result — stepped report */}
      {result && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button onClick={exportWord} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}><FileText size={14} /> Word'ga yuklash</button>
            <button onClick={exportPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}><Printer size={14} /> PDF</button>
          </div>
          <div ref={reportRef}>
          {result.steps.map((step, i) => (
            <div key={i} style={{ marginBottom: 18, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                <CheckCircle2 size={15} color="var(--green)" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{i + 1}. {step.name}</span>
              </div>
              <div className="prose" style={{ padding: '14px 18px', fontSize: 13.5, lineHeight: 1.7 }}>
                <ReactMarkdown>{step.output}</ReactMarkdown>
              </div>
            </div>
          ))}

          {result.citations?.length > 0 && (
            <div style={{ marginTop: 6, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontWeight: 600 }}>MANBALAR:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.citations.map((c, i) => {
                  const style = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--accent-bg)', color: 'var(--accent2)', border: '1px solid rgba(124,109,255,0.15)', fontWeight: 500, textDecoration: 'none' }
                  return c.sourceUrl
                    ? <a key={i} href={c.sourceUrl} target="_blank" rel="noopener noreferrer" style={style}><BookOpen size={10} /> {c.code} · {c.article}-modda <ExternalLink size={9} style={{ opacity: 0.7 }} /></a>
                    : <span key={i} style={style}><BookOpen size={10} /> {c.code} · {c.article}-modda</span>
                })}
              </div>
            </div>
          )}

          </div>
          <button onClick={() => { setResult(null) }} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            ↻ Qayta ishga tushirish
          </button>
        </div>
      )}
    </div>
  )
}
