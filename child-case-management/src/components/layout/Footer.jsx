import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Register Case', path: '/cases/register' },
    { label: 'Search Cases', path: '/cases/search' },
    { label: 'Reports', path: '/reports' },
    { label: 'User Guide', path: '/help' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  const contactInfo = [
    { icon: <Phone fontSize="small" />, text: '+1 (555) 123-4567' },
    { icon: <Email fontSize="small" />, text: 'support@childsafe.org' },
    { icon: <LocationOn fontSize="small" />, text: '123 Child Safety St, City, Country' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ py: 4 }}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                ChildSafe
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              A secure platform for managing child abuse cases, ensuring child safety 
              and providing comprehensive case management tools for professionals.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary">
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {quickLinks.map((link) => (
                <Box component="li" key={link.label} sx={{ mb: 1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    color="text.secondary"
                    onClick={() => navigate(link.path)}
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contactInfo.map((info, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {info.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {info.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* System Status */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  All Systems Operational
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Version: 1.0.0
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider />

        {/* Bottom Bar */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} ChildSafe - Child Protection Case Management System. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              onClick={() => navigate('/privacy')}
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              onClick={() => navigate('/terms')}
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Terms of Service
            </Link>
            <Link
              component="button"
              variant="body2"
              color="text.secondary"
              onClick={() => navigate('/help')}
              sx={{
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Help & Support
            </Link>
          </Box>
        </Box>

        {/* Security Badge */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'grey.50',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            🔒 Protected with 256-bit SSL encryption • ISO 27001 Certified • HIPAA Compliant
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;