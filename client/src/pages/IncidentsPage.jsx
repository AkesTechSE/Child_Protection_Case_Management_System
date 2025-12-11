// src/pages/IncidentsPage.jsx
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  Link,
  MenuItem
} from '@mui/material'
import { 
  Add, 
  Visibility, 
  Edit, 
  Delete, 
  Search as SearchIcon,
  Description,
  LocationOn,
  CalendarToday,
  AccessTime,
  FileCopy,
  Refresh
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../hooks/useAuth'
import { incidentApi } from '../api/incidents'
import { caseApi } from '../api/cases'

const ABUSE_TYPE_OPTIONS = [
  { value: 'sexual_abuse', label: 'Sexual Abuse' },
  { value: 'physical_abuse', label: 'Physical Abuse' },
  { value: 'emotional_abuse', label: 'Emotional Abuse' },
  { value: 'neglect', label: 'Neglect' },
  { value: 'exploitation', label: 'Exploitation' },
  { value: 'other', label: 'Other' }
]

const LOCATION_TYPE_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'school', label: 'School' },
  { value: 'online', label: 'Online' },
  { value: 'public_place', label: 'Public Place' },
  { value: 'other', label: 'Other' }
]

const EMPTY_FORM = {
  id: undefined,
  case_id: '',
  report_datetime: '',
  incident_datetime: '',
  incident_end_datetime: '',
  location: '',
  location_type: 'home',
  abuse_type: 'physical_abuse',
  detailed_description: '',
  prior_reports_count: 0,
}

const IncidentsPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, isFocalPerson } = useAuth()
  const canModifyIncidents = isAdmin || isFocalPerson

  const toDateTimeInputValue = (value) => {
    if (!value) return ''
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : ''
  }

  const toServerDateTime = (value) => {
    if (!value) return null
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : null
  }

  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState(() => ({ ...EMPTY_FORM }))
  const [evidenceFiles, setEvidenceFiles] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [caseOptions, setCaseOptions] = useState([])
  const [caseLoading, setCaseLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    fetchIncidents()
    fetchCases()
  }, [isAuthenticated])

  const fetchCases = async () => {
    setCaseLoading(true)
    try {
      const { data } = await caseApi.getCases({ per_page: 100 })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setCaseOptions(list)
    } catch (err) {
      console.error('Failed to load cases', err)
    } finally {
      setCaseLoading(false)
    }
  }

  const fetchIncidents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await incidentApi.getIncidents()
      let incidentsData = []
      if (Array.isArray(response)) incidentsData = response
      else if (response?.data) {
        if (Array.isArray(response.data)) incidentsData = response.data
        else if (Array.isArray(response.data.data)) incidentsData = response.data.data
      }
      setIncidents(incidentsData)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to fetch incidents')
      setIncidents([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return
    try {
      await incidentApi.deleteIncident(id)
      setSuccess('Incident deleted successfully')
      fetchIncidents()
    } catch (err) {
      console.error(err)
      setError('Failed to delete incident')
    }
  }

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident)
    setOpenDialog(true)
  }

  const handleAddIncident = () => {
    setFormErrors({})
    setEvidenceFiles([])
    setFormData({ ...EMPTY_FORM })
    setFormOpen(true)
  }

  const handleEditIncident = (incident) => {
    setFormErrors({})
    setEvidenceFiles([])
    setFormData({
      ...EMPTY_FORM,
      ...incident,
      report_datetime: toDateTimeInputValue(incident.report_datetime),
      incident_datetime: toDateTimeInputValue(incident.incident_datetime),
      incident_end_datetime: toDateTimeInputValue(incident.incident_end_datetime)
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    setFormErrors({})
    setError('')
    try {
      const payload = {
        case_id: formData.case_id || '',
        report_datetime: toServerDateTime(formData.report_datetime) || '',
        incident_datetime: toServerDateTime(formData.incident_datetime) || '',
        incident_end_datetime: toServerDateTime(formData.incident_end_datetime) || '',
        location: formData.location,
        location_type: formData.location_type,
        abuse_type: formData.abuse_type,
        detailed_description: formData.detailed_description,
        prior_reports_count: Number(formData.prior_reports_count) || 0,
        evidence_files: evidenceFiles,
      }

      if (formData.id) {
        await incidentApi.updateIncident(formData.id, payload)
      } else {
        await incidentApi.createIncident(payload)
      }

      setSuccess(formData.id ? 'Incident updated' : 'Incident created')
      fetchIncidents()
      setFormOpen(false)
      setFormData({ ...EMPTY_FORM })
      setEvidenceFiles([])
    } catch (err) {
      console.error(err)
      const validationErrors = err?.response?.data?.errors || err?.errors
      if (validationErrors) {
        setFormErrors(validationErrors)
        setError('Please fix the highlighted errors')
      } else {
        setError(err.message || 'Failed to save incident')
      }
    }
  }

  const getAbuseTypeLabel = (type) => {
    if (!type) return 'Unknown'
    const labels = {
      sexual_abuse: 'Sexual Abuse',
      physical_abuse: 'Physical Abuse',
      emotional_abuse: 'Emotional Abuse',
      neglect: 'Neglect',
      exploitation: 'Exploitation',
      other: 'Other'
    }
    return labels[type.toLowerCase()] || type.replace('_', ' ')
  }

  const getLocationTypeLabel = (type) => {
    if (!type) return 'Unknown'
    const labels = {
      home: 'Home',
      school: 'School',
      online: 'Online',
      public_place: 'Public Place',
      other: 'Other'
    }
    return labels[type.toLowerCase()] || type.replace('_', ' ')
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString()
  }

  const countEvidenceFiles = (evidenceFiles) => {
    if (!evidenceFiles) return 0
    try {
      if (Array.isArray(evidenceFiles)) return evidenceFiles.length
      if (typeof evidenceFiles === 'string') {
        const parsed = JSON.parse(evidenceFiles)
        return Array.isArray(parsed) ? parsed.length : 0
      }
      return 0
    } catch {
      return 0
    }
  }

  const getFieldError = (field) => {
    const value = formErrors?.[field]
    if (!value) return ''
    return Array.isArray(value) ? value.join(' ') : value
  }

  const filteredIncidents = incidents.filter(incident => {
    if (!incident) return false
    const term = searchTerm.toLowerCase()
    const caseIdStr = incident.case_id ? `case-${incident.case_id}` : ''
    return (
      caseIdStr.toLowerCase().includes(term) ||
      (incident.location?.toLowerCase().includes(term)) ||
      (incident.abuse_type?.toLowerCase().includes(term)) ||
      (incident.location_type?.toLowerCase().includes(term)) ||
      (incident.detailed_description?.toLowerCase().includes(term))
    )
  })

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Incident Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchIncidents} disabled={loading}>
            Refresh
          </Button>
          {canModifyIncidents && <Button variant="contained" startIcon={<Add />} onClick={handleAddIncident}>New Incident</Button>}
        </Box>
      </Box>

      {/* Error / Success */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} message={success} />}

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by case, location, type, description..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        sx={{ mb: 3, borderRadius: 2 }}
      />

      {/* Incidents Table */}
      {loading && incidents.length === 0 ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:10 }}><CircularProgress /></Box>
      ) : filteredIncidents.length === 0 ? (
        <Paper sx={{ p:4, textAlign:'center', borderRadius:2 }}>
          <Description sx={{ fontSize:60, color:'text.secondary', mb:2 }} />
          <Typography>{incidents.length === 0 ? 'No incidents found' : 'No matching incidents'}</Typography>
          {canModifyIncidents && incidents.length === 0 && (
            <Button variant="contained" startIcon={<Add />} sx={{ mt:2 }} onClick={handleAddIncident}>Add First Incident</Button>
          )}
        </Paper>
      ) : (
        <Paper sx={{ overflow:'hidden', borderRadius:2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor:'grey.50' }}>
                <TableRow>
                  <TableCell>Case ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Location Type</TableCell>
                  <TableCell>Abuse Type</TableCell>
                  <TableCell>Prior Reports</TableCell>
                  <TableCell>Evidence</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncidents.map(incident => (
                  <TableRow key={incident.id} hover>
                    <TableCell>{incident.case_id ? `CASE-${incident.case_id}` : 'No Case'}</TableCell>
                    <TableCell>{formatDateTime(incident.incident_datetime)}</TableCell>
                    <TableCell>{incident.location || 'N/A'}</TableCell>
                    <TableCell>{getLocationTypeLabel(incident.location_type)}</TableCell>
                    <TableCell>{getAbuseTypeLabel(incident.abuse_type)}</TableCell>
                    <TableCell>{incident.prior_reports_count || 0}</TableCell>
                    <TableCell>{countEvidenceFiles(incident.evidence_files)} file(s)</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary" onClick={() => handleViewIncident(incident)}><Visibility fontSize="small" /></IconButton>
                      </Tooltip>
                      {canModifyIncidents && <>
                        <Tooltip title="Edit Incident">
                          <IconButton size="small" color="secondary" onClick={() => handleEditIncident(incident)}><Edit fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Incident">
                          <IconButton size="small" color="error" onClick={() => handleDeleteIncident(incident.id)}><Delete fontSize="small" /></IconButton>
                        </Tooltip>
                      </>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* View Incident Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        {selectedIncident && (
          <>
            <DialogTitle>Incident Details - Case {selectedIncident.case_id || 'No Case'}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Incident Date</Typography>
                  <Typography>{formatDateTime(selectedIncident.incident_datetime)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography>{selectedIncident.location || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Location Type</Typography>
                  <Typography>{getLocationTypeLabel(selectedIncident.location_type)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Abuse Type</Typography>
                  <Typography>{getAbuseTypeLabel(selectedIncident.abuse_type)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Paper sx={{ p:2, bgcolor:'grey.50', borderRadius:1 }}>
                    <Typography sx={{ whiteSpace:'pre-wrap' }}>{selectedIncident.detailed_description || 'No description'}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Evidence Files</Typography>
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:1, mt:1 }}>
                    {Array.isArray(selectedIncident.evidence_files) && selectedIncident.evidence_files.map((file, idx) => (
                      <Link key={idx} href={file.url || '#'} target="_blank" underline="hover">
                        <Chip label={file.name || `File ${idx+1}`} size="small" />
                      </Link>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {canModifyIncidents && <Button variant="contained" onClick={() => { handleEditIncident(selectedIncident); setOpenDialog(false) }}>Edit</Button>}
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{formData.id ? 'Edit Incident' : 'Add New Incident'}</DialogTitle>
        <DialogContent sx={{ mt:1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Associated Case"
                value={formData.case_id || ''}
                onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                helperText={getFieldError('case_id') || 'Choose the case this incident belongs to'}
                error={!!getFieldError('case_id')}
              >
                <MenuItem value="">No related case</MenuItem>
                {caseLoading && <MenuItem value="__loading" disabled>Loading cases...</MenuItem>}
                {caseOptions.map((caseItem) => (
                  <MenuItem key={caseItem.id} value={caseItem.id}>
                    {`CASE-${caseItem.id}`}{caseItem.case_number ? ` • ${caseItem.case_number}` : ''}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Date"
                type="datetime-local"
                value={formData.report_datetime || ''}
                onChange={(e) => setFormData({ ...formData, report_datetime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText={getFieldError('report_datetime')}
                error={!!getFieldError('report_datetime')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Incident Start"
                type="datetime-local"
                value={formData.incident_datetime || ''}
                onChange={(e) => setFormData({ ...formData, incident_datetime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText={getFieldError('incident_datetime')}
                error={!!getFieldError('incident_datetime')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Incident End"
                type="datetime-local"
                value={formData.incident_end_datetime || ''}
                onChange={(e) => setFormData({ ...formData, incident_end_datetime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText={getFieldError('incident_end_datetime')}
                error={!!getFieldError('incident_end_datetime')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                helperText={getFieldError('location')}
                error={!!getFieldError('location')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Location Type"
                value={formData.location_type || ''}
                onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                helperText={getFieldError('location_type')}
                error={!!getFieldError('location_type')}
              >
                {LOCATION_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Abuse Type"
                value={formData.abuse_type || ''}
                onChange={(e) => setFormData({ ...formData, abuse_type: e.target.value })}
                helperText={getFieldError('abuse_type')}
                error={!!getFieldError('abuse_type')}
              >
                {ABUSE_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Detailed Description"
                value={formData.detailed_description || ''}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                helperText={getFieldError('detailed_description')}
                error={!!getFieldError('detailed_description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prior Reports Count"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.prior_reports_count}
                onChange={(e) => setFormData({ ...formData, prior_reports_count: e.target.value })}
                helperText={getFieldError('prior_reports_count')}
                error={!!getFieldError('prior_reports_count')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Evidence
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(event) => setEvidenceFiles(Array.from(event.target.files || []))}
                />
              </Button>
              {evidenceFiles.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {evidenceFiles.length} file(s) selected
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>{formData.id ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default IncidentsPage
