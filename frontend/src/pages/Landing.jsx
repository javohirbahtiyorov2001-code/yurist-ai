import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Play, ChevronDown, Brain, FileText, MessageSquare, Sparkles } from 'lucide-react'

const T = {
  uz: {
    flag: '🇺🇿', lang: "O'zbekcha",
    h1a: "Huquqingizni",
    h1b: "biling.",
    sub: "Sun'iy intellekt yordamida 30 soniyada yuridik tahlil",
    tags: [
      { icon: '💼', label: 'Maosh berilmadi',    color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
      { icon: '🏠', label: 'Ijara muammosi',     color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)' },
      { icon: '🛒', label: 'Sifatsiz tovar',     color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)' },
    ],
    cta: "Boshlash →",
    demo: "Demo ko'rish",
    cards: [
      { title: "AI tahlil",            desc: "Vaziyatingizga asoslangan tezkor huquqiy tahlil." },
      { title: "Shartnoma tekshiruvi", desc: "Xavfli bandlarni va adolatsiz shartlarni aniqlang." },
      { title: "Yurist bilan chat",    desc: "24/7 huquqiy maslahat va hujjat tayyorlash." },
    ],
    signin: "Kirish",
    getstarted: "Boshlash",
  },
  ru: {
    flag: '🇷🇺', lang: 'Русский',
    h1a: "Знайте свои",
    h1b: "права.",
    sub: "Правовой анализ за 30 секунд с помощью ИИ",
    tags: [
      { icon: '💼', label: 'Невыплата зарплаты', color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
      { icon: '🏠', label: 'Спор об аренде',     color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)' },
      { icon: '🛒', label: 'Плохой товар',        color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)' },
    ],
    cta: "Начать →",
    demo: "Смотреть демо",
    cards: [
      { title: "AI-анализ дела",    desc: "Мгновенный правовой анализ вашей ситуации." },
      { title: "Проверка договора", desc: "Выявите риски и несправедливые условия за секунды." },
      { title: "Чат с юристом",     desc: "Круглосуточная консультация и составление документов." },
    ],
    signin: "Войти",
    getstarted: "Начать",
  },
  en: {
    flag: '🇬🇧', lang: 'English',
    h1a: "Know Your",
    h1b: "Rights.",
    sub: "AI-powered legal clarity in 30 seconds",
    tags: [
      { icon: '💼', label: 'Unpaid salary',     color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
      { icon: '🏠', label: 'Rental dispute',    color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)' },
      { icon: '🛒', label: 'Defective product', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)' },
    ],
    cta: "Get Started Now →",
    demo: "Watch Demo",
    cards: [
      { title: "AI Case Analysis",  desc: "Instant legal insights based on your specific situation." },
      { title: "Contract Review",   desc: "Identify potential risks and unfair clauses in seconds." },
      { title: "Chat with Yurist",  desc: "24/7 legal guidance and document drafting support." },
    ],
    signin: "Sign in",
    getstarted: "Get Started",
  },
}

const ICONS = [Brain, FileText, MessageSquare]

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: ((i * 41 + 7) % 100),
  size: i % 3 === 0 ? 3 : 2,
  delay: (i * 0.45) % 9,
  duration: 8 + (i % 5) * 2,
  opacity: 0.1 + (i % 4) * 0.07,
  gold: i % 4 === 0,
}))

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

// Logo F — hexagon with embedded scales
function LogoHex({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7c3aed"/><stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <polygon points="30,3 54,16.5 54,43.5 30,57 6,43.5 6,16.5" fill="url(#hexGrad)"/>
      <polygon points="30,9 48,19.5 48,40.5 30,51 12,40.5 12,19.5"
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      {/* scale pillar */}
      <rect x="28.5" y="13" width="3" height="26" rx="1.5" fill="white" opacity="0.92"/>
      {/* crossbeam */}
      <rect x="16" y="19" width="28" height="2.5" rx="1.25" fill="white" opacity="0.92"/>
      {/* left chain + pan */}
      <line x1="20" y1="21.5" x2="20" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M14.5 32 Q20 34.5 25.5 32" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <path d="M14 32 Q20 35.5 26 32 Q22 33.5 20 33.5 Q18 33.5 14 32Z" fill="white" opacity="0.75"/>
      {/* right chain + pan */}
      <line x1="40" y1="21.5" x2="40" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8"/>
      <path d="M34.5 32 Q40 34.5 45.5 32" stroke="white" strokeWidth="1.5" fill="none" opacity="0.85"/>
      <path d="M34 32 Q40 35.5 46 32 Q42 33.5 40 33.5 Q38 33.5 34 32Z" fill="white" opacity="0.75"/>
      {/* base */}
      <rect x="26" y="40" width="8" height="2.5" rx="1.25" fill="white" opacity="0.6"/>
    </svg>
  )
}

export default function Landing() {
  const [lang, setLang] = useState(() => localStorage.getItem('yurist_lang') || 'en')
  const [langOpen, setLangOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [shimmer, setShimmer] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const cardsRef = useRef(null)
  const cardsInView = useInView(cardsRef)
  const t = T[lang]

  useEffect(() => {
    const delays = [100, 260, 420, 580, 740]
    const timers = delays.map((d, i) => setTimeout(() => setStep(i + 1), d))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setShimmer(true)
      setTimeout(() => setShimmer(false), 700)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  const switchLang = (l) => { setLang(l); localStorage.setItem('yurist_lang', l); setLangOpen(false) }

  const fadeUp = (show, delay = 0) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080810',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      <style>{`
        @keyframes floatUp {
          from { transform: translateY(0);    opacity: var(--op); }
          to   { transform: translateY(-95vh); opacity: 0; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes tagFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(500%)  skewX(-18deg); }
        }

        /* ── SCALE ANIMATIONS ── */
        @keyframes swingLeft {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-11deg); }
          50%  { transform: rotate(8deg); }
          80%  { transform: rotate(-11deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes swingRight {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(11deg); }
          50%  { transform: rotate(-8deg); }
          80%  { transform: rotate(11deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes scaleFloat {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-12px); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes glowPulseMid {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes scaleEntrance {
          0%   { opacity: 0; transform: translateY(40px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0px)  scale(1); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* hover states */
        .cta-main:hover {
          box-shadow: 0 10px 52px rgba(124,58,237,0.75), 0 1px 0 rgba(255,255,255,0.2) inset !important;
          transform: translateY(-2px) !important;
        }
        .cta-main { transition: box-shadow 0.28s, transform 0.28s !important; }
        .feature-card { transition: all 0.3s ease !important; }
        .feature-card:hover {
          background: rgba(139,92,246,0.07) !important;
          border-top-color: rgba(168,85,247,0.55) !important;
          transform: translateY(-5px) !important;
          box-shadow: 0 18px 50px rgba(109,40,217,0.22) !important;
        }
      `}</style>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)
        `,
        backgroundSize: '62px 62px',
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 78%)',
        pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, bottom: '-4px',
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.gold ? 'rgba(212,175,55,0.8)' : 'rgba(168,85,247,0.7)',
          '--op': p.opacity, opacity: p.opacity,
          animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* ── NAV ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        opacity: step >= 1 ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {/* Logo F */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            boxShadow: '0 0 22px rgba(139,92,246,0.5), 0 2px 10px rgba(0,0,0,0.5)',
            borderRadius: '30%', flexShrink: 0,
          }}>
            <LogoHex size={36} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' }}>
              Yurist<em style={{ fontStyle: 'normal',
                background: 'linear-gradient(135deg,#e9d5ff,#a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}> AI</em>
            </span>
            <span style={{ fontSize: 9, color: '#6b6b88', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: 2 }}>
              Legal Intelligence
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 13px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.04)',
              cursor: 'pointer', fontSize: 13, color: '#999',
            }}>
              {t.flag} {t.lang} <ChevronDown size={11} />
            </button>
            {langOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                background: 'rgba(8,6,18,0.98)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
                overflow: 'hidden', minWidth: 155, zIndex: 100,
                boxShadow: '0 12px 50px rgba(0,0,0,0.8)',
              }}>
                {Object.entries(T).map(([k, v]) => (
                  <button key={k} onClick={() => switchLang(k)} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', padding: '10px 15px', border: 'none',
                    background: k === lang ? 'rgba(139,92,246,0.15)' : 'transparent',
                    cursor: 'pointer', fontSize: 13,
                    color: k === lang ? '#c4b5fd' : '#888', textAlign: 'left',
                  }}>
                    {v.flag} {v.lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/login" style={{
            padding: '7px 16px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'transparent',
            fontSize: 13, color: '#888', textDecoration: 'none',
            transition: 'color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.color='#888'; e.currentTarget.style.background='transparent' }}
          >{t.signin}</Link>
          <Link to="/register" style={{
            padding: '8px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            fontSize: 13, color: '#fff', fontWeight: 700,
            boxShadow: '0 2px 18px rgba(124,58,237,0.5)',
            textDecoration: 'none', letterSpacing: '-0.01em',
            transition: 'box-shadow 0.22s, transform 0.22s',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 28px rgba(124,58,237,0.75)'; e.currentTarget.style.transform='translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 18px rgba(124,58,237,0.5)'; e.currentTarget.style.transform='translateY(0)' }}
          >{t.getstarted}</Link>
        </div>
      </nav>

      {/* ── HERO — two-column layout ── */}
      <div style={{
        position: 'relative', zIndex: 1, flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: 0,
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: '40px 64px 60px',
      }}>

        {/* ── LEFT: Text content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20,
            border: '1px solid rgba(212,175,55,0.3)',
            background: 'rgba(212,175,55,0.07)',
            fontSize: 12, color: '#d4af37', marginBottom: 26, fontWeight: 600,
            letterSpacing: '0.03em',
            ...fadeUp(step >= 1),
          }}>
            <Sparkles size={11} /> AI-Powered · CIS Legal Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 78px)',
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.045em', marginBottom: 18,
            color: '#fff', textAlign: 'left',
            ...fadeUp(step >= 2),
          }}>
            <span style={{ display: 'block' }}>{t.h1a}</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #f9e189 0%, #d4af37 30%, #c084fc 65%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t.h1b}
              <span style={{
                display: 'inline-block',
                width: 4, height: '0.72em',
                background: '#d4af37',
                marginLeft: 6,
                verticalAlign: 'middle',
                borderRadius: 2,
                animation: 'blink 1.1s step-end infinite',
                WebkitTextFillColor: 'initial',
              }} />
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.42)',
            marginBottom: 30, lineHeight: 1.65,
            maxWidth: 420, textAlign: 'left',
            ...fadeUp(step >= 3),
          }}>{t.sub}</p>

          {/* Tags */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 34, flexWrap: 'wrap',
            ...fadeUp(step >= 4),
          }}>
            {t.tags.map((tag, i) => (
              <span key={tag.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 15px', borderRadius: 100,
                background: tag.bg, border: `1px solid ${tag.border}`,
                fontSize: 13, color: tag.color, fontWeight: 500,
                backdropFilter: 'blur(8px)',
                animation: `tagFloat ${3.6 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
              }}>
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 10,
            ...fadeUp(step >= 5),
          }}>
            <Link to="/register" className="cta-main" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 30px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              fontSize: 15, color: '#fff', fontWeight: 700,
              boxShadow: '0 4px 30px rgba(124,58,237,0.55), 0 1px 0 rgba(255,255,255,0.15) inset',
              letterSpacing: '-0.02em', textDecoration: 'none',
              position: 'relative', overflow: 'hidden',
            }}>
              <span style={{
                position: 'absolute', top: 0, left: 0,
                width: '42%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                animation: shimmer ? 'shimmerSlide 0.65s ease' : 'none',
                pointerEvents: 'none',
              }} />
              {t.cta}
            </Link>
            <button onClick={() => setShowDemo(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 24px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              fontSize: 15, color: 'rgba(255,255,255,0.55)', fontWeight: 500,
              backdropFilter: 'blur(8px)', cursor: 'pointer',
              transition: 'all 0.22s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.55)' }}
            >
              <Play size={13} fill="currentColor" /> {t.demo}
            </button>
          </div>

          {/* Trust line */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, marginTop: 32,
            ...fadeUp(step >= 5),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['🇺🇿','🇷🇺','🇬🇧'].map(f => <span key={f} style={{ fontSize: 16 }}>{f}</span>)}
              <span style={{ fontSize: 12, color: '#6b6b88', marginLeft: 4 }}>3 languages</span>
            </div>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }}/>
            <span style={{ fontSize: 12, color: '#6b6b88' }}>🔒 Secure & private</span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }}/>
            <span style={{ fontSize: 12, color: '#6b6b88' }}>⚡ 30 sec analysis</span>
          </div>
        </div>

        {/* ── RIGHT: Animated Scales ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          animation: 'scaleEntrance 1.1s cubic-bezier(0.34,1.4,0.64,1) 0.4s both',
        }}>

          {/* Outer glow rings (decorative) */}
          <div style={{
            position: 'absolute',
            width: 460, height: 460, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, rgba(139,92,246,0.06) 50%, transparent 72%)',
            filter: 'blur(40px)',
            animation: 'glowPulse 6s ease-in-out infinite',
          }}/>
          <div style={{
            position: 'absolute',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
            filter: 'blur(24px)',
            animation: 'glowPulseMid 4.5s ease-in-out infinite 0.7s',
          }}/>

          {/* Rotating dashed ring */}
          <div style={{
            position: 'absolute',
            width: 380, height: 380, borderRadius: '50%',
            border: '1px dashed rgba(212,175,55,0.12)',
            animation: 'ringRotate 30s linear infinite',
          }}/>
          <div style={{
            position: 'absolute',
            width: 300, height: 300, borderRadius: '50%',
            border: '1px dashed rgba(139,92,246,0.12)',
            animation: 'ringRotate 20s linear infinite reverse',
          }}/>

          {/* The Scale SVG */}
          <div style={{ animation: 'scaleFloat 5s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
            <svg
              viewBox="0 0 360 440"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 340, height: 380, filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.45)) drop-shadow(0 0 60px rgba(212,175,55,0.18))' }}
            >
              <defs>
                <linearGradient id="goldA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#f9e97a"/>
                  <stop offset="30%"  stopColor="#d4af37"/>
                  <stop offset="65%"  stopColor="#a07820"/>
                  <stop offset="100%" stopColor="#6b4f0f"/>
                </linearGradient>
                <linearGradient id="goldB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#fff8c8" stopOpacity="0.95"/>
                  <stop offset="45%"  stopColor="#d4af37"/>
                  <stop offset="100%" stopColor="#7a5a10"/>
                </linearGradient>
                <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#7a5a10"/>
                  <stop offset="25%"  stopColor="#c8941e"/>
                  <stop offset="55%"  stopColor="#f5d848"/>
                  <stop offset="80%"  stopColor="#d4af37"/>
                  <stop offset="100%" stopColor="#8b6914"/>
                </linearGradient>
                <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#7a3b10"/>
                  <stop offset="100%" stopColor="#2d1206"/>
                </linearGradient>
                <radialGradient id="pan" cx="40%" cy="25%" r="65%">
                  <stop offset="0%"   stopColor="#fff5a0"/>
                  <stop offset="55%"  stopColor="#d4af37"/>
                  <stop offset="100%" stopColor="#6b4a0a"/>
                </radialGradient>
                <filter id="glow1">
                  <feGaussianBlur stdDeviation="3.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="glow2">
                  <feGaussianBlur stdDeviation="6" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Shadow under base */}
              <ellipse cx="180" cy="425" rx="80" ry="10" fill="black" opacity="0.35"/>

              {/* Wooden base */}
              <rect x="118" y="390" width="124" height="28" rx="14" fill="url(#wood)"/>
              <rect x="122" y="390" width="116" height="10" rx="8" fill="#8b4513" opacity="0.45"/>
              <ellipse cx="180" cy="390" rx="62" ry="8" fill="#7a3b10" opacity="0.35"/>

              {/* Base collar */}
              <ellipse cx="180" cy="388" rx="24" ry="8" fill="url(#goldA)" filter="url(#glow1)"/>
              <ellipse cx="180" cy="385" rx="18" ry="5.5" fill="url(#goldB)" opacity="0.8"/>

              {/* Pillar */}
              <rect x="172" y="96" width="16" height="294" rx="8" fill="url(#pillar)" filter="url(#glow1)"/>
              <rect x="173" y="96" width="4.5" height="294" rx="2" fill="rgba(255,248,200,0.2)"/>

              {/* Knobs on pillar */}
              {[140, 200, 270, 335].map(y => (
                <g key={y}>
                  <ellipse cx="180" cy={y} rx="13" ry="5.5" fill="url(#goldA)"/>
                  <ellipse cx="180" cy={y-1.5} rx="9" ry="3.5" fill="url(#goldB)" opacity="0.7"/>
                </g>
              ))}

              {/* Top crown */}
              <path d="M155 98 C155 83 165 73 180 68 C195 73 205 83 205 98 C196 90 188 86 180 85 C172 86 164 90 155 98Z"
                fill="url(#goldA)" filter="url(#glow1)"/>
              {/* crown ornament arms */}
              <path d="M157 90 Q143 80 140 67 Q152 72 157 84Z" fill="url(#goldA)" opacity="0.8"/>
              <path d="M203 90 Q217 80 220 67 Q208 72 203 84Z" fill="url(#goldA)" opacity="0.8"/>
              <ellipse cx="180" cy="73" rx="11" ry="8" fill="url(#goldB)"/>
              <circle cx="180" cy="63" r="9" fill="url(#goldA)" filter="url(#glow2)"/>
              <circle cx="176" cy="59" r="3.5" fill="rgba(255,250,200,0.65)"/>

              {/* Crossbeam */}
              <rect x="30" y="100" width="300" height="13" rx="6.5" fill="url(#goldA)" filter="url(#glow1)"/>
              <rect x="30" y="100" width="300" height="5" rx="2.5" fill="rgba(255,248,200,0.28)"/>
              {/* center pivot */}
              <ellipse cx="180" cy="106" rx="17" ry="10" fill="url(#goldA)"/>
              <ellipse cx="180" cy="103" rx="12" ry="6.5" fill="url(#goldB)" opacity="0.65"/>
              {/* end caps */}
              {[30, 330].map(x => (
                <g key={x}>
                  <ellipse cx={x} cy="106" rx="11" ry="10" fill="url(#goldA)" filter="url(#glow1)"/>
                  <ellipse cx={x} cy="103" rx="7.5" ry="6.5" fill="url(#goldB)" opacity="0.7"/>
                </g>
              ))}

              {/* ── LEFT PAN (swing left) ── */}
              <g style={{ transformOrigin: '30px 106px', animation: 'swingLeft 5s ease-in-out infinite' }}>
                {/* 5 chain links */}
                {[120,138,156,174,192].map(y => (
                  <ellipse key={y} cx="30" cy={y} rx="5" ry="3.2" fill="none" stroke="url(#goldA)" strokeWidth="2.2"/>
                ))}
                <line x1="30" y1="112" x2="30" y2="200" stroke="url(#goldA)" strokeWidth="2.5" opacity="0.55"/>
                {/* sub-chains */}
                <line x1="5"  y1="197" x2="30" y2="185" stroke="url(#goldA)" strokeWidth="2" opacity="0.8"/>
                <line x1="55" y1="197" x2="30" y2="185" stroke="url(#goldA)" strokeWidth="2" opacity="0.8"/>
                <line x1="-2" y1="200" x2="8"  y2="195" stroke="url(#goldA)" strokeWidth="1.5" opacity="0.6"/>
                <line x1="62" y1="200" x2="52" y2="195" stroke="url(#goldA)" strokeWidth="1.5" opacity="0.6"/>
                {/* bowl */}
                <path d="M-4 202 Q30 218 64 202" stroke="url(#goldA)" strokeWidth="2.8" fill="none"/>
                <path d="M-6 202 Q30 222 66 202 Q50 210 30 210 Q10 210 -6 202Z" fill="url(#pan)" opacity="0.96"/>
                <ellipse cx="30" cy="202" rx="36" ry="5.5" fill="none" stroke="rgba(255,248,200,0.35)" strokeWidth="1.5"/>
                <ellipse cx="30" cy="208" rx="26" ry="4" fill="rgba(0,0,0,0.2)"/>
              </g>

              {/* ── RIGHT PAN (swing right) ── */}
              <g style={{ transformOrigin: '330px 106px', animation: 'swingRight 5s ease-in-out infinite' }}>
                {[120,138,156,174,192].map(y => (
                  <ellipse key={y} cx="330" cy={y} rx="5" ry="3.2" fill="none" stroke="url(#goldA)" strokeWidth="2.2"/>
                ))}
                <line x1="330" y1="112" x2="330" y2="200" stroke="url(#goldA)" strokeWidth="2.5" opacity="0.55"/>
                <line x1="305" y1="197" x2="330" y2="185" stroke="url(#goldA)" strokeWidth="2" opacity="0.8"/>
                <line x1="355" y1="197" x2="330" y2="185" stroke="url(#goldA)" strokeWidth="2" opacity="0.8"/>
                <line x1="298" y1="200" x2="308" y2="195" stroke="url(#goldA)" strokeWidth="1.5" opacity="0.6"/>
                <line x1="362" y1="200" x2="352" y2="195" stroke="url(#goldA)" strokeWidth="1.5" opacity="0.6"/>
                <path d="M296 202 Q330 218 364 202" stroke="url(#goldA)" strokeWidth="2.8" fill="none"/>
                <path d="M294 202 Q330 222 366 202 Q350 210 330 210 Q310 210 294 202Z" fill="url(#pan)" opacity="0.96"/>
                <ellipse cx="330" cy="202" rx="36" ry="5.5" fill="none" stroke="rgba(255,248,200,0.35)" strokeWidth="1.5"/>
                <ellipse cx="330" cy="208" rx="26" ry="4" fill="rgba(0,0,0,0.2)"/>
              </g>

            </svg>
          </div>

          {/* Floating gold sparks around the scale */}
          {[
            { top: '12%', left: '10%', size: 4, delay: 0 },
            { top: '8%',  left: '80%', size: 3, delay: 1.2 },
            { top: '75%', left: '8%',  size: 3, delay: 0.6 },
            { top: '80%', left: '82%', size: 4, delay: 1.8 },
            { top: '45%', left: '4%',  size: 2, delay: 2.4 },
            { top: '30%', left: '88%', size: 2, delay: 0.9 },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              borderRadius: '50%',
              background: '#d4af37',
              boxShadow: `0 0 ${s.size * 3}px rgba(212,175,55,0.8)`,
              animation: `glowPulse ${2.5 + i * 0.4}s ease-in-out ${s.delay}s infinite`,
            }}/>
          ))}
        </div>
      </div>

      {/* ── VIDEO DEMO MODAL ── */}
      {showDemo && (
        <div
          onClick={() => setShowDemo(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            animation: 'modalIn 0.25s ease',
          }}
        >
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: 960,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 32px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.2)',
              background: '#000',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDemo(false)}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: 18, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.6)'}
            >×</button>

            {/* Gold top bar */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #7c3aed, #d4af37, #a855f7)' }} />

            {/* Video */}
            <video
              src="/demo.mp4"
              autoPlay
              controls
              style={{ width: '100%', display: 'block', aspectRatio: '16/9' }}
            />

            {/* Caption bar */}
            <div style={{
              padding: '12px 20px',
              background: 'rgba(8,8,16,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LogoHex size={22} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                  Yurist <em style={{ fontStyle:'normal', color:'#a78bfa' }}>AI</em>
                  <span style={{ fontSize: 11, color: '#6b6b88', fontWeight: 400, marginLeft: 8 }}>— Product Demo</span>
                </span>
              </div>
              <a href="/demo.mp4" download="yurist-ai-demo.mp4" style={{
                fontSize: 12, color: '#d4af37', textDecoration: 'none', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 5,
                opacity: 0.8, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity='1'}
              onMouseLeave={e => e.currentTarget.style.opacity='0.8'}
              >⬇ Download</a>
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURE CARDS ── */}
      <div ref={cardsRef} style={{
        position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 14,
        maxWidth: 1280, width: '100%', margin: '0 auto',
        padding: '0 64px 72px',
      }}>
        {t.cards.map(({ title, desc }, i) => {
          const Icon = ICONS[i]
          return (
            <div key={title} className="feature-card" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: `1px solid ${i === 0 ? 'rgba(212,175,55,0.35)' : 'rgba(139,92,246,0.28)'}`,
              borderRadius: 14, padding: '22px 20px',
              backdropFilter: 'blur(20px)',
              opacity: cardsInView ? 1 : 0,
              transform: cardsInView ? 'translateY(0)' : 'translateY(36px)',
              transitionDelay: cardsInView ? `${i * 130}ms` : '0ms',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: i === 0 ? 'rgba(212,175,55,0.1)' : 'rgba(139,92,246,0.1)',
                border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.25)' : 'rgba(139,92,246,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <Icon size={17} color={i === 0 ? '#d4af37' : '#a78bfa'} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>{title}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.32)', lineHeight: 1.75 }}>{desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
