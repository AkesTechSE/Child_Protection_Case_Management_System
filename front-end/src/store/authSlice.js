// store/authSlice.js - COMPLETE FILE
import { createSlice } from '@reduxjs/toolkit'

// Load initial state from localStorage
const loadFromStorage = () => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        loading: false,
        error: null
      }
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error)
  }
  
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
}

const initialState = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ ADD THIS - This matches your Login.jsx import
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      
      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
      
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
})

// ✅ Make sure to export setCredentials
export const { 
  setCredentials,      // Make sure this is exported
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser,
  clearError 
} = authSlice.actions

export default authSlice.reducer