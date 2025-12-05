import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Folder,
  People,
  Assessment,
  Settings,
  AddCircle,
  Search,
  Person,
  Home,
  ExpandLess,
  ExpandMore,
  Security,
  Timeline,
  Report,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, useAuth } from '../../context/AppContext';
import { USER_ROLES } from '../../utils/constants';
import { formatRoleName } from '../../utils/formatters';

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();
  const { sidebarOpen } = useApp();
  const [openSubmenus, setOpenSubmenus] = React.useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Menu structure
  const menuStructure = {
    dashboard: {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
    },
    cases: {
      title: 'Cases',
      icon: <Folder />,
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
      submenu: {
        allCases: {
          title: 'All Cases',
          path: '/cases',
          roles: [USER_ROLES.SYSTEM_ADMIN],
        },
        registerCase: {
          title: 'Register Case',
          path: '/cases/register',
          roles: [USER_ROLES.FOCAL_PERSON],
        },
        myCases: {
          title: 'My Cases',
          path: '/cases/my-cases',
          roles: [USER_ROLES.FOCAL_PERSON],
        },
        searchCases: {
          title: 'Search Cases',
          path: '/cases/search',
          roles: [USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
        },
      },
    },
    users: {
      title: 'Users',
      icon: <People />,
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR],
      submenu: {
        userManagement: {
          title: 'User Management',
          path: '/users',
          roles: [USER_ROLES.SYSTEM_ADMIN],
        },
        focalPersons: {
          title: 'Focal Persons',
          path: '/users/focal-persons',
          roles: [USER_ROLES.DIRECTOR],
        },
      },
    },
    reports: {
      title: 'Reports',
      icon: <Report />,
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR],
      submenu: {
        generateReport: {
          title: 'Generate Report',
          path: '/reports',
          roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR],
        },
        analytics: {
          title: 'Analytics',
          path: '/analytics',
          roles: [USER_ROLES.DIRECTOR],
        },
      },
    },
    settings: {
      title: 'Settings',
      icon: <Settings />,
      path: '/settings',
      roles: [USER_ROLES.SYSTEM_ADMIN],
    },
    profile: {
      title: 'My Profile',
      icon: <Person />,
      path: '/profile',
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
    },
  };

  const handleToggleSubmenu = (menuKey) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isMenuItemVisible = (menuItem) => {
    if (!menuItem.roles) return true;
    return menuItem.roles.includes(user?.role);
  };

  const isSubMenuItemVisible = (submenuItem) => {
    if (!submenuItem.roles) return true;
    return submenuItem.roles.includes(user?.role);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Security sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
          {sidebarOpen && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ChildSafe
            </Typography>
          )}
        </Box>
        {sidebarOpen && (
          <Typography variant="caption" color="text.secondary">
            Case Management System
          </Typography>
        )}
      </Box>

      <Divider />

      {/* User Profile */}
      {sidebarOpen && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              margin: '0 auto 12px',
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="subtitle2" noWrap fontWeight={600}>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatRoleName(user?.role)}
          </Typography>
        </Box>
      )}

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {Object.entries(menuStructure).map(([key, menuItem]) => {
          if (!isMenuItemVisible(menuItem)) return null;

          const isActive = location.pathname === menuItem.path;
          const hasSubmenu = menuItem.submenu;
          const isSubmenuOpen = openSubmenus[key];

          if (hasSubmenu) {
            const visibleSubItems = Object.values(menuItem.submenu).filter(isSubMenuItemVisible);
            if (visibleSubItems.length === 0) return null;

            return (
              <React.Fragment key={key}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleToggleSubmenu(key)}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(menuItem.icon, {
                        color: isActive ? 'primary' : 'action',
                      })}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <>
                        <ListItemText 
                          primary={menuItem.title}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                        {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                
                <Collapse in={isSubmenuOpen && sidebarOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {Object.entries(menuItem.submenu).map(([subKey, subItem]) => {
                      if (!isSubMenuItemVisible(subItem)) return null;
                      
                      const isSubActive = location.pathname === subItem.path;
                      
                      return (
                        <ListItem key={subKey} disablePadding sx={{ pl: 4, mb: 0.5 }}>
                          <ListItemButton
                            selected={isSubActive}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              borderRadius: 2,
                              '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                },
                              },
                            }}
                          >
                            <ListItemText 
                              primary={subItem.title}
                              primaryTypographyProps={{ 
                                fontSize: '0.875rem',
                                fontWeight: isSubActive ? 600 : 400 
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItem key={key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(menuItem.path)}
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
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {React.cloneElement(menuItem.icon, {
                    color: isActive ? 'primary' : 'action',
                  })}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText 
                    primary={menuItem.title}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      {sidebarOpen && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Child Protection System
          </Typography>
        </Box>
      )}
    </Box>
  );

  const drawer = (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : sidebarOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: sidebarOpen ? 280 : 72,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );

  return drawer;
};

export default Sidebar;