import { useSelector } from 'react-redux'

/**
 * Custom hook for authentication and authorization
 * Provides user info and role/permission checks
 */
export const useAuth = () => {
  const { user, isAuthenticated, token, loading } = useSelector((state) => state.auth)
  
  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role
  }
  
  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.includes(user?.role)
  }
  
  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission)
  }
  
  /**
   * Check if user is admin (system_admin or admin)
   * @returns {boolean}
   */
  const isAdmin = () => {
    return ['system_admin', 'admin'].includes(user?.role)
  }
  
  /**
   * Check if user is regular user
   * @returns {boolean}
   */
  const isUser = () => {
    return user?.role === 'user'
  }
  
  /**
   * Get user's display name
   * @returns {string}
   */
  const getUserName = () => {
    return user?.name || user?.email || 'User'
  }
  
  return {
    // State
    user,
    isAuthenticated,
    token,
    loading,
    
    // Role checks
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin: isAdmin(),
    isUser: isUser(),
    
    // Convenience methods
    getUserName,
    
    // Specific role checks (add more as needed)
    isSystemAdmin: user?.role === 'system_admin',
    isManager: user?.role === 'manager',
    isFocalPerson: user?.role === 'focal_person',
    isDirector: user?.role === 'director',
  }
}

export default useAuth