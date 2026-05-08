import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const blogs = [
  { id: 1, title: 'Getting Started with Aeroponic Farming', author: 'Admin', tags: ['Guide', 'Beginner'], published: '2026-05-01', status: 'published', views: 1240 },
  { id: 2, title: 'AI Crop Recommendations: How It Works', author: 'Admin', tags: ['AI', 'Tech'], published: '2026-04-22', status: 'published', views: 876 },
  { id: 3, title: 'Water Saving Tips for Hydroponic Farmers', author: 'Admin', tags: ['Tips', 'Water'], published: null, status: 'draft', views: 0 },
]

export default function BlogManagement() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => toast.success('Blog editor opening...')}>
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {blogs.map((b, i) => (
          <motion.div key={b.id} className="card" style={{ padding: 22 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{b.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {b.tags.map(t => (
                    <span key={t} className="badge badge-info" style={{ fontSize: 10 }}>{t}</span>
                  ))}
                  <span className="badge" style={{ fontSize: 10, background: b.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: b.status === 'published' ? '#10b981' : '#6b7280', border: `1px solid ${b.status === 'published' ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.3)'}` }}>
                    {b.status}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.published || 'Draft'} · {b.views} views</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => toast.success('Edit blog')}>
                  <Edit size={13} /> Edit
                </button>
                <button className="btn-ghost" style={{ padding: '7px 10px', color: '#ef4444' }} onClick={() => toast.error('Delete blog')}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
