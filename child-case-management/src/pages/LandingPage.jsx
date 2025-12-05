import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Security, Assessment, Groups, Timeline } from '@mui/icons-material';

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
          py: { xs: 8, md: 12 },
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                Child Abuse Case Management System
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}>
                A secure platform for tracking, managing, and resolving child abuse cases
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ px: 5, py: 1.5, fontWeight: 600 }}
                >
                  Login to System
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: 'white' },
                  }}
                >
                  View Dashboard
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: { xs: 3, md: 5 },
                  backdropFilter: 'blur(12px)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  System Features
                </Typography>
                <ul style={{ fontSize: '1.1rem', lineHeight: 2 }}>
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
      <Box sx={{ bgcolor: "#f0f6ff", py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" color="black" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Key Features
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: "auto" }}>
            Everything you need to manage and track child protection cases effectively
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    backdropFilter: "blur(12px)",
                    background: "rgba(255, 255, 255, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 16px 36px rgba(0,0,0,0.15)",
                      background: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      backgroundColor: "primary.light",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
      </Box>

      {/* Roles Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom color='black'>
            User Roles
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>
            Different roles for different responsibilities
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'System Administrator',
                color: 'primary.main',
                tasks: [
                  'Create all types of users',
                  'Update landing page content',
                  'Manage system settings',
                  'Access all cases and reports',
                ],
              },
              {
                title: 'Director',
                color: 'primary.main',
                tasks: [
                  'View dashboard analytics',
                  'Search perpetrators database',
                  'Add/delete/update Focal Persons',
                  'Generate comprehensive reports',
                ],
              },
              {
                title: 'Focal Person',
                color: 'primary.main',
                tasks: [
                  'Register new abuse cases',
                  'Search perpetrator information',
                  'View dashboard for assigned cases',
                  'Update case progress',
                ],
              },
            ].map((role, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    "&:hover": { transform: 'translateY(-5px)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }
                  }}
                >
                  <Typography variant="h5" gutterBottom color={role.color} sx={{ fontWeight: 700 }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {role.title === 'System Administrator'
                      ? 'Has full access to the system including:'
                      : role.title === 'Director'
                      ? 'Manages the operations including:'
                      : 'Handles case operations including:'}
                  </Typography>
                  <ul style={{ lineHeight: 1.8 }}>
                    {role.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Ready to get started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}>
            Join our mission to protect children and manage cases effectively
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 6, py: 1.5, fontWeight: 600 }}
          >
            Login Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
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
