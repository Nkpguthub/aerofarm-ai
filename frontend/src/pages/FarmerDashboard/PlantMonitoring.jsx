import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, Check, Leaf, AlertTriangle, Search } from 'lucide-react'
import { addPlant, updatePlant, deletePlant } from '../../store/slices/farmSlice'
import toast from 'react-hot-toast'

const STAGES = ['early','growth','flowering','mature','harvest']
const DISEASES = ['None','Low Risk','Aphids','Root Rot','Powdery Mildew','Tip Burn']
const SC = { early:'#06b6d4', growth:'#22c55e', flowering:'#f59e0b', mature:'#10b981', harvest:'#8b5cf6' }
const CROP_LIST = ['Basil','Lettuce','Mint','Spinach','Coriander','Kale','Arugula','Chives','Parsley','Bok Choy']
const SCI = { Basil:'Ocimum basilicum', Lettuce:'Lactuca sativa', Mint:'Mentha piperita', Spinach:'Spinacia oleracea', Coriander:'Coriandrum sativum', Kale:'Brassica oleracea', Arugula:'Eruca sativa', Chives:'Allium schoenoprasum', Parsley:'Petroselinum crispum', 'Bok Choy':'Brassica rapa' }
const EMPTY = { name:'Basil', scientific:'Ocimum basilicum', tower:'T001', stage:'early', health:80, daysToHarvest:30, plantedDate:'', expectedYield:'2.0 kg', disease:'None' }
const DB = [
  { name:'Basil',    temp:'20–25°C', ph:'5.5–6.5', spray:'30s/5min', dur:'45d', yield:'2–3 kg' },
  { name:'Lettuce',  temp:'18–22°C', ph:'6.0–7.0', spray:'30s/8min', dur:'35d', yield:'3–5 kg' },
  { name:'Mint',     temp:'18–26°C', ph:'6.0–7.0', spray:'30s/6min', dur:'60d', yield:'1.5–2 kg' },
  { name:'Spinach',  temp:'15–20°C', ph:'6.0–7.0', spray:'30s/7min', dur:'40d', yield:'2–3 kg' },
  { name:'Coriander',temp:'17–27°C', ph:'6.0–6.7', spray:'30s/6min', dur:'50d', yield:'1–2 kg' },
  { name:'Kale',     temp:'15–22°C', ph:'6.0–7.0', spray:'30s/8min', dur:'55d', yield:'2–4 kg' },
]

const genId = (plants) => {
  const n = plants.map(p=>parseInt(p.id.replace('P',''),10)).filter(Boolean)
  return `P${String(n.length?Math.max(...n)+1:1).padStart(3,'0')}`
}

function HealthBar({ v }) {
  const c = v>=85?'#10b981':v>=65?'#f59e0b':'#ef4444'
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>
        <span>Health</span><span style={{ color:c, fontWeight:600 }}>{v}%</span>
      </div>
      <div style={{ height:6, background:'var(--bg-secondary)', borderRadius:3 }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${v}%` }} transition={{ duration:1 }} style={{ height:'100%', borderRadius:3, background:c }} />
      </div>
    </div>
  )
}

function StageTracker({ stage }) {
  const cur = STAGES.indexOf(stage)
  return (
    <div style={{ display:'flex', alignItems:'center', marginTop:10 }}>
      {STAGES.map((s,i) => (
        <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
          <div style={{ width:16, height:16, borderRadius:'50%', background:i<=cur?SC[stage]:'var(--bg-secondary)', border:`2px solid ${i<=cur?SC[stage]:'var(--border-color)'}`, flexShrink:0 }} />
          {i<STAGES.length-1 && <div style={{ flex:1, height:2, background:i<cur?SC[stage]:'var(--border-color)' }} />}
        </div>
      ))}
    </div>
  )
}

function inp(v, onChange, type='text', extra={}) {
  return <input type={type} value={v} onChange={e=>onChange(type==='number'?+e.target.value:e.target.value)} {...extra}
    style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' }} />
}

function sel(v, onChange, opts) {
  return <select value={v} onChange={e=>onChange(e.target.value)}
    style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:10, border:'1px solid var(--border-color)', background:'var(--bg-secondary)', color:'var(--text-primary)', fontSize:14 }}>
    {opts.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
  </select>
}

function lbl(text) {
  return <label style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{text}</label>
}

function PlantModal({ mode, initial, towers, onSave, onClose }) {
  const [f, setF] = useState(initial)
  const s = (k,v) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.92 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:480, padding:28, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)' }}>{mode==='add'?'🌱 Add Plant':'✏️ Edit Plant'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}><X size={20}/></button>
        </div>
        <form onSubmit={e=>{ e.preventDefault(); if(!f.name){toast.error('Name required');return} onSave(f) }} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>{lbl('Crop')}{sel(f.name, v=>s('name',v) || s('scientific', SCI[v]||''), CROP_LIST)}</div>
            <div>{lbl('Tower')}{sel(f.tower, v=>s('tower',v), towers.map(t=>({v:t.id,l:t.name})))}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>{lbl('Stage')}{sel(f.stage, v=>s('stage',v), STAGES)}</div>
            <div>{lbl('Disease')}{sel(f.disease, v=>s('disease',v), DISEASES)}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>{lbl('Health %')}{inp(f.health, v=>s('health',v), 'number', { min:0, max:100 })}</div>
            <div>{lbl('Days to Harvest')}{inp(f.daysToHarvest, v=>s('daysToHarvest',v), 'number', { min:0 })}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>{lbl('Planted Date')}{inp(f.plantedDate, v=>s('plantedDate',v), 'date')}</div>
            <div>{lbl('Expected Yield')}{inp(f.expectedYield, v=>s('expectedYield',v))}</div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:6 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button type="submit" style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'var(--color-primary)', color:'#fff', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Check size={15}/> {mode==='add'?'Add Plant':'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function DelModal({ plant, onConfirm, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:360, padding:28, textAlign:'center' }}>
        <div style={{ width:52, height:52, borderRadius:14, background:'#ef444422', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
          <AlertTriangle size={24} color="#ef4444"/>
        </div>
        <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>Delete Plant?</h3>
        <p style={{ fontSize:14, color:'var(--text-muted)', marginBottom:22 }}><strong style={{ color:'var(--text-primary)' }}>{plant.name}</strong> in {plant.tower} will be removed.</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid var(--border-color)', background:'transparent', color:'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'11px', borderRadius:10, border:'none', background:'#ef4444', color:'#fff', fontWeight:700, cursor:'pointer' }}>Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function PlantMonitoring() {
  const dispatch = useDispatch()
  const { plants, towers } = useSelector(s => s.farm)
  const [search, setSearch] = useState('')
  const [stageF, setStageF] = useState('all')
  const [modal, setModal] = useState(null)
  const [del, setDel] = useState(null)

  const list = plants.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.tower.toLowerCase().includes(search.toLowerCase())) &&
    (stageF==='all' || p.stage===stageF)
  )

  const handleAdd  = f => { dispatch(addPlant({...f, id:genId(plants)})); toast.success(`${f.name} added!`); setModal(null) }
  const handleEdit = f => { dispatch(updatePlant(f)); toast.success(`${f.name} updated!`); setModal(null) }
  const handleDel  = () => { dispatch(deletePlant(del.id)); toast.success(`${del.name} removed.`); setDel(null) }

  const summaryStats = [
    { label:'Total', value:plants.length, color:'#06b6d4' },
    { label:'Healthy (85%+)', value:plants.filter(p=>p.health>=85).length, color:'#22c55e' },
    { label:'At Risk', value:plants.filter(p=>p.health<65).length, color:'#ef4444' },
    { label:'Near Harvest', value:plants.filter(p=>p.daysToHarvest<=5).length, color:'#8b5cf6' },
  ]

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:22 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Plant Monitoring</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Track health, stages and manage all crops</p>
        </div>
        <button onClick={() => setModal({ mode:'add' })} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
          <Plus size={16}/> Add Plant
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:14 }}>
        {summaryStats.map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:14, padding:'16px 18px', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:200, background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, padding:'10px 14px' }}>
          <Search size={15} color="var(--text-muted)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plants or towers..."
            style={{ border:'none', background:'transparent', color:'var(--text-primary)', fontSize:14, outline:'none', width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all',...STAGES].map(s=>(
            <button key={s} onClick={()=>setStageF(s)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid var(--border-color)', cursor:'pointer', textTransform:'capitalize',
              background:stageF===s?(SC[s]||'var(--color-primary)'):'var(--bg-card)', color:stageF===s?'#fff':'var(--text-secondary)' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Plant Cards */}
      {list.length===0
        ? <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🌿</div>
            <div style={{ fontSize:16, fontWeight:600 }}>No plants found</div>
          </div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
            <AnimatePresence>
              {list.map((plant,i) => {
                const c = SC[plant.stage]
                return (
                  <motion.div key={plant.id} layout initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0, scale:0.9 }} transition={{ delay:i*0.06 }}
                    style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:18, padding:22, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:c }}/>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <div style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)' }}>{plant.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)', fontStyle:'italic' }}>{plant.scientific}</div>
                      </div>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:c+'22', color:c, textTransform:'capitalize' }}>{plant.stage}</span>
                    </div>
                    <HealthBar v={plant.health}/>
                    <StageTracker stage={plant.stage}/>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:14 }}>
                      {[{l:'Tower',v:plant.tower},{l:'Harvest',v:`${plant.daysToHarvest}d`},{l:'Yield',v:plant.expectedYield},{l:'Disease',v:plant.disease}].map(({l,v})=>(
                        <div key={l} style={{ background:'var(--bg-secondary)', borderRadius:8, padding:'8px 10px' }}>
                          <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:l==='Disease'&&v!=='None'?'#f59e0b':'var(--text-primary)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:14 }}>
                      <button onClick={()=>setModal({mode:'edit',plant:{...plant}})} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px', border:'1px solid var(--border-color)', borderRadius:10, background:'transparent', color:'var(--color-primary)', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                        <Edit2 size={13}/> Edit
                      </button>
                      <button onClick={()=>setDel(plant)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px 12px', border:'1px solid #ef444433', borderRadius:10, background:'#ef444411', color:'#ef4444', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                        <Trash2 size={13}/> Delete
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
      }

      {/* Plant Intelligence DB */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}
        style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border-color)', display:'flex', alignItems:'center', gap:8 }}>
          <Leaf size={16} color="var(--color-primary)"/>
          <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>Plant Intelligence Database</h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--bg-secondary)' }}>
                {['Crop','Temp Range','pH Range','Spray Cycle','Duration','Yield'].map(h=>(
                  <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DB.map(p=>(
                <tr key={p.name} style={{ borderTop:'1px solid var(--border-color)' }}>
                  <td style={{ padding:'12px 14px', fontWeight:700, color:'var(--text-primary)' }}>{p.name}</td>
                  <td style={{ padding:'12px 14px', color:'var(--text-secondary)', fontSize:13 }}>{p.temp}</td>
                  <td style={{ padding:'12px 14px', color:'var(--text-secondary)', fontSize:13 }}>{p.ph}</td>
                  <td style={{ padding:'12px 14px' }}><code style={{ fontSize:12, background:'var(--bg-secondary)', padding:'2px 8px', borderRadius:5 }}>{p.spray}</code></td>
                  <td style={{ padding:'12px 14px', color:'var(--text-secondary)', fontSize:13 }}>{p.dur}</td>
                  <td style={{ padding:'12px 14px', color:'#22c55e', fontWeight:700 }}>{p.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {modal?.mode==='add'  && <PlantModal mode="add"  initial={{...EMPTY}} towers={towers} onSave={handleAdd}  onClose={()=>setModal(null)}/>}
        {modal?.mode==='edit' && <PlantModal mode="edit" initial={modal.plant} towers={towers} onSave={handleEdit} onClose={()=>setModal(null)}/>}
        {del && <DelModal plant={del} onConfirm={handleDel} onClose={()=>setDel(null)}/>}
      </AnimatePresence>
    </div>
  )
}
