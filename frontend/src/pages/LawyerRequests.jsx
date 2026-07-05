import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { specLabel } from '../lib/specialties.js'
import { Inbox, FileText, CheckCircle2, Mail, ChevronRight } from 'lucide-react'

export default function LawyerRequests() {
  const [requests, setRequests] = useState([])
  const [open, setOpen] = useState(null)
  const [error, setError] = useState('')

  const load = () => api.lawyerRequests.inbox().then(setRequests).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const accept = async (r) => { await api.lawyerRequests.update(r.id, 'accepted'); load(); setOpen(o => o && { ...o, status: 'accepted' }) }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Inbox size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Mijoz so'rovlari</h1>
      </div>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Sizga yo'naltirilgan tayyor so'rovlar — hujjatlari bilan.</p>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 24px', color: 'var(--text3)' }}>
          <Inbox size={30} style={{ marginBottom: 12, opacity: 0.5 }} />
          <div style={{ fontSize: 14 }}>Hozircha so'rov yo'q.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {requests.map(r => {
            const pkg = r.case_package || {}
            const isOpen = open?.id === r.id
            return (
              <div key={r.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpen(isOpen ? null : r)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.specialty ? specLabel(r.specialty) : "Umumiy so'rov"}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.created_at).toLocaleDateString()} · {r.status === 'accepted' ? 'Qabul qilingan' : 'Yangi'}</div>
                  </div>
                  {r.status === 'accepted' && <CheckCircle2 size={16} color="var(--green)" />}
                  <ChevronRight size={16} color="var(--text3)" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', margin: '12px 0 6px' }}>Vaziyat</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{pkg.note || '—'}</div>
                    {pkg.items?.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', margin: '14px 0 6px' }}>Biriktirilgan hujjatlar</div>
                        {pkg.items.map((it, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text2)', marginBottom: 4 }}>
                            <FileText size={13} color="var(--accent2)" /> {it.title}{it.summary ? ` — ${it.summary.slice(0, 80)}` : ''}
                          </div>
                        ))}
                      </>
                    )}
                    <div style={{ marginTop: 16 }}>
                      {r.status === 'accepted' ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                          <Mail size={14} /> Mijoz aloqasi: {r.client_email || '—'}
                        </div>
                      ) : (
                        <button onClick={() => accept(r)} className="btn btn-primary btn-sm"><CheckCircle2 size={14} /> Qabul qilish</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
