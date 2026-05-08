import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Menu, Bell, Sun, Moon, Globe, Search,
  ChevronDown, Check, Wifi, WifiOff
} from 'lucide-react'
import { toggleTheme } from '../../store/slices/uiSlice'
import { toggleMobileSidebar } from '../../store/slices/uiSlice'
import { setLanguage } from '../../store/slices/uiSlice'
import { markAllRead } from '../../store/slices/notificationsSlice'
import i18n from '../../i18n/config'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
]

export default function Navbar({ title }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { theme } = useSelector(s => s.ui)
  const { unreadCount, items } = useSelector(s => s.notifications)
  const { connected } = useSelector(s => s.sensors)
  const { user } = useSelector(s => s.auth)

  const [showNotifications, setShowNotifications] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const notifRef = useRef(null)
  const langRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLangChange = (code) => {
    i18n.changeLanguage(code)
    dispatch(setLanguage(code))
    setShowLang(false)
  }

  const getSeverityColor = (sev) => {
    const map = { warning: '#f59e0b', danger: '#ef4444', success: '#10b981', info: '#06b6d4' }
    return map[sev] || 'var(--text-muted)'
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border-subtle)',
      height: 64,
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 12,
    }}>
      {/* Mobile hamburger */}
      <button className="btn-ghost" style={{ padding: 8 }} onClick={() => dispatch(toggleMobileSidebar())}>
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
        {title}
      </h1>

      {/* IoT Connection status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: connected ? '#10b981' : '#ef4444' }}>
        {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span style={{ display: 'none' }} className="sm-show">{connected ? 'Live' : 'Offline'}</span>
      </div>

      {/* Theme toggle */}
      <button
        className="btn-ghost"
        style={{ padding: 8 }}
        onClick={() => dispatch(toggleTheme())}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Language switcher */}
      <div ref={langRef} style={{ position: 'relative' }}>
        <button className="btn-ghost" style={{ padding: 8, gap: 4 }} onClick={() => setShowLang(!showLang)}>
          <Globe size={18} />
          <ChevronDown size={12} style={{ opacity: 0.5 }} />
        </button>
        <AnimatePresence>
          {showLang && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', right: 0, top: '110%',
                background: 'var(--bg-card)', border: '1px solid var(--border-medium)',
                borderRadius: 12, padding: 6, minWidth: 140,
                boxShadow: 'var(--shadow-lg)', zIndex: 50,
              }}
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 12px', borderRadius: 8, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: 'var(--text-primary)', fontSize: 14,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--border-subtle)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  <span>{lang.flag}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{lang.label}</span>
                  {i18n.language === lang.code && <Check size={12} style={{ color: 'var(--color-primary-light)' }} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button className="btn-ghost" style={{ padding: 8, position: 'relative' }} onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--color-danger)', color: 'white',
              fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', right: 0, top: '110%',
                background: 'var(--bg-card)', border: '1px solid var(--border-medium)',
                borderRadius: 16, width: 340,
                boxShadow: 'var(--shadow-lg)', zIndex: 50, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
                <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => dispatch(markAllRead())}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {items.slice(0, 6).map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                    background: n.read ? 'transparent' : 'rgba(34,197,94,0.04)',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                        background: getSeverityColor(n.severity), flexShrink: 0,
                        boxShadow: `0 0 6px ${getSeverityColor(n.severity)}80`,
                      }} />
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
        flexShrink: 0,
      }}>
        {user?.name?.charAt(0) || 'U'}
      </div>
    </header>
  )
}
