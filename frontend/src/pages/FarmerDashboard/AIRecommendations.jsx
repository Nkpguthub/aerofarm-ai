import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, Bot, User, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react'

const suggestions = [
  { icon: Lightbulb, text: 'Optimize pH for basil growth', color: '#22c55e' },
  { icon: AlertTriangle, text: 'Disease risk assessment', color: '#f59e0b' },
  { icon: TrendingUp, text: 'Yield prediction next month', color: '#8b5cf6' },
]

const mockResponses = {
  default: `**Recommendation:** Based on your current sensor data, I suggest the following optimizations:

1. **pH Adjustment** — Tower Alpha is reading 6.8, slightly above optimal for basil (5.8–6.2). Recommend reducing by 0.3 units over 2 hours.

2. **Spray Timing** — Increasing spray frequency from 30s/5min to 30s/4min during peak growth (Day 20–35) can boost yield by ~18%.

3. **EC Level** — Tower Beta EC is at 1.6 mS/cm, slightly low. Add 15ml of nutrient concentrate to maintain 1.8–2.2 range.

4. **Harvest Prediction** — Based on current growth rate, Tower Alpha basil is on track for harvest in **12 days**. Expected yield: **2.8 kg**.

5. **Disease Risk** — Low risk detected. Maintain current humidity below 80% to prevent powdery mildew.`,
}

function Message({ role, content }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: role === 'ai' ? 'linear-gradient(135deg,#16a34a,#06b6d4)' : 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)' }}>
        {role === 'ai' ? <Bot size={16} color="white" /> : <User size={16} color="var(--text-muted)" />}
      </div>
      <div style={{ flex: 1, background: role === 'ai' ? 'rgba(34,197,94,0.05)' : 'var(--bg-surface)',
        border: `1px solid ${role === 'ai' ? 'rgba(34,197,94,0.15)' : 'var(--border-subtle)'}`,
        borderRadius: 12, padding: '14px 16px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {content.split('\n').map((line, i) => {
          const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong style="color:var(--text-primary)">${m}</strong>`)
          return <div key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ marginBottom: line ? 4 : 0 }} />
        })}
      </div>
    </motion.div>
  )
}

export default function AIRecommendations() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I\'m your AeroFarm AI assistant. I analyze your real-time sensor data and provide actionable recommendations to maximize your yield. What would you like to know?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text) => {
    const userMsg = text || input
    if (!userMsg.trim()) return
    setMessages(m => [...m, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setMessages(m => [...m, { role: 'ai', content: mockResponses.default }])
    setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, height: 'calc(100vh - 160px)', minHeight: 500 }}>
      {/* Chat panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#16a34a,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>AeroFarm AI Assistant</div>
            <div style={{ fontSize: 11, color: '#10b981' }}>● Online · Analyzing your farm data</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((m, i) => <Message key={i} {...m} />)}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#16a34a,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="white" />
              </div>
              <div style={{ padding: '14px 16px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}
                    animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10 }}>
          <input className="input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about pH, yield, disease, optimization..." style={{ flex: 1 }} />
          <button className="btn-primary" style={{ padding: '10px 16px' }} onClick={() => sendMessage()}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Suggestions panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
          {suggestions.map(({ icon: Icon, text, color }) => (
            <button key={text} onClick={() => sendMessage(text)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, cursor: 'pointer', marginBottom: 8, textAlign: 'left', transition: 'all 0.2s', color: 'var(--text-secondary)', fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <Icon size={16} color={color} /> {text}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>AI Insights</h3>
          {[
            { label: 'pH Status', status: 'Optimal', color: '#10b981' },
            { label: 'Yield Forecast', status: '+18% this week', color: '#22c55e' },
            { label: 'Disease Risk', status: 'Low', color: '#10b981' },
            { label: 'Water Eff.', status: '94%', color: '#06b6d4' },
          ].map(({ label, status, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
