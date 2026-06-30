import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react'

function LogoHex({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient id="lhg2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <polygon points="30,3 54,16.5 54,43.5 30,57 6,43.5 6,16.5" fill="url(#lhg2)"/>
      <polygon points="30,9 48,19.5 48,40.5 30,51 12,40.5 12,19.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <rect x="28.5" y="13" width="3" height="26" rx="1.5" fill="white" opacity="0.92"/>
      <rect x="16" y="19" width="28" height="2.5" rx="1.25" fill="white" opacity="0.92"/>
      <line x1="20" y1="21.5" x2="20" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M14.5 32 Q20 34.5 25.5 32" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <path d="M14 32 Q20 35.5 26 32 Q22 33.5 20 33.5 Q18 33.5 14 32Z" fill="white" opacity="0.75"/>
      <line x1="40" y1="21.5" x2="40" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M34.5 32 Q40 34.5 45.5 32" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <path d="M34 32 Q40 35.5 46 32 Q42 33.5 40 33.5 Q38 33.5 34 32Z" fill="white" opacity="0.75"/>
      <rect x="26" y="40" width="8" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
    </svg>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try { await login(form.email, form.password); navigate('/app') }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden', background: 'var(--bg)',
    }}>
      {/* Background glow blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,110,180,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, textDecoration: 'none' }}>
            <div style={{ boxShadow: '0 0 18px rgba(139,92,246,0.5)', borderRadius: '30%' }}>
              <LogoHex size={36} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em' }}>
                Yurist<em style={{ fontStyle:'normal', background:'linear-gradient(135deg,#e9d5ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}> AI</em>
              </span>
              <span style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>Legal Intelligence</span>
            </div>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 18, padding: '28px 28px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input className="input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ paddingLeft: 38 }} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input className="input" type="password" placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingLeft: 38 }} required />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red)', fontSize: 13, padding: '10px 12px', background: 'var(--red-bg)', borderRadius: 9, border: '1px solid rgba(255,95,95,0.15)' }}>
                ⚠️ {error}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ justifyContent: 'center', width: '100%', padding: '13px', fontSize: 14, marginTop: 4, gap: 8 }}>
              {loading
                ? <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
                : <>Sign in <ArrowRight size={15} /></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)', fontWeight: 500 }}>Create one free →</Link>
        </p>
      </div>
    </div>
  )
}

