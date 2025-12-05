import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Edit, Save, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatRoleName } from '../../utils/formatters';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
    },
    onSubmit: async (values) => {
      try {
        setError('');
        setSuccess('');
        
        const result = await updateProfile(values);
        if (result.success) {
          setSuccess('Profile updated successfully');
          setEditMode(false);
        } else {
          setError(result.error || 'Failed to update profile');
        }
      } catch (err) {
        setError('An error occurred while updating profile');
      }
    },
  });

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Case Management System</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
              }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            
            <Typography variant="h6" gutterBottom>
              {user.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatRoleName(user.role)}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Button
              variant={editMode ? "contained" : "outlined"}
              startIcon={editMode ? <Save /> : <Edit />}
              onClick={() => {
                if (editMode) {
                  formik.handleSubmit();
                } else {
                  setEditMode(true);
                }
              }}
              fullWidth
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="User ID"
                    value={user.id}
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="User Role"
                    value={formatRoleName(user.role)}
                    disabled
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;