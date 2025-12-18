import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { authApi } from '../api/auth'
import { updateUser } from '../store/authSlice'

const PREFERENCES_STORAGE_KEY = 'cpms_notification_preferences'
const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  escalationAlerts: true,
}

const Settings = () => {
  const dispatch = useDispatch()
  const { getUserName, isAdmin } = useAuth()

  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [initialProfile, setInitialProfile] = useState(null)
  const [profileErrors, setProfileErrors] = useState({})
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)

  const formatFieldError = (errors, field) => {
    const value = errors?.[field]
    if (!value) return ''
    return Array.isArray(value) ? value.join(' ') : value
  }

  const getPasswordFieldError = (field) => formatFieldError(passwordErrors, field)
  const getProfileFieldError = (field) => formatFieldError(profileErrors, field)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPreferences((prev) => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Unable to load stored preferences', error)
    }
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true)
      setProfileErrors({})
      try {
        const data = await authApi.getProfile()
        const nextProfile = {
          name: data?.name || '',
          email: data?.email || '',
        }
        setProfileForm(nextProfile)
        setInitialProfile(nextProfile)
      } catch (error) {
        setFeedback({ type: 'error', message: error.message || 'Unable to load profile information.' })
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [])

  const setAndStorePreferences = (nextPreferences) => {
    setPreferences(nextPreferences)
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(nextPreferences))
    } catch (error) {
      console.warn('Unable to save preferences locally', error)
    }
  }

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordErrors({})
    setFeedback({ type: '', message: '' })

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordErrors({ new_password_confirmation: 'Passwords do not match.' })
      return
    }

    try {
      setSubmitting(true)
      await authApi.changePassword(passwordForm)
      setFeedback({ type: 'success', message: 'Password updated successfully. You will need to log in again.' })
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (error) {
      if (error?.errors) {
        setPasswordErrors(error.errors)
      }
      setFeedback({ type: 'error', message: error.message || 'Failed to change password.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePreferenceToggle = (field) => (event) => {
    const updated = { ...preferences, [field]: event.target.checked }
    setAndStorePreferences(updated)
    setFeedback({ type: 'success', message: 'Notification preferences updated locally.' })
  }

  const handlePreferenceReset = () => {
    setAndStorePreferences(DEFAULT_PREFERENCES)
    setFeedback({ type: 'info', message: 'Notification preferences reset to defaults.' })
  }

  const handleProfileChange = (field) => (event) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleProfileReset = () => {
    if (initialProfile) {
      setProfileForm(initialProfile)
      setProfileErrors({})
    }
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setProfileErrors({})
    setFeedback({ type: '', message: '' })

    const payload = {}
    if (!initialProfile) {
      payload.name = profileForm.name
      payload.email = profileForm.email
    } else {
      if (profileForm.name !== initialProfile.name) payload.name = profileForm.name
      if (profileForm.email !== initialProfile.email) payload.email = profileForm.email
    }

    if (Object.keys(payload).length === 0) {
      setFeedback({ type: 'info', message: 'No profile changes detected.' })
      return
    }

    try {
      setProfileSubmitting(true)
      const updated = await authApi.updateProfile(payload)
      const nextProfile = {
        name: updated?.name || profileForm.name,
        email: updated?.email || profileForm.email,
      }
      setProfileForm(nextProfile)
      setInitialProfile(nextProfile)
      dispatch(updateUser(nextProfile))
      setFeedback({ type: 'success', message: 'Profile updated successfully.' })
    } catch (error) {
      if (error?.errors) {
        setProfileErrors(error.errors)
      }
      setFeedback({ type: 'error', message: error.message || 'Failed to update profile.' })
    } finally {
      setProfileSubmitting(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Settings
        </Typography>

        {!isAdmin && (
          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            You can update your profile and password below. Notification controls stay local on this device.
          </Alert>
        )}

        {feedback.message && (
          <Alert
            severity={feedback.type || 'info'}
            sx={{ mt: 2, mb: 3 }}
            onClose={() => setFeedback({ type: '', message: '' })}
          >
            {feedback.message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Signed in as {getUserName()}. Update your display name or email address below.
              </Typography>

              <Box component="form" onSubmit={handleProfileSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      required
                      value={profileForm.name}
                      onChange={handleProfileChange('name')}
                      disabled={profileLoading}
                      error={!!getProfileFieldError('name')}
                      helperText={getProfileFieldError('name')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={profileForm.email}
                      onChange={handleProfileChange('email')}
                      disabled={profileLoading}
                      error={!!getProfileFieldError('email')}
                      helperText={getProfileFieldError('email')}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={profileLoading || profileSubmitting}
                    >
                      {profileSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="text"
                      onClick={handleProfileReset}
                      disabled={profileLoading || profileSubmitting}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                For security reasons, choose a unique password with at least 8 characters.
              </Typography>

              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      type="password"
                      label="Current Password"
                      fullWidth
                      autoComplete="current-password"
                      value={passwordForm.current_password}
                      onChange={handlePasswordChange('current_password')}
                      error={!!getPasswordFieldError('current_password')}
                      helperText={getPasswordFieldError('current_password')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="password"
                      label="New Password"
                      fullWidth
                      autoComplete="new-password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange('new_password')}
                      error={!!getPasswordFieldError('new_password')}
                      helperText={getPasswordFieldError('new_password') || 'Minimum 8 characters'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="password"
                      label="Confirm New Password"
                      fullWidth
                      autoComplete="new-password"
                      value={passwordForm.new_password_confirmation}
                      onChange={handlePasswordChange('new_password_confirmation')}
                      error={!!getPasswordFieldError('new_password_confirmation')}
                      helperText={getPasswordFieldError('new_password_confirmation')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Customize how the system keeps you informed. Preferences are stored locally in your browser. Administrators can later sync them across the platform.
              </Typography>
              <Divider sx={{ my: 2 }} />
              {!isAdmin && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  These toggles only affect your view. An administrator must apply changes globally.
                </Alert>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceToggle('emailNotifications')}
                  />
                }
                label="Email alerts for new cases"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.smsNotifications}
                    onChange={handlePreferenceToggle('smsNotifications')}
                  />
                }
                label="SMS notifications for urgent incidents"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.escalationAlerts}
                    onChange={handlePreferenceToggle('escalationAlerts')}
                  />
                }
                label="Escalation alerts when cases remain unassigned"
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={handlePreferenceReset}>
                  Reset to defaults
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Preference syncing with the backend is planned in a future update.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Settings