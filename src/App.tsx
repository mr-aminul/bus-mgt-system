import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthenticatedLayout } from '@/layout'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { OperatorProvider } from '@/contexts/OperatorContext'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import ForgotPassword from '@/pages/ForgotPassword'
import { OperationsDashboard } from '@/pages/OperationsDashboard'
import { FleetPage } from '@/pages/FleetPage'
import { VehicleDetail } from '@/pages/VehicleDetail'
import { RoutesPage } from '@/pages/RoutesPage'
import { DriversPage } from '@/pages/DriversPage'
import { CountersPage } from '@/pages/CountersPage'
import { TicketsPage } from '@/pages/TicketsPage'
import { ReportsPage } from '@/pages/ReportsPageBMS'
import { SettingsPage } from '@/pages/SettingsPageBMS'
import { CounterPOS } from '@/pages/CounterPOS'
import Profile from '@/pages/Profile'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUp />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LanguageProvider>
                <OperatorProvider>
                  <AuthenticatedLayout />
                </OperatorProvider>
              </LanguageProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<OperationsDashboard />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="fleet/:id" element={<VehicleDetail />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="counters" element={<CountersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="pos" element={<CounterPOS />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
