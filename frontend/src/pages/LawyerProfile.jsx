import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'
import { SPECIALTIES } from '../lib/specialties.js'
import { Scale, BadgeCheck, Check } from 'lucide-react'

export default function LawyerProfile() {
  const { refresh } = useAuth()
  const [form, setForm] = useState({ fullName: '', specialties: [], region: '', bio: '', consultFee: '', contact: '' })
  const [existing, setExisting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.lawyers.me().then(p => {
      if (p) { setExisting(true); setForm({ fullName: p.full_name || '', specialties: p.specialties || [], region: p.region || '', bio: p.bio || '', consultFee: p.consult_fee || '', contact: p.contact || '' }) }
    }).catch(() => {})
  }, [])

  const toggleSpec = (k) => setForm(f => ({ ...f, specialties: f.specialties.includes(k) ? f.specialties.filter(x => x !== k) : [...f.specialties, k] }))
  const save = async () => {
    setError('')
    if (!form.fullName.trim() || !form.contact.trim()) { setError('Ism va aloqa ma\'lumoti shart'); return }
    try { await api.lawyers.saveProfile(form); setSaved(true); setTimeout(() => setSaved(false), 2000); refresh?.() }
    catch (e) { setError(e.message) }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scale size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Yurist profili</h1>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
        {existing ? 'Profilingizni tahrirlang.' : "Yurist sifatida ro'yxatdan o'ting — mijozlardan tayyor so'rovlar oling."}
      </p>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      <div className="card" style={{ padding: 22 }}>
        <label className="label">To'liq ism</label>
        <input className="input" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="F.I.Sh." style={{ marginBottom: 14 }} />

        <label className="label">Yo'nalishlar</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {SPECIALTIES.map(s => (
            <button key={s.key} onClick={() => toggleSpec(s.key)}
              style={{ fontSize: 12, padding: '5px 11px', borderRadius: 16, cursor: 'pointer', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 4,
                background: form.specialties.includes(s.key) ? 'var(--accent-bg)' : 'var(--bg2)', color: form.specialties.includes(s.key) ? 'var(--accent2)' : 'var(--text2)' }}>
              {form.specialties.includes(s.key) && <Check size={11} />}{s.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div><label className="label">Hudud</label><input className="input" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="Toshkent" /></div>
          <div><label className="label">Konsultatsiya narxi</label><input className="input" value={form.consultFee} onChange={e => setForm(f => ({ ...f, consultFee: e.target.value }))} placeholder="300 000 so'm" /></div>
        </div>

        <label className="label">Aloqa (telefon / email)</label>
        <input className="input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+998 90 123 45 67" style={{ marginBottom: 14 }} />

        <label className="label">Qisqacha ma'lumot</label>
        <textarea className="input" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tajriba, mutaxassislik…" style={{ marginBottom: 18, resize: 'vertical' }} />

        <button onClick={save} className="btn btn-primary">
          {saved ? <><Check size={14} /> Saqlandi</> : <><BadgeCheck size={14} /> {existing ? 'Saqlash' : 'Yurist bo\'lish'}</>}
        </button>
      </div>
    </div>
  )
}
