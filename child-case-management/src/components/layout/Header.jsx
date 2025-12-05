import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Settings,
  Logout,
  Search,
  Help,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, useAuth, useNotifications } from '../../context/AppContext';
import SearchBar from '../common/SearchBar';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme: appTheme, toggleTheme, addNotification } = useApp();
  const { notifications } = useNotifications();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

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

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/cases': 'All Cases',
    '/cases/register': 'Register New Case',
    '/cases/search': 'Search Cases',
    '/cases/my-cases': 'My Cases',
    '/users': 'User Management',
    '/reports': 'Reports',
    '/profile': 'My Profile',
    '/settings': 'Settings',
    '/analytics': 'Case Analytics',
  };

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {currentTitle}
          </Typography>

          {/* Search Bar - Only show on certain pages */}
          {['/cases', '/cases/search', '/users'].includes(location.pathname) && (
            <Box sx={{ ml: 3, width: 300, display: { xs: 'none', md: 'block' } }}>
              <SearchBar
                placeholder="Search..."
                onSearch={handleSearch}
                size="small"
              />
            </Box>
          )}
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${appTheme === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={toggleTheme} size="small">
              {appTheme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {/* Search Button for Mobile */}
          <Tooltip title="Search">
            <IconButton
              size="small"
              onClick={() => navigate('/search')}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <Search />
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help & Support">
            <IconButton
              size="small"
              onClick={() => navigate('/help')}
            >
              <Help />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="large"
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { width: 200 },
            }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
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
              sx: { width: 320, maxHeight: 400 },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Notifications</Typography>
              {notifications.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No new notifications
                </Typography>
              )}
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;