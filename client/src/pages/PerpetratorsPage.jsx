// src/pages/PerpetratorsPage.jsx
import React, { useEffect, useState } from 'react'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, Typography, Grid, TextField, Select, MenuItem, FormControl,
  InputLabel, CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Alert, Chip, Tooltip, Checkbox, FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon,
  Search as SearchIcon, Refresh as RefreshIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../api/index'
import { caseApi } from '../api/cases'
import { victimApi } from '../api/victims'

/**
 * PerpetratorsPage
 * Full CRUD page for perpetrators with form dropdowns (cases, victims, abuse types, SNNPR addresses)
 */
const PerpetratorsPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isSystemAdmin, isAdmin, isFocalPerson } = useAuth()
  const canModify = isSystemAdmin || isAdmin || isFocalPerson

  const [perpetrators, setPerpetrators] = useState([])
  const [cases, setCases] = useState([])
  const [victims, setVictims] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // SNNPR sample list — expand if needed
  const SNNPR_REGIONS = [
    'Arba Minch', 'Hawassa', 'Bonga', 'Wolaita Sodo', 'Dilla', 'Konso',
    'Jinka', 'Mizan Teferi', 'Sodo Zuria', 'Bale', 'Keffa', 'Bench Maji'
  ]

  const ABUSE_TYPES = [
    { value: 'sexual_abuse', label: 'Sexual Abuse' },
    { value: 'physical_abuse', label: 'Physical Abuse' },
    { value: 'emotional_abuse', label: 'Emotional Abuse' },
    { value: 'neglect', label: 'Neglect' },
    { value: 'exploitation', label: 'Exploitation' },
    { value: 'other', label: 'Other' },
  ]

  const RELATIONSHIP_OPTIONS = [
    'Parent',
    'Stepparent',
    'Grandparent',
    'Relative',
    'Babysitter',
    'Teacher',
    'Stranger',
  ]

  useEffect(() => {
    // load everything
    const init = async () => {
      setPageLoading(true)
      await Promise.all([fetchPerpetrators(), fetchCases(), fetchVictims()])
      setPageLoading(false)
    }
    if (isAuthenticated) init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // ---------- Fetch functions ----------
  const fetchPerpetrators = async () => {
    setLoading(true)
    setError('')
    try {
      const params = searchTerm ? { search: searchTerm } : {}
      const res = await api.get('/perpetrators', { params })
      // support paginated or raw array response
      let data = []
      if (Array.isArray(res)) data = res
      else if (res?.data && Array.isArray(res.data)) data = res.data
      else if (res?.data?.data && Array.isArray(res.data.data)) data = res.data.data
      else data = []
      setPerpetrators(data)
    } catch (err) {
      console.error('fetchPerpetrators error', err)
      setError(err.message || 'Failed to fetch perpetrators')
      setPerpetrators([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCases = async () => {
    try {
      const res = await caseApi.getCases({ per_page: 200 })
      let data = []
      if (Array.isArray(res)) data = res
      else if (res?.data && Array.isArray(res.data)) data = res.data
      else if (res?.data?.data && Array.isArray(res.data.data)) data = res.data.data
      setCases(data)
    } catch (err) {
      console.error('fetchCases error', err)
      setError(prev => prev || 'Failed to fetch cases')
      setCases([])
    }
  }

  const fetchVictims = async () => {
    try {
      const res = await victimApi.getVictims({ per_page: 500 })
      let data = []
      if (Array.isArray(res)) data = res
      else if (res?.data && Array.isArray(res.data)) data = res.data
      else if (res?.data?.data && Array.isArray(res.data.data)) data = res.data.data
      setVictims(data)
    } catch (err) {
      console.error('fetchVictims error', err)
      setError(prev => prev || 'Failed to fetch victims')
      setVictims([])
    }
  }

  // ---------- CRUD handlers ----------
  const handleOpenCreate = () => {
    setSelected(null)
    setOpenForm(true)
  }

  const handleOpenEdit = (item) => {
    setSelected(item)
    setOpenForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete perpetrator? This cannot be undone.')) return
    try {
      setSubmitting(true)
      await api.delete(`/perpetrators/${id}`)
      setSuccess('Perpetrator deleted')
      await fetchPerpetrators()
    } catch (err) {
      console.error('delete error', err)
      setError(err.message || 'Failed to delete')
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = (item) => {
    setViewItem(item)
    setViewOpen(true)
  }

  const handleSubmitForm = async (formData) => {
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      // Normalize payload for backend
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender || null,
        age: formData.age ? Number(formData.age) : null,
        date_of_birth: formData.date_of_birth || null,
        contact_number: formData.contact_number || null,
        address: formData.address || null,
        region: formData.region || null,
        occupation: formData.occupation || null,
        relationship_to_victim: formData.relationship_to_victim || null,
        fan_number: formData.fan_number || null,
        fin_number: formData.fin_number || null,
        description: formData.description || null,
        case_id: formData.case_id || null,
        victim_id: formData.victim_id || null,
        abuse_type: formData.abuse_type || null,
        previous_records: !!formData.previous_records,
        additional_info: formData.additional_info || null,
      }

      if (selected && selected.id) {
        // update
        await api.put(`/perpetrators/${selected.id}`, payload)
        setSuccess('Perpetrator updated')
      } else {
        // create
        await api.post('/perpetrators', payload)
        setSuccess('Perpetrator created')
      }
      setOpenForm(false)
      setSelected(null)
      await fetchPerpetrators()
    } catch (err) {
      console.error('submit error', err)
      const msg = err?.message || err?.data?.message || 'Failed to save perpetrator'
      setError(msg)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- Filtering ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPerpetrators()
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // ---------- UI helpers ----------
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A')
  const calcAge = (dob) => {
    if (!dob) return null
    const b = new Date(dob); const t = new Date()
    let age = t.getFullYear() - b.getFullYear()
    const m = t.getMonth() - b.getMonth()
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--
    return age
  }

  // ---------- Perpetrator Form Component ----------
  const PerpForm = ({ initial = {}, onCancel, onSubmit }) => {
    const normalizeRelationship = (value) => {
      if (!value) return ''
      const match = RELATIONSHIP_OPTIONS.find(
        (option) => option.toLowerCase() === value.toLowerCase()
      )
      return match || value
    }

    const [form, setForm] = useState({
      first_name: initial.first_name || '',
      last_name: initial.last_name || '',
      gender: initial.gender || '',
      age: initial.age || '',
      date_of_birth: initial.date_of_birth || '',
      contact_number: initial.contact_number || '',
      address: initial.address || '',
      region: initial.region || '',
      occupation: initial.occupation || '',
      relationship_to_victim: normalizeRelationship(initial.relationship_to_victim),
      fan_number: initial.fan_number || '',
      fin_number: initial.fin_number || '',
      description: initial.description || '',
      case_id: initial.case_id || '',
      victim_id: initial.victim_id || '',
      abuse_type: initial.abuse_type || '',
      previous_records: !!initial.previous_records,
      additional_info: initial.additional_info || '',
    })
    const [localError, setLocalError] = useState('')

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setLocalError('')
      // simple validation
      if (!form.first_name || !form.last_name) {
        setLocalError('First and last name are required')
        return
      }
      try {
        await onSubmit(form)
      } catch (err) {
        setLocalError(err?.message || 'Failed to save')
      }
    }

    return (
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initial?.id ? 'Edit Perpetrator' : 'Add Perpetrator'}</DialogTitle>
        <DialogContent dividers>
          {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField name="first_name" label="First name" value={form.first_name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="last_name" label="Last name" value={form.last_name} onChange={handleChange} fullWidth required />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" label="Gender" name="gender" value={form.gender} onChange={handleChange}>
                  <MenuItem value="">--</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="prefer_not_to_disclose">Prefer not to disclose</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField name="age" label="Age" value={form.age} onChange={handleChange} type="number" fullWidth />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField name="date_of_birth" label="Date of birth" value={form.date_of_birth} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="contact_number" label="Phone" value={form.contact_number} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="case-label">Case</InputLabel>
                <Select labelId="case-label" label="Case" name="case_id" value={form.case_id} onChange={handleChange}>
                  <MenuItem value="">Unassigned</MenuItem>
                  {cases.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.case_number ? `${c.case_number} — ${c.case_title}` : c.case_title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="victim-label">Victim</InputLabel>
                <Select labelId="victim-label" label="Victim" name="victim_id" value={form.victim_id} onChange={handleChange}>
                  <MenuItem value="">Unknown</MenuItem>
                  {victims.map(v => (
                    <MenuItem key={v.id} value={v.id}>
                      {`${v.first_name} ${v.last_name}`}{v.case ? ` — CASE-${v.case.id || v.case_id}` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="abuse-label">Abuse Type</InputLabel>
                <Select labelId="abuse-label" label="Abuse Type" name="abuse_type" value={form.abuse_type} onChange={handleChange}>
                  <MenuItem value="">Select</MenuItem>
                  {ABUSE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="fan_number" label="FAN Number" value={form.fan_number} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="fin_number" label="FIN Number" value={form.fin_number} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField name="address" label="Address" value={form.address} onChange={handleChange} fullWidth multiline rows={2} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="occupation" label="Occupation" value={form.occupation} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="relationship_to_victim"
                label="Relationship to victim"
                value={form.relationship_to_victim}
                onChange={handleChange}
                select
                fullWidth
                helperText="Select how the victim is related to this perpetrator"
              >
                <MenuItem value="">Select relationship</MenuItem>
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField name="description" label="Description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="prev-label">Previous records</InputLabel>
                <Select labelId="prev-label" label="Previous records" name="previous_records" value={form.previous_records} onChange={handleChange}>
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : (initial?.id ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    )
  }

  // ---------------- Render ----------------
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Perpetrators</Typography>
          <Typography variant="body2" color="text.secondary">Manage and track known perpetrators</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search by name, phone, address..."
            InputProps={{ startAdornment: <SearchIcon /> }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outlined" onClick={fetchPerpetrators} startIcon={<RefreshIcon />}>Refresh</Button>
          {canModify && <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>New</Button>}
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {pageLoading ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}><CircularProgress /><Typography sx={{ mt: 2 }}>Loading...</Typography></Paper>
      ) : perpetrators.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No perpetrators found</Typography>
          {canModify && <Button sx={{ mt: 2 }} variant="contained" onClick={handleOpenCreate}>Add First Perpetrator</Button>}
        </Paper>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age / DOB</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>FAN Number</TableCell>
                  <TableCell>FIN Number</TableCell>
                  <TableCell>Case</TableCell>
                  <TableCell>Victim</TableCell>
                  <TableCell>Abuse Type</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {perpetrators.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{p.first_name} {p.last_name}</Typography>
                      {p.address && <Typography variant="caption" color="text.secondary" display="block">{p.address}</Typography>}
                    </TableCell>
                    <TableCell>{p.gender || 'N/A'}</TableCell>
                    <TableCell>
                      {calcAge(p.date_of_birth) ? `${calcAge(p.date_of_birth)} yrs` : 'N/A'}
                      {p.date_of_birth && <Typography variant="caption" color="text.secondary" display="block">{formatDate(p.date_of_birth)}</Typography>}
                    </TableCell>
                    <TableCell>{p.contact_number || 'N/A'}</TableCell>
                    <TableCell>{p.fan_number || 'N/A'}</TableCell>
                    <TableCell>{p.fin_number || 'N/A'}</TableCell>
                    <TableCell>{p.case ? (p.case.case_number || `CASE-${p.case.id}`) : (p.case_id ? `CASE-${p.case_id}` : 'Unassigned')}</TableCell>
                    <TableCell>{p.victim ? `${p.victim.first_name} ${p.victim.last_name}` : p.victim_id ? `Victim-${p.victim_id}` : 'N/A'}</TableCell>
                    <TableCell><Chip label={p.abuse_type ? p.abuse_type.replace('_', ' ') : 'N/A'} size="small" /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleView(p)}><VisibilityIcon /></IconButton>
                      </Tooltip>
                      {canModify && <>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleOpenEdit(p)}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
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

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => { setOpenForm(false); setSelected(null) }} maxWidth="md" fullWidth>
        <PerpForm
          initial={selected || {}}
          onCancel={() => { setOpenForm(false); setSelected(null) }}
          onSubmit={handleSubmitForm}
        />
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Perpetrator Details</DialogTitle>
        <DialogContent dividers>
          {viewItem ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><strong>Name</strong><div>{viewItem.first_name} {viewItem.last_name}</div></Grid>
              <Grid item xs={12} md={6}><strong>Gender</strong><div>{viewItem.gender || 'N/A'}</div></Grid>
              <Grid item xs={12} md={6}><strong>Age</strong><div>{calcAge(viewItem.date_of_birth) || 'N/A'}</div></Grid>
              <Grid item xs={12} md={6}><strong>Contact</strong><div>{viewItem.contact_number || 'N/A'}</div></Grid>
              <Grid item xs={12} md={6}><strong>FAN Number</strong><div>{viewItem.fan_number || 'N/A'}</div></Grid>
              <Grid item xs={12} md={6}><strong>FIN Number</strong><div>{viewItem.fin_number || 'N/A'}</div></Grid>
              <Grid item xs={12}><strong>Address</strong><div>{viewItem.address || 'N/A'}</div></Grid>
              <Grid item xs={12} md={6}><strong>Case</strong><div>{viewItem.case ? (viewItem.case.case_number || `CASE-${viewItem.case.id}`) : (viewItem.case_id ? `CASE-${viewItem.case_id}` : 'Unassigned')}</div></Grid>
              <Grid item xs={12} md={6}><strong>Victim</strong><div>{viewItem.victim ? `${viewItem.victim.first_name} ${viewItem.victim.last_name}` : (viewItem.victim_id ? `Victim-${viewItem.victim_id}` : 'N/A')}</div></Grid>
              <Grid item xs={12}><strong>Abuse Type</strong><div>{viewItem.abuse_type || 'N/A'}</div></Grid>
              <Grid item xs={12}><strong>Description</strong><div style={{ whiteSpace: 'pre-wrap' }}>{viewItem.description || 'N/A'}</div></Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
          {canModify && <Button onClick={() => { setViewOpen(false); handleOpenEdit(viewItem) }} variant="contained">Edit</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PerpetratorsPage