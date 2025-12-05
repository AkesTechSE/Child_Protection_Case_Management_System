import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Security,
  Assessment,
  Groups,
  Timeline,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security sx={{ fontSize: 50 }} />,
      title: 'Secure System',
      description: 'Role-based access control ensures data security and privacy.',
    },
    {
      icon: <Assessment sx={{ fontSize: 50 }} />,
      title: 'Comprehensive Case Management',
      description: 'Track every case from registration to resolution with detailed records.',
    },
    {
      icon: <Groups sx={{ fontSize: 50 }} />,
      title: 'Team Collaboration',
      description: 'Multiple roles work together seamlessly - Administrators, Directors, and Focal Persons.',
    },
    {
      icon: <Timeline sx={{ fontSize: 50 }} />,
      title: 'Analytics & Reporting',
      description: 'Generate insights with detailed dashboards and reports.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Child Abuse Case Management System</title>
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom fontWeight="bold">
                Child Abuse Case Management System
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                A secure platform for tracking, managing, and resolving child abuse cases
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Login to System
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  System Features
                </Typography>
                <ul style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                  <li>Secure user authentication and role management</li>
                  <li>Comprehensive case registration and tracking</li>
                  <li>Real-time dashboards and analytics</li>
                  <li>Evidence management and document storage</li>
                  <li>Automated reporting and notifications</li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need for effective case management
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            User Roles
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Different roles for different responsibilities
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  System Administrator
                </Typography>
                <Typography variant="body1" paragraph>
                  Has full access to the system including:
                </Typography>
                <ul>
                  <li>Create all types of users</li>
                  <li>Update landing page content</li>
                  <li>Manage system settings</li>
                  <li>Access all cases and reports</li>
                </ul>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Director
                </Typography>
                <Typography variant="body1" paragraph>
                  Manages the operations including:
                </Typography>
                <ul>
                  <li>View dashboard analytics</li>
                  <li>Search perpetrators database</li>
                  <li>Add/delete/update Focal Persons</li>
                  <li>Generate comprehensive reports</li>
                </ul>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Focal Person
                </Typography>
                <Typography variant="body1" paragraph>
                  Handles case operations including:
                </Typography>
                <ul>
                  <li>Register new abuse cases</li>
                  <li>Search perpetrator information</li>
                  <li>View dashboard for assigned cases</li>
                  <li>Update case progress</li>
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join our mission to protect children and manage cases effectively
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/login')}
          sx={{ px: 6, py: 1.5 }}
        >
          Login Now
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          color: 'white',
          py: 4,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Child Protection Case Management System. All rights reserved.
          </Typography>
          <Typography variant="caption" align="center" sx={{ display: 'block', mt: 1 }}>
            A secure platform for child protection professionals
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;