// src/pages/CasesPage.jsx
import React, { useEffect, useMemo, useState } from 'react'
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Chip, Menu, MenuItem,
  Alert, CircularProgress, InputAdornment
} from '@mui/material'
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, MoreVert as MoreIcon,
  Search as SearchIcon, Refresh as RefreshIcon, Download as DownloadIcon
} from '@mui/icons-material'
import { caseApi } from '../api/cases'
import { useAuth } from '../hooks/useAuth'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const CaseForm = ({ initialData = null, onCancel, onSaved }) => {
  const dedupeSelectedFiles = (files) => {
    const list = Array.isArray(files) ? files : []
    const unique = []
    const seen = new Set()

    for (const file of list) {
      if (!file) continue
      const name = typeof file.name === 'string' ? file.name : ''
      const size = typeof file.size === 'number' ? file.size : ''
      const key = `${name}::${size}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(file)
    }

    return unique
  }

  const toDateTimeInputValue = (value) => {
    if (!value) return ''
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : ''
  }

  const [form, setForm] = useState({
    case_number: initialData?.case_number || '',
    case_title: initialData?.case_title || '',
    case_description: initialData?.case_description || '',
    abuse_type: initialData?.abuse_type || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'reported',
    location: initialData?.location || '',
    // Merged incident fields
    report_datetime: toDateTimeInputValue(initialData?.report_datetime || initialData?.reporting_date),
    incident_datetime: toDateTimeInputValue(initialData?.incident_datetime || initialData?.incident_date),
    incident_end_datetime: toDateTimeInputValue(initialData?.incident_end_datetime),
    location_type: initialData?.location_type || 'home',
    prior_reports_count: initialData?.prior_reports_count ?? 0,
  })
  const [evidenceFiles, setEvidenceFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        prior_reports_count: form.prior_reports_count === '' ? null : Number(form.prior_reports_count),
      }

      if (initialData) {
        const { data, error } = await caseApi.updateCase(initialData.id, payload)
        if (error) throw error
        if (evidenceFiles.length) {
          const up = await caseApi.uploadAttachments(initialData.id, evidenceFiles)
          if (up?.error) throw up.error
        }
        onSaved(data)
      } else {
        const { data, error } = await caseApi.createCase(payload)
        if (error) throw error
        if (evidenceFiles.length && data?.id) {
          const up = await caseApi.uploadAttachments(data.id, evidenceFiles)
          if (up?.error) throw up.error
        }
        onSaved(data)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save case')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{initialData ? 'Edit Case' : 'Create Case'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Case Number" name="case_number" fullWidth value={form.case_number} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Title" name="case_title" fullWidth value={form.case_title} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="case_description" fullWidth multiline rows={3} value={form.case_description} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
  select 
  label="የጥቃት ዓይነት (Abuse Type)" 
  name="abuse_type" 
  fullWidth 
  value={form.abuse_type} 
  onChange={handleChange} 
  required
>
  
  <MenuItem value="sexual_abuse">ጾታዊ ጥቃት (Sexual Abuse)</MenuItem>
  <MenuItem value="physical_abuse">አካላዊ ጥቃት (Physical Abuse)</MenuItem>
  <MenuItem value="emotional_abuse">ስነልቦና ጥቃት (Psychological/Emotional Abuse)</MenuItem>
  <MenuItem value="neglect">ቸልተኝነት (Neglect)</MenuItem>
  <MenuItem value="exploitation">የሕጻናት ጉልበት ብዝበዛ (Child Labour/Exploitation)</MenuItem>
  <MenuItem value="abduction">ጠለፋ (Abduction)</MenuItem>
  <MenuItem value="early_marriage">ያለዕድሜ ጋብቻ (Early Marriage)</MenuItem>
  <MenuItem value="trafficking">የሕጻናት ዝውውር (Trafficking)</MenuItem>
  <MenuItem value="abandonment">ሕጻናትን መጣል (Abandonment)</MenuItem>
  <MenuItem value="other">ሌሎች (Other)</MenuItem>
</TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Priority" name="priority" fullWidth value={form.priority} onChange={handleChange}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Status" name="status" fullWidth value={form.status} onChange={handleChange}>
              <MenuItem value="reported">Reported</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="under_investigation">Under Investigation</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Location" name="location" fullWidth value={form.location} onChange={handleChange} />
          </Grid>

          {/* Incident (merged) */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Incident (one per case)</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Report Date/Time"
              name="report_datetime"
              type="datetime-local"
              fullWidth
              value={form.report_datetime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Incident Date/Time"
              name="incident_datetime"
              type="datetime-local"
              fullWidth
              value={form.incident_datetime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Incident End Date/Time"
              name="incident_end_datetime"
              type="datetime-local"
              fullWidth
              value={form.incident_end_datetime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Location Type"
              name="location_type"
              fullWidth
              value={form.location_type}
              onChange={handleChange}
            >
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="public_place">Public Place</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Prior Reports Count"
              name="prior_reports_count"
              type="number"
              fullWidth
              value={form.prior_reports_count}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={`Evidence files (${evidenceFiles.length} file(s))`}
              type="file"
              fullWidth
              inputProps={{ multiple: true }}
              onChange={(e) => {
                const next = dedupeSelectedFiles(Array.from(e.target.files || []))
                setEvidenceFiles(next)
                e.target.value = ''
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving...' : (initialData ? 'Update' : 'Create')}</Button>
      </DialogActions>
    </form>
  )
}

const CasesPage = () => {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { id: paramId } = useParams()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('q') || ''
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuCase, setMenuCase] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [editingCase, setEditingCase] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewCase, setViewCase] = useState(null)

  const loadCases = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await caseApi.getCases({ per_page: 100 })
      if (error) throw error
      // handle paginated response to array
      const arr = Array.isArray(data) ? data : (data?.data || [])
      setCases(arr)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load cases')
      setCases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isAuthenticated) loadCases() }, [isAuthenticated])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const term = params.get('q') || ''
    setSearch(term)
  }, [location.search])

  // Open view dialog when route param /cases/:id is present
  useEffect(() => {
    const load = async () => {
      if (!paramId) {
        setViewOpen(false)
        setViewCase(null)
        return
      }
      try {
        const { data, error } = await caseApi.getCase(paramId)
        if (error) throw error
        setViewCase(data)
        setViewOpen(true)
      } catch (e) {
        setError(e?.message || 'Failed to load case')
        setViewOpen(false)
        setViewCase(null)
      }
    }
    load()
  }, [paramId])

  const filteredCases = useMemo(() => {
    if (!search) return cases
    const term = search.toLowerCase()
    return cases.filter((c) =>
      [c.case_title, c.case_number, c.abuse_type, c.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    )
  }, [cases, search])

  const handleOpenMenu = (e, c) => { setAnchorEl(e.currentTarget); setMenuCase(c) }
  const handleCloseMenu = () => { setAnchorEl(null); setMenuCase(null) }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete case?')) return
    try {
      const { error } = await caseApi.deleteCase(id)
      if (error) throw error
      await loadCases()
    } catch (err) { alert(err.response?.data?.message || err.message || 'Delete failed') }
  }

  const downloadEvidenceFile = async (caseId, fileMeta) => {
    try {
      const filename = typeof fileMeta === 'string' ? fileMeta : fileMeta?.filename
      const originalName = typeof fileMeta === 'string' ? fileMeta : (fileMeta?.original_name || fileMeta?.name || fileMeta?.filename)
      if (!filename) return

      const res = await caseApi.downloadAttachment(caseId, filename)
      if (res?.error) throw res.error
      const blob = res?.data instanceof Blob ? res.data : new Blob([res?.data])

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = originalName || filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download evidence', err)
      alert(err?.message || 'Failed to download evidence file')
    }
  }

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h4">Cases</Typography>
        <Box>
          <TextField size="small" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment> }} sx={{ mr:2 }} />
          <Button variant="outlined" onClick={loadCases} startIcon={<RefreshIcon/>} sx={{ mr:1 }}>Refresh</Button>
          <Button variant="contained" startIcon={<AddIcon/>} onClick={() => { setEditingCase(null); setOpenForm(true) }}>New Case</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ textAlign:'center', py:8 }}><CircularProgress/></Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Case #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cases.filter(c => !search || (c.case_title||'').toLowerCase().includes(search.toLowerCase()) || (c.case_number||'').toLowerCase().includes(search.toLowerCase())).map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.case_number || `CASE-${c.id}`}</TableCell>
                    <TableCell>{c.case_title}</TableCell>
                    <TableCell>
                      {c.abuse_type ? <Chip label={c.abuse_type.replace('_',' ')} size="small" /> : null}
                    </TableCell>
                    <TableCell><Chip label={(c.priority||'medium').toUpperCase()} size="small" /></TableCell>
                    <TableCell>
                      {c.status ? <Chip label={c.status.replace('_',' ')} size="small" /> : null}
                    </TableCell>
                    <TableCell>{c.location || ''}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e)=>handleOpenMenu(e,c)}><MoreIcon/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={()=>{ if(menuCase?.id){ navigate(`/cases/${menuCase.id}`) } handleCloseMenu() }}>View</MenuItem>
        <MenuItem onClick={()=>{ setEditingCase(menuCase); setOpenForm(true); handleCloseMenu() }}>Edit</MenuItem>
        <MenuItem onClick={()=>{ handleDelete(menuCase?.id); handleCloseMenu() }} sx={{ color:'error.main' }}>Delete</MenuItem>
      </Menu>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <CaseForm initialData={editingCase} onCancel={() => setOpenForm(false)} onSaved={() => { setOpenForm(false); loadCases() }} />
      </Dialog>

      {/* View Case Dialog */}
      <Dialog open={viewOpen} onClose={() => { setViewOpen(false); navigate('/cases', { replace: true }) }} fullWidth maxWidth="sm">
        <DialogTitle>Case Details</DialogTitle>
        <DialogContent dividers>
          {viewCase ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Case Number</Typography><Typography>{viewCase.case_number || `CASE-${viewCase.id}`}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Title</Typography><Typography>{viewCase.case_title || ''}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Description</Typography><Typography sx={{ whiteSpace:'pre-wrap' }}>{viewCase.case_description || ''}</Typography></Grid>
              <Grid item xs={12} md={4}><Typography variant="subtitle2">Type</Typography>{viewCase.abuse_type ? <Chip label={viewCase.abuse_type.replace('_',' ')} size="small" /> : null}</Grid>
              <Grid item xs={12} md={4}><Typography variant="subtitle2">Priority</Typography><Chip label={(viewCase.priority||'medium').toUpperCase()} size="small" /></Grid>
              <Grid item xs={12} md={4}><Typography variant="subtitle2">Status</Typography>{viewCase.status ? <Chip label={viewCase.status.replace('_',' ')} size="small" /> : null}</Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Location</Typography><Typography>{viewCase.location || ''}</Typography></Grid>

              <Grid item xs={12}><Typography variant="subtitle2" sx={{ mt: 1 }}>Incident (merged)</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Report Date/Time</Typography><Typography>{viewCase.report_datetime || viewCase.reporting_date || ''}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Incident Date/Time</Typography><Typography>{viewCase.incident_datetime || viewCase.incident_date || ''}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Incident End</Typography><Typography>{viewCase.incident_end_datetime || ''}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Location Type</Typography><Typography>{viewCase.location_type || ''}</Typography></Grid>
              <Grid item xs={12} md={6}><Typography variant="subtitle2">Prior Reports</Typography><Typography>{viewCase.prior_reports_count ?? ''}</Typography></Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Evidence Files</Typography>
                {Array.isArray(viewCase.evidence_files) && viewCase.evidence_files.length ? (
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {viewCase.evidence_files.map((f, idx) => {
                      const label = typeof f === 'string' ? f : (f?.original_name || f?.filename || `file-${idx + 1}`)
                      return (
                        <Box key={`${label}-${idx}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{label}</Typography>
                          <IconButton size="small" onClick={() => downloadEvidenceFile(viewCase.id, f)} aria-label="download">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2">No evidence files</Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ py:4, textAlign:'center' }}><CircularProgress/></Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setViewOpen(false); navigate('/cases', { replace: true }) }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CasesPage
