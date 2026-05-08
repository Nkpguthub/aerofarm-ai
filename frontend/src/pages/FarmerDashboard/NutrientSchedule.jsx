import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, Check, Beaker, AlertTriangle, Power } from 'lucide-react'
import { addNutrientSchedule, updateNutrientSchedule, deleteNutrientSchedule } from '../../store/slices/farmSlice'
import toast from 'react-hot-toast'

const FREQ = ['Every 4h','Every 6h','Every 8h','Every 12h','Every 24h','Manual']
const EMPTY = { name:'', tower:'T001', nitrogen:150, phosphorus:60, potassium:200, calcium:110, frequency:'Every 6h', active:true }

const genId = () => `N${String(Date.now()).slice(-5)}`

function SchedModal({ mode, initial, towers, onSave, onClose }) {
  const [f, setF] = useState(initial)
  const s = (k,v) => setF(p=>({...p,[k]:v}))
  const num = (label, key, unit='ppm') => (
    <div>
      <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{label} ({unit})</label>
      <input type="number" min="0" value={f[key]} onChange={e=>s(key,+e.target.value)}
        style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
    </div>
  )
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:480, padding:28, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>{mode==='add'?'⚗️ Add Schedule':'✏️ Edit Schedule'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <form onSubmit={e=>{ e.preventDefault(); if(!f.name.trim()){toast.error('Name required');return} onSave(f) }} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Schedule Name</label>
            <input value={f.name} onChange={e=>s('name',e.target.value)} placeholder="e.g. Vegetative Mix"
              style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Tower</label>
              <select value={f.tower} onChange={e=>s('tower',e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {towers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Frequency</label>
              <select value={f.frequency} onChange={e=>s('frequency',e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {FREQ.map(fr=><option key={fr}>{fr}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {num('Nitrogen (N)', 'nitrogen')}
            {num('Phosphorus (P)', 'phosphorus')}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {num('Potassium (K)', 'potassium')}
            {num('Calcium (Ca)', 'calcium')}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'var(--bg-secondary)', borderRadius:10 }}>
            <span style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', flex:1 }}>Active</span>
            <button type="button" onClick={()=>s('active',!f.active)}
              style={{ width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', background:f.active?'var(--color-primary)':'var(--border-color)', position:'relative', transition:'background 0.2s' }}>
              <div style={{ position:'absolute', top:3, left:f.active?22:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
            </button>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'var(--color-primary)', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Check size={15}/> {mode==='add'?'Add Schedule':'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const NUTRIENTS = [
  { key:'nitrogen',   label:'N',  color:'#22c55e', max:300 },
  { key:'phosphorus', label:'P',  color:'#06b6d4', max:200 },
  { key:'potassium',  label:'K',  color:'#a78bfa', max:300 },
  { key:'calcium',    label:'Ca', color:'#f59e0b', max:200 },
]

export default function NutrientSchedule() {
  const dispatch = useDispatch()
  const { nutrientSchedules, towers } = useSelector(s => s.farm)
  const [modal, setModal] = useState(null)
  const [delId, setDelId] = useState(null)

  const handleAdd  = f => { dispatch(addNutrientSchedule({...f, id:genId()})); toast.success(`${f.name} schedule added!`); setModal(null) }
  const handleEdit = f => { dispatch(updateNutrientSchedule(f)); toast.success(`${f.name} updated!`); setModal(null) }
  const handleDel  = id => { dispatch(deleteNutrientSchedule(id)); toast.success('Schedule deleted'); setDelId(null) }
  const toggleActive = sched => { dispatch(updateNutrientSchedule({...sched, active:!sched.active})); toast.success(sched.active?'Schedule paused':'Schedule activated') }

  const towerName = id => towers.find(t=>t.id===id)?.name || id

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:22 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Nutrient Schedule</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Manage nutrient dosing for each tower</p>
        </div>
        <button onClick={()=>setModal({mode:'add'})} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
          <Plus size={16}/> Add Schedule
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14 }}>
        {[
          { l:'Total Schedules', v:nutrientSchedules.length,                         c:'#06b6d4' },
          { l:'Active',          v:nutrientSchedules.filter(n=>n.active).length,      c:'#22c55e' },
          { l:'Paused',          v:nutrientSchedules.filter(n=>!n.active).length,     c:'#f59e0b' },
          { l:'Towers Covered',  v:new Set(nutrientSchedules.map(n=>n.tower)).size,   c:'#a78bfa' },
        ].map((s,i)=>(
          <motion.div key={s.l} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:14, padding:'16px 18px', borderTop:`3px solid ${s.c}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)' }}>{s.v}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{s.l}</div>
          </motion.div>
        ))}
      </div>

      {/* Schedule Cards */}
      {nutrientSchedules.length===0
        ? <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚗️</div>
            <div style={{ fontSize:16, fontWeight:600 }}>No nutrient schedules yet</div>
          </div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
            <AnimatePresence>
              {nutrientSchedules.map((n,i)=>(
                <motion.div key={n.id} layout initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,scale:0.9 }} transition={{ delay:i*0.07 }}
                  style={{ background:'var(--bg-card)', border:`1px solid ${n.active?'rgba(34,197,94,0.3)':'var(--border-color)'}`, borderRadius:18, padding:22, position:'relative' }}>
                  {/* Header */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)' }}>{n.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{towerName(n.tower)} · {n.frequency}</div>
                    </div>
                    <button onClick={()=>toggleActive(n)}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', border:'none', borderRadius:20, background:n.active?'#22c55e22':'#f59e0b22', color:n.active?'#22c55e':'#f59e0b', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                      <Power size={11}/>{n.active?'Active':'Paused'}
                    </button>
                  </div>

                  {/* Nutrient bars */}
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {NUTRIENTS.map(nut=>(
                      <div key={nut.key}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                          <span style={{ color:'var(--text-muted)', fontWeight:600 }}>{nut.label} — {nut.key.charAt(0).toUpperCase()+nut.key.slice(1)}</span>
                          <span style={{ color:nut.color, fontWeight:700 }}>{n[nut.key]} ppm</span>
                        </div>
                        <div style={{ height:6, background:'var(--bg-secondary)', borderRadius:3 }}>
                          <motion.div initial={{ width:0 }} animate={{ width:`${Math.min(100,(n[nut.key]/nut.max)*100)}%` }} transition={{ duration:0.8, delay:i*0.1 }}
                            style={{ height:'100%', borderRadius:3, background:nut.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8, marginTop:16 }}>
                    <button onClick={()=>setModal({mode:'edit',sched:{...n}})} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px', border:'1px solid var(--border-color)', borderRadius:10, background:'transparent', color:'var(--color-primary)', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                      <Edit2 size={13}/> Edit
                    </button>
                    {delId===n.id
                      ? <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>handleDel(n.id)} style={{ padding:'8px 12px', borderRadius:10, border:'none', background:'#ef4444', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>Delete</button>
                          <button onClick={()=>setDelId(null)} style={{ padding:'8px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontSize:13, cursor:'pointer' }}>No</button>
                        </div>
                      : <button onClick={()=>setDelId(n.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 12px', border:'1px solid #ef444433', borderRadius:10, background:'#ef444411', color:'#ef4444', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                          <Trash2 size={13}/> Delete
                        </button>
                    }
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
      }

      <AnimatePresence>
        {modal?.mode==='add'  && <SchedModal mode="add"  initial={{...EMPTY}} towers={towers} onSave={handleAdd}  onClose={()=>setModal(null)}/>}
        {modal?.mode==='edit' && <SchedModal mode="edit" initial={modal.sched}  towers={towers} onSave={handleEdit} onClose={()=>setModal(null)}/>}
      </AnimatePresence>
    </div>
  )
}
