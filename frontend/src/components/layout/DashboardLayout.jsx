import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageTitles = {
  '/dashboard': 'Farm Overview',
  '/dashboard/monitoring': 'IoT Sensor Monitoring',
  '/dashboard/automation': 'Automation Controls',
  '/dashboard/towers': 'Tower Management',
  '/dashboard/plants': 'Plant Monitoring',
  '/dashboard/yield': 'Yield Analytics',
  '/dashboard/ai': 'AI Recommendations',
  '/dashboard/notifications': 'Notifications',
}

export default function DashboardLayout() {
  const { sidebarCollapsed } = useSelector(s => s.ui)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="FARMER" />
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ flex: 1 }}>
        <Navbar title={title} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
