import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import LineChartWidget from '../../components/charts/LineChartWidget'

export default function YieldAnalytics() {
  const { yieldData } = useSelector(s => s.farm)
  const weekly = yieldData.slice(-7)
  const monthly = yieldData

  const totalYield = monthly.reduce((s, d) => s + d.yield, 0).toFixed(1)
  const totalRevenue = monthly.reduce((s, d) => s + d.revenue, 0).toFixed(0)
  const totalWater = monthly.reduce((s, d) => s + d.water, 0).toFixed(0)
  const avgYield = (totalYield / monthly.length).toFixed(2)

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Monthly Yield', value: `${totalYield} kg`, color: '#22c55e' },
          { label: 'Monthly Revenue', value: `₹${Number(totalRevenue).toLocaleString()}`, color: '#8b5cf6' },
          { label: 'Water Used', value: `${Number(totalWater).toLocaleString()} L`, color: '#06b6d4' },
          { label: 'Avg Daily Yield', value: `${avgYield} kg`, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="card" style={{ padding: 22 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>30-Day Yield Trend (kg)</h3>
          <LineChartWidget data={monthly} dataKey="yield" color="#22c55e" height={220} />
        </motion.div>
        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Daily Revenue (₹)</h3>
          <LineChartWidget data={monthly} dataKey="revenue" color="#8b5cf6" height={220} />
        </motion.div>
      </div>

      {/* Weekly bar chart */}
      <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Weekly Comparison</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weekly} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 10 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="yield" name="Yield (kg)" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="water" name="Water (L/10)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Water efficiency */}
      <motion.div className="card" style={{ padding: 24, marginTop: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Water Efficiency Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'Water per kg yield', value: `${(totalWater / totalYield).toFixed(1)} L/kg` },
            { label: 'vs. Soil farming', value: '95% savings', color: '#22c55e' },
            { label: 'vs. Hydroponics', value: '40% savings', color: '#10b981' },
            { label: 'Efficiency rating', value: 'A+', color: '#f59e0b' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: color || 'var(--text-primary)' }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
