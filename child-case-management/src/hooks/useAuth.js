import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { USER_ROLES } from '../utils/constants';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          // Verify token by fetching profile
          const profile = await authService.getProfile();
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authService.clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user?.role) return false;
    
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

    return permissions[user.role]?.[permission] || false;
  }, [user]);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    hasPermission,
    isAuthenticated: !!user,
  };
};