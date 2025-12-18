import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleProtectedRoute