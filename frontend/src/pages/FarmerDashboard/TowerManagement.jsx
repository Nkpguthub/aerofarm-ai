import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Leaf, Settings, Plus, Trash2, Edit2, X, Check, AlertTriangle, Search } from 'lucide-react'
import { addTower, updateTower, deleteTower } from '../../store/slices/farmSlice'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['active', 'maintenance', 'offline']
const LOCATION_OPTIONS = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']
const CYCLE_OPTIONS = ['Basil Cycle', 'Lettuce Cycle', 'Mint Cycle', 'Spinach Cycle', 'Coriander Cycle', 'Idle']
const STATUS_COLOR = { active: '#22c55e', offline: '#ef4444', maintenance: '#f59e0b' }

const EMPTY_FORM = {
  name: '', location: 'Zone A', plants: 48, utilization: 0,
  status: 'active', cycle: 'Idle', startDate: '', daysLeft: 0,
}

function genId(towers) {
  const nums = towers.map(t => parseInt(t.id.replace('T', ''), 10)).filter(Boolean)
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `T${String(next).padStart(3, '0')}`
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function TowerModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Tower name is required'); return }
    onSave(form)
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:480, padding:28, maxHeight:'90vh', overflowY:'auto' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>
            {mode === 'add' ? '➕ Add New Tower' : '✏️ Edit Tower'}
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Tower Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Tower Epsilon"
              style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
          </div>

          {/* Location + Status row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Location</label>
              <select value={form.location} onChange={e => set('location', e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Plants + Utilization row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Plant Slots</label>
              <input type="number" min="0" max="120" value={form.plants} onChange={e => set('plants', +e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Utilization %</label>
              <input type="number" min="0" max="100" value={form.utilization} onChange={e => set('utilization', +e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
            </div>
          </div>

          {/* Cycle + Days Left */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Crop Cycle</label>
              <select value={form.cycle} onChange={e => set('cycle', e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {CYCLE_OPTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Days to Harvest</label>
              <input type="number" min="0" value={form.daysLeft} onChange={e => set('daysLeft', +e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Start Date</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
              style={{ width:'100%', marginTop:6, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'var(--color-primary)', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Check size={16}/> {mode === 'add' ? 'Add Tower' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ── Delete confirm ──────────────────────────────────────────────────────────────
function DeleteModal({ tower, onConfirm, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:380, padding:28, textAlign:'center' }}>
        <div style={{ width:56, height:56, borderRadius:16, background:'#ef444422', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <AlertTriangle size={26} color="#ef4444" />
        </div>
        <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>Delete Tower?</h3>
        <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:24 }}>
          <strong style={{ color:'var(--text-primary)' }}>{tower.name}</strong> ({tower.id}) will be permanently removed. This cannot be undone.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'#ef4444', color:'#fff', fontWeight:700, cursor:'pointer' }}>Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TowerManagement() {
  const dispatch = useDispatch()
  const { towers } = useSelector(s => s.farm)
  const { towers: sensorData } = useSelector(s => s.sensors)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modal, setModal] = useState(null)   // null | { mode:'add' } | { mode:'edit', tower }
  const [delTarget, setDelTarget] = useState(null)

  // Filtered list
  const filtered = towers.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  // Summary stats
  const stats = [
    { label: 'Total',       value: towers.length,                                   color: '#06b6d4' },
    { label: 'Active',      value: towers.filter(t => t.status === 'active').length,      color: '#22c55e' },
    { label: 'Maintenance', value: towers.filter(t => t.status === 'maintenance').length, color: '#f59e0b' },
    { label: 'Offline',     value: towers.filter(t => t.status === 'offline').length,     color: '#ef4444' },
  ]

  const handleAdd = (form) => {
    const newTower = { ...form, id: genId(towers) }
    dispatch(addTower(newTower))
    toast.success(`${newTower.name} added!`)
    setModal(null)
  }

  const handleEdit = (form) => {
    dispatch(updateTower(form))
    toast.success(`${form.name} updated!`)
    setModal(null)
  }

  const handleDelete = () => {
    dispatch(deleteTower(delTarget.id))
    toast.success(`${delTarget.name} deleted.`)
    setDelTarget(null)
  }

  const handleStatusChange = (tower, status) => {
    dispatch(updateTower({ ...tower, status }))
    toast.success(`${tower.name} → ${status}`)
  }

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Tower Management</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Add, configure and manage your aeroponic towers</p>
        </div>
        <button onClick={() => setModal({ mode:'add' })}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
          <Plus size={16}/> Add Tower
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:14 }}>
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--bg-card)', border:`1px solid var(--border-color)`, borderRadius:14, padding:'16px 18px', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:30, fontWeight:800, color:'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:200, background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, padding:'10px 14px' }}>
          <Search size={16} color="var(--text-muted)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search towers..."
            style={{ border:'none', background:'transparent', color:'var(--text-primary)', fontSize:14, outline:'none', width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{ padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight:600, border:'1px solid var(--border-color)', cursor:'pointer', textTransform:'capitalize',
                background: filterStatus===s ? (STATUS_COLOR[s] || 'var(--color-primary)') : 'var(--bg-card)',
                color: filterStatus===s ? '#fff' : 'var(--text-secondary)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tower grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏗️</div>
          <div style={{ fontSize:16, fontWeight:600 }}>No towers found</div>
          <div style={{ fontSize:14, marginTop:6 }}>Try a different search or add a new tower</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          <AnimatePresence>
            {filtered.map((tower, i) => {
              const sensor = sensorData?.find(s => s.id === tower.id) || {}
              const sc = STATUS_COLOR[tower.status] || '#888'
              return (
                <motion.div key={tower.id} layout
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:18, padding:22, overflow:'hidden', position:'relative' }}>

                  {/* Status stripe */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:sc }} />

                  {/* Header */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                    <div>
                      <div style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)' }}>{tower.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{tower.id}</div>
                    </div>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      {/* Status quick-change */}
                      <select value={tower.status} onChange={e => handleStatusChange(tower, e.target.value)}
                        style={{ padding:'4px 8px', borderRadius:8, border:`1px solid ${sc}44`, background:sc+'22', color:sc, fontSize:11, fontWeight:700, cursor:'pointer', textTransform:'capitalize' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Utilization bar */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-muted)', marginBottom:5 }}>
                      <span>Utilization</span><span style={{ fontWeight:700 }}>{tower.utilization}%</span>
                    </div>
                    <div style={{ height:6, background:'var(--bg-secondary)', borderRadius:3 }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${tower.utilization}%` }} transition={{ duration:0.9, delay:i*0.07 }}
                        style={{ height:'100%', borderRadius:3, background: tower.utilization>80?'#22c55e':tower.utilization>50?'#f59e0b':'#ef4444' }} />
                    </div>
                  </div>

                  {/* Stat grid */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                    {[
                      { label:'Plants', value: tower.plants, icon: Leaf },
                      { label:'Location', value: tower.location, icon: MapPin },
                      { label:'pH', value: sensor.ph ?? '—' },
                      { label:'Temp', value: sensor.temperature ? `${sensor.temperature}°C` : '—' },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} style={{ background:'var(--bg-secondary)', borderRadius:8, padding:'9px 11px' }}>
                        <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{label}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', display:'flex', alignItems:'center', gap:3 }}>
                          {Icon && <Icon size={11} color="var(--text-muted)"/>} {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cycle info */}
                  {tower.cycle && tower.cycle !== 'Idle' && (
                    <div style={{ background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.18)', borderRadius:8, padding:'9px 12px', marginBottom:14, fontSize:13 }}>
                      <div style={{ color:'#22c55e', fontWeight:600 }}>{tower.cycle}</div>
                      {tower.daysLeft > 0 && <div style={{ color:'var(--text-muted)', marginTop:2 }}>{tower.daysLeft} days to harvest</div>}
                      {tower.startDate && <div style={{ color:'var(--text-muted)', fontSize:11, marginTop:2 }}>Started: {tower.startDate}</div>}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setModal({ mode:'edit', tower: { ...tower } })}
                      style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', border:'1px solid var(--border-color)', borderRadius:10, background:'transparent', color:'var(--color-primary)', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                      <Edit2 size={13}/> Edit
                    </button>
                    <button onClick={() => setDelTarget(tower)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 14px', border:'1px solid #ef444433', borderRadius:10, background:'#ef444411', color:'#ef4444', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                      <Trash2 size={13}/> Delete
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal?.mode === 'add' && (
          <TowerModal mode="add" initial={{ ...EMPTY_FORM }} onSave={handleAdd} onClose={() => setModal(null)} />
        )}
        {modal?.mode === 'edit' && (
          <TowerModal mode="edit" initial={modal.tower} onSave={handleEdit} onClose={() => setModal(null)} />
        )}
        {delTarget && (
          <DeleteModal tower={delTarget} onConfirm={handleDelete} onClose={() => setDelTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
