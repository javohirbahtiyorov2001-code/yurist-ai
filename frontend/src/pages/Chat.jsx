import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import ReactMarkdown from 'react-markdown'
import { Send, Plus, MessageSquare, BookOpen, Scale, Sparkles, ExternalLink } from 'lucide-react'

const SITUATIONS = [
  { emoji: '💼', label: 'Ish joyi muammosi', desc: "Maosh berilmadi yoki huquqlar buzildi", color: '#7c6dff',
    prompt: "Ish beruvchim meni ogohlantirisiz ishdan bo'shatdi va oxirgi oylik maoshimni bermadi. Nima qila olaman?" },
  { emoji: '🏠', label: 'Uy-joy ijarasi', desc: 'Depozit qaytarilmadi, muammolar', color: '#22d47a',
    prompt: "Uy egasi depozitimni qaytarishdan bosh tortdi. Mening huquqlarim nima?" },
  { emoji: '🛒', label: "Iste'molchi huquqlari", desc: 'Sifatsiz tovar, aldashdi', color: '#ffb347',
    prompt: "Sotib olgan telefonim 2 kun ichida ishlamay qoldi, do'kon esa qaytarishni rad etdi. Nima qilaman?" },
  { emoji: '👨‍👩‍👧', label: 'Oila masalalari', desc: 'Ajralish, nafaqa, meros', color: '#ff6eb4',
    prompt: "Ajralishmoqchiman, bolam bilan qolishni xohlayman. Vasiyatni qanday olaman?" },
  { emoji: '🚗', label: "Yo'l-transport hodisasi", desc: "Avaria, sug'urta to'lamaydi", color: '#ff5f5f',
    prompt: "Mening aybim bo'lmagan holda avariyaga uchradim. Sug'urta to'lashdan bosh tortmoqda." },
  { emoji: '🏦', label: 'Bank va qarzlar', desc: "Kredit, garov, muammolar", color: '#36d6e7',
    prompt: "Bank mening roziligimisiz kredit shartlarini o'zgartirdi. Bu qonuniy-mi?" },
  { emoji: '👮', label: 'Davlat organlari', desc: "Jarima, huquq buzilishi", color: '#8b5cf6',
    prompt: "Politsiya meni asossiz ushlab qoldi va jarima yozdi. Qanday e'tiroz bildiraman?" },
  { emoji: '🏢', label: 'Biznes muammosi', desc: "Shartnoma buzildi, hamkor aldadi", color: '#14b8a6',
    prompt: "Biznes sherikim shartnomani buzdi va pul qaytarmayapti. Nima qilaman?" },
]

const JURISDICTIONS = [
  { value: 'UZ', label: '🇺🇿 Uzbekistan' },
  { value: 'KZ', label: '🇰🇿 Kazakhstan (coming soon)', disabled: true },
  { value: 'AZ', label: '🇦🇿 Azerbaijan (coming soon)', disabled: true },
]

export default function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [jurisdiction, setJurisdiction] = useState('UZ')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { api.chat.list().then(setConversations).catch(() => {}) }, [])
  useEffect(() => {
    if (id) api.chat.messages(id).then(setMessages).catch(() => {})
    else setMessages([])
  }, [id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamText])

  const newConversation = async () => {
    const conv = await api.chat.create('New conversation')
    setConversations(c => [conv, ...c])
    navigate(`/app/chat/${conv.id}`)
  }

  const sendMessage = async () => {
    if (!input.trim() || streaming) return
    let convId = id
    if (!convId) {
      const conv = await api.chat.create(input.slice(0, 60))
      setConversations(c => [conv, ...c])
      convId = conv.id
      navigate(`/app/chat/${conv.id}`, { replace: true })
    }
    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    if (inputRef.current) { inputRef.current.style.height = 'auto' }
    setStreaming(true); setStreamText(''); setError('')

    try {
      const res = await api.chat.sendStream(convId, input, jurisdiction)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = '', fullText = '', citations = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) { fullText += data.text; setStreamText(fullText) }
            if (data.done) citations = data.citations || []
            if (data.error) setError(data.error)
          } catch {}
        }
      }
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', content: fullText, citations }])
      setStreamText('')
    } catch (err) { setError(err.message) }
    finally { setStreaming(false); inputRef.current?.focus() }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }
  const handleInput = (e) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation sidebar */}
      <div style={{ width: 220, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', flexShrink: 0 }}>
        <div style={{ padding: '12px 10px', borderBottom: '1px solid var(--border)' }}>
          <button onClick={newConversation} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '9px 12px', borderRadius: 9, fontSize: 12, fontWeight: 600,
            background: 'linear-gradient(135deg, rgba(124,109,255,0.15) 0%, rgba(155,109,255,0.08) 100%)',
            border: '1px solid rgba(124,109,255,0.2)', color: 'var(--accent2)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,109,255,0.25) 0%, rgba(155,109,255,0.15) 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,109,255,0.15) 0%, rgba(155,109,255,0.08) 100%)'}>
            <Plus size={13} /> New chat
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 8px' }}>
          {conversations.length === 0 && (
            <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--text3)', fontSize: 11 }}>No conversations yet</div>
          )}
          {conversations.map(c => (
            <button key={c.id} onClick={() => navigate(`/app/chat/${c.id}`)}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, marginBottom: 2,
                display: 'flex', alignItems: 'center', gap: 8,
                background: String(c.id) === String(id) ? 'var(--accent-bg)' : 'transparent',
                color: String(c.id) === String(id) ? 'var(--accent2)' : 'var(--text2)',
                fontSize: 12, border: 'none', cursor: 'pointer', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { if (String(c.id) !== String(id)) e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { if (String(c.id) !== String(id)) e.currentTarget.style.background = 'transparent' }}>
              <MessageSquare size={11} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title || 'Conversation'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(6,6,11,0.8)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Legal Q&A</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>Jurisdiction:</span>
            <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value)}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '5px 10px', borderRadius: 8, fontSize: 12, outline: 'none', cursor: 'pointer' }}>
              {JURISDICTIONS.map(j => <option key={j.value} value={j.value} disabled={j.disabled}>{j.label}</option>)}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 0' }}>
          {/* Empty state */}
          {!id && messages.length === 0 && (
            <div style={{ maxWidth: 740, margin: '0 auto', padding: '24px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 24px rgba(124,109,255,0.4)' }}>
                  <Sparkles size={24} color="#fff" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>Qanday muammoingiz bor?</h2>
                <p style={{ fontSize: 14, color: 'var(--text2)' }}>Bir tapping yetarli — biz huquqingizni tushuntiramiz</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10, marginBottom: 32 }}>
                {SITUATIONS.map(s => (
                  <button key={s.label} onClick={() => { setInput(s.prompt); setTimeout(() => inputRef.current?.focus(), 50) }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px',
                      borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = s.color
                      e.currentTarget.style.background = `${s.color}10`
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'var(--bg2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}>
                    <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)' }}>
                Yoki pastda savolingizni yozing — o'zbek, rus yoki ingliz tilida
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <div key={msg.id} style={{ maxWidth: 740, margin: '0 auto 20px', padding: '0 24px' }}>
              {msg.role === 'user' ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    maxWidth: '80%', background: 'linear-gradient(135deg, var(--accent) 0%, #9b6dff 100%)',
                    borderRadius: '16px 16px 4px 16px', padding: '12px 16px',
                    fontSize: 14, lineHeight: 1.6, color: '#fff',
                    boxShadow: '0 4px 16px rgba(124,109,255,0.3)',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Scale size={12} color="#fff" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)', letterSpacing: '0.03em' }}>YURIST AI</span>
                  </div>
                  <div style={{
                    background: 'var(--bg2)', borderRadius: '4px 16px 16px 16px',
                    padding: '16px 18px', border: '1px solid var(--border)',
                    fontSize: 14, lineHeight: 1.75,
                  }}>
                    <div className="prose">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  {msg.citations?.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {msg.citations.map((c, i) => {
                        const chipStyle = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'var(--accent-bg)', color: 'var(--accent2)', border: '1px solid rgba(124,109,255,0.15)', fontWeight: 500, textDecoration: 'none', cursor: c.sourceUrl ? 'pointer' : 'default', transition: 'all 0.15s' }
                        return c.sourceUrl ? (
                          <a key={i} href={c.sourceUrl} target="_blank" rel="noopener noreferrer" title={`Manba: ${c.sourceName || 'lex.uz'}`} style={chipStyle}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,109,255,0.22)'; e.currentTarget.style.borderColor = 'rgba(124,109,255,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.borderColor = 'rgba(124,109,255,0.15)' }}>
                            <BookOpen size={10} /> {c.code} · {c.article}-modda
                            <ExternalLink size={9} style={{ opacity: 0.7 }} />
                          </a>
                        ) : (
                          <span key={i} style={chipStyle}>
                            <BookOpen size={10} /> {c.code} · {c.article}-modda
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Streaming */}
          {streaming && streamText && (
            <div style={{ maxWidth: 740, margin: '0 auto 20px', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={12} color="#fff" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)', letterSpacing: '0.03em' }}>YURIST AI</span>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: '4px 16px 16px 16px', padding: '16px 18px', border: '1px solid var(--border)', fontSize: 14, lineHeight: 1.75 }}>
                <div className="prose">
                  <ReactMarkdown>{streamText}</ReactMarkdown>
                </div>
                <span style={{ display: 'inline-block', width: 7, height: 15, background: 'var(--accent2)', borderRadius: 2, marginLeft: 2, animation: 'blink 0.8s step-end infinite', opacity: 0.8 }} />
              </div>
            </div>
          )}

          {/* Typing indicator when no text yet */}
          {streaming && !streamText && (
            <div style={{ maxWidth: 740, margin: '0 auto 20px', padding: '0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, var(--accent), #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scale size={12} color="#fff" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent2)' }}>YURIST AI</span>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', border: '1px solid var(--border)', display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent2)', display: 'inline-block', animation: `blink 1.2s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px' }}>
              <div style={{ color: 'var(--red)', fontSize: 13, padding: '10px 14px', background: 'var(--red-bg)', borderRadius: 10, border: '1px solid rgba(255,95,95,0.15)' }}>⚠️ {error}</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '14px 20px 18px', borderTop: '1px solid var(--border)', background: 'rgba(6,6,11,0.8)', backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-end',
              background: 'var(--bg2)', border: '1px solid var(--border2)',
              borderRadius: 16, padding: '10px 10px 10px 16px',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(124,109,255,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,109,255,0.08)' }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'none' }}>
              <textarea ref={inputRef} value={input} onChange={handleInput} onKeyDown={handleKey}
                placeholder="Ask a legal question in Uzbek, Russian, or English..." rows={1}
                style={{
                  flex: 1, resize: 'none', background: 'transparent', border: 'none',
                  color: 'var(--text)', fontSize: 14, outline: 'none',
                  minHeight: 24, maxHeight: 200, overflow: 'auto', lineHeight: 1.6,
                  fontFamily: 'inherit',
                }} />
              <button onClick={sendMessage} disabled={!input.trim() || streaming}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !streaming
                    ? 'linear-gradient(135deg, var(--accent), #9b6dff)'
                    : 'var(--bg3)',
                  border: 'none', cursor: input.trim() && !streaming ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: input.trim() && !streaming ? '0 2px 12px rgba(124,109,255,0.4)' : 'none',
                }}>
                <Send size={15} color={input.trim() && !streaming ? '#fff' : 'var(--text3)'} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 8 }}>
              Answers cite specific law articles · Not legal representation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
