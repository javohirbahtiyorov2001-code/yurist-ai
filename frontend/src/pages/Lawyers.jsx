import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { SPECIALTIES, specLabel } from '../lib/specialties.js'
import { Scale, Star, BadgeCheck, MapPin, Send, X, Clock, CheckCircle2, FileText } from 'lucide-react'

export default function Lawyers() {
  const location = useLocation()
  const [tab, setTab] = useState('browse')
  const [lawyers, setLawyers] = useState([])
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  // Request modal
  const [reqFor, setReqFor] = useState(null)   // lawyer object or {broadcast:true}
  const [specialty, setSpecialty] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState([])       // workspace items to attach
  const [picked, setPicked] = useState([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const loadLawyers = () => api.lawyers.list(filter).then(setLawyers).catch(e => setError(e.message))
  const loadRequests = () => api.lawyerRequests.mine().then(setRequests).catch(() => {})
  useEffect(() => { loadLawyers() }, [filter])
  useEffect(() => { loadRequests(); api.workspace.list().then(setItems).catch(() => {}) }, [])

  // Deep-link from an escalation button: /app/lawyers?note=...&specialty=...
  useEffect(() => {
    const p = new URLSearchParams(location.search)
    if (p.get('note') || p.get('specialty')) {
      setNote(p.get('note') || ''); setSpecialty(p.get('specialty') || '')
      setReqFor({ broadcast: true })
    }
  }, [location.search])

  const openRequest = (lawyer) => { setReqFor(lawyer); setSent(false); setPicked([]); if (lawyer?.specialties?.[0]) setSpecialty(lawyer.specialties[0]) }
  const closeModal = () => { setReqFor(null); setNote(''); setSpecialty(''); setPicked([]) }

  const submit = async () => {
    setSending(true); setError('')
    try {
      await api.lawyerRequests.create({
        specialty: specialty || null,
        note,
        lawyerId: reqFor?.broadcast ? null : reqFor?.id,
        workspaceItemIds: picked,
        source: 'lawyers-page',
      })
      setSent(true); loadRequests()
    } catch (e) { setError(e.message) } finally { setSending(false) }
  }

  const STATUS = {
    pending: { label: 'Yuborildi', color: 'var(--text2)', icon: Clock },
    viewed: { label: "Ko'rildi", color: 'var(--accent2)', icon: Clock },
    accepted: { label: 'Qabul qilindi', color: 'var(--green)', icon: CheckCircle2 },
    closed: { label: 'Yopildi', color: 'var(--text3)', icon: X },
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Scale size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Yuristlar</h1>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
        Murakkab masala uchun tekshirilgan yuristga murojaat qiling — hujjatlaringiz bilan tayyor holda.
        {' '}<Link to="/app/lawyer/profile" style={{ color: 'var(--accent2)' }}>Yuristmisiz? Ro'yxatdan o'ting →</Link>
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button onClick={() => setTab('browse')} className={`btn ${tab === 'browse' ? 'btn-primary' : 'btn-ghost'} btn-sm`}>Yuristlar</button>
        <button onClick={() => setTab('requests')} className={`btn ${tab === 'requests' ? 'btn-primary' : 'btn-ghost'} btn-sm`}>Mening so'rovlarim {requests.length ? `(${requests.length})` : ''}</button>
      </div>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {tab === 'browse' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            <button onClick={() => setFilter('')} style={chip(filter === '')}>Barchasi</button>
            {SPECIALTIES.map(s => <button key={s.key} onClick={() => setFilter(s.key)} style={chip(filter === s.key)}>{s.label}</button>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {lawyers.map(l => (
              <div key={l.id} style={{ padding: 18, borderRadius: 14, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                    {l.full_name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{l.full_name}</span>
                      {l.verified && <BadgeCheck size={14} color="var(--accent2)" />}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Star size={10} fill="var(--amber)" color="var(--amber)" /> {l.rating}</span>
                      {l.region && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {l.region}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {(l.specialties || []).map(s => <span key={s} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text2)' }}>{specLabel(s)}</span>)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10, minHeight: 34 }}>{l.bio}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)', marginBottom: 12 }}>{l.consult_fee}</div>
                <button onClick={() => openRequest(l)} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}><Send size={13} /> Murojaat qilish</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'requests' && (
        requests.length === 0
          ? <div style={{ textAlign: 'center', padding: '50px 24px', color: 'var(--text3)', fontSize: 14 }}>Hozircha so'rov yo'q.</div>
          : requests.map(r => {
            const S = STATUS[r.status] || STATUS.pending
            return (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 11, marginBottom: 8 }}>
                <S.icon size={16} color={S.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.lawyer_name || 'Mutaxassisga yuborildi'}{r.specialty ? ` · ${specLabel(r.specialty)}` : ''}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.created_at).toLocaleDateString()} · {S.label}</div>
                </div>
                {r.lawyer_contact && <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{r.lawyer_contact}</div>}
              </div>
            )
          })
      )}

      {/* Request modal */}
      {reqFor && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 16, padding: 24, width: 480, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={40} color="var(--green)" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>So'rov yuborildi!</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Yurist tez orada javob beradi. "Mening so'rovlarim"da holatini kuzating.</div>
                <button onClick={closeModal} className="btn btn-primary btn-sm">Yopish</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{reqFor.broadcast ? 'Yuristga murojaat' : `Murojaat: ${reqFor.full_name}`}</span>
                  <button onClick={closeModal} style={{ display: 'flex', border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} color="var(--text2)" /></button>
                </div>
                <label className="label">Yo'nalish</label>
                <select className="input" value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ marginBottom: 12 }}>
                  <option value="">— tanlang —</option>
                  {SPECIALTIES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
                <label className="label">Vaziyatingiz</label>
                <textarea className="input" value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="Muammoni qisqacha tasvirlab bering…" style={{ marginBottom: 12, resize: 'vertical' }} />
                {items.length > 0 && (
                  <>
                    <label className="label">Hujjatlarni biriktirish (ixtiyoriy)</label>
                    <div style={{ maxHeight: 130, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 6, marginBottom: 16 }}>
                      {items.slice(0, 15).map(it => (
                        <label key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 6px', fontSize: 12, cursor: 'pointer' }}>
                          <input type="checkbox" checked={picked.includes(it.id)} onChange={e => setPicked(p => e.target.checked ? [...p, it.id] : p.filter(x => x !== it.id))} />
                          <FileText size={12} color="var(--text3)" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={submit} disabled={sending || (!specialty && !note.trim())} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {sending ? 'Yuborilmoqda…' : <><Send size={14} /> So'rov yuborish</>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const chip = (active) => ({ fontSize: 12, padding: '5px 11px', borderRadius: 16, cursor: 'pointer', border: '1px solid var(--border)', background: active ? 'var(--accent-bg)' : 'var(--bg2)', color: active ? 'var(--accent2)' : 'var(--text2)' })
