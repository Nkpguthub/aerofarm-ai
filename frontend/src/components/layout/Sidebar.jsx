import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Activity, Zap, Building2, Leaf, BarChart3,
  Sparkles, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  Shield, ShoppingBag, FileText, Users, Package, BarChart2, DollarSign,
  Wheat, FlaskConical
} from 'lucide-react'
import { toggleSidebar, closeMobileSidebar } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'

const farmerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'dashboard', end: true },
  { to: '/dashboard/monitoring', icon: Activity, label: 'monitoring' },
  { to: '/dashboard/automation', icon: Zap, label: 'automation' },
  { to: '/dashboard/towers', icon: Building2, label: 'towers' },
  { to: '/dashboard/plants', icon: Leaf, label: 'plants' },
  { to: '/dashboard/harvest', icon: Wheat, label: 'Harvest Log' },
  { to: '/dashboard/nutrients', icon: FlaskConical, label: 'Nutrients' },
  { to: '/dashboard/yield', icon: BarChart3, label: 'yield' },
  { to: '/dashboard/ai', icon: Sparkles, label: 'ai' },
  { to: '/dashboard/notifications', icon: Bell, label: 'notifications' },
]

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'dashboard', end: true },
  { to: '/admin/farmers', icon: Users, label: 'Farmers' },
  { to: '/admin/towers', icon: Building2, label: 'towers' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
  { to: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { to: '/admin/settings', icon: Settings, label: 'settings' },
]

function SidebarLink({ to, icon: Icon, label, collapsed, end }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => dispatch(closeMobileSidebar())}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      title={collapsed ? t(label, label) : undefined}
    >
      <Icon className="icon" size={20} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            {t(label, label)}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

export default function Sidebar({ role = 'FARMER' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { sidebarCollapsed, mobileSidebarOpen } = useSelector(s => s.ui)
  const { user } = useSelector(s => s.auth)
  const links = role === 'ADMIN' ? adminLinks : farmerLinks

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => dispatch(closeMobileSidebar())}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
              flexShrink: 0
            }}>
              <Leaf size={18} color="white" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                    AeroFarm<span style={{ color: 'var(--color-primary-light)' }}> AI</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Smart Farming
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div style={{ padding: '12px 16px 4px' }}>
            <span className={`badge ${role === 'ADMIN' ? 'badge-info' : 'badge-success'}`}>
              {role === 'ADMIN' ? <Shield size={10} /> : <Leaf size={10} />}
              {role === 'ADMIN' ? 'Admin' : 'Farmer'}
            </span>
          </div>
        )}

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: !sidebarCollapsed ? '4px 16px 6px' : '4px 0 6px', textAlign: sidebarCollapsed ? 'center' : 'left' }}>
            {!sidebarCollapsed && (
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Navigation
              </span>
            )}
          </div>
          {links.map(link => (
            <SidebarLink key={link.to} {...link} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* User profile + collapse */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 8px 8px' }}>
          {/* User info */}
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 10, marginBottom: 8,
              background: 'var(--border-subtle)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'white'
              }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', truncate: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>
            </div>
          )}

          <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--color-danger)', fontSize: 13 }} onClick={handleLogout}>
            <LogOut size={16} />
            {!sidebarCollapsed && 'Logout'}
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  )
}
