import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const reports = [
  { id: 'RPT-001', title: 'Monthly Farm Performance Report', type: 'Performance', generated: '2026-05-01', size: '2.4 MB', status: 'ready', farms: 189, period: 'April 2026' },
  { id: 'RPT-002', title: 'Water Usage & Conservation Report',  type: 'Resource',    generated: '2026-05-01', size: '1.8 MB', status: 'ready', farms: 189, period: 'April 2026' },
  { id: 'RPT-003', title: 'IoT Sensor Health Audit',            type: 'IoT',         generated: '2026-04-28', size: '3.1 MB', status: 'ready', farms: 143, period: 'Q1 2026'   },
  { id: 'RPT-004', title: 'Crop Yield Prediction Accuracy',     type: 'AI',          generated: '2026-04-25', size: '1.2 MB', status: 'ready', farms: 189, period: 'Q1 2026'   },
  { id: 'RPT-005', title: 'May 2026 Real-Time Snapshot',        type: 'Live',        generated: '—',          size: '—',      status: 'generating', farms: 189, period: 'May 2026' },
  { id: 'RPT-006', title: 'Revenue & Subscription Report',      type: 'Finance',     generated: '—',          size: '—',      status: 'scheduled',  farms: 189, period: 'May 2026' },
]

const typeColors = { Performance:'#06b6d4', Resource:'#22c55e', IoT:'#a78bfa', AI:'#f59e0b', Live:'#ec4899', Finance:'#10b981' }
const statusConfig = {
  ready:      { icon: CheckCircle, color: '#22c55e', label: 'Ready' },
  generating: { icon: RefreshCw,   color: '#f59e0b', label: 'Generating...' },
  scheduled:  { icon: Clock,       color: '#06b6d4', label: 'Scheduled' },
}
const TYPES = ['All', 'Performance', 'Resource', 'IoT', 'AI', 'Finance', 'Live']

export default function ReportsPage() {
  const [filter, setFilter] = useState('All')
  const [generating, setGenerating] = useState(false)
  const filtered = filter === 'All' ? reports : reports.filter(r => r.type === filter)

  const handleGenerate = () => {
    setGenerating(true)
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Generating report...', success: 'Report generated!', error: 'Failed'
    }).finally(() => setGenerating(false))
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Generate and download platform reports</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer', opacity: generating ? 0.7 : 1 }}>
          <FileText size={16}/> {generating ? 'Generating...' : 'New Report'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:16 }}>
        {[{l:'Total Reports',v:'48',c:'#06b6d4'},{l:'Ready',v:'41',c:'#22c55e'},{l:'In Progress',v:'3',c:'#f59e0b'},{l:'Scheduled',v:'4',c:'#a78bfa'}].map((s,i) => (
          <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:14, padding:'18px 20px', borderLeft:`3px solid ${s.c}` }}>
            <div style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)' }}>{s.v}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{s.l}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:600, border:'1px solid var(--border-color)', cursor:'pointer', background: filter===t ? 'var(--color-primary)' : 'var(--bg-card)', color: filter===t ? '#fff' : 'var(--text-secondary)' }}>{t}</button>
        ))}
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'var(--bg-secondary)' }}>
                {['Report','Type','Period','Generated','Size','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const sc = statusConfig[r.status]
                const StatusIcon = sc.icon
                return (
                  <motion.tr key={r.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.05*i}} style={{ borderTop:'1px solid var(--border-color)' }}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:9, background:(typeColors[r.type]||'#888')+'22', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <FileText size={16} color={typeColors[r.type]||'#888'} />
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{r.title}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.id} · {r.farms} farms</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:(typeColors[r.type]||'#888')+'22', color:typeColors[r.type]||'#888' }}>{r.type}</span>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'var(--text-secondary)' }}>{r.period}</td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'var(--text-secondary)' }}>{r.generated}</td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'var(--text-secondary)' }}>{r.size}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5, width:'fit-content', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:sc.color+'22', color:sc.color }}>
                        <StatusIcon size={11}/> {sc.label}
                      </span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <button onClick={() => { if(r.status!=='ready'){toast.error('Not ready yet');return} toast.success(`Downloading ${r.title}`) }}
                        style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'1px solid var(--border-color)', borderRadius:8, background:'transparent', color: r.status==='ready'?'var(--color-primary)':'var(--text-muted)', cursor: r.status==='ready'?'pointer':'default', fontSize:12, fontWeight:600 }}>
                        <Download size={13}/> Download
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
