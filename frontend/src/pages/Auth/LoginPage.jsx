import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { Leaf, Eye, EyeOff, ArrowRight, Mail, Lock, ShieldAlert } from 'lucide-react'
import { loginSuccess } from '../../store/slices/authSlice'
import { hashPassword, getRateLimit, recordFailedAttempt, clearRateLimit, secureRead, startSessionTimer } from '../../utils/security'
import toast from 'react-hot-toast'

// ── Admin: email + pre-computed SHA-256 of password ─────────
const ADMIN_EMAIL    = 'narendra.galsana@gmail.com'
const ADMIN_HASH     = '8915928308b3859dd9ba0a3aea8cd5d144090435c1ff146f5f772df2494a078f'
const ADMIN_NAME     = 'Narendra Galsana'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [lockInfo, setLockInfo] = useState({ locked: false, secondsLeft: 0 })
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  // Countdown timer while locked out
  useEffect(() => {
    if (!lockInfo.locked) return
    const interval = setInterval(() => {
      const rl = getRateLimit(email)
      if (!rl.locked) { setLockInfo({ locked: false, secondsLeft: 0 }); clearInterval(interval) }
      else setLockInfo(rl)
    }, 1000)
    return () => clearInterval(interval)
  }, [lockInfo.locked, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check rate limit before doing anything
    const rl = getRateLimit(email)
    if (rl.locked) { setLockInfo(rl); return }

    setLoading(true)
    const inputHash = await hashPassword(password)

    // ── Admin check ───────────────────────────────
    if (email === ADMIN_EMAIL) {
      if (inputHash === ADMIN_HASH) {
        clearRateLimit(email)
        dispatch(loginSuccess({
          user: { id: 0, name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'ADMIN', farmName: 'AeroFarm HQ' },
          token: 'jwt-admin-' + Date.now(),
        }))
        startSessionTimer(() => { dispatch({ type: 'auth/logout' }); navigate('/login') })
        toast.success(`Welcome, ${ADMIN_NAME}! 🛡️`)
        navigate('/admin')
        setLoading(false)
        return
      }
      // Wrong admin password
      const result = recordFailedAttempt(email)
      if (result.lockedUntil > Date.now()) setLockInfo(getRateLimit(email))
      else setError(`Incorrect password. ${5 - result.attempts} attempt(s) remaining.`)
      setLoading(false)
      return
    }

    // ── Farmer check (encrypted localStorage) ────
    const farmers = secureRead('farmers') || []
    const farmer  = farmers.find(f => f.email === email && f.passwordHash === inputHash)
    if (farmer) {
      clearRateLimit(email)
      dispatch(loginSuccess({
        user: { id: farmer.id, name: farmer.name, email: farmer.email, role: 'FARMER', farmName: farmer.farmName },
        token: 'jwt-farmer-' + farmer.id,
      }))
      startSessionTimer(() => { dispatch({ type: 'auth/logout' }); navigate('/login') })
      toast.success(`Welcome back, ${farmer.name}! 🌱`)
      navigate('/dashboard')
      setLoading(false)
      return
    }

    // ── No match ──────────────────────────────────
    const result = recordFailedAttempt(email)
    if (result.lockedUntil > Date.now()) {
      setLockInfo(getRateLimit(email))
      setError('')
    } else {
      const remaining = Math.max(0, 5 - (result.attempts % 5))
      setError(`Invalid email or password. ${remaining} attempt(s) before lockout.`)
    }
    setLoading(false)
  }

  const fmtTime = (s) => s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 30% 50%, rgba(22,163,74,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(6,182,212,0.08) 0%, transparent 60%)' }} />
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, padding: '0 16px', position: 'relative', zIndex: 1 }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #16a34a, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(34,197,94,0.4)' }}>
            <Leaf size={22} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            AeroFarm <span style={{ color: 'var(--color-primary-light)' }}>AI</span>
          </span>
        </Link>

        <div className="glass-card" style={{ padding: 36 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Sign in to your farming dashboard</p>

          {/* ── Quick Fill (Mobile Friendly) ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
              🔑 Quick Sign In
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Admin quick fill */}
              <button type="button"
                onClick={() => { setEmail(ADMIN_EMAIL); setPassword('Narendra@2501'); setError('') }}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.05))',
                  border: '1px solid rgba(6,182,212,0.3)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#06b6d4'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4' }}>🛡️ Admin</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Narendra Galsana</div>
              </button>

              {/* Farmer hint */}
              <button type="button"
                onClick={() => { setEmail(''); setPassword(''); setError(''); toast('Enter your registered farmer email & password 🌱', { icon: '📋' }) }}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))',
                  border: '1px solid rgba(34,197,94,0.3)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#22c55e'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>🌱 Farmer</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Use registered email</div>
              </button>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
              Tap a card to auto-fill credentials
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />

          {/* Lockout banner */}
          {lockInfo.locked ? (
            <div style={{ padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Account Temporarily Locked</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Too many failed attempts. Try again in <strong style={{ color: '#ef4444' }}>{fmtTime(lockInfo.secondsLeft)}</strong>
                </div>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 42 }} required disabled={lockInfo.locked} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 42, paddingRight: 42 }} required disabled={lockInfo.locked} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && !lockInfo.locked && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#ef4444' }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
              disabled={loading || lockInfo.locked}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite', display: 'inline-block' }} />
                  Verifying...
                </span>
              ) : lockInfo.locked ? `Locked • ${fmtTime(lockInfo.secondsLeft)}` : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Security badge */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <ShieldAlert size={12} />
            SHA-256 encrypted · Rate limited · Session protected
          </div>

          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
