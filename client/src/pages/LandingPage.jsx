import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import { Shield, People, Gavel, Security, AccessTime, Analytics } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Custom styled tooltip with neutral theming
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#2C3E50',
    color: 'white',
    boxShadow: theme.shadows[4],
    fontSize: 14,
    borderRadius: 8,
    padding: '12px 16px',
    maxWidth: 300,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#2C3E50',
  },
}));

const LandingPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Shield sx={{ fontSize: 60, color: '#E74C3C' }} />,
      title: 'Secure Case Management',
      text: 'End-to-end encrypted handling of all sensitive case data with role-based access controls.',
      delay: 0.1
    },
    {
      icon: <People sx={{ fontSize: 60, color: '#27AE60' }} />,
      title: 'Collaborative Platform',
      text: 'Seamless collaboration between social workers, law enforcement, and legal teams.',
      delay: 0.2
    },
    {
      icon: <Gavel sx={{ fontSize: 60, color: '#8E44AD' }} />,
      title: 'Streamlined Reporting',
      text: 'Generate comprehensive reports for legal proceedings and case reviews efficiently.',
      delay: 0.3
    },
    {
      icon: <Security sx={{ fontSize: 60, color: '#E67E22' }} />,
      title: 'HIPAA Compliant',
      text: 'Fully compliant with healthcare privacy regulations and data protection standards.',
      delay: 0.4
    },
    {
      icon: <AccessTime sx={{ fontSize: 60, color: '#3498DB' }} />,
      title: 'Real-time Updates',
      text: 'Instant notifications and updates on case progress and important deadlines.',
      delay: 0.5
    },
    {
      icon: <Analytics sx={{ fontSize: 60, color: '#16A085' }} />,
      title: 'Analytics Dashboard',
      text: 'Comprehensive insights and analytics for better decision making and resource allocation.',
      delay: 0.6
    }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #F9F7F7 0%, #F0F0F0 30%, #FFFFFF 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '600px',
        background: 'linear-gradient(180deg, rgba(231, 76, 60, 0.05) 0%, transparent 100%)',
        zIndex: 0,
      }
    }}>
      {/* Decorative elements */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(231, 76, 60, 0.1) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155, 89, 182, 0.1) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Box 
        component={motion.div}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.5 
        }}
        sx={{ 
          p: 3, 
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(236, 240, 241, 0.5)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: 2,
            bgcolor: '#E74C3C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            <Shield sx={{ fontSize: 24 }} />
          </Box>
          <CustomTooltip 
            title="Child Abuse Protection Case Management System - A secure platform for child welfare professionals"
            arrow
            placement="bottom"
            enterDelay={300}
            leaveDelay={200}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                color: '#2C3E50',
                cursor: 'default',
                letterSpacing: '-0.5px'
              }}
            >
              CAPCMS
            </Typography>
          </CustomTooltip>
        </Box>
        
        <Button 
          variant="contained"
          component={Link} 
          to="/login"
          sx={{
            bgcolor: '#E74C3C',
            color: 'white',
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(231, 76, 60, 0.3)',
            '&:hover': {
              bgcolor: '#C0392B',
              boxShadow: '0 6px 20px rgba(231, 76, 60, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 8, md: 15 },
          px: { xs: 2, md: 0 }
        }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800, 
                color: '#2C3E50',
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                mb: 3
              }}
            >
              Protecting Our
              <Box component="span" sx={{ color: '#E74C3C', display: 'block' }}>
                Most Vulnerable
              </Box>
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#34495E',
                mb: 5,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              A comprehensive, secure platform for child protection professionals to manage cases, 
              collaborate effectively, and ensure the safety and well-being of children in need.
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/login" 
                sx={{ 
                  px: 6,
                  py: 1.5,
                  bgcolor: '#E74C3C',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(231, 76, 60, 0.4)',
                  '&:hover': {
                    bgcolor: '#C0392B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(231, 76, 60, 0.5)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Protecting Now
              </Button>
              
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ 
                  px: 6,
                  py: 1.5,
                  borderColor: '#E74C3C',
                  color: '#E74C3C',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#C0392B',
                    color: '#C0392B',
                    bgcolor: 'rgba(231, 76, 60, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <Typography 
              variant="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                color: '#2C3E50',
                mb: 8,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Why Choose CAPCMS?
            </Typography>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    variants={fadeInUp}
                    custom={feature.delay}
                  >
                    <Paper 
                      component={motion.div}
                      whileHover={{ 
                        y: -12, 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        transition: { duration: 0.3 }
                      }}
                      sx={{ 
                        p: 4, 
                        height: '100%',
                        textAlign: 'center', 
                        borderRadius: 4,
                        border: '1px solid rgba(236, 240, 241, 0.5)',
                        bgcolor: 'white',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ 
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'rgba(236, 240, 241, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#2C3E50',
                          mb: 2 
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: '#7F8C8D',
                          lineHeight: 1.6 
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
        bgcolor: '#F9F9F9',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#2C3E50',
                    mb: 3
                  }}
                >
                  Trusted by Child Protection Professionals Nationwide
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#7F8C8D',
                    lineHeight: 1.7,
                    mb: 4
                  }}
                >
                  Our platform is built with input from hundreds of social workers, 
                  law enforcement officers, and legal professionals who work tirelessly 
                  to protect children every day.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {[
                  { value: '10,000+', label: 'Cases Managed' },
                  { value: '2,400+', label: 'Active Professionals' },
                  { value: '99.8%', label: 'System Uptime' },
                  { value: '50+', label: 'States Served' }
                ].map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Paper 
                        sx={{ 
                          p: 3,
                          textAlign: 'center',
                          borderRadius: 3,
                          bgcolor: 'white',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          height: '100%'
                        }}
                      >
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#E74C3C',
                            mb: 1
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: '#34495E',
                            fontSize: '0.9rem'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Paper 
              sx={{ 
                p: { xs: 4, md: 8 },
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: '#2C3E50',
                color: 'white',
                background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
              }}
            >
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2.5rem' }
                }}
              >
                Ready to Make a Difference?
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5, 
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Join thousands of child protection professionals using CAPCMS to save time, 
                improve collaboration, and better serve children in need.
              </Typography>
              
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/login"
                sx={{ 
                  px: 6,
                  py: 2,
                  bgcolor: '#E74C3C',
                  color: 'white',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#C0392B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started Free
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 4, 
        borderTop: '1px solid rgba(236, 240, 241, 0.5)',
        bgcolor: '#2C3E50',
        color: 'white',
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 1,
                bgcolor: '#E74C3C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                <Shield sx={{ fontSize: 18 }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  letterSpacing: '-0.5px'
                }}
              >
                CAPCMS
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              © {new Date().getFullYear()} Child Abuse Protection Case Management System. 
              All rights reserved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography 
                component={Link}
                to="/privacy"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                Privacy Policy
              </Typography>
              
              <Typography 
                component={Link}
                to="/terms"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                Terms of Service
              </Typography>
              
              <Typography 
                component={Link}
                to="/contact"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    color: 'white',
                    textDecoration: 'underline',
                  }
                }}
              >
                Contact
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;