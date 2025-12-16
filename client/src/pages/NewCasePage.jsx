// src/pages/NewCasePage.jsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../api/index' // ✅ FIXED: Correct import path
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const NewCasePage = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [users, setUsers] = useState([])
  const [formErrors, setFormErrors] = useState({})

  // Case Form State
  const [caseData, setCaseData] = useState({
    case_title: '',
    case_description: '',
    abuse_type: 'other',
    priority: 'medium',
    severity: 'medium',
    location: '',
    incident_date: null,
    reporting_date: new Date(),
    status: 'reported',
    assigned_to: '',
    follow_up_date: null,
    resolution_details: '',
    notes: '',
  })

  const steps = [
    'Case Information',
    'Review & Submit'
  ]

  // Fetch users for assignment
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      console.log('Users API response:', response)
      
      // ✅ Handle different response structures
      let usersData = []
      if (Array.isArray(response)) {
        usersData = response
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          usersData = response.data.data
        }
      }
      
      // Filter to get focal persons and directors
      const focalPersons = usersData.filter(user => 
        user.role === 'focal_person' || user.role === 'director' || user.role === 'system_admin'
      )
      setUsers(focalPersons)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users for assignment')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Validation function
  const validateStep = () => {
    const errors = {}
    
    if (activeStep === 0) {
      if (!caseData.case_title.trim()) {
        errors.case_title = 'Case title is required'
      }
      if (caseData.case_title.length > 255) {
        errors.case_title = 'Case title must be less than 255 characters'
      }
      if (!caseData.abuse_type) {
        errors.abuse_type = 'Abuse type is required'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleCaseChange = (e) => {
    const { name, value } = e.target
    setCaseData({
      ...caseData,
      [name]: value
    })
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleDateChange = (name, date) => {
    setCaseData({
      ...caseData,
      [name]: date
    })
  }

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date) => {
    if (!date) return null
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) return null
      return d.toISOString().split('T')[0]
    } catch (error) {
      console.error('Error formatting date:', error)
      return null
    }
  }

  // Format datetime for API
  const formatDateTimeForAPI = (date) => {
    if (!date) return null
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) return null
      return d.toISOString()
    } catch (error) {
      console.error('Error formatting datetime:', error)
      return null
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Prepare data for submission
      const submitData = {
        case_title: caseData.case_title,
        case_description: caseData.case_description || null,
        abuse_type: caseData.abuse_type,
        priority: caseData.priority,
        severity: caseData.severity,
        location: caseData.location || null,
        incident_date: formatDateForAPI(caseData.incident_date),
        reporting_date: formatDateTimeForAPI(caseData.reporting_date),
        status: caseData.status,
        assigned_to: caseData.assigned_to || null,
        follow_up_date: formatDateForAPI(caseData.follow_up_date),
        resolution_details: caseData.resolution_details || null,
        notes: caseData.notes || null,
      }

      console.log('Submitting case data:', submitData)

      // Create the case
      const response = await api.post('/cases', submitData)
      console.log('Case creation response:', response)
      
      setSuccess('Case created successfully! Redirecting to cases list...')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/cases')
      }, 2000)

    } catch (err) {
      console.error('Error creating case:', err)
      
      // Handle Laravel validation errors
      if (err.errors) {
        const validationErrors = err.errors
        const errorMessages = Object.values(validationErrors).flat().join(', ')
        setError(`Validation errors: ${errorMessages}`)
      } else if (err.status === 409) {
        setError(err.message || 'Conflict. Please check your input and try again.')
      } else if (err.status === 401) {
        setError('Session expired. Please login again.')
        setTimeout(() => navigate('/login'), 2000)
      } else if (err.status === 422) {
        setError('Validation error. Please check all required fields.')
      } else if (err.status === 404) {
        setError('Cases API endpoint not found. Please check your Laravel routes.')
      } else {
        setError(err.message || 'Failed to create case. Please check all required fields.')
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Case Title *"
                name="case_title"
                value={caseData.case_title}
                onChange={handleCaseChange}
                required
                error={!!formErrors.case_title}
                helperText={formErrors.case_title || "Brief descriptive title for the case"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Case Description"
                name="case_description"
                value={caseData.case_description}
                onChange={handleCaseChange}
                multiline
                rows={4}
                helperText="Detailed description of the case"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!formErrors.abuse_type}>
                <InputLabel>Abuse Type *</InputLabel>
                <Select
                  name="abuse_type"
                  value={caseData.abuse_type}
                  onChange={handleCaseChange}
                  label="Abuse Type *"
                >
                  <MenuItem value="sexual_abuse">Sexual Abuse</MenuItem>
                  <MenuItem value="physical_abuse">Physical Abuse</MenuItem>
                  <MenuItem value="emotional_abuse">Emotional Abuse</MenuItem>
                  <MenuItem value="neglect">Neglect</MenuItem>
                  <MenuItem value="exploitation">Exploitation</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formErrors.abuse_type && (
                  <Typography variant="caption" color="error">
                    {formErrors.abuse_type}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={caseData.priority}
                  onChange={handleCaseChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={caseData.severity}
                  onChange={handleCaseChange}
                  label="Severity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={caseData.status}
                  onChange={handleCaseChange}
                  label="Status"
                >
                  <MenuItem value="reported">Reported</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="under_investigation">Under Investigation</MenuItem>
                  <MenuItem value="investigation">Investigation</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="reopened">Reopened</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={caseData.location}
                onChange={handleCaseChange}
                helperText="Where the incident occurred"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Incident Date"
                value={caseData.incident_date}
                onChange={(date) => handleDateChange('incident_date', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    helperText: "Date when the incident occurred"
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Reporting Date"
                value={caseData.reporting_date}
                onChange={(date) => handleDateChange('reporting_date', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    helperText: "Date when the case was reported"
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Follow-up Date"
                value={caseData.follow_up_date}
                onChange={(date) => handleDateChange('follow_up_date', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    helperText: "Optional follow-up date"
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  name="assigned_to"
                  value={caseData.assigned_to}
                  onChange={handleCaseChange}
                  label="Assigned To"
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.role?.replace('_', ' ')})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={caseData.notes}
                onChange={handleCaseChange}
                multiline
                rows={3}
                helperText="Additional notes or observations"
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all information before submitting.
            </Alert>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Case Information Summary
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Title:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {caseData.case_title || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Abuse Type:</Typography>
                  <Typography variant="body1">
                    {caseData.abuse_type === 'sexual_abuse' ? 'Sexual Abuse' :
                     caseData.abuse_type === 'physical_abuse' ? 'Physical Abuse' :
                     caseData.abuse_type === 'emotional_abuse' ? 'Emotional Abuse' :
                     caseData.abuse_type === 'neglect' ? 'Neglect' :
                     caseData.abuse_type === 'exploitation' ? 'Exploitation' : 'Other'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Priority:</Typography>
                  <Chip 
                    label={caseData.priority?.toUpperCase()}
                    color={
                      caseData.priority === 'critical' ? 'error' :
                      caseData.priority === 'high' ? 'warning' :
                      caseData.priority === 'medium' ? 'info' : 'success'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Severity:</Typography>
                  <Chip 
                    label={caseData.severity?.toUpperCase()}
                    color={
                      caseData.severity === 'critical' ? 'error' :
                      caseData.severity === 'high' ? 'warning' :
                      caseData.severity === 'medium' ? 'info' : 'success'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={
                      caseData.status === 'reported' ? 'Reported' :
                      caseData.status === 'assigned' ? 'Assigned' :
                      caseData.status === 'under_investigation' ? 'Under Investigation' :
                      caseData.status === 'investigation' ? 'Investigation' :
                      caseData.status === 'resolved' ? 'Resolved' :
                      caseData.status === 'closed' ? 'Closed' : 'Reopened'
                    }
                    color={
                      caseData.status === 'reported' ? 'error' :
                      caseData.status === 'assigned' ? 'warning' :
                      caseData.status === 'under_investigation' ? 'warning' :
                      caseData.status === 'investigation' ? 'info' :
                      caseData.status === 'resolved' ? 'success' :
                      caseData.status === 'closed' ? 'default' : 'warning'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Location:</Typography>
                  <Typography variant="body1">{caseData.location || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Incident Date:</Typography>
                  <Typography variant="body1">
                    {caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Reporting Date:</Typography>
                  <Typography variant="body1">
                    {new Date(caseData.reporting_date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Assigned To:</Typography>
                  <Typography variant="body1">
                    {caseData.assigned_to ? 
                      users.find(u => u.id === caseData.assigned_to)?.name || 'User not found' : 
                      'Unassigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1, borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {caseData.case_description || 'No description provided'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
            
            <Alert severity="warning">
              Once submitted, the case will be created in the system and you can add victims, perpetrators, and incidents to it.
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/cases')}
              sx={{ mr: 2 }}
            >
              Back to Cases
            </Button>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Register New Case
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complete all steps to register a new abuse case
              </Typography>
            </Box>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError('')}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => setError('')}
                >
                  Dismiss
                </Button>
              }
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                      sx={{ mr: 2, borderRadius: 2 }}
                    >
                      {index === steps.length - 1 ? 
                        (loading ? 'Creating Case...' : 'Create Case') : 
                        'Continue'
                      }
                    </Button>
                    {index > 0 && (
                      <Button
                        onClick={handleBack}
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                      >
                        Back
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Navigation */}
          {activeStep === steps.length && !success && (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Case Registration Complete!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The case has been successfully registered in the system.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/cases')}
                sx={{ borderRadius: 2 }}
              >
                View All Cases
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </LocalizationProvider>
  )
}

export default NewCasePage