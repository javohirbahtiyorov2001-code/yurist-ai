import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { CalendarClock, Plus, Trash2, Check, AlertTriangle, Clock, X } from 'lucide-react'

const CAT = {
  tax: { label: 'Soliq', color: 'var(--accent2)' },
  license: { label: 'Litsenziya', color: 'var(--amber)' },
  report: { label: 'Hisobot', color: 'var(--green)' },
  renewal: { label: 'Yangilash', color: 'var(--pink)' },
  other: { label: 'Boshqa', color: 'var(--text3)' },
}
const STATE = {
  overdue: { label: 'Muddati o\'tgan', color: 'var(--red)', icon: AlertTriangle },
  soon: { label: 'Yaqinda', color: 'var(--amber)', icon: Clock },
  upcoming: { label: 'Kelgusi', color: 'var(--text2)', icon: CalendarClock },
  done: { label: 'Bajarilgan', color: 'var(--green)', icon: Check },
}

export default function Compliance() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'tax', dueDate: '', recurrence: 'none', notes: '' })

  const load = () => api.compliance.list().then(setItems).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const save = async () => {
    setError('')
    if (!form.title.trim() || !form.dueDate) { setError('Nom va sana kiritilishi shart'); return }
    try { await api.compliance.create(form); setForm({ title: '', category: 'tax', dueDate: '', recurrence: 'none', notes: '' }); setAdding(false); load() }
    catch (e) { setError(e.message) }
  }
  const toggleDone = async (it) => { await api.compliance.update(it.id, { status: it.status === 'done' ? 'open' : 'done' }); load() }
  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.compliance.remove(id); load() }
  const loadPresets = async () => { await api.compliance.loadPresets(); load() }

  const groups = ['overdue', 'soon', 'upcoming', 'done']
  const byState = (s) => items.filter(i => i.state === s)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalendarClock size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Compliance kalendar</h1>
        <button onClick={() => setAdding(a => !a)} className="btn btn-primary btn-sm"><Plus size={14} /> Qo'shish</button>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Soliq, hisobot va litsenziya muddatlarini kuzatib boring — hech narsani o'tkazib yubormang.</p>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {adding && (
        <div className="card" style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input className="input" placeholder="Nomi (masalan: QQS deklaratsiyasi)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <input className="input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {Object.entries(CAT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className="input" value={form.recurrence} onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}>
              <option value="none">Bir marta</option><option value="monthly">Har oy</option><option value="quarterly">Har chorak</option><option value="yearly">Har yil</option>
            </select>
          </div>
          <input className="input" placeholder="Izoh (ixtiyoriy)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} className="btn btn-primary btn-sm">Saqlash</button>
            <button onClick={() => setAdding(false)} className="btn btn-ghost btn-sm">Bekor</button>
          </div>
        </div>
      )}

      {items.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '50px 24px', color: 'var(--text3)' }}>
          <CalendarClock size={30} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 14, marginBottom: 14 }}>Hozircha muddat yo'q. Standart O'zbekiston deadline'larini yuklang.</div>
          <button onClick={loadPresets} className="btn btn-primary btn-sm"><Plus size={14} /> Standart deadline'lar</button>
        </div>
      )}

      {groups.map(g => {
        const list = byState(g)
        if (!list.length) return null
        const S = STATE[g]
        return (
          <div key={g} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, color: S.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <S.icon size={13} /> {S.label} ({list.length})
            </div>
            {list.map(it => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 11, marginBottom: 7, opacity: it.status === 'done' ? 0.6 : 1 }}>
                <button onClick={() => toggleDone(it)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${it.status === 'done' ? 'var(--green)' : 'var(--border2)'}`, background: it.status === 'done' ? 'var(--green)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {it.status === 'done' && <Check size={12} color="#fff" />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, textDecoration: it.status === 'done' ? 'line-through' : 'none' }}>{it.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    <span style={{ color: CAT[it.category]?.color }}>{CAT[it.category]?.label}</span>
                    {' · '}{new Date(it.due_date).toLocaleDateString()}
                    {it.recurrence !== 'none' && ` · ${it.recurrence}`}
                    {it.state === 'overdue' && ` · ${Math.abs(it.days_until)} kun kechikdi`}
                    {it.state === 'soon' && ` · ${it.days_until} kun qoldi`}
                    {it.notes && ` · ${it.notes}`}
                  </div>
                </div>
                <button onClick={() => del(it.id)} style={{ display: 'flex', padding: 6, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={14} color="var(--text3)" /></button>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
