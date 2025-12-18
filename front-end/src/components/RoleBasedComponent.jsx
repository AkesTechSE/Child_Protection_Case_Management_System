import React from 'react'
import { useAuth } from '../hooks/useAuth'

/**
 * Component that renders children only for admin users
 */
export const AdminOnly = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth()
  return isAdmin ? children : fallback
}

/**
 * Component that renders children only for users with specific roles
 */
export const RoleBased = ({ children, roles = [], fallback = null }) => {
  const { hasAnyRole } = useAuth()
  return hasAnyRole(roles) ? children : fallback
}

/**
 * Component that renders different content based on role
 */
export const RoleSwitch = ({ cases = [], defaultCase = null }) => {
  const { user } = useAuth()
  const userRole = user?.role
  
  // Find matching case
  const matchedCase = cases.find(c => c.role === userRole)
  
  return matchedCase?.component || defaultCase || null
}

