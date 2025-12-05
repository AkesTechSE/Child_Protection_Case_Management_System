export const USER_ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  DIRECTOR: 'director',
  FOCAL_PERSON: 'focal_person',
};

export const ABUSE_TYPES = {
  SEXUAL_ABUSE: 'sexual_abuse',
  PHYSICAL_ABUSE: 'physical_abuse',
  NEGLECT: 'neglect',
  EMOTIONAL_ABUSE: 'emotional_abuse',
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_disclose', label: 'Prefer Not to Disclose' },
];

export const RELATIONSHIP_OPTIONS = [
  { value: 'parent', label: 'Parent' },
  { value: 'stepparent', label: 'Stepparent' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'relative', label: 'Relative' },
  { value: 'babysitter', label: 'Babysitter' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'stranger', label: 'Stranger' },
  { value: 'other', label: 'Other' },
];

export const CASE_STATUS = {
  REPORTED: 'reported',
  ASSIGNED: 'assigned',
  UNDER_INVESTIGATION: 'under_investigation',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh',
  },
  CASES: {
    BASE: '/cases',
    SEARCH: '/cases/search',
    STATS: '/cases/stats',
    ASSIGN: '/cases/:id/assign',
    STATUS: '/cases/:id/status',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    METRICS: '/dashboard/metrics',
  },
  USERS: {
    BASE: '/users',
    ROLES: '/users/roles',
  },
  REPORTS: {
    GENERATE: '/reports/generate',
    DOWNLOAD: '/reports/download',
  },
};