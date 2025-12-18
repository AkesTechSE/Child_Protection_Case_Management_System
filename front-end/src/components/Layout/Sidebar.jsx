import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Collapse,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import GavelIcon from '@mui/icons-material/Gavel'
import ReportIcon from '@mui/icons-material/Report'
import PersonIcon from '@mui/icons-material/Person'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useSelector } from 'react-redux'
import { DASHBOARD_ROLES, REPORTS_ROLES } from '../../utils/constants'

const drawerWidth = 240

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openCases, setOpenCases] = useState(false)

  const { user } = useSelector((state) => state.auth)

  const menuItems = [
    ...(DASHBOARD_ROLES.includes(user?.role)
      ? [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }]
      : []),
    { 
      text: 'Cases', 
      icon: <AssignmentIcon />, 
      path: '/cases',
    },
    { text: 'Victims', icon: <PeopleIcon />, path: '/victims' },
    { text: 'Perpetrators', icon: <GavelIcon />, path: '/perpetrators' },
    ...(REPORTS_ROLES.includes(user?.role)
      ? [{ text: 'Reports', icon: <ReportIcon />, path: '/reports' }]
      : []),
    ...((user?.role === 'system_admin' || user?.role === 'admin' || user?.role === 'director')
      ? [{ text: user?.role === 'director' ? 'Focal Persons' : 'Users', icon: <PersonIcon />, path: '/users' }]
      : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              <ListItem
                button
                onClick={() => {
                  if (item.subItems) {
                    setOpenCases(!openCases)
                  } else {
                    navigate(item.path)
                  }
                }}
                sx={{
                  backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (openCases ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse in={openCases} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.text}
                        button
                        onClick={() => navigate(subItem.path)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default Sidebar