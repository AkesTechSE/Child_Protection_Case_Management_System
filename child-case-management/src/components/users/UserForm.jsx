import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Badge,
  Lock,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { userValidationSchema } from '../../utils/validators';
import { useUsers } from '../../hooks/useUsers';
import { USER_ROLES } from '../../utils/constants';
import RoleBadge from './RoleBadge';
import toast from 'react-hot-toast';

const UserForm = ({ user, onSuccess, onCancel }) => {
  const { createUser, updateUser, isCreating, isUpdating } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Generate initial password for new users
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || USER_ROLES.FOCAL_PERSON,
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
      status: user?.status || 'active',
      password: user ? '' : generatePassword(),
      confirmPassword: user ? '' : '',
      sendWelcomeEmail: !user,
      twoFactorEnabled: user?.two_factor_enabled || false,
      notes: user?.notes || '',
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        setFormError('');
        
        // Prepare data for API
        const userData = {
          name: values.name,
          email: values.email,
          role: values.role,
          phone: values.phone,
          department: values.department,
          position: values.position,
          status: values.status,
          two_factor_enabled: values.twoFactorEnabled,
          notes: values.notes,
        };

        // Only include password for new users or when changing password
        if (!user || values.password) {
          if (values.password !== values.confirmPassword) {
            setFormError('Passwords do not match');
            return;
          }
          if (values.password.length < 8) {
            setFormError('Password must be at least 8 characters');
            return;
          }
          userData.password = values.password;
          userData.password_confirmation = values.confirmPassword;
        }

        if (user) {
          await updateUser({ id: user.id, data: userData });
          toast.success('User updated successfully');
        } else {
          await createUser(userData);
          toast.success('User created successfully');
          
          // Send welcome email if requested
          if (values.sendWelcomeEmail) {
            // API call to send welcome email would go here
            console.log('Welcome email sent to', values.email);
          }
        }
        
        onSuccess();
      } catch (error) {
        setFormError(error.message || 'An error occurred. Please try again.');
        toast.error('Failed to save user');
      }
    },
  });

  // Password validation helper
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    return {
      ...requirements,
      isValid: Object.values(requirements).every(Boolean),
    };
  };

  const passwordValidation = validatePassword(formik.values.password);
  const passwordMatch = formik.values.password === formik.values.confirmPassword;

  const roleDescriptions = {
    [USER_ROLES.SYSTEM_ADMIN]: 'Full system access, can manage all users and settings',
    [USER_ROLES.DIRECTOR]: 'Can view all cases, manage focal persons, generate reports',
    [USER_ROLES.FOCAL_PERSON]: 'Can register new cases and search perpetrators',
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user ? 'Edit User' : 'Create New User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user ? 'Update user information and permissions' : 'Add a new user to the system'}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Error Alert */}
        {formError && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setFormError('')}>
              {formError}
            </Alert>
          </Grid>
        )}

        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name *"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address *"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            placeholder="+1 (555) 123-4567"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formik.values.status}
              label="Status"
              onChange={formik.handleChange}
              startAdornment={
                <InputAdornment position="start">
                  {formik.values.status === 'active' ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="active">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  Active
                </Box>
              </MenuItem>
              <MenuItem value="inactive">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cancel color="error" fontSize="small" />
                  Inactive
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Role and Department */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Role and Department
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={formik.touched.role && Boolean(formik.errors.role)}>
            <InputLabel>Role *</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              label="Role *"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RoleBadge role={selected} size="small" showIcon={false} />
                  <Typography>{selected.replace('_', ' ').toUpperCase()}</Typography>
                </Box>
              )}
            >
              {Object.values(USER_ROLES).map((role) => (
                <MenuItem key={role} value={role}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <RoleBadge role={role} size="small" showIcon={false} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography>{role.replace('_', ' ').toUpperCase()}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleDescriptions[role]}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {formik.touched.role && formik.errors.role && (
              <FormHelperText>{formik.errors.role}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            placeholder="e.g., Child Protection, Administration"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Position/Title"
            name="position"
            value={formik.values.position}
            onChange={formik.handleChange}
            placeholder="e.g., Case Manager, Director"
          />
        </Grid>

        {/* Password Section (only for new users or when explicitly changing) */}
        {(!user || formik.values.password) && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {user ? 'Change Password' : 'Set Password'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password *"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                required={!user}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {/* Password requirements */}
              {formik.values.password && (
                <Box sx={{ mt: 1, ml: 1 }}>
                  {[
                    { label: 'At least 8 characters', met: passwordValidation.length },
                    { label: 'One uppercase letter', met: passwordValidation.uppercase },
                    { label: 'One lowercase letter', met: passwordValidation.lowercase },
                    { label: 'One number', met: passwordValidation.number },
                    { label: 'One special character', met: passwordValidation.special },
                  ].map((req, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '0.75rem',
                        color: req.met ? 'success.main' : 'error.main',
                      }}
                    >
                      {req.met ? '✓' : '✗'} {req.label}
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password *"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                required={!user}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formik.values.confirmPassword && (
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    color: passwordMatch ? 'success.main' : 'error.main',
                  }}
                >
                  {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </Typography>
              )}
            </Grid>
          </>
        )}

        {/* Additional Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Additional Settings
          </Typography>
        </Grid>

        {!user && (
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.sendWelcomeEmail}
                  onChange={(e) =>
                    formik.setFieldValue('sendWelcomeEmail', e.target.checked)
                  }
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Send welcome email</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Send login instructions and password to user's email
                  </Typography>
                </Box>
              }
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.twoFactorEnabled}
                onChange={(e) =>
                  formik.setFieldValue('twoFactorEnabled', e.target.checked)
                }
              />
            }
            label={
              <Box>
                <Typography variant="body2">Enable Two-Factor Authentication</Typography>
                <Typography variant="caption" color="text.secondary">
                  Require additional verification during login
                </Typography>
              </Box>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            multiline
            rows={3}
            placeholder="Any additional information about this user..."
          />
        </Grid>

        {/* Role Preview */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Role Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <RoleBadge role={formik.values.role} size="medium" />
                <Typography variant="body2">
                  {roleDescriptions[formik.values.role]}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Permissions will be assigned based on the selected role
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    formik.setFieldValue('password', generatePassword());
                    formik.setFieldValue('confirmPassword', '');
                  }}
                  disabled={isCreating || isUpdating}
                >
                  Generate New Password
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                disabled={isCreating || isUpdating}
                startIcon={user ? <Badge /> : <Person />}
                sx={{ minWidth: 150 }}
              >
                {isCreating || isUpdating ? 'Saving...' : user ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;