import { useState, useEffect } from 'react'
import { api } from '../lib/api.js'
import { Users, Copy, RefreshCw, LogIn, Crown, Check } from 'lucide-react'

export default function Team() {
  const [org, setOrg] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')

  const load = () => api.org.get().then(o => { setOrg(o); setName(o.name) }).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const isOwner = org?.myRole === 'owner'

  const copyCode = () => { navigator.clipboard.writeText(org.invite_code); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const regenerate = async () => { await api.org.regenerateInvite(); load() }
  const saveName = async () => { setEditingName(false); if (name.trim() && name !== org.name) { await api.org.rename(name.trim()); load() } }
  const join = async () => {
    setError('')
    try { await api.org.join(joinCode.trim()); setJoinCode(''); load(); window.location.reload() }
    catch (e) { setError(e.message) }
  }

  if (!org) return <div style={{ padding: 40, color: 'var(--text2)' }}>{error || 'Loading…'}</div>

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={17} color="#fff" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Tashkilot / Team</h1>
      </div>

      {error && <div style={{ marginBottom: 16, color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10 }}>⚠️ {error}</div>}

      {/* Org name */}
      <div className="card" style={{ marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Organization</div>
        {editingName && isOwner ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={name} onChange={e => setName(e.target.value)} autoFocus onBlur={saveName} onKeyDown={e => e.key === 'Enter' && saveName()}
              style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--accent2)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 16, outline: 'none' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{org.name}</div>
            {isOwner && <button onClick={() => setEditingName(true)} style={{ fontSize: 11, color: 'var(--accent2)', background: 'none', border: 'none', cursor: 'pointer' }}>edit</button>}
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--accent2)', textTransform: 'capitalize' }}>{org.plan} plan</span>
          </div>
        )}
      </div>

      {/* Invite code */}
      <div className="card" style={{ marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Invite teammates</div>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Bu kodni hamkasblaringizga bering — ular ro'yxatdan o'tib, "Join" orqali qo'shiladi.</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <code style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 14px', fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent2)' }}>{org.invite_code}</code>
          <button onClick={copyCode} className="btn btn-ghost btn-sm">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button>
          {isOwner && <button onClick={regenerate} className="btn btn-ghost btn-sm" title="Regenerate"><RefreshCw size={14} /></button>}
        </div>
      </div>

      {/* Members */}
      <div className="card" style={{ marginBottom: 16, padding: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Members ({org.members.length})</div>
        {org.members.map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {m.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{m.full_name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.email}</div>
            </div>
            {m.role === 'owner' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--amber)' }}><Crown size={11} /> Owner</span>}
          </div>
        ))}
      </div>

      {/* Join another org */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Join another organization</div>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Boshqa tashkilotga qo'shilmoqchimisiz? Taklif kodini kiriting (diqqat: joriy tashkilotdan chiqib ketasiz).</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="XXXX-XXXX"
            style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 14, outline: 'none', letterSpacing: '0.05em' }} />
          <button onClick={join} disabled={!joinCode.trim()} className="btn btn-primary btn-sm"><LogIn size={14} /> Join</button>
        </div>
      </div>
    </div>
  )
}
