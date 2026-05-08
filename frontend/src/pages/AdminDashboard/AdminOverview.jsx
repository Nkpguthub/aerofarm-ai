import { motion } from 'framer-motion'
import { Users, Building2, ShoppingBag, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../../components/cards/StatCard'

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: Math.floor(12000 + Math.random() * 18000),
  farmers: Math.floor(40 + Math.random() * 30),
}))

const pieData = [
  { name: 'Active Farmers', value: 342, color: '#22c55e' },
  { name: 'Trial Users', value: 128, color: '#06b6d4' },
  { name: 'Inactive', value: 56, color: '#6b7280' },
]

export default function AdminOverview() {
  const cards = [
    { label: 'Total Farmers', value: 526, icon: Users, color: '#22c55e', trend: 15 },
    { label: 'Active Towers', value: 1843, icon: Building2, color: '#06b6d4', trend: 8 },
    { label: 'Monthly Revenue', value: 248600, icon: DollarSign, unit: '₹', color: '#8b5cf6', trend: 22 },
    { label: 'Total Orders', value: 3241, icon: ShoppingBag, color: '#f59e0b', trend: 11 },
    { label: 'Avg Farm Yield', value: 48.6, icon: TrendingUp, unit: 'kg', color: '#10b981', trend: 18 },
    { label: 'System Uptime', value: 99.9, icon: Activity, unit: '%', color: '#22c55e', trend: 0 },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <StatCard {...c} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 10 }} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Farmer Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {pieData.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} /> {name}
                </div>
                <span style={{ fontWeight: 600, color }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h3>
        <table className="data-table">
          <thead><tr>{['Farmer', 'Farm', 'Status', 'Towers', 'Revenue', 'Joined'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              { name: 'Rajesh Kumar', farm: 'Green Valley', status: 'active', towers: 12, rev: '₹24,800', joined: 'Jan 2026' },
              { name: 'Priya Sharma', farm: 'Urban Greens', status: 'active', towers: 6, rev: '₹11,200', joined: 'Feb 2026' },
              { name: 'Amit Patel', farm: 'Smart Roots', status: 'trial', towers: 2, rev: '₹0', joined: 'May 2026' },
              { name: 'Sunita Devi', farm: 'Farm AI Co.', status: 'inactive', towers: 0, rev: '₹0', joined: 'Mar 2026' },
            ].map(r => {
              const col = { active: '#10b981', trial: '#06b6d4', inactive: '#6b7280' }[r.status]
              return (
                <tr key={r.name}>
                  <td><span style={{ fontWeight: 600 }}>{r.name}</span></td>
                  <td>{r.farm}</td>
                  <td><span className="badge" style={{ background: `${col}15`, color: col, border: `1px solid ${col}30` }}>{r.status}</span></td>
                  <td>{r.towers}</td>
                  <td style={{ fontWeight: 600 }}>{r.rev}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.joined}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
