import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import SensorGauge from '../../components/iot/SensorGauge'
import LineChartWidget from '../../components/charts/LineChartWidget'
import { tickSensors, selectTower } from '../../store/slices/sensorsSlice'

export default function IoTMonitoring() {
  const dispatch = useDispatch()
  const { towers, selected, history, lastUpdated } = useSelector(s => s.sensors)
  const activeTower = towers.find(t => t.id === selected) || towers[0]

  useEffect(() => {
    const id = setInterval(() => dispatch(tickSensors()), 2000)
    return () => clearInterval(id)
  }, [dispatch])

  const gauges = ['ph', 'temperature', 'humidity', 'waterLevel', 'ec', 'lightIntensity']

  return (
    <div>
      {/* Tower selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {towers.map(t => {
          const col = { active: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }[t.status]
          return (
            <button key={t.id} onClick={() => dispatch(selectTower(t.id))}
              style={{
                padding: '8px 18px', borderRadius: 10, border: `1px solid ${t.id === selected ? col : 'var(--border-subtle)'}`,
                background: t.id === selected ? `${col}15` : 'var(--bg-card)',
                color: t.id === selected ? col : 'var(--text-muted)',
                cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
              }}>
              {t.name}
            </button>
          )
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <Wifi size={13} color="#10b981" />
          Live · {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Sensor gauges grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 28 }}>Live Sensor Readings — {activeTower?.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 24 }}>
          {gauges.map(g => (
            <motion.div key={g} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
              <SensorGauge type={g} value={activeTower?.[g] ?? 0} size={130} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pump status */}
      <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: activeTower?.pumpStatus ? '#10b981' : '#ef4444', boxShadow: `0 0 10px ${activeTower?.pumpStatus ? '#10b98180' : '#ef444480'}` }} />
        <span style={{ fontWeight: 600, fontSize: 15 }}>Spray Pump</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>— {activeTower?.pumpStatus ? 'Currently spraying nutrients' : 'Pump idle (rest cycle)'}</span>
      </div>

      {/* Historical charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {[
          { key: 'ph', color: '#22c55e', label: 'pH Level (24h)' },
          { key: 'temperature', color: '#f59e0b', label: 'Temperature °C (24h)' },
          { key: 'humidity', color: '#06b6d4', label: 'Humidity % (24h)' },
          { key: 'ec', color: '#8b5cf6', label: 'EC Level mS/cm (24h)' },
        ].map(({ key, color, label }) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 20 }}>
            <LineChartWidget data={history} dataKey={key} color={color} label={label} height={160} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
