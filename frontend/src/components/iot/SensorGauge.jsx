import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const colorZones = {
  ph:          { min: 5.5, max: 6.5, unit: '', label: 'pH' },
  temperature: { min: 18, max: 28, unit: '°C', label: 'Temp' },
  humidity:    { min: 60, max: 85, unit: '%', label: 'Humidity' },
  waterLevel:  { min: 40, max: 100, unit: '%', label: 'Water' },
  ec:          { min: 1.5, max: 2.5, unit: 'mS/cm', label: 'EC' },
  lightIntensity: { min: 400, max: 1200, unit: 'lux', label: 'Light' },
}

function getStatus(type, value) {
  const zone = colorZones[type]
  if (!zone) return { color: '#6b7280', label: 'Unknown' }
  if (value < zone.min) return { color: '#3b82f6', label: 'Low' }
  if (value > zone.max) return { color: '#ef4444', label: 'High' }
  return { color: '#10b981', label: 'Normal' }
}

export default function SensorGauge({ type, value, size = 140 }) {
  const zone = colorZones[type] || { min: 0, max: 100, unit: '', label: type }
  const { color, label: statusLabel } = getStatus(type, value)

  // Normalise to 0-100 for pie
  const range = zone.max - zone.min
  const pct = Math.min(100, Math.max(0, ((value - zone.min) / (range * 1.4)) * 100))

  const data = [
    { value: pct },
    { value: 100 - pct },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size * 0.6 }}>
        <ResponsiveContainer width="100%" height={size}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="80%"
              startAngle={180} endAngle={0}
              innerRadius={size * 0.32}
              outerRadius={size * 0.44}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="var(--bg-surface)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{
          position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: size * 0.18, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{zone.unit}</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{zone.label}</div>
        <span className="badge" style={{
          fontSize: 10, marginTop: 4,
          background: `${color}20`, color, border: `1px solid ${color}40`
        }}>
          {statusLabel}
        </span>
      </div>
    </div>
  )
}
