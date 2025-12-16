export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Child Protection Case Management System'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const APP_VERSION = '1.0.0'

export const CASE_STATUS = {
  REPORTED: 'reported',
  ASSIGNED: 'assigned',
  UNDER_INVESTIGATION: 'under_investigation',
  INVESTIGATION: 'investigation',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REOPENED: 'reopened',
}

export const ABUSE_TYPES = {
  SEXUAL_ABUSE: 'sexual_abuse',
  PHYSICAL_ABUSE: 'physical_abuse',
  EMOTIONAL_ABUSE: 'emotional_abuse',
  NEGLECT: 'neglect',
  EXPLOITATION: 'exploitation',
  OTHER: 'other',
}

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

export const USER_ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  DIRECTOR: 'director',
  FOCAL_PERSON: 'focal_person',
}

// Roles allowed to access the Dashboard
export const DASHBOARD_ROLES = ['system_admin', 'admin', 'director', 'focal_person']

// Roles allowed to access the Reports section
export const REPORTS_ROLES = ['system_admin', 'admin', 'director']

// Compute the most appropriate landing route for a given role
export const getHomeRouteForRole = (role) => {
  return DASHBOARD_ROLES.includes(role) ? '/dashboard' : '/cases'
}

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_disclose', label: 'Prefer not to disclose' },
]

export const LOCATION_TYPES = {
  HOME: 'home',
  SCHOOL: 'school',
  ONLINE: 'online',
  PUBLIC_PLACE: 'public_place',
  OTHER: 'other',
}

export const RELATIONSHIP_TYPES = [
  'Parent',
  'Guardian',
  'Teacher',
  'Relative',
  'Neighbor',
  'Stranger',
  'Other',
]

// Formatting functions
export const formatCaseStatus = (status) => {
  const statusMap = {
    [CASE_STATUS.REPORTED]: 'Reported',
    [CASE_STATUS.ASSIGNED]: 'Assigned',
    [CASE_STATUS.UNDER_INVESTIGATION]: 'Under Investigation',
    [CASE_STATUS.INVESTIGATION]: 'Investigation',
    [CASE_STATUS.RESOLVED]: 'Resolved',
    [CASE_STATUS.CLOSED]: 'Closed',
    [CASE_STATUS.REOPENED]: 'Reopened',
  }
  return statusMap[status] || status
}

export const formatAbuseType = (type) => {
  const typeMap = {
    [ABUSE_TYPES.SEXUAL_ABUSE]: 'Sexual Abuse',
    [ABUSE_TYPES.PHYSICAL_ABUSE]: 'Physical Abuse',
    [ABUSE_TYPES.EMOTIONAL_ABUSE]: 'Emotional Abuse',
    [ABUSE_TYPES.NEGLECT]: 'Neglect',
    [ABUSE_TYPES.EXPLOITATION]: 'Exploitation',
    [ABUSE_TYPES.OTHER]: 'Other',
  }
  return typeMap[type] || type
}

export const formatUserRole = (role) => {
  const roleMap = {
    [USER_ROLES.SYSTEM_ADMIN]: 'System Administrator',
    [USER_ROLES.DIRECTOR]: 'Director',
    [USER_ROLES.FOCAL_PERSON]: 'Focal Person',
  }
  return roleMap[role] || role
}

export const formatLocationType = (type) => {
  const typeMap = {
    [LOCATION_TYPES.HOME]: 'Home',
    [LOCATION_TYPES.SCHOOL]: 'School',
    [LOCATION_TYPES.ONLINE]: 'Online',
    [LOCATION_TYPES.PUBLIC_PLACE]: 'Public Place',
    [LOCATION_TYPES.OTHER]: 'Other',
  }
  return typeMap[type] || type
}

// Utility functions
export const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.CRITICAL:
    case PRIORITY_LEVELS.HIGH:
      return 'error'
    case PRIORITY_LEVELS.MEDIUM:
      return 'warning'
    case PRIORITY_LEVELS.LOW:
      return 'success'
    default:
      return 'default'
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case CASE_STATUS.CLOSED:
    case CASE_STATUS.RESOLVED:
      return 'success'
    case CASE_STATUS.REPORTED:
      return 'error'
    case CASE_STATUS.ASSIGNED:
    case CASE_STATUS.UNDER_INVESTIGATION:
    case CASE_STATUS.INVESTIGATION:
    case CASE_STATUS.REOPENED:
      return 'warning'
    default:
      return 'default'
  }
}

// Arrays for dropdowns
export const CASE_STATUS_OPTIONS = Object.values(CASE_STATUS).map(status => ({
  value: status,
  label: formatCaseStatus(status)
}))

export const ABUSE_TYPE_OPTIONS = Object.values(ABUSE_TYPES).map(type => ({
  value: type,
  label: formatAbuseType(type)
}))

export const PRIORITY_OPTIONS = Object.values(PRIORITY_LEVELS).map(priority => ({
  value: priority,
  label: priority.charAt(0).toUpperCase() + priority.slice(1)
}))

export const USER_ROLE_OPTIONS = Object.values(USER_ROLES).map(role => ({
  value: role,
  label: formatUserRole(role)
}))