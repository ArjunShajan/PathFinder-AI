import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User } from 'lucide-react'
import client from '../api/client'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

export default function Mentor() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    client
      .get('/mentor/history')
      .then(({ data }) => setMessages(data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setError('')
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setSending(true)
    try {
      const history = nextMessages.slice(-10, -1).map((m) => ({ role: m.role, content: m.content }))
      const { data } = await client.post('/mentor/chat', { message: text, history })
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err?.response?.data?.detail || 'The mentor could not respond. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <Loader label="Waking up your mentor…" />

  return (
    <div className="mx-auto flex h-[calc(100vh-73px)] max-w-3xl flex-col px-5 py-8">
      <div className="mb-4">
        <p className="eyebrow mb-1">AI Mentor</p>
        <h1 className="text-2xl font-medium">Ask anything about your path</h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-ink-line bg-ink-card/50 p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-paper/50">
            <Bot className="mb-3 h-8 w-8 text-gold" />
            <p>Hi {user?.name?.split(' ')[0]}, I&rsquo;m your mentor. Ask me about subjects, exams, or what to do next.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-nebula/20 text-nebula-soft' : 'bg-gold/20 text-gold'}`}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-nebula/15 text-paper' : 'bg-ink-soft text-paper/90'
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-ink-soft px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-paper/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</p>}

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          className="input-field"
          placeholder="Ask your mentor something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary shrink-0 !px-5">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
