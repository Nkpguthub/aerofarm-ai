import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const mockFarmers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@farm.io', farm: 'Green Valley', plan: 'Pro', towers: 12, status: 'active', joined: '2026-01-15' },
  { id: 2, name: 'Priya Sharma', email: 'priya@urban.io', farm: 'Urban Greens', plan: 'Pro', towers: 6, status: 'active', joined: '2026-02-08' },
  { id: 3, name: 'Amit Patel', email: 'amit@smart.io', farm: 'Smart Roots', plan: 'Starter', towers: 2, status: 'trial', joined: '2026-05-01' },
  { id: 4, name: 'Sunita Devi', email: 'sunita@farmco.io', farm: 'Farm AI Co.', plan: 'Starter', towers: 0, status: 'inactive', joined: '2026-03-20' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@verdant.io', farm: 'Verdant Fields', plan: 'Enterprise', towers: 32, status: 'active', joined: '2025-12-01' },
]

export default function FarmerManagement() {
  const [search, setSearch] = useState('')
  const farmers = mockFarmers.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.farm.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search farmers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => toast.success('Add Farmer modal coming soon')}>
          <Plus size={16} /> Add Farmer
        </button>
      </div>

      <motion.div className="card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>{['Name', 'Email', 'Farm', 'Plan', 'Towers', 'Status', 'Joined', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {farmers.map(f => {
                const col = { active: '#10b981', trial: '#06b6d4', inactive: '#6b7280' }[f.status]
                const planCol = { Enterprise: '#8b5cf6', Pro: '#22c55e', Starter: '#f59e0b' }[f.plan]
                return (
                  <tr key={f.id}>
                    <td><span style={{ fontWeight: 600 }}>{f.name}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.email}</td>
                    <td>{f.farm}</td>
                    <td><span className="badge" style={{ background: `${planCol}15`, color: planCol, border: `1px solid ${planCol}30` }}>{f.plan}</span></td>
                    <td style={{ fontWeight: 600 }}>{f.towers}</td>
                    <td><span className="badge" style={{ background: `${col}15`, color: col, border: `1px solid ${col}30` }}>{f.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[Eye, Edit, Trash2].map((Icon, i) => (
                          <button key={i} className="btn-ghost" style={{ padding: 6 }} onClick={() => toast.success(`Action on ${f.name}`)}>
                            <Icon size={14} />
                          </button>
                        ))}
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
