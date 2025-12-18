// src/pages/UsersPage.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
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
  Alert,
  CircularProgress,
  TextField,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import api from '../api/index'
import { useAuth } from '../hooks/useAuth'

const UsersPage = () => {
    const { user, isSystemAdmin, isDirector } = useAuth()
    const isAdmin = user?.role === 'admin'
    const canManageAll = isSystemAdmin || isAdmin
    const canManageFocalPersons = canManageAll || isDirector
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewUser, setViewUser] = useState(null)
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false)
  const [pwdUser, setPwdUser] = useState(null)
  const [pwdData, setPwdData] = useState({ new_password: '', new_password_confirmation: '' })
  const [pwdSubmitting, setPwdSubmitting] = useState(false)
  const [pwdError, setPwdError] = useState('')

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      // Director: only show focal persons
      if (isDirector && !canManageAll) {
        params.role = 'focal_person'
      }

      const data = await api.get('/users', { params })
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setUsers(data)
      } else if (data && data.data && Array.isArray(data.data)) {
        setUsers(data.data) // Paginated response
      } else {
        console.warn('Unexpected API response format:', data)
        setUsers([])
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(err.message || 'Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [isDirector, canManageAll])

  const handleToggleActive = async (user) => {
    try {
      const newStatus = !user.is_active
      await api.put(`/users/${user.id}`, { is_active: newStatus })
      setSuccess(`User ${newStatus ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
    } catch (err) {
      console.error('Failed to toggle user status:', err)
      setError('Failed to update user status')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!canManageFocalPersons) return
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`)
        setSuccess('User deleted successfully')
        fetchUsers()
      } catch (err) {
        console.error('Failed to delete user:', err)
        setError('Failed to delete user')
      }
    }
  }

  const handleCreateUser = async (formData) => {
    try {
      if (isDirector && !canManageAll) {
        formData = { ...formData, role: 'focal_person' }
      }
      await api.post('/users', formData)
      setSuccess('User created successfully')
      setSelectedUser(null)
      setOpenForm(false)
      fetchUsers()
    } catch (err) {
      console.error('Failed to create user:', err)
      throw err // Let form handle the error
    }
  }

  const handleUpdateUser = async (id, formData) => {
    try {
      if (isDirector && !canManageAll) {
        // Director cannot change roles; keep focal_person
        const { role, ...rest } = formData
        formData = rest
      }
      await api.put(`/users/${id}`, formData)
      setSuccess('User updated successfully')
      setSelectedUser(null)
      setOpenForm(false)
      fetchUsers()
    } catch (err) {
      console.error('Failed to update user:', err)
      throw err // Let form handle the error
    }
  }

  const handleViewUser = (user) => {
    setViewUser(user)
    setViewDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setOpenForm(true)
  }

  const openPasswordDialog = (user) => {
    if (!canManageFocalPersons) return
    setPwdUser(user)
    setPwdData({ new_password: '', new_password_confirmation: '' })
    setPwdError('')
    setPwdDialogOpen(true)
  }

  const handleChangePassword = async () => {
    setPwdSubmitting(true)
    setPwdError('')
    try {
      if (pwdData.new_password !== pwdData.new_password_confirmation) {
        setPwdError('Passwords do not match')
        setPwdSubmitting(false)
        return
      }
      await api.post(`/users/${pwdUser.id}/change-password`, {
        new_password: pwdData.new_password,
        new_password_confirmation: pwdData.new_password_confirmation,
      })
      setSuccess('Password updated. User must re-login.')
      setPwdDialogOpen(false)
      setPwdUser(null)
    } catch (err) {
      const apiErrors = err?.errors ? Object.values(err.errors).flat() : []
      setPwdError(apiErrors[0] || err.message || 'Failed to update password')
    } finally {
      setPwdSubmitting(false)
    }
  }

  // Helper functions
  const getRoleLabel = (role) => {
    const labels = {
      'system_admin': 'System Administrator',
      'admin': 'Administrator',
      'director': 'Director',
      'focal_person': 'Focal Person'
    }
    return labels[role] || role
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'system_admin': return 'error'
      case 'admin': return 'secondary'
      case 'director': return 'warning'
      case 'focal_person': return 'primary'
      default: return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredUsers = users.filter(user => {
    if (!user) return false
    // Extra safety: director only sees focal_person
    if (isDirector && !canManageAll && user.role !== 'focal_person') return false
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower) ||
      getRoleLabel(user.role).toLowerCase().includes(searchLower)
    )
  })

  const buildInitialFormValues = (data) => ({
    name: data?.name || '',
    email: data?.email || '',
    password: '',
    password_confirmation: '',
    role: data?.role || 'focal_person',
    is_active: typeof data?.is_active === 'boolean' ? data.is_active : true,
  })

  const UserForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(() => buildInitialFormValues(initialData))
    useEffect(() => {
      setFormData(buildInitialFormValues(initialData))
    }, [initialData])
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setSubmitting(true)
      setFormError('')
      
      try {
        if ((formData.password || formData.password_confirmation) && formData.password !== formData.password_confirmation) {
          setFormError('Passwords do not match')
          setSubmitting(false)
          return
        }

        const submitData = { ...formData }

        // Directors can only create/edit focal persons
        if (isDirector && !canManageAll) {
          submitData.role = 'focal_person'
        }

        if (initialData) {
          if (!submitData.password) {
            delete submitData.password
            delete submitData.password_confirmation
          }
        }

        await onSubmit(submitData)
      } catch (err) {
        console.error('User save failed:', {
          status: err?.status,
          message: err?.message,
          errors: err?.errors,
        })
        const apiErrors = err?.errors ? Object.values(err.errors).flat() : []
        setFormError(apiErrors[0] || err?.message || 'Failed to save user')
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent dividers>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError('')}>
              {formError}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!initialData}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                helperText={initialData ? "Leave blank to keep current password" : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required={!initialData}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              {isDirector && !canManageAll ? (
                <TextField
                  fullWidth
                  label="Role"
                  value="Focal Person"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Directors can manage focal persons only"
                />
              ) : (
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="focal_person">Focal Person</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="system_admin">System Administrator</MenuItem>
                </TextField>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    name="is_active"
                  />
                }
                label={formData.is_active ? "Active" : "Inactive"}
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {initialData ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    )
  }

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isDirector && !canManageAll ? 'Manage focal persons' : 'Manage system users and their permissions'}
          </Typography>
        </Box>
        {canManageFocalPersons && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null)
              setOpenForm(true)
            }}
          >
            New User
          </Button>
        )}
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Search and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {users.length === 0 ? 'No users found' : 'No matching users found'}
          </Typography>
          {searchTerm && users.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search terms
            </Typography>
          )}
          {users.length === 0 && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{ mt: 2 }}
            >
              Add First User
            </Button>
          )}
        </Paper>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getRoleLabel(user.role)}
                        size="small"
                        color={getRoleColor(user.role)}
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.is_active ? 'success' : 'error'}
                        variant="filled"
                        icon={user.is_active ? <LockOpenIcon /> : <LockIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewUser(user)}
                          title="View Details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color={user.is_active ? 'warning' : 'success'}
                          onClick={() => handleToggleActive(user)}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleEditUser(user)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => openPasswordDialog(user)}
                          title="Change Password"
                        >
                          <LockIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete"
                          disabled={user.role === 'system_admin'} // Prevent deleting system admin
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Results Count */}
      {filteredUsers.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
      )}

      {/* User Form Dialog */}
      <Dialog open={openForm} onClose={() => {
        setOpenForm(false)
        setSelectedUser(null)
      }} maxWidth="sm" fullWidth>
        <UserForm
          key={selectedUser ? selectedUser.id : 'new-user'}
          initialData={selectedUser}
          onSubmit={selectedUser ? 
            (data) => handleUpdateUser(selectedUser.id, data) :
            handleCreateUser
          }
          onCancel={() => {
            setOpenForm(false)
            setSelectedUser(null)
          }}
        />
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        {viewUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6">
                  User Details - {viewUser.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" gutterBottom>
                    {viewUser.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1" gutterBottom>
                    {viewUser.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                  <Chip
                    label={getRoleLabel(viewUser.role)}
                    color={getRoleColor(viewUser.role)}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={viewUser.is_active ? 'Active' : 'Inactive'}
                    color={viewUser.is_active ? 'success' : 'error'}
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email Verified</Typography>
                  <Typography variant="body1" gutterBottom>
                    {viewUser.email_verified_at ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Login</Typography>
                  <Typography variant="body1" gutterBottom>
                    {viewUser.last_login_at ? formatDate(viewUser.last_login_at) : 'Never'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                  <Typography variant="body1">
                    {formatDate(viewUser.created_at)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">
                    {formatDate(viewUser.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  setViewDialogOpen(false)
                  handleEditUser(viewUser)
                }}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={pwdDialogOpen} onClose={() => setPwdDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          {pwdError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPwdError('')}>
              {pwdError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={pwdData.new_password}
            onChange={(e) => setPwdData(prev => ({ ...prev, new_password: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={pwdData.new_password_confirmation}
            onChange={(e) => setPwdData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The user will be signed out and must log in again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdDialogOpen(false)} disabled={pwdSubmitting}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={pwdSubmitting}
            startIcon={pwdSubmitting ? <CircularProgress size={20} /> : null}
          >Update Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UsersPage