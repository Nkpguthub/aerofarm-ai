import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const adminTitles = {
  '/admin': 'Admin Overview',
  '/admin/farmers': 'Farmer Management',
  '/admin/blogs': 'Blog Management',
  '/admin/settings': 'System Settings',
}

export default function AdminLayout() {
  const { sidebarCollapsed } = useSelector(s => s.ui)
  const location = useLocation()
  const title = adminTitles[location.pathname] || 'Admin Panel'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="ADMIN" />
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ flex: 1 }}>
        <Navbar title={title} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
