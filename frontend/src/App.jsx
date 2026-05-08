import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

// Landing
import LandingPage from './pages/Landing/LandingPage'

// Auth
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

// Layouts
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'

// Farmer Dashboard Pages
import FarmerOverview from './pages/FarmerDashboard/FarmerOverview'
import IoTMonitoring from './pages/FarmerDashboard/IoTMonitoring'
import AutomationControl from './pages/FarmerDashboard/AutomationControl'
import TowerManagement from './pages/FarmerDashboard/TowerManagement'
import PlantMonitoring from './pages/FarmerDashboard/PlantMonitoring'
import YieldAnalytics from './pages/FarmerDashboard/YieldAnalytics'
import AIRecommendations from './pages/FarmerDashboard/AIRecommendations'
import NotificationsPage from './pages/FarmerDashboard/NotificationsPage'

// Admin Pages
import AdminOverview from './pages/AdminDashboard/AdminOverview'
import FarmerManagement from './pages/AdminDashboard/FarmerManagement'
import AdminTowers from './pages/AdminDashboard/AdminTowers'
import ProductManagement from './pages/AdminDashboard/ProductManagement'
import OrderManagement from './pages/AdminDashboard/OrderManagement'
import BlogManagement from './pages/AdminDashboard/BlogManagement'
import SystemSettings from './pages/AdminDashboard/SystemSettings'

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { theme } = useSelector(s => s.ui)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Farmer Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<FarmerOverview />} />
        <Route path="monitoring" element={<IoTMonitoring />} />
        <Route path="automation" element={<AutomationControl />} />
        <Route path="towers" element={<TowerManagement />} />
        <Route path="plants" element={<PlantMonitoring />} />
        <Route path="yield" element={<YieldAnalytics />} />
        <Route path="ai" element={<AIRecommendations />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminOverview />} />
        <Route path="farmers" element={<FarmerManagement />} />
        <Route path="towers" element={<AdminTowers />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
