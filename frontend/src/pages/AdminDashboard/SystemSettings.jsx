import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Bell, Database, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SystemSettings() {
  const [settings, setSettings] = useState({ siteName: 'AeroFarm AI', mqttBroker: 'mqtt://localhost:1883', dbHost: 'localhost:3306', emailAlerts: true, whatsappAlerts: false, smsAlerts: false, maintenanceMode: false })
  const set = k => e => setSettings(s => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const sections = [
    {
      icon: Globe, title: 'General Settings',
      fields: [{ key: 'siteName', label: 'Platform Name', type: 'text' }]
    },
    {
      icon: Database, title: 'IoT & Database',
      fields: [{ key: 'mqttBroker', label: 'MQTT Broker URL', type: 'text' }, { key: 'dbHost', label: 'Database Host', type: 'text' }]
    },
    {
      icon: Bell, title: 'Notification Channels',
      toggles: [{ key: 'emailAlerts', label: 'Email Alerts' }, { key: 'whatsappAlerts', label: 'WhatsApp Alerts' }, { key: 'smsAlerts', label: 'SMS Alerts' }]
    },
    {
      icon: Shield, title: 'System Control',
      toggles: [{ key: 'maintenanceMode', label: 'Maintenance Mode', danger: true }]
    },
  ]

  return (
    <div style={{ maxWidth: 680 }}>
      {sections.map(({ icon: Icon, title, fields, toggles }, i) => (
        <motion.div key={title} className="card" style={{ padding: 24, marginBottom: 20 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <Icon size={18} color="var(--color-primary-light)" />
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
          </div>
          {fields?.map(({ key, label, type }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{label}</label>
              <input className="input" type={type} value={settings[key]} onChange={set(key)} />
            </div>
          ))}
          {toggles?.map(({ key, label, danger }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 14, color: danger ? '#ef4444' : 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
              <label className="toggle">
                <input type="checkbox" checked={settings[key]} onChange={set(key)} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </motion.div>
      ))}

      <button className="btn-primary" onClick={() => toast.success('Settings saved!')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Save size={16} /> Save Settings
      </button>
    </div>
  )
}
