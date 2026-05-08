import { motion } from 'framer-motion'
import { Building2, Wifi, WifiOff, Wrench } from 'lucide-react'

const towers = [
  { id: 'F001-T01', farm: 'Green Valley', name: 'Tower Alpha', status: 'active', farmer: 'Rajesh Kumar', plants: 48, ph: 6.1, temp: 23.4, uptime: 99.8 },
  { id: 'F001-T02', farm: 'Green Valley', name: 'Tower Beta', status: 'active', farmer: 'Rajesh Kumar', plants: 36, ph: 5.9, temp: 22.8, uptime: 98.2 },
  { id: 'F002-T01', farm: 'Urban Greens', name: 'Tower A', status: 'maintenance', farmer: 'Priya Sharma', plants: 0, ph: null, temp: null, uptime: 85.0 },
  { id: 'F003-T01', farm: 'Smart Roots', name: 'Tower 1', status: 'offline', farmer: 'Amit Patel', plants: 24, ph: null, temp: null, uptime: 41.0 },
  { id: 'F004-T01', farm: 'Verdant Fields', name: 'Main Tower', status: 'active', farmer: 'Vikram Singh', plants: 64, ph: 6.0, temp: 24.1, uptime: 99.9 },
]

export default function AdminTowers() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {towers.map((t, i) => {
          const col = { active: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }[t.status]
          const Icon = t.status === 'active' ? Wifi : t.status === 'maintenance' ? Wrench : WifiOff
          return (
            <motion.div key={t.id} className="card" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: col }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.farm} · {t.farmer}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={14} color={col} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: col, textTransform: 'capitalize' }}>{t.status}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Plants', value: t.plants },
                  { label: 'pH', value: t.ph ?? '–' },
                  { label: 'Temp', value: t.temp ? `${t.temp}°C` : '–' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>
                  <span>Uptime</span><span style={{ fontWeight: 600, color: t.uptime > 95 ? '#10b981' : '#f59e0b' }}>{t.uptime}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" style={{ background: t.uptime > 95 ? undefined : 'linear-gradient(90deg,#f59e0b,#fbbf24)' }}
                    initial={{ width: 0 }} animate={{ width: `${t.uptime}%` }} transition={{ duration: 1 }} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
