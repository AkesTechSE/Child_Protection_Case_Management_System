import React, { useState, useEffect } from 'react'
import {
  Container, Paper, Typography, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Alert, CircularProgress, InputAdornment, Snackbar, MenuItem
} from '@mui/material'
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Visibility as VisibilityIcon, Search as SearchIcon,
  Refresh as RefreshIcon, Person as PersonIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { childApi } from '../api/children'
import { caseApi } from '../api/cases'

const ChildrenPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading, isAdmin, isSystemAdmin, isFocalPerson } = useAuth()
  const canModifyChildren = isAdmin || isSystemAdmin || isFocalPerson

  const EMPTY_FORM = {
    id: undefined,
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    guardian_phone: '',
    guardian_email: '',
    current_address: '',
    case_id: '',
    address_history: '',
    child_contact: ''
  }

  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [cases, setCases] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Fetch children
  const fetchChildren = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await childApi.getChildren({ per_page: 200 })
      let data = []
      if (Array.isArray(res)) data = res
      else if (Array.isArray(res?.data)) data = res.data
      else if (Array.isArray(res?.data?.data)) data = res.data.data
      else data = res?.data?.data ?? res?.data ?? []
      setChildren(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to fetch children')
      setChildren([])
    } finally { setLoading(false) }
  }

  const fetchCaseOptions = async () => {
    try {
      const { data } = await caseApi.getCases({ per_page: 200 })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setCases(list)
    } catch (err) {
      console.error('Failed to fetch cases', err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchChildren()
      fetchCaseOptions()
    }
  }, [isAuthenticated])

  // CRUD Handlers
  const handleAddChild = () => {
    setFormErrors({})
    setFormData({ ...EMPTY_FORM })
    setFormOpen(true)
  }
  const handleEditChild = (child) => {
    setFormErrors({})
    setFormData({
      ...EMPTY_FORM,
      ...child,
      case_id: child.case_id || '',
    })
    setFormOpen(true)
  }
  const handleViewChild = (child) => { setSelectedChild(child); setDialogOpen(true) }

  const handleDeleteChild = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await childApi.deleteChild(id)
      setSuccess('Child deleted successfully')
      fetchChildren()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to delete child')
    }
  }

  const handleFormSubmit = async () => {
    setFormErrors({})
    setError('')
    try {
      setSaving(true)
      const payload = {
        case_id: formData.case_id || undefined,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        guardian_phone: formData.guardian_phone,
        guardian_email: formData.guardian_email,
        current_address: formData.current_address,
        address_history: formData.address_history,
        child_contact: formData.child_contact,
      }

      if (formData.id) {
        await childApi.updateChild(formData.id, payload)
        setSuccess('Child updated successfully')
      } else {
        await childApi.createChild(payload)
        setSuccess('Child added successfully')
      }
      setFormOpen(false)
      setFormData({ ...EMPTY_FORM })
      fetchChildren()
    } catch (err) {
      console.error(err)
      const validationErrors = err?.errors
      if (validationErrors) {
        setFormErrors(validationErrors)
        setError('Please fix the highlighted fields')
      } else {
        setError(err.message || 'Failed to save child')
      }
    } finally {
      setSaving(false)
    }
  }

  // Helpers
  const calculateAge = dob => { if (!dob) return 'N/A'; const b = new Date(dob); const today = new Date(); let age = today.getFullYear() - b.getFullYear(); const m = today.getMonth() - b.getMonth(); if (m<0 || (m===0 && today.getDate()<b.getDate())) age--; return age }
  const getGenderLabel = gender => { if (!gender) return 'Not specified'; switch(gender.toLowerCase()){ case 'male': return 'Male'; case 'female': return 'Female'; case 'other': return 'Other'; case 'prefer_not_to_disclose': return 'Prefer not to disclose'; default: return gender } }
  const formatDate = date => { if (!date) return 'N/A'; const d = new Date(date); return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString() }

  const filteredChildren = children.filter(c => {
    if (!c) return false
    const term = searchTerm.toLowerCase()
    const fullName = `${c.first_name} ${c.middle_name||''} ${c.last_name}`.toLowerCase()
    const caseIdStr = c.case_id ? `case-${c.case_id}` : ''
    return fullName.includes(term) || (c.current_address||'').toLowerCase().includes(term) || (c.guardian_phone||'').includes(term) || (c.guardian_email||'').toLowerCase().includes(term) || caseIdStr.includes(term)
  })

  const getFieldError = (field) => {
    const value = formErrors?.[field]
    if (!value) return ''
    return Array.isArray(value) ? value.join(' ') : value
  }

  if (authLoading) return <Box sx={{ display:'flex', justifyContent:'center', mt:5 }}><CircularProgress /><Typography>Checking authentication...</Typography></Box>
  if (!isAuthenticated) return <Box sx={{ mt:5, textAlign:'center' }}><Alert severity="warning">Login required</Alert><Button variant="contained" onClick={()=>navigate('/login')}>Login</Button></Box>

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ display:'flex', justifyContent:'space-between', my:4 }}>
        <Typography variant="h4">Children Management</Typography>
        {canModifyChildren && <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddChild}>Add Child</Button>}
      </Box>

      {/* Messages */}
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
      {success && <Snackbar open autoHideDuration={3000} onClose={()=>setSuccess('')} message={success} />}

      {/* Search */}
      <TextField fullWidth placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} InputProps={{ startAdornment:<InputAdornment position="start"><SearchIcon /></InputAdornment> }} sx={{ mb:3 }} />

      {/* Table */}
      {filteredChildren.length === 0 ? (
        <Paper sx={{ p:4, textAlign:'center' }}><PersonIcon sx={{ fontSize:60, color:'text.secondary', mb:2 }} /><Typography>{children.length===0 ? 'No children found' : 'No matching results'}</Typography></Paper>
      ) : (
        <Paper sx={{ borderRadius:2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor:'primary.light' }}>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Guardian Phone</TableCell>
                  <TableCell>Case ID</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChildren.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.first_name} {c.middle_name||''} {c.last_name}</TableCell>
                    <TableCell>{formatDate(c.date_of_birth)}</TableCell>
                    <TableCell>{calculateAge(c.date_of_birth)} yrs</TableCell>
                    <TableCell>{getGenderLabel(c.gender)}</TableCell>
                    <TableCell>{c.guardian_phone||'N/A'}</TableCell>
                    <TableCell>{c.case_id ? `CASE-${c.case_id}`:'Not Assigned'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={()=>handleViewChild(c)}><VisibilityIcon /></IconButton>
                      {canModifyChildren && <>
                        <IconButton onClick={()=>handleEditChild(c)}><EditIcon /></IconButton>
                        <IconButton onClick={()=>handleDeleteChild(c.id)}><DeleteIcon /></IconButton>
                      </>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* View Dialog */}
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} fullWidth maxWidth="md">
        {selectedChild && <><DialogTitle>{selectedChild.first_name} {selectedChild.last_name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}><strong>Age:</strong> {calculateAge(selectedChild.date_of_birth)}</Grid>
            <Grid item xs={6}><strong>Gender:</strong> {getGenderLabel(selectedChild.gender)}</Grid>
            <Grid item xs={6}><strong>Guardian Phone:</strong> {selectedChild.guardian_phone||'N/A'}</Grid>
            <Grid item xs={6}><strong>Case ID:</strong> {selectedChild.case_id ? `CASE-${selectedChild.case_id}`:'Not Assigned'}</Grid>
            <Grid item xs={12}><strong>Address:</strong> {selectedChild.current_address||'N/A'}</Grid>
            <Grid item xs={12}><strong>Guardian Email:</strong> {selectedChild.guardian_email||'N/A'}</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)}>Close</Button>
          {canModifyChildren && <Button onClick={()=>{ setDialogOpen(false); handleEditChild(selectedChild) }}>Edit</Button>}
        </DialogActions></>}
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={()=>setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{formData.id ? 'Edit Child':'Add New Child'}</DialogTitle>
        <DialogContent sx={{ mt:1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                value={formData.first_name}
                onChange={e=>setFormData({...formData, first_name:e.target.value})}
                fullWidth
                required
                error={!!getFieldError('first_name')}
                helperText={getFieldError('first_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Middle Name"
                value={formData.middle_name}
                onChange={e=>setFormData({...formData, middle_name:e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={formData.last_name}
                onChange={e=>setFormData({...formData, last_name:e.target.value})}
                fullWidth
                required
                error={!!getFieldError('last_name')}
                helperText={getFieldError('last_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Gender"
                value={formData.gender}
                onChange={e=>setFormData({...formData, gender:e.target.value})}
                fullWidth
                required
                error={!!getFieldError('gender')}
                helperText={getFieldError('gender')}
              >
                <MenuItem value="">Select gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_disclose">Prefer not to disclose</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e=>setFormData({...formData, date_of_birth:e.target.value})}
                InputLabelProps={{ shrink:true }}
                fullWidth
                required
                error={!!getFieldError('date_of_birth')}
                helperText={getFieldError('date_of_birth')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Case"
                value={formData.case_id}
                onChange={e=>setFormData({...formData, case_id:e.target.value})}
                fullWidth
                helperText="Optional: link to an existing case"
              >
                <MenuItem value="">No Case Assigned</MenuItem>
                {cases.map((caseItem) => (
                  <MenuItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.case_number ? `${caseItem.case_number} — ${caseItem.case_title}` : caseItem.case_title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Phone"
                value={formData.guardian_phone}
                onChange={e=>setFormData({...formData, guardian_phone:e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Email"
                value={formData.guardian_email}
                onChange={e=>setFormData({...formData, guardian_email:e.target.value})}
                fullWidth
                error={!!getFieldError('guardian_email')}
                helperText={getFieldError('guardian_email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Current Address"
                value={formData.current_address}
                onChange={e=>setFormData({...formData, current_address:e.target.value})}
                fullWidth
                multiline
                minRows={2}
                required
                error={!!getFieldError('current_address')}
                helperText={getFieldError('current_address')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address History"
                value={formData.address_history}
                onChange={e=>setFormData({...formData, address_history:e.target.value})}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Child Contact"
                value={formData.child_contact}
                onChange={e=>setFormData({...formData, child_contact:e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit} disabled={saving}>
            {saving ? 'Saving...' : formData.id ? 'Update':'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}

export default ChildrenPage
