import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, User, Mail, Lock, ArrowRight, Building, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { hashPassword, checkPasswordStrength, secureRead, secureStore } from '../../utils/security'
import toast from 'react-hot-toast'

const ADMIN_EMAIL = 'narendra1.galsana@gmail.com'

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', farmName: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]  = useState(false)
  const [error, setError]      = useState('')
  const navigate = useNavigate()

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (error) setError('')
  }

  const strength = checkPasswordStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.email.toLowerCase() === ADMIN_EMAIL) {
      setError('This email is reserved and cannot be used.')
      return
    }
    if (!strength.strong) {
      setError('Please create a stronger password (see requirements below).')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    const existing = secureRead('farmers') || []
    if (existing.find(f => f.email === form.email)) {
      setError('An account with this email already exists.')
      return
    }

    setLoading(true)
    const passwordHash = await hashPassword(form.password)

    const newFarmer = {
      id:           Date.now(),
      name:         form.name.trim(),
      email:        form.email.trim().toLowerCase(),
      farmName:     form.farmName.trim(),
      passwordHash,
      role:         'FARMER',
      createdAt:    new Date().toISOString(),
    }
    secureStore('farmers', [...existing, newFarmer])

    toast.success('Account created! Please sign in. 🌱')
    navigate('/login')
    setLoading(false)
  }

  // Strength bar color
  const barColor = strength.score <= 1 ? '#ef4444' : strength.score === 2 ? '#f97316' : strength.score === 3 ? '#eab308' : '#22c55e'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(22,163,74,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 460, padding: '32px 16px', position: 'relative', zIndex: 1 }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(34,197,94,0.4)' }}>
            <Leaf size={22} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>AeroFarm <span style={{ color: 'var(--color-primary-light)' }}>AI</span></span>
        </Link>

        <div className="glass-card" style={{ padding: 36 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Start farming smarter</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Create your secure farmer account</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 24 }}>
            🌱 Farmer Account Only
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'name',     label: 'Full Name',  type: 'text',  icon: User,     ph: 'Your full name' },
              { key: 'email',    label: 'Email',       type: 'email', icon: Mail,     ph: 'you@example.com' },
              { key: 'farmName', label: 'Farm Name',   type: 'text',  icon: Building, ph: 'Green Valley Aeroponics' },
            ].map(({ key, label, type, icon: Icon, ph }) => (
              <div key={key}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input" type={type} placeholder={ph} value={form[key]}
                    onChange={set(key)} style={{ paddingLeft: 42 }} required />
                </div>
              </div>
            ))}

            {/* Password with strength meter */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Min. 8 chars" value={form.password}
                  onChange={set('password')} style={{ paddingLeft: 42, paddingRight: 42 }} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength.score ? barColor : 'var(--border-subtle)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: barColor, marginBottom: 8 }}>{strength.label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {Object.entries(strength.checks).map(([key, { pass, label }]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: pass ? '#22c55e' : 'var(--text-muted)' }}>
                        <span style={{ fontSize: 10 }}>{pass ? '✅' : '○'}</span> {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirm}
                  onChange={set('confirm')} style={{ paddingLeft: 42, borderColor: form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.5)' : undefined }} required />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>⚠️ Passwords do not match</div>
              )}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#ef4444' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Securing account...' : <> Create Secure Account <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Security note */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <ShieldCheck size={12} />
            Password hashed with SHA-256 before storage
          </div>

          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
