import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api.js'
import { getLang } from '../lib/lang.js'
import { downloadWord, printPDF, textToHtml } from '../lib/export.js'
import { Library, Plus, Trash2, FileText, Wand2, GitCompare, ArrowLeft, Upload, Printer, X } from 'lucide-react'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [view, setView] = useState('list')   // list | create | detail
  const [active, setActive] = useState(null)
  const [error, setError] = useState('')

  // create form
  const [form, setForm] = useState({ title: '', docType: '', content: '' })
  // draft-from-template
  const [instructions, setInstructions] = useState('')
  const [draftResult, setDraftResult] = useState(null)
  // compare
  const [compareFile, setCompareFile] = useState(null)
  const [compareResult, setCompareResult] = useState(null)
  const [busy, setBusy] = useState('')
  const fileRef = useRef(null)

  const load = () => api.templates.list().then(setTemplates).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const openDetail = async (id) => {
    setError(''); setDraftResult(null); setCompareResult(null); setInstructions(''); setCompareFile(null)
    const t = await api.templates.get(id); setActive(t); setView('detail')
  }
  const create = async () => {
    setError('')
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content required'); return }
    try { await api.templates.create(form); setForm({ title: '', docType: '', content: '' }); setView('list'); load() }
    catch (e) { setError(e.message) }
  }
  const del = async (id, e) => { e?.stopPropagation(); if (!window.confirm('Delete this template?')) return; await api.templates.remove(id); load() }
  const loadStarter = async () => { setError(''); try { await api.templates.loadStarterPack(); load() } catch (e) { setError(e.message) } }

  const runDraft = async () => {
    if (!instructions.trim()) return
    setBusy('draft'); setError(''); setDraftResult(null)
    try { setDraftResult(await api.templates.draft(active.id, instructions, getLang())) }
    catch (e) { setError(e.message) } finally { setBusy('') }
  }
  const runCompare = async () => {
    if (!compareFile) return
    setBusy('compare'); setError(''); setCompareResult(null)
    try {
      const fd = new FormData(); fd.append('file', compareFile); fd.append('lang', getLang())
      setCompareResult(await api.templates.compare(active.id, fd))
    } catch (e) { setError(e.message) } finally { setBusy('') }
  }

  // ── Create ──
  if (view === 'create') {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 60px' }}>
        <button onClick={() => setView('list')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 18, padding: 0 }}><ArrowLeft size={15} /> Templates</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Yangi shablon qo'shish</h1>
        {error && <div style={{ marginBottom: 14, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}
        <label className="label">Nomi</label>
        <input className="input" placeholder="Bizning standart NDA" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ marginBottom: 14 }} />
        <label className="label">Turi (ixtiyoriy)</label>
        <input className="input" placeholder="NDA, mehnat shartnomasi, ..." value={form.docType} onChange={e => setForm(f => ({ ...f, docType: e.target.value }))} style={{ marginBottom: 14 }} />
        <label className="label">Shablon matni (kompaniyangizning standart hujjati)</label>
        <textarea placeholder="To'liq hujjat matnini shu yerga joylashtiring…" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          rows={14} style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, padding: '12px 14px', color: 'var(--text)', fontSize: 13, lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'monospace', marginBottom: 16 }} />
        <button onClick={create} className="btn btn-primary"><Plus size={14} /> Saqlash</button>
      </div>
    )
  }

  // ── Detail ──
  if (view === 'detail' && active) {
    return (
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 24px 60px' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <button onClick={() => setView('list')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 18, padding: 0 }}><ArrowLeft size={15} /> Templates</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{active.title}</h1>
        {active.doc_type && <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 20 }}>{active.doc_type}</div>}
        {error && <div style={{ marginBottom: 14, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

        {/* Action 1: draft from template */}
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Wand2 size={15} color="var(--accent2)" /><strong style={{ fontSize: 14 }}>Shu shablon asosida yangi hujjat</strong></div>
          <p style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 10 }}>Yangi tafsilotlarni yozing — AI sizning standartingiz uslubida to'ldiradi.</p>
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} placeholder="Masalan: Taraf — Acme MChJ, xodim — Ali Valiyev, lavozim — dasturchi, oylik 12 mln so'm…"
            style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 10 }} />
          <button onClick={runDraft} disabled={busy === 'draft'} className="btn btn-primary btn-sm">{busy === 'draft' ? 'Yaratilmoqda…' : <><Wand2 size={13} /> Hujjat yaratish</>}</button>

          {draftResult && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button onClick={() => downloadWord(draftResult.title, textToHtml(draftResult.content))} className="btn btn-ghost btn-sm"><FileText size={13} /> Word</button>
                <button onClick={() => printPDF(draftResult.title, textToHtml(draftResult.content))} className="btn btn-ghost btn-sm"><Printer size={13} /> PDF</button>
              </div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.7, maxHeight: 400, overflow: 'auto' }}>{draftResult.content}</div>
            </div>
          )}
        </div>

        {/* Action 2: compare against playbook */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><GitCompare size={15} color="var(--green)" /><strong style={{ fontSize: 14 }}>Kelgan hujjatni standartimizga solishtirish</strong></div>
          <p style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 10 }}>Kimdir yuborgan shartnomani yuklang — AI sizning standartingizdan farqlarni topadi.</p>
          <input ref={fileRef} type="file" accept="application/pdf,text/plain" style={{ display: 'none' }} onChange={e => setCompareFile(e.target.files?.[0])} />
          {!compareFile
            ? <button onClick={() => fileRef.current?.click()} className="btn btn-ghost btn-sm"><Upload size={13} /> Hujjat yuklash</button>
            : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 8 }}><FileText size={13} /> {compareFile.name} <button onClick={() => setCompareFile(null)} style={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer' }}><X size={12} /></button></span>
                <button onClick={runCompare} disabled={busy === 'compare'} className="btn btn-primary btn-sm">{busy === 'compare' ? 'Tahlil…' : <><GitCompare size={13} /> Solishtirish</>}</button>
              </div>}

          {compareResult && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, marginBottom: 10 }}>Xulosa: <strong style={{ color: compareResult.verdict === 'reject' ? 'var(--red)' : compareResult.verdict === 'acceptable' ? 'var(--green)' : 'var(--amber)' }}>{compareResult.verdict}</strong> — {compareResult.summary}</div>
              {(compareResult.deviations || []).map((x, i) => (
                <div key={i} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>[{x.severity}] {x.topic}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}><strong>Bizning standart:</strong> {x.standard}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}><strong>Kelgan hujjat:</strong> {x.incoming}</div>
                  <div style={{ fontSize: 12, color: 'var(--accent2)', marginTop: 4 }}>→ {x.recommendation}</div>
                </div>
              ))}
              {compareResult.missing?.length > 0 && <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 8 }}><strong>Yetishmayotgan himoyalar:</strong> {compareResult.missing.join('; ')}</div>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── List ──
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Library size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Template Library</h1>
        <button onClick={() => setView('create')} className="btn btn-primary btn-sm"><Plus size={14} /> Yangi shablon</button>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Kompaniyangizning standart hujjatlari. Ular asosida yangi hujjat yarating yoki kelgan hujjatlarni ularga solishtiring.</p>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text3)' }}>
          <Library size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 14, marginBottom: 14 }}>Hozircha shablon yo'q. Standart to'plamni yuklang yoki o'zingiznikini qo'shing.</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={loadStarter} className="btn btn-primary btn-sm"><Plus size={14} /> Standart to'plamni yuklash</button>
            <button onClick={() => setView('create')} className="btn btn-ghost btn-sm">O'z shablonini qo'shish</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {templates.map(t => (
            <div key={t.id} onClick={() => openDetail(t.id)}
              style={{ padding: 16, borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.12s', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <FileText size={20} color="var(--accent2)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3, paddingRight: 20 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.doc_type || 'Template'} · {new Date(t.created_at).toLocaleDateString()}</div>
              <button onClick={e => del(t.id, e)} style={{ position: 'absolute', top: 12, right: 12, display: 'flex', padding: 5, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer' }} title="Delete"><Trash2 size={13} color="var(--text3)" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
