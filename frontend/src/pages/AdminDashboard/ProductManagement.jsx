import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const mockProducts = [
  { id: 1, name: 'AeroTower Pro 48-Slot', category: 'Towers', price: 24999, stock: 45, status: 'active' },
  { id: 2, name: 'pH Sensor Module v2', category: 'Sensors', price: 1499, stock: 120, status: 'active' },
  { id: 3, name: 'Nutrient Starter Kit', category: 'Nutrients', price: 899, stock: 200, status: 'active' },
  { id: 4, name: 'ESP32 IoT Board', category: 'Electronics', price: 599, stock: 80, status: 'active' },
  { id: 5, name: 'EC Meter Pro', category: 'Sensors', price: 2199, stock: 0, status: 'out-of-stock' },
]

export default function ProductManagement() {
  const [search, setSearch] = useState('')
  const products = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => toast.success('Add product form')}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {products.map((p, i) => {
          const inStock = p.stock > 0
          return (
            <motion.div key={p.id} className="card" style={{ padding: 22 }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="badge badge-info" style={{ fontSize: 10 }}>{p.category}</span>
                <span className="badge" style={{ fontSize: 10, background: inStock ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: inStock ? '#10b981' : '#ef4444', border: `1px solid ${inStock ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  {inStock ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#22c55e', marginBottom: 16 }}>₹{p.price.toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: 13 }} onClick={() => toast.success('Edit product')}>
                  <Edit size={13} /> Edit
                </button>
                <button className="btn-ghost" style={{ padding: '8px 12px', color: '#ef4444' }} onClick={() => toast.error('Delete product')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
