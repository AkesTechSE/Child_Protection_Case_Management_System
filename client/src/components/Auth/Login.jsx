import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import ShieldIcon from '@mui/icons-material/Shield'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { setCredentials } from '../../store/authSlice'
import { authApi } from '../../api/auth'
import { getHomeRouteForRole } from '../../utils/constants'

const Login = () => {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(''), 3000)
    return () => clearTimeout(t)
  }, [error])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login...', { email })
      
      const data = await authApi.login({ email, password })
      if (!data?.user) {
        throw new Error('Invalid response format. User missing.')
      }

      // ✅ Use setCredentials (now available)
      // Store user in redux for role-based UI; token is not needed with cookies
      dispatch(setCredentials({ 
        user: data.user, 
        token: data.token || 'cookie-session' 
      }))
      
      console.log('Login successful!', { user: data.user.name })
      
      // Navigate to role-appropriate home
      navigate(getHomeRouteForRole(data.user?.role))
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check credentials and ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Test API connection
  const testApi = async () => {
    setLoading(true)
    try {
      console.log('Testing API connection...')
      
      // Test health endpoint first
      const healthResponse = await fetch('http://localhost:8000/api/health')
      const healthText = await healthResponse.text()
      const cleanHealthText = healthText.replace(/^\uFEFF/, '').replace(/^ï»¿/, '')
      
      let healthData
      try {
        healthData = JSON.parse(cleanHealthText)
      } catch (e) {
        throw new Error(`Health endpoint returned invalid JSON: ${cleanHealthText.substring(0, 100)}`)
      }
      
      console.log('Health check:', healthData)
      
      // Test login endpoint
      try {
        const loginData = await authApi.login({ email: 'admin@test.com', password: 'password123' })
        let message = `API Test Results:\n\n`
        message += `✅ Health Check: ${healthData.status || 'OK'}\n`
        message += `✅ Login Endpoint: 200\n`
        message += `✅ Cookie Session: Enabled\n`
        message += `✅ User: ${loginData.user?.name || 'None'}\n\n`
        message += `Full response in browser console`
        alert(message)
      } catch (e) {
        alert(`❌ Login Test Failed: ${e.message}`)
      }
      
    } catch (error) {
      console.error('API test error:', error)
      alert(`❌ API Test Failed:\n${error.message}\n\nMake sure:\n1. Laravel is running: php artisan serve\n2. Database is seeded\n3. CORS is configured`)
    } finally {
      setLoading(false)
    }
  }

  const checkStorage = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    let message = 'Local Storage Status:\n\n'
    message += `Token: ${token ? `✓ Present (${token.substring(0, 20)}...)` : '✗ Missing'}\n`
    
    if (user) {
      try {
        const userObj = JSON.parse(user)
        message += `User: ✓ ${userObj.name} (${userObj.email})\n`
        message += `Role: ${userObj.role}\n`
        message += `Authenticated: ${localStorage.getItem('token') ? 'Yes' : 'No'}`
      } catch (e) {
        message += `User: ✗ Invalid JSON`
      }
    } else {
      message += 'User: ✗ Missing'
    }
    
    alert(message)
  }

  const clearStorage = () => {
    localStorage.clear()
    alert('Local storage cleared! You will need to login again.')
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '85vh',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 460,
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <ShieldIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <LockIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
            </Box>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: '1.5rem',
                mb: 0.5,
                color: 'primary.main',
              }}
            >
              Child Protection System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Case Management & Reporting Portal
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }} 
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="email"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="current-password"
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 44,
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mt: 3,
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
          </Divider>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login