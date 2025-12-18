import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Snackbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { logout } from '../../store/authSlice'
import { authApi } from '../../api/auth'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfile = () => {
    handleClose()
    navigate('/profile')
  }

  const handleLogout = async () => {
    handleClose()
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

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
       
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {user?.name}
          </Typography>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Logged out successfully"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </AppBar>
  )
}

export default Navbar