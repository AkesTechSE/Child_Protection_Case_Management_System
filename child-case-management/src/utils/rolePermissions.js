import { USER_ROLES } from './constants';

export const PERMISSIONS = {
  [USER_ROLES.SYSTEM_ADMIN]: {
    canManageUsers: true,
    canManageRoles: true,
    canCreateAllUsers: true,
    canUpdateLandingPage: true,
    canViewDashboard: true,
    canSearchPerpetrators: true,
    canManageFocalPersons: true,
    canGenerateReports: true,
    canRegisterCases: true,
    canViewAllCases: true,
    canUpdateCases: true,
    canDeleteCases: true,
  },
  [USER_ROLES.DIRECTOR]: {
    canManageUsers: false,
    canManageRoles: false,
    canCreateAllUsers: false,
    canUpdateLandingPage: false,
    canViewDashboard: true,
    canSearchPerpetrators: true,
    canManageFocalPersons: true,
    canGenerateReports: true,
    canRegisterCases: false,
    canViewAllCases: true,
    canUpdateCases: true,
    canDeleteCases: false,
  },
  [USER_ROLES.FOCAL_PERSON]: {
    canManageUsers: false,
    canManageRoles: false,
    canCreateAllUsers: false,
    canUpdateLandingPage: false,
    canViewDashboard: true,
    canSearchPerpetrators: true,
    canManageFocalPersons: false,
    canGenerateReports: false,
    canRegisterCases: true,
    canViewAllCases: false,
    canUpdateCases: false,
    canDeleteCases: false,
  },
};

export const hasPermission = (userRole, permission) => {
  return PERMISSIONS[userRole]?.[permission] || false;
};

export const getMenuItems = (userRole) => {
  const baseItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      roles: [USER_ROLES.SYSTEM_ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
    },
  ];

  const roleSpecificItems = {
    [USER_ROLES.SYSTEM_ADMIN]: [
      {
        title: 'User Management',
        path: '/users',
        icon: 'people',
        roles: [USER_ROLES.SYSTEM_ADMIN],
      },
      {
        title: 'All Cases',
        path: '/cases',
        icon: 'folder',
        roles: [USER_ROLES.SYSTEM_ADMIN],
      },
      {
        title: 'Reports',
        path: '/reports',
        icon: 'assessment',
        roles: [USER_ROLES.SYSTEM_ADMIN],
      },
    ],
    [USER_ROLES.DIRECTOR]: [
      {
        title: 'Search Cases',
        path: '/cases/search',
        icon: 'search',
        roles: [USER_ROLES.DIRECTOR, USER_ROLES.FOCAL_PERSON],
      },
      {
        title: 'Manage Focal Persons',
        path: '/users/focal-persons',
        icon: 'manage_accounts',
        roles: [USER_ROLES.DIRECTOR],
      },
      {
        title: 'Generate Reports',
        path: '/reports',
        icon: 'assessment',
        roles: [USER_ROLES.DIRECTOR],
      },
    ],
    [USER_ROLES.FOCAL_PERSON]: [
      {
        title: 'Register Case',
        path: '/cases/register',
        icon: 'add_circle',
        roles: [USER_ROLES.FOCAL_PERSON],
      },
      {
        title: 'My Cases',
        path: '/cases/my-cases',
        icon: 'folder',
        roles: [USER_ROLES.FOCAL_PERSON],
      },
      {
        title: 'Search Perpetrators',
        path: '/perpetrators/search',
        icon: 'search',
        roles: [USER_ROLES.FOCAL_PERSON],
      },
    ],
  };

  return [
    ...baseItems,
    ...(roleSpecificItems[userRole] || []),
  ].filter(item => item.roles.includes(userRole));
};