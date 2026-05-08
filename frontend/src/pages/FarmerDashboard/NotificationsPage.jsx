import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { markRead, markAllRead } from '../../store/slices/notificationsSlice'

const severityConfig = {
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  danger: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  info: { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
}

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const { items, unreadCount } = useSelector(s => s.notifications)

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={20} color="var(--color-primary-light)" />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Notifications</h2>
          {unreadCount > 0 && (
            <span style={{ background: 'var(--color-danger)', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{unreadCount}</span>
          )}
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => dispatch(markAllRead())}>
          <CheckCheck size={15} /> Mark all read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((n, i) => {
          const { color, bg } = severityConfig[n.severity] || severityConfig.info
          return (
            <motion.div key={n.id} className="card"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: '16px 20px', background: n.read ? 'var(--bg-card)' : bg, borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{n.time}</div>
                </div>
                {!n.read && (
                  <button onClick={() => dispatch(markRead(n.id))} className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12, flexShrink: 0 }}>
                    <Check size={13} /> Read
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
