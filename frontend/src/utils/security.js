// ============================================================
//  AeroFarm AI — Security Utility
//  SHA-256 hashing · Rate limiting · Encrypted storage
// ============================================================

// ── SHA-256 via Web Crypto API (with pure JS fallback) ─────────
function sha256_pure(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiLength = ascii[lengthProperty];
  var hash = sha256_pure.h = sha256_pure.h || [];
  var k = sha256_pure.k = sha256_pure.k || [];
  var primeCounter = k[lengthProperty];
  var isPrime = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isPrime[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isPrime[i] = 1;
      }
      hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
      k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << (24 - (i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
  words[words[lengthProperty]] = (asciiLength * 8);
  var h0 = hash[0], h1 = hash[1], h2 = hash[2], h3 = hash[3],
      h4 = hash[4], h5 = hash[5], h6 = hash[6], h7 = hash[7];
  for (i = 0; i < words[lengthProperty]; i += 16) {
    var w = [];
    for (j = 0; j < 16; j++) w[j] = words[i + j];
    for (j = 16; j < 64; j++) {
      var s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      var s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    var a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h_val = h7;
    for (j = 0; j < 64; j++) {
      var S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      var ch = (e & f) ^ (~e & g);
      var temp1 = (h_val + S1 + ch + k[j] + w[j]) | 0;
      var S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var temp2 = (S0 + maj) | 0;
      h_val = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h_val) | 0;
  }
  return [h0, h1, h2, h3, h4, h5, h6, h7].map(function (val) {
    var str = (val >>> 0).toString(16);
    return '00000000'.substring(0, 8 - str.length) + str;
  }).join('');
}

export async function hashPassword(password) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (e) {
    console.warn("Web Crypto API failed, falling back to pure JS SHA-256:", e)
  }
  return sha256_pure(password)
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
