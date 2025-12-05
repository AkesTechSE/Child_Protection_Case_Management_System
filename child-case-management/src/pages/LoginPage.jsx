import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { Visibility, VisibilityOff, Lock, Email, Security } from '@mui/icons-material';
import { loginValidationSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        
        // Demo login - Remove this in production
        const demoCredentials = {
          'admin@example.com': { password: 'admin123', role: 'system_admin', name: 'System Admin' },
          'director@example.com': { password: 'director123', role: 'director', name: 'Director' },
          'focal@example.com': { password: 'focal123', role: 'focal_person', name: 'Focal Person' },
        };

        if (demoCredentials[values.email] && demoCredentials[values.email].password === values.password) {
          const userData = demoCredentials[values.email];
          
          // Store user data
          localStorage.setItem('auth_token', 'demo-token-' + Date.now());
          localStorage.setItem('user_data', JSON.stringify({
            id: Date.now(),
            name: userData.name,
            email: values.email,
            role: userData.role,
            status: 'active',
            created_at: new Date().toISOString(),
          }));

          toast.success(`Welcome back, ${userData.name}!`);
          navigate(from, { replace: true });
          return;
        }

        // If using real API
        const result = await login(values.email, values.password);
        
        if (result.success) {
          toast.success('Login successful!');
          navigate(from, { replace: true });
        } else {
          setError(result.message || 'Invalid credentials');
        }
      } catch (err) {
        setError(err.message || 'An error occurred during login');
        toast.error('Login failed');
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = (role) => {
    const credentials = {
      system_admin: { email: 'admin@example.com', password: 'admin123' },
      director: { email: 'director@example.com', password: 'director123' },
      focal_person: { email: 'focal@example.com', password: 'focal123' },
    };

    const cred = credentials[role];
    formik.setValues(cred);
    
    // Auto-submit after a brief delay
    setTimeout(() => {
      formik.handleSubmit();
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Login - Child Case Management System</title>
      </Helmet>

      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            ChildSafe Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access the case management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Demo Login Buttons */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
              Try demo accounts:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('system_admin')}
                disabled={isLoading}
              >
                System Admin
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('director')}
                disabled={isLoading}
              >
                Director
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('focal_person')}
                disabled={isLoading}
              >
                Focal Person
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            By signing in, you agree to our{' '}
            <Link component={RouterLink} to="/terms" underline="hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link component={RouterLink} to="/privacy" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        </Paper>

        {/* Support Info */}
        <Paper elevation={0} sx={{ mt: 3, p: 2, backgroundColor: 'info.light', textAlign: 'center' }}>
          <Typography variant="body2">
            Need help?{' '}
            <Link
              component={RouterLink}
              to="/contact-support"
              underline="hover"
              fontWeight="bold"
            >
              Contact Support
            </Link>{' '}
            or call +1 (555) 123-4567
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default LoginPage;