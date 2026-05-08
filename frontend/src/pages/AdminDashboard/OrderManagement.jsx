import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const orders = [
  { id: '#ORD-001', customer: 'Rajesh Kumar', product: 'AeroTower Pro 48-Slot', amount: 24999, status: 'delivered', date: '2026-05-01' },
  { id: '#ORD-002', customer: 'Priya Sharma', product: 'Nutrient Starter Kit × 3', amount: 2697, status: 'shipped', date: '2026-05-05' },
  { id: '#ORD-003', customer: 'Amit Patel', product: 'pH Sensor Module v2', amount: 1499, status: 'processing', date: '2026-05-07' },
  { id: '#ORD-004', customer: 'Vikram Singh', product: 'ESP32 IoT Board × 5', amount: 2995, status: 'pending', date: '2026-05-07' },
]

const statusColors = { delivered: '#10b981', shipped: '#06b6d4', processing: '#f59e0b', pending: '#6b7280' }

export default function OrderManagement() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Orders', value: 3241, color: '#22c55e' },
          { label: 'Pending', value: 48, color: '#6b7280' },
          { label: 'Processing', value: 124, color: '#f59e0b' },
          { label: 'Delivered', value: 3069, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} className="card" style={{ padding: 18 }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color }}>{value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div className="card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr>{['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date', 'Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.map(o => {
                const col = statusColors[o.status]
                return (
                  <tr key={o.id}>
                    <td><code style={{ fontSize: 12, background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>{o.id}</code></td>
                    <td style={{ fontWeight: 600 }}>{o.customer}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 200 }}>{o.product}</td>
                    <td style={{ fontWeight: 700, color: '#22c55e' }}>₹{o.amount.toLocaleString()}</td>
                    <td><span className="badge" style={{ background: `${col}15`, color: col, border: `1px solid ${col}30`, textTransform: 'capitalize' }}>{o.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{o.date}</td>
                    <td><button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => toast.success(`Update order ${o.id}`)}>Update</button></td>
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
