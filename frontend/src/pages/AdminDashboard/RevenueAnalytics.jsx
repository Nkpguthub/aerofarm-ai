import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { DollarSign, TrendingUp, TrendingDown, Users, CreditCard, ArrowUpRight } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Nov', revenue: 182000, subscriptions: 62, mrr: 15200 },
  { month: 'Dec', revenue: 224000, subscriptions: 78, mrr: 18700 },
  { month: 'Jan', revenue: 261000, subscriptions: 91, mrr: 21800 },
  { month: 'Feb', revenue: 312000, subscriptions: 110, mrr: 26000 },
  { month: 'Mar', revenue: 389000, subscriptions: 134, mrr: 32400 },
  { month: 'Apr', revenue: 452000, subscriptions: 158, mrr: 38100 },
  { month: 'May', revenue: 534000, subscriptions: 189, mrr: 45200 },
]

const plans = [
  { name: 'Starter',    price: 499,   farmers: 98,  color: '#06b6d4', revenue: 48902,  badge: 'Most Popular' },
  { name: 'Pro',        price: 1499,  farmers: 67,  color: '#22c55e', revenue: 100433, badge: '' },
  { name: 'Enterprise', price: 4999,  farmers: 24,  color: '#a78bfa', revenue: 119976, badge: 'Top Revenue' },
]

const transactions = [
  { id: 'TXN-2891', farmer: 'Rajesh Kumar',   plan: 'Pro',        amount: 1499, date: '2026-05-07', status: 'success' },
  { id: 'TXN-2892', farmer: 'Anita Sharma',   plan: 'Enterprise', amount: 4999, date: '2026-05-07', status: 'success' },
  { id: 'TXN-2893', farmer: 'Vikram Patel',   plan: 'Starter',    amount: 499,  date: '2026-05-06', status: 'success' },
  { id: 'TXN-2894', farmer: 'Meena Gupta',    plan: 'Pro',        amount: 1499, date: '2026-05-06', status: 'failed'  },
  { id: 'TXN-2895', farmer: 'Suresh Reddy',   plan: 'Enterprise', amount: 4999, date: '2026-05-05', status: 'success' },
  { id: 'TXN-2896', farmer: 'Pooja Iyer',     plan: 'Starter',    amount: 499,  date: '2026-05-05', status: 'refunded'},
]

const statusStyle = {
  success:  { bg: '#22c55e22', color: '#22c55e', label: 'Success' },
  failed:   { bg: '#ef444422', color: '#ef4444', label: 'Failed'  },
  refunded: { bg: '#f59e0b22', color: '#f59e0b', label: 'Refunded'},
}

const planColors = { Starter:'#06b6d4', Pro:'#22c55e', Enterprise:'#a78bfa' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10, padding:'10px 14px' }}>
      <p style={{ color:'var(--text-muted)', fontSize:12, marginBottom:6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color:p.color, fontSize:13, fontWeight:600 }}>{p.name}: ₹{Number(p.value).toLocaleString()}</p>
      ))}
    </div>
  )
}

export default function RevenueAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')

  const totalRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue
  const prevRevenue  = monthlyRevenue[monthlyRevenue.length - 2].revenue
  const growth = (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
  const currentMRR = monthlyRevenue[monthlyRevenue.length - 1].mrr

  return (
    <div style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Revenue Analytics</h1>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Subscription revenue & financial insights</p>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['overview', 'transactions'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, border:'1px solid var(--border-color)', cursor:'pointer', background: activeTab===t ? 'var(--color-primary)' : 'var(--bg-card)', color: activeTab===t ? '#fff' : 'var(--text-secondary)', textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
            {[
              { label:'Monthly Revenue',  value:`₹${(totalRevenue/1000).toFixed(0)}K`, change:`+${growth}%`, up:true,  icon:DollarSign, color:'#22c55e' },
              { label:'MRR',              value:`₹${(currentMRR/1000).toFixed(1)}K`,  change:'+18.7%', up:true,  icon:TrendingUp,  color:'#06b6d4' },
              { label:'Active Farmers',   value:'189',                                  change:'+19.6%', up:true,  icon:Users,       color:'#a78bfa' },
              { label:'Avg Revenue/Farm', value:`₹${Math.round(totalRevenue/189).toLocaleString()}`, change:'+0.3%', up:true, icon:CreditCard, color:'#f59e0b' },
            ].map((k, i) => {
              const Icon = k.icon
              return (
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, padding:20 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:k.color+'22', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} color={k.color} />
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, padding:'3px 8px', borderRadius:20, background: k.up?'#22c55e22':'#ef444422', color: k.up?'#22c55e':'#ef4444', display:'flex', alignItems:'center', gap:3 }}>
                      {k.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {k.change}
                    </span>
                  </div>
                  <div style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)' }}>{k.value}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{k.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Revenue Chart */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, padding:24 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:20 }}>Revenue Trend (₹)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill:'var(--text-muted)', fontSize:12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="mrr"     name="MRR"     stroke="#06b6d4" fill="url(#mrrGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plans */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
            {plans.map((p, i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35+i*0.1}}
                style={{ background:'var(--bg-card)', border:`1px solid ${p.color}44`, borderRadius:16, padding:20, position:'relative', overflow:'hidden' }}>
                {p.badge && (
                  <span style={{ position:'absolute', top:12, right:12, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:p.color+'22', color:p.color }}>{p.badge}</span>
                )}
                <div style={{ fontSize:13, fontWeight:700, color:p.color, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', marginBottom:2 }}>₹{p.price.toLocaleString()}<span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:400 }}>/mo</span></div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>Active Farmers</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{p.farmers}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>Monthly Revenue</span>
                    <span style={{ fontSize:13, fontWeight:700, color:p.color }}>₹{p.revenue.toLocaleString()}</span>
                  </div>
                  <div style={{ height:4, background:'var(--bg-secondary)', borderRadius:2, marginTop:4 }}>
                    <motion.div initial={{width:0}} animate={{width:`${(p.farmers/189)*100}%`}} transition={{delay:0.5+i*0.1, duration:0.8}}
                      style={{ height:'100%', borderRadius:2, background:p.color }} />
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', textAlign:'right' }}>{((p.farmers/189)*100).toFixed(0)}% of farmers</div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-color)' }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)' }}>Recent Transactions</h3>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg-secondary)' }}>
                  {['Transaction','Farmer','Plan','Amount','Date','Status'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => {
                  const ss = statusStyle[t.status]
                  return (
                    <motion.tr key={t.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.05*i}} style={{ borderTop:'1px solid var(--border-color)' }}>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'var(--text-muted)', fontFamily:'monospace' }}>{t.id}</td>
                      <td style={{ padding:'14px 16px', fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{t.farmer}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:(planColors[t.plan]||'#888')+'22', color:planColors[t.plan]||'#888' }}>{t.plan}</span>
                      </td>
                      <td style={{ padding:'14px 16px', fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>₹{t.amount.toLocaleString()}</td>
                      <td style={{ padding:'14px 16px', fontSize:13, color:'var(--text-muted)' }}>{t.date}</td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:600, background:ss.bg, color:ss.color }}>{ss.label}</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
