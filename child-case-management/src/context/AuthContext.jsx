import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { USER_ROLES } from '../utils/constants';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          // Verify token
          const profile = await authService.getProfile();
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user: profile } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        authService.clearAuth();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login({ email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: { error: error.message } });
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const hasPermission = (permission) => {
    if (!state.user?.role) return false;

    const permissions = {
      [USER_ROLES.SYSTEM_ADMIN]: {
        canManageUsers: true,
        canUpdateLandingPage: true,
        canViewDashboard: true,
        canSearchPerpetrators: true,
        canManageFocalPersons: true,
        canGenerateReports: true,
        canRegisterCases: true,
      },
      [USER_ROLES.DIRECTOR]: {
        canManageUsers: false,
        canUpdateLandingPage: false,
        canViewDashboard: true,
        canSearchPerpetrators: true,
        canManageFocalPersons: true,
        canGenerateReports: true,
        canRegisterCases: false,
      },
      [USER_ROLES.FOCAL_PERSON]: {
        canManageUsers: false,
        canUpdateLandingPage: false,
        canViewDashboard: true,
        canSearchPerpetrators: true,
        canManageFocalPersons: false,
        canGenerateReports: false,
        canRegisterCases: true,
      },
    };

    return permissions[state.user.role]?.[permission] || false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};