import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon as ListIcon,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  People,
  Folder,
  Search,
  AddCircle,
  Assessment,
  Settings,
  Logout,
  ChevronLeft,
  Notifications,
  Home,
  Report,
  Security,
  Timeline,
} from '@mui/icons-material';
import { useApp, useAuth, useNotifications } from '../../context/AppContext';
import { USER_ROLES } from '../../utils/constants';
import { formatRoleName } from '../../utils/formatters';

const drawerWidth = 280;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  const { user, logout } = useAuth();
  const { theme, toggleSidebar, sidebarOpen } = useApp();
  const { notifications, markNotificationAsRead, clearNotifications } = useNotifications();
  
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        icon: <Dashboard />,
        path: '/dashboard',
        roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
      },
      {
        title: 'My Profile',
        icon: <Person />,
        path: '/profile',
        roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
      },
    ];

    const roleSpecificItems = {
      [USER_ROLES.SYSTEM_ADMIN]: [
        {
          title: 'All Cases',
          icon: <Folder />,
          path: '/cases',
        },
        {
          title: 'User Management',
          icon: <People />,
          path: '/users',
        },
        {
          title: 'Reports',
          icon: <Assessment />,
          path: '/reports',
        },
        {
          title: 'System Settings',
          icon: <Settings />,
          path: '/settings',
        },
      ],
      [USER_ROLES.DIRECTOR]: [
        {
          title: 'Search Cases',
          icon: <Search />,
          path: '/cases/search',
        },
        {
          title: 'Manage Focal Persons',
          icon: <People />,
          path: '/users/focal-persons',
        },
        {
          title: 'Generate Reports',
          icon: <Report />,
          path: '/reports',
        },
        {
          title: 'Case Analytics',
          icon: <Timeline />,
          path: '/analytics',
        },
      ],
      [USER_ROLES.FOCAL_PERSON]: [
        {
          title: 'Register Case',
          icon: <AddCircle />,
          path: '/cases/register',
        },
        {
          title: 'My Cases',
          icon: <Folder />,
          path: '/cases/my-cases',
        },
        {
          title: 'Search Perpetrators',
          icon: <Security />,
          path: '/perpetrators/search',
        },
        {
          title: 'Quick Actions',
          icon: <Assessment />,
          path: '/quick-actions',
        },
      ],
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[user?.role] || []),
    ].filter(item => item.roles?.includes(user?.role) || !item.roles);
  };

  const menuItems = getMenuItems();
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      toggleSidebar();
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleNotificationRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Drawer Header */}
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            ChildSafe
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Toolbar>
      <Divider />

      {/* User Profile */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 12px',
            bgcolor: 'primary.main',
            fontSize: '2rem',
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" noWrap fontWeight={600}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {formatRoleName(user?.role)}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {user?.email}
        </Typography>
      </Box>
      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListIcon sx={{ minWidth: 40 }}>
                  {React.cloneElement(item.icon, {
                    color: isActive ? 'primary' : 'action',
                  })}
                </ListIcon>
                <ListItemText 
                  primary={item.title} 
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Child Protection System
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 0}px` },
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap fontWeight={600}>
              {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {location.pathname === '/dashboard' ? 'Case Management Overview' : ''}
            </Typography>
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton onClick={handleNotificationClick} sx={{ mr: 1 }}>
              <Badge badgeContent={unreadNotifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} size="large">
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          {/* Profile Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 360, maxHeight: 400 },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Notifications</Typography>
              {notifications.length > 0 && (
                <Button size="small" onClick={clearNotifications}>
                  Clear All
                </Button>
              )}
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No notifications</Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={() => handleNotificationRead(notification.id)}
                    sx={{ 
                      borderLeft: notification.type === 'error' ? '3px solid #f44336' :
                                 notification.type === 'success' ? '3px solid #4caf50' :
                                 notification.type === 'warning' ? '3px solid #ff9800' : '3px solid #2196f3',
                      mb: 0.5,
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                        {notification.message}
                      </Typography>
                      {notification.action && (
                        <Typography variant="caption" color="text.secondary">
                          {notification.action}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: sidebarOpen ? drawerWidth : 0 },
          flexShrink: { md: 0 },
          transition: muiTheme.transitions.create('width', {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: sidebarOpen ? drawerWidth : 0,
              overflowX: 'hidden',
              transition: muiTheme.transitions.create('width', {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.leavingScreen,
              }),
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open={sidebarOpen}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          transition: muiTheme.transitions.create(['width', 'margin'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
          mt: 8,
          backgroundColor: 'grey.50',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;