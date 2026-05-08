import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Leaf, Settings } from 'lucide-react'

export default function TowerManagement() {
  const { towers } = useSelector(s => s.farm)
  const { towers: sensorData } = useSelector(s => s.sensors)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {towers.map((tower, i) => {
          const sensor = sensorData.find(s => s.id === tower.id) || {}
          const statusColor = { active: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }[tower.status]

          return (
            <motion.div key={tower.id} className="card" style={{ padding: 24, overflow: 'hidden', position: 'relative' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}>
              {/* Status stripe */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: statusColor }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{tower.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{tower.id}</div>
                </div>
                <span className="badge" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                  {tower.status}
                </span>
              </div>

              {/* Utilization */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Utilization</span><span style={{ fontWeight: 600 }}>{tower.utilization}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${tower.utilization}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Plants', value: tower.plants, icon: Leaf },
                  { label: 'Location', value: tower.location, icon: MapPin },
                  { label: 'pH', value: sensor.ph ?? '–' },
                  { label: 'Temp', value: sensor.temperature ? `${sensor.temperature}°C` : '–' },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {Icon && <Icon size={12} color="var(--text-muted)" />} {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cycle info */}
              {tower.cycle && tower.cycle !== 'Idle' && (
                <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                  <div style={{ color: '#22c55e', fontWeight: 600 }}>{tower.cycle}</div>
                  {tower.daysLeft && <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{tower.daysLeft} days until harvest</div>}
                </div>
              )}

              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 4, fontSize: 13 }}>
                <Settings size={14} /> Configure Tower
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
