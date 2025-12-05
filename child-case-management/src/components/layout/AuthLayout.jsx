import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.50',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            background: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
            },
          }}
        >
          {/* Logo Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11H19C18.47 16.11 15.72 20.78 12 21.93C8.28 20.78 5.53 16.11 5 11H12V7L17 10L12 13V11Z" />
              </svg>
            </Box>
            
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ChildSafe
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Child Protection Case Management System
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Outlet />
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
            >
              © {new Date().getFullYear()} Child Protection System
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              display="block"
              sx={{ mt: 0.5 }}
            >
              A secure platform for child protection professionals
            </Typography>
          </Box>
        </Paper>

        {/* Security Notice */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" color="text.secondary" align="center">
            🔒 Your data is protected with 256-bit SSL encryption
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;