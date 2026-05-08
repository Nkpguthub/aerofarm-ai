import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Building2, Leaf, Droplets, Zap, TrendingUp, Activity, Wifi, AlertTriangle } from 'lucide-react'
import StatCard from '../../components/cards/StatCard'
import LineChartWidget from '../../components/charts/LineChartWidget'
import { tickSensors } from '../../store/slices/sensorsSlice'

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function FarmerOverview() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { stats, yieldData, towers } = useSelector(s => s.farm)
  const { towers: sensorTowers } = useSelector(s => s.sensors)

  // Simulate live sensor ticks
  useEffect(() => {
    const id = setInterval(() => dispatch(tickSensors()), 3000)
    return () => clearInterval(id)
  }, [dispatch])

  const selectedSensor = sensorTowers[0]

  const cards = [
    { label: t('totalTowers'), value: stats.totalTowers, icon: Building2, color: '#22c55e', trend: 0 },
    { label: t('activeTowers'), value: stats.activeTowers, icon: Wifi, color: '#10b981', trend: 5 },
    { label: 'Offline Towers', value: stats.offlineTowers, icon: AlertTriangle, color: '#ef4444', trend: -2 },
    { label: t('totalPlants'), value: stats.totalPlants, icon: Leaf, color: '#22c55e', trend: 12 },
    { label: t('waterUsage'), value: stats.waterUsageToday, icon: Droplets, unit: 'L', color: '#06b6d4', trend: -8 },
    { label: t('electricity'), value: stats.electricityToday, icon: Zap, unit: 'kWh', color: '#f59e0b', trend: 3 },
    { label: t('dailyYield'), value: stats.dailyYield, icon: TrendingUp, unit: 'kg', color: '#10b981', trend: 18 },
    { label: t('monthlyYield'), value: stats.monthlyYield, icon: Activity, unit: 'kg', color: '#8b5cf6', trend: 22 },
  ]

  return (
    <div>
      <motion.div variants={grid} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map(c => (
          <motion.div key={c.label} variants={item}>
            <StatCard {...c} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Daily Yield (kg)</h3>
          <LineChartWidget data={yieldData.slice(-14)} dataKey="yield" color="#22c55e" label="Yield" height={200} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Water Usage (L/day)</h3>
          <LineChartWidget data={yieldData.slice(-14)} dataKey="water" color="#06b6d4" label="Water" height={200} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Revenue (₹/day)</h3>
          <LineChartWidget data={yieldData.slice(-14)} dataKey="revenue" color="#8b5cf6" label="Revenue" height={200} />
        </motion.div>
      </div>

      {/* Tower status table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Tower Status Overview</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {['Tower', 'Status', 'Plants', 'pH', 'Temp', 'Humidity', 'Utilization'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {towers.map(tower => {
                const sensor = sensorTowers.find(s => s.id === tower.id) || {}
                const statusColor = { active: '#10b981', offline: '#ef4444', maintenance: '#f59e0b' }[tower.status]
                return (
                  <tr key={tower.id}>
                    <td><span style={{ fontWeight: 600 }}>{tower.name}</span></td>
                    <td><span className="badge" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>{tower.status}</span></td>
                    <td>{tower.plants}</td>
                    <td>{sensor.ph ?? '–'}</td>
                    <td>{sensor.temperature ? `${sensor.temperature}°C` : '–'}</td>
                    <td>{sensor.humidity ? `${sensor.humidity}%` : '–'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${tower.utilization}%` }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tower.utilization}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
