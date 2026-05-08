import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Leaf, Droplets, Zap } from 'lucide-react'

// ── Data ────────────────────────────────────────────────────
const monthlyGrowth = [
  { month: 'Nov', farmers: 62, revenue: 182000, yield: 4.1 },
  { month: 'Dec', farmers: 78, revenue: 224000, yield: 4.6 },
  { month: 'Jan', farmers: 91, revenue: 261000, yield: 4.9 },
  { month: 'Feb', farmers: 110, revenue: 312000, yield: 5.2 },
  { month: 'Mar', farmers: 134, revenue: 389000, yield: 5.7 },
  { month: 'Apr', farmers: 158, revenue: 452000, yield: 6.1 },
  { month: 'May', farmers: 189, revenue: 534000, yield: 6.5 },
]

const cropDistribution = [
  { name: 'Basil',     value: 34, color: '#22c55e' },
  { name: 'Spinach',   value: 22, color: '#06b6d4' },
  { name: 'Lettuce',   value: 18, color: '#a78bfa' },
  { name: 'Mint',      value: 14, color: '#34d399' },
  { name: 'Coriander', value: 12, color: '#f59e0b' },
]

const waterData = [
  { day: 'Mon', used: 1240, saved: 320 },
  { day: 'Tue', used: 1380, saved: 410 },
  { day: 'Wed', used: 1190, saved: 280 },
  { day: 'Thu', used: 1520, saved: 490 },
  { day: 'Fri', used: 1450, saved: 380 },
  { day: 'Sat', used: 980,  saved: 230 },
  { day: 'Sun', used: 860,  saved: 190 },
]

const zonePerformance = [
  { zone: 'Zone A', efficiency: 94, towers: 12, yield: 6.8 },
  { zone: 'Zone B', efficiency: 87, towers: 8,  yield: 5.9 },
  { zone: 'Zone C', efficiency: 91, towers: 10, yield: 6.3 },
  { zone: 'Zone D', efficiency: 79, towers: 6,  yield: 5.1 },
  { zone: 'Zone E', efficiency: 96, towers: 14, yield: 7.2 },
]

const kpis = [
  { label: 'Total Farmers',   value: '189',    change: '+19.6%', up: true,  icon: Users,      color: '#06b6d4' },
  { label: 'Avg Yield (kg/m²)', value: '6.5', change: '+7.4%',  up: true,  icon: Leaf,       color: '#22c55e' },
  { label: 'Water Saved',     value: '2,300L', change: '+14.2%', up: true,  icon: Droplets,   color: '#a78bfa' },
  { label: 'Energy Use',      value: '4.8 kW', change: '-3.1%',  up: false, icon: Zap,        color: '#f59e0b' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

const RANGES = ['7D', '30D', '90D', '1Y']

export default function AnalyticsDashboard() {
  const [range, setRange] = useState('30D')

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Platform-wide performance insights</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: range === r ? 'var(--color-primary)' : 'var(--bg-card)',
                color: range === r ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                padding: 20,
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: kpi.color + '22'
                }}>
                  <Icon size={18} color={kpi.color} />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                  background: kpi.up ? '#22c55e22' : '#ef444422',
                  color: kpi.up ? '#22c55e' : '#ef4444',
                  display: 'flex', alignItems: 'center', gap: 3
                }}>
                  {kpi.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {kpi.change}
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{kpi.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Growth Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Monthly Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Farmer Growth & Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="gFarmers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="farmers" name="Farmers" stroke="#06b6d4" fill="url(#gFarmers)" strokeWidth={2} />
              <Area type="monotone" dataKey="yield" name="Yield (kg/m²)" stroke="#22c55e" fill="url(#gRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {cropDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {cropDistribution.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Water Usage & Zone Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Water */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Water Usage (Litres)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={waterData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="used" name="Used" fill="#06b6d4" radius={[4,4,0,0]} />
              <Bar dataKey="saved" name="Saved" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Zone Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Zone Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {zonePerformance.map((z, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{z.zone}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{z.towers} towers</span>
                    <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{z.yield} kg/m²</span>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{z.efficiency}%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${z.efficiency}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%', borderRadius: 3,
                      background: z.efficiency >= 90 ? '#22c55e' : z.efficiency >= 80 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
