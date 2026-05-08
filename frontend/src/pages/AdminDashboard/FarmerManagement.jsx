import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, UserCheck, UserX, Leaf } from 'lucide-react'
import { secureRead } from '../../utils/security'

export default function FarmerManagement() {
  const [search, setSearch] = useState('')
  const [farmers, setFarmers] = useState([])

  // Load real registered farmers from encrypted localStorage
  useEffect(() => {
    const stored = secureRead('farmers') || []
    setFarmers(stored)
  }, [])

  const filtered = farmers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.farmName?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Total Farmers', value: farmers.length, color: '#06b6d4', icon: '👨‍🌾' },
    { label: 'Registered Today', value: farmers.filter(f => f.joinedDate === new Date().toISOString().slice(0,10)).length, color: '#22c55e', icon: '✅' },
    { label: 'Active This Month', value: farmers.length, color: '#a78bfa', icon: '📅' },
  ]

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Farmer Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>All registered farmers on the platform</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '16px 18px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '10px 14px', maxWidth: 400 }}>
        <Search size={15} color="var(--text-muted)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, farm..."
          style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: 14, outline: 'none', width: '100%' }} />
      </div>

      {/* Table / Empty state */}
      {farmers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍🌾</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No Farmers Registered Yet</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Farmers who sign up via the <strong>Register</strong> page will appear here automatically.
          </div>
          <div style={{ marginTop: 16, padding: '10px 18px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, display: 'inline-block', fontSize: 13, color: '#22c55e' }}>
            <Leaf size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Direct farmers to: <strong>aerofarm-ai.vercel.app/register</strong>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--color-primary)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Registered Farmers ({filtered.length})</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Name', 'Email', 'Farm Name', 'Joined', 'Status'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <motion.tr key={f.id || f.email} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {f.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{f.email}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{f.farmName || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{f.joinedDate || '—'}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#22c55e22', color: '#22c55e' }}>
                        <UserCheck size={11} /> Active
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
