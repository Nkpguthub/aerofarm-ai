import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Check, Scale, CalendarDays, AlertTriangle } from 'lucide-react'
import { addHarvestLog, deleteHarvestLog } from '../../store/slices/farmSlice'
import toast from 'react-hot-toast'

const CROPS = ['Basil','Lettuce','Mint','Spinach','Coriander','Kale','Arugula','Chives','Parsley']
const EMPTY = { crop:'Basil', tower:'T001', weight:'', date:'', notes:'' }

function HarvestModal({ towers, onSave, onClose }) {
  const [f, setF] = useState(EMPTY)
  const s = (k,v) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:460, padding:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>🌾 Log Harvest</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <form onSubmit={e=>{ e.preventDefault(); if(!f.weight||!f.date){toast.error('Weight and date required');return} onSave(f) }}
          style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Crop</label>
              <select value={f.crop} onChange={e=>s('crop',e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {CROPS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Tower</label>
              <select value={f.tower} onChange={e=>s('tower',e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
                {towers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Weight (kg)</label>
              <input type="number" step="0.1" min="0" value={f.weight} onChange={e=>s('weight',+e.target.value)} placeholder="e.g. 2.5"
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Harvest Date</label>
              <input type="date" value={f.date} onChange={e=>s('date',e.target.value)}
                style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Notes</label>
            <textarea value={f.notes} onChange={e=>s('notes',e.target.value)} rows={3} placeholder="Quality notes, observations..."
              style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, resize:'vertical', boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'var(--color-primary)', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Check size={15}/> Save Harvest
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function HarvestLog() {
  const dispatch = useDispatch()
  const { harvestLogs, towers } = useSelector(s => s.farm)
  const [open, setOpen] = useState(false)
  const [delId, setDelId] = useState(null)

  const totalKg  = harvestLogs.reduce((a,h)=>a+(+h.weight||0),0).toFixed(1)
  const thisMonth = harvestLogs.filter(h=>h.date?.startsWith('2026-05')).reduce((a,h)=>a+(+h.weight||0),0).toFixed(1)
  const topCrop = (() => {
    const m = {}; harvestLogs.forEach(h=>{ m[h.crop]=(m[h.crop]||0)+(+h.weight||0) })
    return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—'
  })()

  const genId = () => `H${String(Date.now()).slice(-5)}`

  const handleSave = (f) => {
    dispatch(addHarvestLog({ ...f, id: genId() }))
    toast.success(`${f.crop} harvest logged — ${f.weight}kg`)
    setOpen(false)
  }

  const handleDel = (id) => {
    dispatch(deleteHarvestLog(id))
    toast.success('Harvest log deleted')
    setDelId(null)
  }

  const cropColors = { Basil:'#22c55e', Lettuce:'#06b6d4', Mint:'#34d399', Spinach:'#a78bfa', Coriander:'#f59e0b', Kale:'#ec4899', default:'#888' }
  const cc = (crop) => cropColors[crop]||cropColors.default

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:22 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Harvest Log</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Record and track all your crop harvests</p>
        </div>
        <button onClick={()=>setOpen(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
          <Plus size={16}/> Log Harvest
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14 }}>
        {[
          { label:'Total Harvested', value:`${totalKg} kg`,   color:'#22c55e', icon:'🌾' },
          { label:'This Month',      value:`${thisMonth} kg`, color:'#06b6d4', icon:'📅' },
          { label:'Total Records',   value:harvestLogs.length, color:'#a78bfa', icon:'📋' },
          { label:'Best Crop',       value:topCrop,            color:'#f59e0b', icon:'🏆' },
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:14, padding:'18px 20px', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Log table */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border-color)', display:'flex', alignItems:'center', gap:8 }}>
          <Scale size={16} color="var(--color-primary)"/>
          <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>All Harvest Records</h3>
        </div>
        {harvestLogs.length === 0
          ? <div style={{ padding:'50px 20px', textAlign:'center', color:'var(--text-muted)' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🌾</div>
              <div style={{ fontWeight:600 }}>No harvest logs yet</div>
              <div style={{ fontSize:13, marginTop:6 }}>Click "Log Harvest" to record your first crop</div>
            </div>
          : <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-secondary)' }}>
                    {['Crop','Tower','Weight','Date','Notes',''].map(h=>(
                      <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {harvestLogs.map((h,i)=>(
                      <motion.tr key={h.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:10 }} transition={{ delay:i*0.04 }}
                        style={{ borderTop:'1px solid var(--border-color)' }}>
                        <td style={{ padding:'13px 16px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, background:cc(h.crop)+'22', color:cc(h.crop) }}>{h.crop}</span>
                        </td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>{h.tower}</td>
                        <td style={{ padding:'13px 16px', fontSize:14, fontWeight:700, color:'#22c55e' }}>{h.weight} kg</td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-secondary)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}><CalendarDays size={13} color="var(--text-muted)"/>{h.date}</div>
                        </td>
                        <td style={{ padding:'13px 16px', fontSize:13, color:'var(--text-muted)', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.notes||'—'}</td>
                        <td style={{ padding:'13px 16px' }}>
                          {delId===h.id
                            ? <div style={{ display:'flex', gap:6 }}>
                                <button onClick={()=>handleDel(h.id)} style={{ padding:'5px 10px', borderRadius:8, border:'none', background:'#ef4444', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>Yes</button>
                                <button onClick={()=>setDelId(null)} style={{ padding:'5px 10px', borderRadius:8, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontSize:12, fontWeight:600, cursor:'pointer' }}>No</button>
                              </div>
                            : <button onClick={()=>setDelId(h.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', border:'1px solid #ef444433', borderRadius:8, background:'#ef444411', color:'#ef4444', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                                <Trash2 size={12}/> Delete
                              </button>
                          }
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
        }
      </motion.div>

      <AnimatePresence>
        {open && <HarvestModal towers={towers} onSave={handleSave} onClose={()=>setOpen(false)}/>}
      </AnimatePresence>
    </div>
  )
}
