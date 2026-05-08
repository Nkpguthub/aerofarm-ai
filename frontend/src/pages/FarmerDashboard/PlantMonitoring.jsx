import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Leaf, Clock, AlertTriangle } from 'lucide-react'

const stageColors = { early: '#06b6d4', growth: '#22c55e', flowering: '#f59e0b', mature: '#10b981', harvest: '#8b5cf6' }
const stageOrder = ['early', 'growth', 'flowering', 'mature', 'harvest']

function HealthBar({ value }) {
  const color = value >= 85 ? '#10b981' : value >= 65 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>Health</span><span style={{ color, fontWeight: 600 }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <motion.div className="progress-fill" style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }} />
      </div>
    </div>
  )
}

function StageTracker({ stage }) {
  const current = stageOrder.indexOf(stage)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 12 }}>
      {stageOrder.map((s, i) => {
        const done = i <= current
        const col = done ? stageColors[stage] : 'var(--bg-surface)'
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? col : 'var(--bg-surface)', border: `2px solid ${done ? col : 'var(--border-subtle)'}`, flexShrink: 0, transition: 'all 0.3s', boxShadow: done ? `0 0 8px ${col}60` : 'none' }} />
            {i < stageOrder.length - 1 && <div style={{ flex: 1, height: 2, background: i < current ? col : 'var(--border-subtle)', transition: 'all 0.3s' }} />}
          </div>
        )
      })}
    </div>
  )
}

export default function PlantMonitoring() {
  const { plants } = useSelector(s => s.farm)

  const plantDB = [
    { name: 'Basil', temp: '20–25°C', ph: '5.5–6.5', spray: '30s ON / 5min OFF', duration: '45 days', yield: '2–3 kg' },
    { name: 'Lettuce', temp: '18–22°C', ph: '6.0–7.0', spray: '30s ON / 8min OFF', duration: '35 days', yield: '3–5 kg' },
    { name: 'Mint', temp: '18–26°C', ph: '6.0–7.0', spray: '30s ON / 6min OFF', duration: '60 days', yield: '1.5–2 kg' },
    { name: 'Spinach', temp: '15–20°C', ph: '6.0–7.0', spray: '30s ON / 7min OFF', duration: '40 days', yield: '2–3 kg' },
  ]

  return (
    <div>
      {/* Plant cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
        {plants.map((plant, i) => (
          <motion.div key={plant.id} className="card" style={{ padding: 24 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{plant.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>{plant.scientific}</div>
              </div>
              <span className="badge" style={{ background: `${stageColors[plant.stage]}15`, color: stageColors[plant.stage], border: `1px solid ${stageColors[plant.stage]}30`, textTransform: 'capitalize' }}>
                {plant.stage}
              </span>
            </div>

            <HealthBar value={plant.health} />
            <StageTracker stage={plant.stage} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 16 }}>
              {[
                { label: 'Tower', value: plant.tower },
                { label: 'Harvest in', value: `${plant.daysToHarvest}d` },
                { label: 'Expected', value: plant.expectedYield },
                { label: 'Disease', value: plant.disease },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: plant.disease !== 'None' && label === 'Disease' ? '#f59e0b' : 'var(--text-primary)' }}>{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plant Intelligence DB */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Leaf size={18} color="var(--color-primary-light)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Plant Intelligence Database</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>{['Plant', 'Temp Range', 'pH Range', 'Spray Cycle', 'Duration', 'Expected Yield'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {plantDB.map(p => (
                <tr key={p.name}>
                  <td><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                  <td>{p.temp}</td>
                  <td>{p.ph}</td>
                  <td><code style={{ fontSize: 12, background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>{p.spray}</code></td>
                  <td>{p.duration}</td>
                  <td style={{ color: '#22c55e', fontWeight: 600 }}>{p.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
