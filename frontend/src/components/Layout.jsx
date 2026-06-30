import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { MessageSquare, FileText, FileEdit, LogOut, LayoutDashboard, Sparkles } from 'lucide-react'

function LogoHex({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient id="lhg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <polygon points="30,3 54,16.5 54,43.5 30,57 6,43.5 6,16.5" fill="url(#lhg)"/>
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

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/chat', label: 'Legal Q&A', icon: MessageSquare },
    { to: '/app/contracts', label: 'Contracts', icon: FileText },
    { to: '/app/documents', label: 'Documents', icon: FileEdit },
  ]

  const initials = user?.full_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'
  const planColor = { free: 'var(--amber)', pro: 'var(--accent2)', entity: 'var(--green)' }[user?.plan] || 'var(--text3)'

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: 232, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 18px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ boxShadow: '0 0 16px rgba(139,92,246,0.45)', borderRadius: '30%', flexShrink: 0 }}>
              <LogoHex size={30} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.02em' }}>
                Yurist<em style={{ fontStyle:'normal', background:'linear-gradient(135deg,#e9d5ff,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}> AI</em>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase' }}>Legal Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 8px 8px' }}>Menu</div>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 9, marginBottom: 2,
              color: isActive ? 'var(--accent2)' : 'var(--text2)',
              background: isActive ? 'var(--accent-bg)' : 'transparent',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
              boxShadow: isActive ? 'inset 0 0 0 1px rgba(124,109,255,0.2)' : 'none',
            })}
            onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg3)' }}
            onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}

          {/* Upgrade nudge for free users */}
          {user?.plan === 'free' && (
            <div style={{
              marginTop: 16, padding: '12px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(124,109,255,0.1) 0%, rgba(155,109,255,0.06) 100%)',
              border: '1px solid rgba(124,109,255,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={12} color="var(--accent2)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)' }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 10 }}>Unlimited questions + contract analysis</p>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}>
                $5/month →
              </button>
            </div>
          )}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--pink) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: planColor, textTransform: 'capitalize', letterSpacing: '0.03em' }}>{user?.plan} plan</div>
            </div>
            <button onClick={handleLogout} title="Log out"
              style={{ color: 'var(--text3)', display: 'flex', padding: 6, borderRadius: 7, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)' }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  )
}
