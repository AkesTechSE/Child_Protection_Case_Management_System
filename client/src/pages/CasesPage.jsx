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
  Search as SearchIcon, Refresh as RefreshIcon
} from '@mui/icons-material'
import { caseApi } from '../api/cases'
import { useAuth } from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

const CaseForm = ({ initialData = null, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    case_number: initialData?.case_number || '',
    case_title: initialData?.case_title || '',
    case_description: initialData?.case_description || '',
    abuse_type: initialData?.abuse_type || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'reported',
    location: initialData?.location || ''
  })
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
      if (initialData) {
        const { data, error } = await caseApi.updateCase(initialData.id, form)
        if (error) throw error
        onSaved(data)
      } else {
        const { data, error } = await caseApi.createCase(form)
        if (error) throw error
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
            <TextField select label="Abuse Type" name="abuse_type" fullWidth value={form.abuse_type} onChange={handleChange} required>
              <MenuItem value="sexual_abuse">Sexual Abuse</MenuItem>
              <MenuItem value="physical_abuse">Physical Abuse</MenuItem>
              <MenuItem value="emotional_abuse">Emotional Abuse</MenuItem>
              <MenuItem value="neglect">Neglect</MenuItem>
              <MenuItem value="exploitation">Exploitation</MenuItem>
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
                    <TableCell><Chip label={c.abuse_type?.replace('_',' ') || 'N/A'} size="small" /></TableCell>
                    <TableCell><Chip label={(c.priority||'medium').toUpperCase()} size="small" /></TableCell>
                    <TableCell><Chip label={c.status?.replace('_',' ') || 'N/A'} size="small" /></TableCell>
                    <TableCell>{c.location || 'N/A'}</TableCell>
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
        <MenuItem onClick={()=>{ window.location.href=`/cases/${menuCase?.id}`; handleCloseMenu() }}>View</MenuItem>
        <MenuItem onClick={()=>{ setEditingCase(menuCase); setOpenForm(true); handleCloseMenu() }}>Edit</MenuItem>
        <MenuItem onClick={()=>{ handleDelete(menuCase?.id); handleCloseMenu() }} sx={{ color:'error.main' }}>Delete</MenuItem>
      </Menu>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <CaseForm initialData={editingCase} onCancel={() => setOpenForm(false)} onSaved={() => { setOpenForm(false); loadCases() }} />
      </Dialog>
    </Box>
  )
}

export default CasesPage
