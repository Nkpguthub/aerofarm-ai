import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Droplets, FlaskConical, Wind, Lightbulb, RefreshCcw, Zap } from 'lucide-react'
import { toggleAutomation } from '../../store/slices/farmSlice'
import toast from 'react-hot-toast'

const rules = [
  { key: 'waterSpray', icon: Droplets, title: 'Auto Water Spray', desc: '30s ON / 5min OFF cycle — delivers nutrients directly to roots', color: '#06b6d4' },
  { key: 'phControl', icon: FlaskConical, title: 'Auto pH Control', desc: 'Auto-doses pH up/down solution to maintain 5.8–6.2 range', color: '#22c55e' },
  { key: 'nutrientDosing', icon: Zap, title: 'Auto Nutrient Dosing', desc: 'Monitors EC and doses nutrients to maintain 1.8–2.2 mS/cm', color: '#8b5cf6' },
  { key: 'coolingFan', icon: Wind, title: 'Auto Cooling Fan', desc: 'Activates fan when temperature exceeds 27°C', color: '#f59e0b' },
  { key: 'ledLighting', icon: Lightbulb, title: 'Auto LED Lighting', desc: '16h light / 8h dark cycle optimized per plant type', color: '#fbbf24' },
  { key: 'waterRefill', icon: RefreshCcw, title: 'Auto Water Refill', desc: 'Refills reservoir when water level drops below 30%', color: '#10b981' },
]

function Toggle({ enabled, onChange }) {
  return (
    <label className="toggle" onClick={onChange}>
      <input type="checkbox" checked={enabled} readOnly />
      <span className="toggle-slider" />
    </label>
  )
}

export default function AutomationControl() {
  const dispatch = useDispatch()
  const { automation } = useSelector(s => s.farm)

  const handleToggle = (key) => {
    dispatch(toggleAutomation(key))
    const next = !automation[key]
    toast.success(`${rules.find(r => r.key === key)?.title} ${next ? 'enabled' : 'disabled'}`)
  }

  const activeCount = Object.values(automation).filter(Boolean).length

  return (
    <div>
      {/* Summary bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{activeCount} of {rules.length} automations active</div>
          <div className="progress-bar" style={{ marginTop: 8, maxWidth: 300 }}>
            <div className="progress-fill" style={{ width: `${(activeCount / rules.length) * 100}%` }} />
          </div>
        </div>
        <span className="badge badge-success">{activeCount > 0 ? 'System Running' : 'All Paused'}</span>
      </motion.div>

      {/* Automation rule cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {rules.map(({ key, icon: Icon, title, desc, color }, i) => {
          const enabled = automation[key]
          return (
            <motion.div key={key} className="card" style={{ padding: 24 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <Toggle enabled={enabled} onChange={() => handleToggle(key)} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>{desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: enabled ? '#10b981' : '#6b7280', boxShadow: enabled ? '0 0 8px #10b98160' : 'none', transition: 'all 0.3s' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? '#10b981' : 'var(--text-muted)' }}>
                  {enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Schedule info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Spray Schedule (Tower Alpha)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'ON Duration', value: '30 seconds' },
            { label: 'OFF Duration', value: '5 minutes' },
            { label: 'Daily Cycles', value: '240 cycles' },
            { label: 'Next Spray', value: '2m 14s' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '14px 16px', background: 'var(--bg-surface)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-light)' }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
