// ============================================================
//  AeroFarm AI — Security Utility
//  SHA-256 hashing · Rate limiting · Encrypted storage
// ============================================================

// ── SHA-256 via Web Crypto API ──────────────────────────────
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Rate Limiter ────────────────────────────────────────────
const MAX_ATTEMPTS = 5

export function getRateLimit(email) {
  const key = `rl_${btoa(email)}`
  const raw = sessionStorage.getItem(key)
  if (!raw) return { locked: false, attempts: 0, secondsLeft: 0 }
  const data = JSON.parse(raw)
  const now = Date.now()
  if (data.lockedUntil > now) {
    return { locked: true, attempts: data.attempts, secondsLeft: Math.ceil((data.lockedUntil - now) / 1000) }
  }
  return { locked: false, attempts: data.attempts, secondsLeft: 0 }
}

export function recordFailedAttempt(email) {
  const key = `rl_${btoa(email)}`
  const raw = sessionStorage.getItem(key)
  const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 }
  data.attempts += 1
  if (data.attempts >= MAX_ATTEMPTS) {
    // Exponential backoff: 30s → 2m → 10m
    const lockSeconds = [30, 120, 600][Math.min(Math.floor(data.attempts / MAX_ATTEMPTS) - 1, 2)]
    data.lockedUntil = Date.now() + lockSeconds * 1000
  }
  sessionStorage.setItem(key, JSON.stringify(data))
  return data
}

export function clearRateLimit(email) {
  sessionStorage.removeItem(`rl_${btoa(email)}`)
}

// ── Password Strength ───────────────────────────────────────
export function checkPasswordStrength(password) {
  const checks = {
    length:    { pass: password.length >= 8,              label: 'Min. 8 characters' },
    uppercase: { pass: /[A-Z]/.test(password),            label: 'Uppercase letter (A-Z)' },
    lowercase: { pass: /[a-z]/.test(password),            label: 'Lowercase letter (a-z)' },
    number:    { pass: /[0-9]/.test(password),            label: 'Number (0-9)' },
    special:   { pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), label: 'Special character (!@#$...)' },
  }
  const score = Object.values(checks).filter(c => c.pass).length
  const levels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4']
  return { checks, score, label: levels[score], color: colors[score], strong: score >= 4 }
}

// ── Encrypted localStorage (XOR + Base64) ──────────────────
const XOR_KEY = 'aerofarm_v2_2026_secure_xk'

function xorCipher(str) {
  return str.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length))
  ).join('')
}

export function secureStore(key, data) {
  const json = JSON.stringify(data)
  const encrypted = btoa(xorCipher(json))
  localStorage.setItem(`_af_${key}`, encrypted)
}

export function secureRead(key) {
  try {
    const encrypted = localStorage.getItem(`_af_${key}`)
    if (!encrypted) return null
    return JSON.parse(xorCipher(atob(encrypted)))
  } catch {
    return null
  }
}

export function secureRemove(key) {
  localStorage.removeItem(`_af_${key}`)
}

// ── Session Timeout (30 min inactivity) ────────────────────
let _logoutTimer = null

export function startSessionTimer(logoutCallback) {
  clearTimeout(_logoutTimer)
  const reset = () => {
    clearTimeout(_logoutTimer)
    _logoutTimer = setTimeout(() => {
      logoutCallback()
    }, 30 * 60 * 1000) // 30 minutes
  }
  reset()
  ;['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(ev =>
    window.addEventListener(ev, reset, { passive: true })
  )
}

export function clearSessionTimer() {
  clearTimeout(_logoutTimer)
}
