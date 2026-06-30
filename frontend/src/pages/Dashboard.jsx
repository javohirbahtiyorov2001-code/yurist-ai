import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { MessageSquare, FileText, FileEdit, ArrowRight, Shield, Zap, TrendingUp, Clock } from 'lucide-react'

const PLAN_LIMITS = { free: 3, pro: Infinity, entity: Infinity }

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const limit = PLAN_LIMITS[user?.plan] || 3
  const used = user?.questions_used || 0
  const isUnlimited = limit === Infinity
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100))

  const quickActions = [
    {
      to: '/app/chat',
      icon: MessageSquare,
      gradient: 'linear-gradient(135deg, #7c6dff 0%, #9b6dff 100%)',
      glow: 'rgba(124,109,255,0.25)',
      label: 'Ask a Legal Question',
      desc: 'Get instant answers with citations to real law articles',
      tag: 'Most used',
    },
    {
      to: '/app/contracts',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #22d47a 0%, #14b8a6 100%)',
      glow: 'rgba(34,212,122,0.2)',
      label: 'Analyze a Contract',
      desc: 'Upload any PDF — AI flags risks and suggests fixes',
      tag: 'Pro feature',
    },
    {
      to: '/app/documents',
      icon: FileEdit,
      gradient: 'linear-gradient(135deg, #ffb347 0%, #ff6eb4 100%)',
      glow: 'rgba(255,179,71,0.2)',
      label: 'Draft a Document',
      desc: 'Generate NDAs, employment contracts, and more in minutes',
      tag: null,
    },
  ]

  const stats = [
    { icon: Zap, label: 'Questions used', value: isUnlimited ? '∞' : `${used}/${limit}`, color: 'var(--accent2)' },
    { icon: TrendingUp, label: 'Plan', value: user?.plan?.toUpperCase(), color: 'var(--green)' },
    { icon: Clock, label: 'Resets', value: '1st of month', color: 'var(--amber)' },
  ]

  return (
    <div style={{ padding: '40px 40px', maxWidth: 960, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{getGreeting()}</p>
            <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>What legal matter can we help you with today?</p>
          </div>
          {user?.plan === 'free' && (
            <div style={{ padding: '10px 16px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(124,109,255,0.12) 0%, rgba(255,110,180,0.06) 100%)', border: '1px solid rgba(124,109,255,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--accent2)', fontWeight: 500 }}>✨ Upgrade to Pro</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>$5/month</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage bar (only for free) */}
      {!isUnlimited && (
        <div style={{ marginBottom: 28, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Monthly questions</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: pct > 80 ? 'var(--red)' : 'var(--text)' }}>{used} <span style={{ color: 'var(--text3)' }}>/ {limit}</span></span>
          </div>
          <div style={{ height: 6, background: 'var(--bg4)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 6, transition: 'width 0.4s ease',
              background: pct > 80
                ? 'linear-gradient(90deg, var(--amber), var(--red))'
                : 'linear-gradient(90deg, var(--accent), #9b6dff)',
            }} />
          </div>
          {pct > 66 && (
            <p style={{ fontSize: 11, color: 'var(--amber)', marginTop: 8 }}>
              ⚡ {limit - used} question{limit - used !== 1 ? 's' : ''} left this month — <Link to="/register" style={{ color: 'var(--accent2)' }}>upgrade for unlimited</Link>
            </p>
          )}
        </div>
      )}

      {/* Quick actions */}
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 36 }}>
        {quickActions.map(({ to, icon: Icon, gradient, glow, label, desc, tag }) => (
          <Link key={to} to={to} style={{
            display: 'flex', flexDirection: 'column', gap: 14, padding: 22,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${glow}` }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${glow}` }}>
                <Icon size={20} color="#fff" />
              </div>
              {tag && <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: 'var(--bg3)', color: 'var(--text3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{tag}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{label}</div>
              <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent2)', fontWeight: 500 }}>
              Get started <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        <Shield size={15} color="var(--text3)" style={{ marginTop: 1, flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text2)' }}>Legal information only.</strong> Yurist AI provides AI-powered legal guidance based on CIS law. This is not legal representation. For court matters or binding legal advice, consult a licensed attorney.
        </p>
      </div>
    </div>
  )
}
