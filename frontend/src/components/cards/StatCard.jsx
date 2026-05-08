import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { TrendingUp, TrendingDown } from 'lucide-react'

function formatValue(val, unit) {
  const n = Number(val)
  if (isNaN(n)) return val
  if (Number.isInteger(n)) return n.toLocaleString()
  return n.toFixed(1)
}

export default function StatCard({ label, value, unit, icon: Icon, color = 'var(--color-primary-light)', trend, suffix = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Icon && <Icon size={20} color={color} />}
        </div>
        {trend !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 600, color: trend >= 0 ? '#10b981' : '#ef4444', background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 20 }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 6 }}>
        {formatValue(value)}{suffix}
        {unit && <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
    </motion.div>
  )
}
