import { useState, useRef } from 'react'
import { api } from '../lib/api.js'
import { getLang } from '../lib/lang.js'
import { downloadWord, printPDF } from '../lib/export.js'
import { Table2, Upload, X, FileText, Image as ImageIcon, Sparkles, AlertTriangle, Printer } from 'lucide-react'

const DEFAULT_TASK = "Har bir hujjatni ko'rib chiqing va barcha faktik masalalarni jadval ko'rinishida keltiring. Birinchi ustunda masalalar mantiqiy/xronologik tartibda, qolgan ustunlar har bir hujjat bo'yicha. Ziddiyatlarni aniq belgilang."

const EXAMPLES = [
  { label: '⚖️ Guvoh bayonotlarini solishtirish', task: "Har bir guvoh bayonotidagi faktik masalalarni jadvalga keltiring. Ziddiyatlar va 'muhokama qilinmagan' holatlarni belgilang." },
  { label: '📄 Shartnomalarni taqqoslash', task: "Bu shartnomalarni asosiy shartlar bo'yicha solishtiring: taraflar, muddat, to'lov, javobgarlik, bekor qilish sharti, nizolarni hal qilish." },
  { label: '🏠 Ijara shartnomalari', task: "Ijara shartnomalarini solishtiring: ijarachi, ijaraga beruvchi, ob'ekt, narx, muddat, depozit, majburiyatlar." },
]

export default function Review() {
  const [files, setFiles] = useState([])
  const [task, setTask] = useState(DEFAULT_TASK)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const resultRef = useRef(null)

  const exportTitle = () => result?.title || 'Document Review'
  const exportWord = () => resultRef.current && downloadWord(exportTitle(), resultRef.current.innerHTML)
  const exportPDF = () => resultRef.current && printPDF(exportTitle(), resultRef.current.innerHTML)

  const addFiles = (list) => {
    const incoming = Array.from(list || [])
    const valid = []
    for (const f of incoming) {
      const ok = f.type.startsWith('image/') || f.type === 'application/pdf' || f.type.startsWith('text/')
      if (!ok) { setError(`Skipped ${f.name}: use PDF, image, or text`); continue }
      if (f.size > 10 * 1024 * 1024) { setError(`Skipped ${f.name}: over 10MB`); continue }
      valid.push(f)
    }
    setFiles(prev => [...prev, ...valid].slice(0, 12))
  }
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const run = async () => {
    if (files.length < 2 || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      fd.append('task', task)
      fd.append('lang', getLang())
      files.forEach(f => fd.append('files', f))
      const res = await api.review.run(fd)
      setResult(res)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const docNames = result?.documents || []

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Table2 size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Document Review</h1>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
        Bir nechta hujjatni yuklang — sun'iy intellekt ularni taqqoslab, tuzilgan jadval yaratadi. Guvoh bayonotlari, shartnomalar, ijara hujjatlari uchun.
      </p>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragOver ? 'var(--accent2)' : 'var(--border2)'}`,
          borderRadius: 14, padding: '28px', textAlign: 'center', cursor: 'pointer',
          background: dragOver ? 'var(--accent-bg)' : 'var(--bg2)', transition: 'all 0.15s', marginBottom: 14,
        }}>
        <input ref={inputRef} type="file" multiple accept="image/*,application/pdf,text/plain" style={{ display: 'none' }}
          onChange={e => { addFiles(e.target.files); e.target.value = '' }} />
        <Upload size={22} color="var(--accent2)" style={{ marginBottom: 8 }} />
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>Drop documents here or click to browse</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>PDF, image, or text · 2–12 files · max 10MB each</div>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10 }}>
              {f.type.startsWith('image/') ? <ImageIcon size={14} color="var(--accent2)" /> : <FileText size={14} color="var(--accent2)" />}
              <span style={{ fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>{(f.size / 1024).toFixed(0)}KB</span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i) }} style={{ display: 'flex', padding: 2, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={12} color="var(--text2)" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Task prompt */}
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>What should the AI compare?</label>
      <textarea value={task} onChange={e => setTask(e.target.value)} rows={3}
        style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 13, lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 10 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
        {EXAMPLES.map(ex => (
          <button key={ex.label} onClick={() => setTask(ex.task)}
            style={{ fontSize: 11, padding: '5px 11px', borderRadius: 16, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer' }}>
            {ex.label}
          </button>
        ))}
      </div>

      <button onClick={run} disabled={files.length < 2 || loading}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, border: 'none',
          background: files.length >= 2 && !loading ? 'linear-gradient(135deg, var(--accent), #9b6dff)' : 'var(--bg3)',
          color: files.length >= 2 && !loading ? '#fff' : 'var(--text3)', fontSize: 14, fontWeight: 600,
          cursor: files.length >= 2 && !loading ? 'pointer' : 'default',
          boxShadow: files.length >= 2 && !loading ? '0 4px 16px rgba(124,109,255,0.35)' : 'none',
        }}>
        <Sparkles size={15} /> {loading ? 'Analyzing…' : `Analyze ${files.length || ''} documents`}
      </button>
      {files.length === 1 && <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 12 }}>Add at least 1 more document to compare</span>}

      {error && (
        <div style={{ marginTop: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10, border: '1px solid rgba(255,95,95,0.15)' }}>⚠️ {error}</div>
      )}

      {loading && (
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text2)', fontSize: 13 }}>
          <div className="spinner" style={{ width: 16, height: 16, border: '2px solid var(--border2)', borderTopColor: 'var(--accent2)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Reading {files.length} documents and building the comparison table…
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 28 }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{result.title || 'Comparison'}</h2>
            <button onClick={exportWord} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><FileText size={13} /> Word</button>
            <button onClick={exportPDF} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><Printer size={13} /> PDF</button>
          </div>
          <div ref={resultRef}>
          {result.summary && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>{result.summary}</p>}

          {/* Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 18 }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  <th style={{ textAlign: 'left', padding: '11px 14px', fontWeight: 700, color: 'var(--accent2)', position: 'sticky', left: 0, background: 'var(--bg3)', minWidth: 190, borderRight: '1px solid var(--border)' }}>Factual Issue</th>
                  {docNames.map(n => (
                    <th key={n} style={{ textAlign: 'left', padding: '11px 14px', fontWeight: 600, minWidth: 200, borderLeft: '1px solid var(--border)' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(result.rows || []).map((row, ri) => (
                  <tr key={ri} style={{ borderTop: '1px solid var(--border)', background: ri % 2 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, verticalAlign: 'top', position: 'sticky', left: 0, background: 'var(--bg)', borderRight: '1px solid var(--border)' }}>{row.issue}</td>
                    {docNames.map(n => {
                      const val = row.cells?.[n] || ''
                      const isEmpty = /muhokama qilinmagan|not discussed/i.test(val)
                      return (
                        <td key={n} style={{ padding: '10px 14px', verticalAlign: 'top', lineHeight: 1.55, color: isEmpty ? 'var(--text3)' : 'var(--text)', fontStyle: isEmpty ? 'italic' : 'normal', borderLeft: '1px solid var(--border)' }}>{val}</td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Conflicts */}
          {result.conflicts?.length > 0 && (
            <div style={{ padding: '14px 16px', background: 'var(--red-bg)', border: '1px solid rgba(255,95,95,0.2)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, color: 'var(--red)', fontWeight: 600, fontSize: 13 }}>
                <AlertTriangle size={14} /> Ziddiyatlar / Contradictions
              </div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                {result.conflicts.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}
