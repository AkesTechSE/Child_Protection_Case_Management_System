import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material'
import { authApi } from '../api/auth'
import { updateUser } from '../store/authSlice'

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Update profile
  const handleUpdateProfile = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const response = await authApi.updateProfile({ name, email })
      dispatch(updateUser(response))
      setMessage('Profile updated successfully')
    } catch (err) {
      // Show Laravel validation errors if available
      if (err.errors) {
        const messages = Object.values(err.errors).flat().join(' ')
        setError(messages)
      } else {
        setError(err.message || 'Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })
      setMessage('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err.errors) {
        const messages = Object.values(err.errors).flat().join(' ')
        setError(messages)
      } else {
        setError(err.message || 'Failed to change password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  value={user?.role?.replace('_', ' ') || ''}
                  disabled
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfilePage
