// src/components/Layout/MainLayout.jsx
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Snackbar,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Folder as CasesIcon,
  Person as VictimsIcon,
  Gavel as PerpetratorsIcon,
  Assessment as ReportsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice' // Updated import path
import { DASHBOARD_ROLES, REPORTS_ROLES } from '../../utils/constants'
import { authApi } from '../../api/auth'

const drawerWidth = 280

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)

  // Keep search field in sync with current URL query (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q') || ''
    setSearchValue(q)
  }, [location.search])

  const menuItems = [
    ...(DASHBOARD_ROLES.includes(user?.role)
      ? [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }]
      : []),
    { text: 'ድርጊቶች (Cases)', icon: <CasesIcon />, path: '/cases' },
    { text: 'ተጎጂዎች (Victims)', icon: <VictimsIcon />, path: '/victims' },
    { text: 'አጥፊዎች (Perpetrators)', icon: <PerpetratorsIcon />, path: '/perpetrators' },
    ...(REPORTS_ROLES.includes(user?.role)
      ? [{ text: 'Reports', icon: <ReportsIcon />, path: '/reports' }]
      : []),
  ]

  if (user?.role === 'system_admin' || user?.role === 'admin' || user?.role === 'director') {
    menuItems.push({ text: user?.role === 'director' ? 'Focal Persons' : 'Users', icon: <UsersIcon />, path: '/users' })
  }

  if (user?.role === 'system_admin' || user?.role === 'admin') {
    menuItems.push({ text: 'Settings', icon: <SettingsIcon />, path: '/settings' })
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
    setUnreadCount(0)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  // Mock notification fetch; replace with API call when backend endpoint is available
  useEffect(() => {
    const items = [
      { id: 1, text: 'New case assigned to you', time: '1 minute ago', path: '/cases' },
      { id: 2, text: 'Follow-up required for CASE-001', time: '1 day ago', path: '/cases' },
    ]
    setNotifications(items)
    setUnreadCount(items.length)
  }, [])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      console.error('Logout failed', e)
    } finally {
      dispatch(logout())
      setSnackbarOpen(true)
      navigate('/login')
    }
  }

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    const term = searchValue.trim()
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search')
  }

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            mr: 2,
          }}
        >
          CP
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Child Protection
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Case Management
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Navigation */}
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'common.white',
                  },
                },
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '& .MuiListItemIcon-root': {
                    color: 'common.white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'grey.50',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                maxWidth: 400,
                width: '100%',
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, cursor: 'pointer' }} onClick={handleSearchSubmit} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search cases, victims, perpetrators..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.875rem',
                }}
              />
            </Box>
          </Box>

          {/* Notifications */}
          <IconButton
            sx={{ mr: 2 }}
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuOpen}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                mr: 1,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              
            </Box>
          </Box>

          {/* User Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 200, mt: 1 },
            }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }} />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { width: 320, mt: 1 },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            {notifications.length === 0 && (
              <MenuItem disabled>
                <Typography variant="body2">No new alerts</Typography>
              </MenuItem>
            )}
            {notifications.map((n) => (
              <MenuItem key={n.id} onClick={() => { if (n.path) navigate(n.path); handleNotificationsClose() }}>
                <Box>
                  <Typography variant="body2">{n.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {n.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => { navigate('/cases'); handleNotificationsClose() }}>
              <ListItemIcon>
                <CasesIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View all alerts" />
            </MenuItem>
          </Menu>
        </Toolbar>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Logged out successfully"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default MainLayout