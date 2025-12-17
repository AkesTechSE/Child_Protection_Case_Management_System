import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSelector } from 'react-redux'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'

// Pages - code-splitting via React.lazy
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const CasesPage = lazy(() => import('./pages/CasesPage'))
const VictimsPage = lazy(() => import('./pages/VictimsPage'))
const PerpetratorsPage = lazy(() => import('./pages/PerpetratorsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))
const Settings = lazy(() => import('./pages/Settings'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))

// If you have ProfilePage, add it too
import ProfilePage from './pages/ProfilePage'

// Layout
import MainLayout from './components/Layout/MainLayout'
import { getHomeRouteForRole, REPORTS_ROLES } from './utils/constants'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

const RoleBasedHomeRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <Navigate to={getHomeRouteForRole(user?.role)} replace />
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes with MainLayout - ALL routes inside require auth */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              {/* Dashboard */}
              <Route element={<RoleProtectedRoute allowedRoles={['system_admin', 'admin', 'director', 'focal_person']} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
              
              {/* Case Management */}
              <Route path="/cases" element={<CasesPage />} />
              <Route path="/cases/:id" element={<CasesPage />} />
              <Route path="/victims" element={<VictimsPage />} />
              <Route path="/perpetrators" element={<PerpetratorsPage />} />
              <Route element={<RoleProtectedRoute allowedRoles={REPORTS_ROLES} />}>
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
              <Route path="/search" element={<SearchPage />} />
              
              {/* Profile Page - if you want it */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* User management */}
              <Route element={<RoleProtectedRoute allowedRoles={['system_admin', 'admin', 'director']} />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>

              {/* Admin-only Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['system_admin', 'admin']} />}>
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>
          
          {/* Redirect to dashboard for any other route for now */}
          <Route path="*" element={<RoleBasedHomeRedirect />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App