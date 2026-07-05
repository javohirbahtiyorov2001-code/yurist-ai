import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { downloadWord, printPDF, textToHtml } from '../lib/export.js'
import ReactMarkdown from 'react-markdown'
import { getLang } from '../lib/lang.js'
import { FolderOpen, FileText, Table2, Workflow, Trash2, Printer, ArrowLeft, Search, ShieldAlert, X } from 'lucide-react'

const KIND_META = {
  draft: { icon: FileText, label: 'Document', color: 'var(--accent2)' },
  review: { icon: Table2, label: 'Review', color: 'var(--green)' },
  workflow: { icon: Workflow, label: 'Workflow', color: 'var(--amber)' },
}

export default function Workspace() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scan, setScan] = useState(null)

  const load = () => api.workspace.list().then(setItems).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const runScan = async () => {
    setScanning(true); setError('')
    try { setScan(await api.workspace.scan(getLang())) }
    catch (e) { setError(e.message) } finally { setScanning(false) }
  }

  const openItem = (id) => api.workspace.get(id).then(setOpen).catch(e => setError(e.message))
  const del = async (id, e) => { e?.stopPropagation(); if (!window.confirm('Delete this item?')) return; await api.workspace.remove(id); if (open?.id === id) setOpen(null); load() }

  const shown = items.filter(i => (!filter || i.kind === filter) && (!q || i.title.toLowerCase().includes(q.toLowerCase())))

  // ── Detail view ──
  if (open) {
    const d = open.data || {}
    const title = open.title
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 60px' }}>
        <button onClick={() => setOpen(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0 }}><ArrowLeft size={15} /> Workspace</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, flex: 1 }}>{title}</h1>
          {open.kind === 'draft' && d.content && <>
            <button onClick={() => downloadWord(title, textToHtml(d.content))} className="btn btn-ghost btn-sm"><FileText size={13} /> Word</button>
            <button onClick={() => printPDF(title, textToHtml(d.content))} className="btn btn-ghost btn-sm"><Printer size={13} /> PDF</button>
          </>}
        </div>

        {/* Draft */}
        {open.kind === 'draft' && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>{d.content}</div>
        )}

        {/* Review */}
        {open.kind === 'review' && (
          <div>
            {d.summary && <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{d.summary}</p>}
            {d.documents && d.rows && (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12.5 }}>
                  <thead><tr style={{ background: 'var(--bg3)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--accent2)' }}>Issue</th>
                    {d.documents.map(n => <th key={n} style={{ textAlign: 'left', padding: '10px 14px' }}>{n}</th>)}
                  </tr></thead>
                  <tbody>{d.rows.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '9px 14px', fontWeight: 600, verticalAlign: 'top' }}>{r.issue}</td>
                      {d.documents.map(n => <td key={n} style={{ padding: '9px 14px', verticalAlign: 'top' }}>{r.cells?.[n]}</td>)}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            {/* playbook-style review */}
            {d.deviations && (
              <div style={{ marginTop: 8 }}>
                {d.verdict && <div style={{ fontSize: 13, marginBottom: 12 }}>Verdict: <strong>{d.verdict}</strong></div>}
                {d.deviations.map((x, i) => (
                  <div key={i} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>[{x.severity}] {x.topic}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{x.recommendation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Workflow */}
        {open.kind === 'workflow' && d.steps && (
          <div>
            {d.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: 16, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'var(--bg3)', fontWeight: 700, fontSize: 13, borderBottom: '1px solid var(--border)' }}>{i + 1}. {s.name}</div>
                <div className="prose" style={{ padding: '14px 18px', fontSize: 13.5, lineHeight: 1.7 }}><ReactMarkdown>{s.output}</ReactMarkdown></div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── List view ──
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FolderOpen size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Workspace</h1>
        {items.length > 0 && (
          <button onClick={runScan} disabled={scanning} className="btn btn-primary btn-sm"><ShieldAlert size={14} /> {scanning ? 'Tekshirilmoqda…' : 'Risk scan'}</button>
        )}
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Tashkilotingiz yaratgan barcha hujjatlar, tahlillar va workflow natijalari — bir joyda.</p>

      {scan && (
        <div style={{ marginBottom: 20, border: '1px solid rgba(124,109,255,0.25)', borderRadius: 12, background: 'var(--accent-bg)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ShieldAlert size={15} color="var(--accent2)" />
            <strong style={{ fontSize: 14 }}>Proaktiv risk tahlili</strong>
            <button onClick={() => setScan(null)} style={{ marginLeft: 'auto', display: 'flex', border: 'none', background: 'none', cursor: 'pointer' }}><X size={14} color="var(--text3)" /></button>
          </div>
          {(scan.observations || []).length === 0
            ? <div style={{ fontSize: 13, color: 'var(--text2)' }}>Jiddiy risklar aniqlanmadi.</div>
            : scan.observations.map((o, i) => (
              <div key={i} style={{ padding: '10px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase', background: 'var(--bg3)', color: o.severity === 'high' ? 'var(--red)' : o.severity === 'medium' ? 'var(--amber)' : 'var(--green)' }}>{o.severity}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{o.title}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 3 }}>{o.detail}</div>
                {o.action && <div style={{ fontSize: 12, color: 'var(--accent2)' }}>➜ {o.action}</div>}
              </div>
            ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 9, padding: '6px 10px', flex: 1, minWidth: 180 }}>
          <Search size={14} color="var(--text3)" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text)', fontSize: 13, outline: 'none' }} />
        </div>
        {['', 'draft', 'review', 'workflow'].map(k => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
              background: filter === k ? 'var(--accent-bg)' : 'var(--bg2)', color: filter === k ? 'var(--accent2)' : 'var(--text2)' }}>
            {k === '' ? 'All' : KIND_META[k].label}
          </button>
        ))}
      </div>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
          <FolderOpen size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 14 }}>Hozircha hujjatlar yo'q. Document, Review yoki Workflow yarating.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shown.map(it => {
            const meta = KIND_META[it.kind] || KIND_META.draft
            const Icon = meta.icon
            return (
              <div key={it.id} onClick={() => openItem(it.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 11, cursor: 'pointer', transition: 'border-color 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={meta.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{meta.label} · {it.author || '—'} · {new Date(it.created_at).toLocaleDateString()}</div>
                </div>
                <button onClick={e => del(it.id, e)} style={{ display: 'flex', padding: 6, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer' }} title="Delete">
                  <Trash2 size={14} color="var(--text3)" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
