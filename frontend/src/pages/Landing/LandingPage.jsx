import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Droplets, Brain, Cpu, TrendingUp, Sprout, Star, ChevronDown, Mail, Phone, MapPin, ArrowRight, Play, Check, Zap, Shield, Globe } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }

/* ── Hero ── */
function Hero() {
  return (
    <section className="hero-section" style={{ padding: '0 24px' }}>
      <div className="hero-bg" />
      <div className="grid-pattern" />
      <div style={{ position: 'absolute', top: '20%', left: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 120, paddingBottom: 80 }}>
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15 } } }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', fontSize: 13, fontWeight: 600, color: '#22c55e', marginBottom: 24 }}>
              <Zap size={13} /> AI-Powered Aeroponic Platform · Version 2.0
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
            The Future of<br />
            <span className="gradient-text">Smart Farming</span><br />
            is Here
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            Harness AI-powered aeroponic technology to grow <strong style={{ color: '#22c55e' }}>10× more</strong> with <strong style={{ color: '#06b6d4' }}>95% less water</strong>. Real-time IoT monitoring, automated controls, and yield prediction — all in one premium platform.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 60 }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Start Growing Free <ArrowRight size={18} />
            </Link>
            <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }}>
              <Play size={16} style={{ fill: 'currentColor' }} /> Watch Demo
            </button>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, maxWidth: 600 }}>
            {[
              { val: '500+', label: 'Active Farms' },
              { val: '95%', label: 'Water Savings' },
              { val: '10×', label: 'Yield Increase' },
              { val: '99.9%', label: 'Uptime SLA' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)' }}>
          <ChevronDown size={24} />
        </motion.div>
      </div>
    </section>
  )
}

/* ── Features ── */
function Features() {
  const features = [
    { icon: Droplets, title: 'Save 95% Water', desc: 'Precision misting delivers nutrients directly to roots, eliminating water waste completely.', color: '#06b6d4' },
    { icon: Brain, title: 'AI Automation', desc: 'Machine learning optimizes pH, nutrients, lighting, and spray cycles automatically.', color: '#8b5cf6' },
    { icon: Cpu, title: 'IoT Sensors', desc: 'Real-time ESP32 sensors monitor pH, temperature, humidity, EC, and water levels 24/7.', color: '#22c55e' },
    { icon: Sprout, title: 'Organic Farming', desc: 'Grow pesticide-free, certified organic produce with controlled nutrient dosing.', color: '#f59e0b' },
    { icon: TrendingUp, title: 'Yield Prediction', desc: 'AI models predict harvest dates, expected yield, and profit margins weeks in advance.', color: '#ef4444' },
  ]
  return (
    <section className="section">
      <div className="container">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14, letterSpacing: '2px', textTransform: 'uppercase' }}>Platform Features</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>Everything you need to<br /><span className="gradient-text">farm smarter</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <motion.div key={title} variants={fadeUp} className="card" style={{ padding: 28 }} whileHover={{ y: -4 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Pricing ── */
function Pricing() {
  const plans = [
    { name: 'Starter', price: 0, desc: 'Perfect for hobby farmers', features: ['2 towers', 'Basic monitoring', 'Email alerts', '7-day history'], cta: 'Get Started', highlighted: false },
    { name: 'Pro', price: 49, desc: 'For commercial operations', features: ['20 towers', 'AI recommendations', 'WhatsApp alerts', 'Unlimited history', 'Yield prediction', 'Priority support'], cta: 'Start Pro Trial', highlighted: true },
    { name: 'Enterprise', price: 199, desc: 'Full-scale farm management', features: ['Unlimited towers', 'Custom AI models', 'Dedicated support', 'White-label option', 'API access', 'SLA guarantee'], cta: 'Contact Sales', highlighted: false },
  ]
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14, letterSpacing: '2px', textTransform: 'uppercase' }}>Pricing</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>Simple, transparent<br /><span className="gradient-text">pricing</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 960, margin: '0 auto' }}>
            {plans.map(({ name, price, desc, features, cta, highlighted }) => (
              <motion.div key={name} variants={fadeUp}
                style={{ background: highlighted ? 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(6,182,212,0.1))' : 'var(--bg-card)', border: `1px solid ${highlighted ? 'rgba(34,197,94,0.4)' : 'var(--border-subtle)'}`, borderRadius: 20, padding: 32, position: 'relative', boxShadow: highlighted ? '0 0 40px rgba(34,197,94,0.15)' : 'none' }}
                whileHover={{ y: -4 }}>
                {highlighted && (
                  <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 100, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Most Popular
                  </span>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>{desc}</div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-primary)' }}>${price}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                      <Check size={15} color="#22c55e" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={highlighted ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>{cta}</Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Testimonials ── */
function Testimonials() {
  const items = [
    { name: 'Rajesh Kumar', role: 'Vertical Farm Owner, Pune', text: 'AeroFarm AI increased our basil yield by 340% in just 3 months. The real-time monitoring saves us hours every day.', rating: 5 },
    { name: 'Priya Sharma', role: 'Urban Farmer, Bangalore', text: 'The AI recommendations are incredible. It automatically adjusted our pH levels before we even noticed an issue.', rating: 5 },
    { name: 'Amit Patel', role: 'Commercial Grower, Ahmedabad', text: 'ROI was achieved in just 6 months. The water savings alone paid for the subscription 10 times over.', rating: 5 },
  ]
  return (
    <section className="section">
      <div className="container">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="section-title">Loved by <span className="gradient-text">farmers worldwide</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {items.map(({ name, role, text, rating }) => (
              <motion.div key={name} variants={fadeUp} className="glass-card" style={{ padding: 28 }} whileHover={{ y: -4 }}>
                <div style={{ display: 'flex', marginBottom: 16 }}>
                  {[...Array(rating)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#16a34a,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── FAQ ── */
function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'What is aeroponic farming?', a: 'Aeroponics grows plants with roots suspended in air, misted with nutrient solution. It uses 95% less water than soil farming and grows plants 3× faster.' },
    { q: 'Do I need technical knowledge to use AeroFarm AI?', a: 'No! Our AI handles all the complexity. You just set your plant type and the system automatically manages pH, nutrients, spray cycles, and lighting.' },
    { q: 'What sensors are supported?', a: 'We support ESP32-based sensors for pH, EC, temperature (DHT22), humidity, water level, LDR (light), and motion detection. Custom sensors can be integrated via MQTT.' },
    { q: 'Is my data secure?', a: 'Yes. All data is encrypted with JWT authentication. We use role-based access control and industry-standard security practices.' },
    { q: 'Can I use this without internet?', a: 'Core monitoring works on local network via WebSocket. Analytics and AI features require internet connectivity.' },
  ]
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">Frequently asked <span className="gradient-text">questions</span></h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} variants={fadeUp} className="card" style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, textAlign: 'left' }}>
                  {q}
                  <ChevronDown size={18} style={{ color: 'var(--text-muted)', transform: open === i ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }} />
                </button>
                {open === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Contact ── */
function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Get in <span className="gradient-text">touch</span></h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.7 }}>Ready to transform your farm? Our team is here to help you get started.</p>
            {[{ icon: Mail, text: 'support@aerofarm.io' }, { icon: Phone, text: '+91 98765 43210' }, { icon: MapPin, text: 'Ahmedabad, Gujarat, India' }].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Icon size={18} color="var(--color-primary-light)" /> {text}
              </div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Message sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[{ ph: 'Your name', type: 'text' }, { ph: 'Email address', type: 'email' }].map(({ ph, type }) => (
                  <input key={ph} className="input" type={type} placeholder={ph} required />
                ))}
                <textarea className="input" placeholder="Tell us about your farm..." rows={4} required style={{ resize: 'vertical' }} />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>Send Message <ArrowRight size={16} /></button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '48px 24px 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={16} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>AeroFarm AI</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>The world's most advanced aeroponic farm management platform.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Dashboard', 'IoT Sensors', 'AI Engine'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Partners'] },
            { title: 'Support', links: ['Documentation', 'API Docs', 'Community', 'Status', 'Contact'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</div>
              {links.map(l => (
                <div key={l} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 AeroFarm AI. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[Globe, Shield, Leaf].map((Icon, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={14} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Sticky Nav ── */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', transition: 'all 0.3s', background: scrolled ? 'var(--glass-bg)' : 'transparent', backdropFilter: scrolled ? 'var(--glass-blur)' : 'none', borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#16a34a,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={17} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>AeroFarm <span style={{ color: '#22c55e' }}>AI</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login" className="btn-ghost" style={{ fontSize: 14 }}>Sign In</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

/* ── Main export ── */
export default function LandingPage() {
  return (
    <div>
      <LandingNav />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
