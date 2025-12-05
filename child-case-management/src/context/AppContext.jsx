import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";

import toast from 'react-hot-toast';
import { USER_ROLES, ABUSE_TYPES, CASE_STATUS } from '../utils/constants';

// Initial state
const initialState = {
  // User & Auth
  user: null,
  isAuthenticated: false,
  
  // UI State
  theme: 'light',
  language: 'en',
  sidebarOpen: true,
  notifications: [],
  
  // Data State
  cases: [],
  users: [],
  focalPersons: [],
  dashboardStats: null,
  recentActivity: [],
  
  // Loading States
  isLoading: {
    cases: false,
    users: false,
    dashboard: false,
    reports: false,
  },
  
  // Filters
  filters: {
    cases: {
      status: '',
      abuseType: '',
      dateRange: {},
      assignedTo: '',
      search: '',
    },
    users: {
      role: '',
      status: '',
      search: '',
    },
  },
  
  // Pagination
  pagination: {
    cases: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    users: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  },
  
  // Selected Items
  selectedCases: [],
  selectedUsers: [],
  
  // Modals
  modals: {
    createCase: false,
    editCase: false,
    createUser: false,
    editUser: false,
    viewCase: false,
    assignCase: false,
    generateReport: false,
  },
  
  // Current Selections
  currentCase: null,
  currentUser: null,
  currentReport: null,
};

// Action Types
const ActionTypes = {
  // Auth Actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  
  // UI Actions
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Data Actions
  SET_CASES: 'SET_CASES',
  ADD_CASE: 'ADD_CASE',
  UPDATE_CASE: 'UPDATE_CASE',
  DELETE_CASE: 'DELETE_CASE',
  SET_USERS: 'SET_USERS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  SET_FOCAL_PERSONS: 'SET_FOCAL_PERSONS',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  SET_RECENT_ACTIVITY: 'SET_RECENT_ACTIVITY',
  
  // Loading Actions
  SET_LOADING: 'SET_LOADING',
  
  // Filter Actions
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // Pagination Actions
  SET_PAGINATION: 'SET_PAGINATION',
  
  // Selection Actions
  SELECT_CASE: 'SELECT_CASE',
  SELECT_USER: 'SELECT_USER',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  
  // Modal Actions
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  CLOSE_ALL_MODALS: 'CLOSE_ALL_MODALS',
  
  // Current Item Actions
  SET_CURRENT_CASE: 'SET_CURRENT_CASE',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_CURRENT_REPORT: 'SET_CURRENT_REPORT',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // Auth Actions
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        theme: state.theme,
        language: state.language,
      };
      
    // UI Actions
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
      
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
      
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50), // Limit to 50
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
      
    // Data Actions
    case ActionTypes.SET_CASES:
      return {
        ...state,
        cases: action.payload,
      };
      
    case ActionTypes.ADD_CASE:
      return {
        ...state,
        cases: [action.payload, ...state.cases],
      };
      
    case ActionTypes.UPDATE_CASE:
      return {
        ...state,
        cases: state.cases.map(caseItem => 
          caseItem.id === action.payload.id ? action.payload : caseItem
        ),
        currentCase: state.currentCase?.id === action.payload.id ? action.payload : state.currentCase,
      };
      
    case ActionTypes.DELETE_CASE:
      return {
        ...state,
        cases: state.cases.filter(caseItem => caseItem.id !== action.payload),
        selectedCases: state.selectedCases.filter(id => id !== action.payload),
        currentCase: state.currentCase?.id === action.payload ? null : state.currentCase,
      };
      
    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
      
    case ActionTypes.ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
      
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
      
    case ActionTypes.DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        selectedUsers: state.selectedUsers.filter(id => id !== action.payload),
        currentUser: state.currentUser?.id === action.payload ? null : state.currentUser,
      };
      
    case ActionTypes.SET_FOCAL_PERSONS:
      return {
        ...state,
        focalPersons: action.payload,
      };
      
    case ActionTypes.SET_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
      };
      
    case ActionTypes.SET_RECENT_ACTIVITY:
      return {
        ...state,
        recentActivity: action.payload,
      };
      
    // Loading Actions
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          ...action.payload,
        },
      };
      
    // Filter Actions
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: {
            ...state.filters[action.payload.type],
            ...action.payload.filters,
          },
        },
        pagination: {
          ...state.pagination,
          [action.payload.type]: {
            ...state.pagination[action.payload.type],
            page: 1, // Reset to first page when filters change
          },
        },
      };
      
    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload]: initialState.filters[action.payload],
        },
        pagination: {
          ...state.pagination,
          [action.payload]: initialState.pagination[action.payload],
        },
      };
      
    // Pagination Actions
    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.type]: {
            ...state.pagination[action.payload.type],
            ...action.payload.pagination,
          },
        },
      };
      
    // Selection Actions
    case ActionTypes.SELECT_CASE:
      return {
        ...state,
        selectedCases: action.payload.reset 
          ? [action.payload.caseId]
          : state.selectedCases.includes(action.payload.caseId)
            ? state.selectedCases.filter(id => id !== action.payload.caseId)
            : [...state.selectedCases, action.payload.caseId],
      };
      
    case ActionTypes.SELECT_USER:
      return {
        ...state,
        selectedUsers: action.payload.reset 
          ? [action.payload.userId]
          : state.selectedUsers.includes(action.payload.userId)
            ? state.selectedUsers.filter(id => id !== action.payload.userId)
            : [...state.selectedUsers, action.payload.userId],
      };
      
    case ActionTypes.CLEAR_SELECTIONS:
      return {
        ...state,
        selectedCases: [],
        selectedUsers: [],
      };
      
    // Modal Actions
    case ActionTypes.OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: true,
        },
      };
      
    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: false,
        },
      };
      
    case ActionTypes.CLOSE_ALL_MODALS:
      return {
        ...state,
        modals: initialState.modals,
      };
      
    // Current Item Actions
    case ActionTypes.SET_CURRENT_CASE:
      return {
        ...state,
        currentCase: action.payload,
      };
      
    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
      
    case ActionTypes.SET_CURRENT_REPORT:
      return {
        ...state,
        currentReport: action.payload,
      };
      
    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { value: storedTheme, setValue: setStoredTheme } = useLocalStorage('app-theme', 'light');
  const { value: storedLanguage, setValue: setStoredLanguage } = useLocalStorage('app-language', 'en');

  // Initialize theme and language from localStorage
  useEffect(() => {
    if (storedTheme !== state.theme) {
      dispatch({ type: ActionTypes.SET_THEME, payload: storedTheme });
    }
    if (storedLanguage !== state.language) {
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: storedLanguage });
    }
  }, []);

  // Save theme and language to localStorage when they change
  useEffect(() => {
    setStoredTheme(state.theme);
  }, [state.theme, setStoredTheme]);

  useEffect(() => {
    setStoredLanguage(state.language);
  }, [state.language, setStoredLanguage]);

  // Auth Actions
  const setUser = useCallback((user) => {
    dispatch({ type: ActionTypes.SET_USER, payload: user });
    if (user) {
      toast.success(`Welcome back, ${user.name}!`);
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: ActionTypes.LOGOUT });
    dispatch({ type: ActionTypes.CLOSE_ALL_MODALS });
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });
    toast.success('Logged out successfully');
  }, []);

  // UI Actions
  const setTheme = useCallback((theme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    toast.success(`Theme changed to ${theme} mode`);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [state.theme, setTheme]);

  const setLanguage = useCallback((language) => {
    dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
    toast.success(`Language changed to ${language}`);
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const fullNotification = {
      id,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: fullNotification });
    
    // Show toast for important notifications
    if (notification.type === 'error') {
      toast.error(notification.message);
    } else if (notification.type === 'success') {
      toast.success(notification.message);
    } else if (notification.type === 'warning') {
      toast(notification.message, { icon: '⚠️' });
    }
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notificationId });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  }, []);

  // Case Actions
  const setCases = useCallback((cases) => {
    dispatch({ type: ActionTypes.SET_CASES, payload: cases });
  }, []);

  const addCase = useCallback((caseData) => {
    dispatch({ type: ActionTypes.ADD_CASE, payload: caseData });
    addNotification({
      type: 'success',
      message: 'New case registered successfully',
      action: `Case #${caseData.case_id}`,
    });
  }, [addNotification]);

  const updateCase = useCallback((caseData) => {
    dispatch({ type: ActionTypes.UPDATE_CASE, payload: caseData });
    addNotification({
      type: 'success',
      message: 'Case updated successfully',
      action: `Case #${caseData.case_id}`,
    });
  }, [addNotification]);

  const deleteCase = useCallback((caseId) => {
    dispatch({ type: ActionTypes.DELETE_CASE, payload: caseId });
    addNotification({
      type: 'info',
      message: 'Case deleted successfully',
    });
  }, [addNotification]);

  // User Actions
  const setUsers = useCallback((users) => {
    dispatch({ type: ActionTypes.SET_USERS, payload: users });
  }, []);

  const addUser = useCallback((userData) => {
    dispatch({ type: ActionTypes.ADD_USER, payload: userData });
    addNotification({
      type: 'success',
      message: 'User added successfully',
      action: userData.email,
    });
  }, [addNotification]);

  const updateUser = useCallback((userData) => {
    dispatch({ type: ActionTypes.UPDATE_USER, payload: userData });
    addNotification({
      type: 'success',
      message: 'User updated successfully',
      action: userData.email,
    });
  }, [addNotification]);

  const deleteUser = useCallback((userId) => {
    dispatch({ type: ActionTypes.DELETE_USER, payload: userId });
    addNotification({
      type: 'info',
      message: 'User deleted successfully',
    });
  }, [addNotification]);

  // Focal Persons Actions
  const setFocalPersons = useCallback((focalPersons) => {
    dispatch({ type: ActionTypes.SET_FOCAL_PERSONS, payload: focalPersons });
  }, []);

  // Dashboard Actions
  const setDashboardStats = useCallback((stats) => {
    dispatch({ type: ActionTypes.SET_DASHBOARD_STATS, payload: stats });
  }, []);

  const setRecentActivity = useCallback((activity) => {
    dispatch({ type: ActionTypes.SET_RECENT_ACTIVITY, payload: activity });
  }, []);

  // Loading Actions
  const setLoading = useCallback((loadingState) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loadingState });
  }, []);

  // Filter Actions
  const setFilters = useCallback((type, filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: { type, filters } });
  }, []);

  const resetFilters = useCallback((type) => {
    dispatch({ type: ActionTypes.RESET_FILTERS, payload: type });
  }, []);

  // Pagination Actions
  const setPagination = useCallback((type, pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: { type, pagination } });
  }, []);

  // Selection Actions
  const selectCase = useCallback((caseId, reset = false) => {
    dispatch({ type: ActionTypes.SELECT_CASE, payload: { caseId, reset } });
  }, []);

  const selectUser = useCallback((userId, reset = false) => {
    dispatch({ type: ActionTypes.SELECT_USER, payload: { userId, reset } });
  }, []);

  const clearSelections = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_SELECTIONS });
  }, []);

  // Modal Actions
  const openModal = useCallback((modalName) => {
    dispatch({ type: ActionTypes.OPEN_MODAL, payload: modalName });
  }, []);

  const closeModal = useCallback((modalName) => {
    dispatch({ type: ActionTypes.CLOSE_MODAL, payload: modalName });
  }, []);

  const closeAllModals = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_ALL_MODALS });
  }, []);

  // Current Item Actions
  const setCurrentCase = useCallback((caseData) => {
    dispatch({ type: ActionTypes.SET_CURRENT_CASE, payload: caseData });
  }, []);

  const setCurrentUser = useCallback((userData) => {
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: userData });
  }, []);

  const setCurrentReport = useCallback((reportData) => {
    dispatch({ type: ActionTypes.SET_CURRENT_REPORT, payload: reportData });
  }, []);

  // Permission Helpers
  const hasPermission = useCallback((permission) => {
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
        canViewAllCases: true,
        canUpdateCases: true,
        canDeleteCases: true,
        canAssignCases: true,
      },
      [USER_ROLES.DIRECTOR]: {
        canManageUsers: false,
        canUpdateLandingPage: false,
        canViewDashboard: true,
        canSearchPerpetrators: true,
        canManageFocalPersons: true,
        canGenerateReports: true,
        canRegisterCases: false,
        canViewAllCases: true,
        canUpdateCases: true,
        canDeleteCases: false,
        canAssignCases: true,
      },
      [USER_ROLES.FOCAL_PERSON]: {
        canManageUsers: false,
        canUpdateLandingPage: false,
        canViewDashboard: true,
        canSearchPerpetrators: true,
        canManageFocalPersons: false,
        canGenerateReports: false,
        canRegisterCases: true,
        canViewAllCases: false,
        canUpdateCases: false,
        canDeleteCases: false,
        canAssignCases: false,
      },
    };

    return permissions[state.user.role]?.[permission] || false;
  }, [state.user]);

  const canPerformAction = useCallback((action, resource) => {
    // Example: canPerformAction('delete', 'case')
    const role = state.user?.role;
    
    if (!role) return false;
    
    const actionMatrix = {
      [USER_ROLES.SYSTEM_ADMIN]: {
        case: { create: true, read: true, update: true, delete: true },
        user: { create: true, read: true, update: true, delete: true },
        report: { create: true, read: true, export: true },
      },
      [USER_ROLES.DIRECTOR]: {
        case: { create: false, read: true, update: true, delete: false },
        user: { create: false, read: true, update: true, delete: false },
        report: { create: true, read: true, export: true },
      },
      [USER_ROLES.FOCAL_PERSON]: {
        case: { create: true, read: false, update: false, delete: false },
        user: { create: false, read: false, update: false, delete: false },
        report: { create: false, read: false, export: false },
      },
    };

    return actionMatrix[role]?.[resource]?.[action] || false;
  }, [state.user]);

  // Statistics Helpers
  const getCaseStatistics = useCallback(() => {
    const cases = state.cases;
    
    return {
      total: cases.length,
      byStatus: Object.values(CASE_STATUS).reduce((acc, status) => {
        acc[status] = cases.filter(c => c.status === status).length;
        return acc;
      }, {}),
      byAbuseType: Object.values(ABUSE_TYPES).reduce((acc, type) => {
        acc[type] = cases.filter(c => c.abuse_type === type).length;
        return acc;
      }, {}),
      recent: cases.slice(0, 5),
      assignedToMe: state.user ? cases.filter(c => c.assigned_to === state.user.id) : [],
    };
  }, [state.cases, state.user]);

  const getUserStatistics = useCallback(() => {
    const users = state.users;
    
    return {
      total: users.length,
      byRole: Object.values(USER_ROLES).reduce((acc, role) => {
        acc[role] = users.filter(u => u.role === role).length;
        return acc;
      }, {}),
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
    };
  }, [state.users]);

  // Context Value
  const contextValue = {
    // State
    state,
    
    // Auth
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    setUser,
    logout,
    
    // UI
    theme: state.theme,
    language: state.language,
    sidebarOpen: state.sidebarOpen,
    notifications: state.notifications,
    setTheme,
    toggleTheme,
    setLanguage,
    toggleSidebar,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    
    // Data
    cases: state.cases,
    users: state.users,
    focalPersons: state.focalPersons,
    dashboardStats: state.dashboardStats,
    recentActivity: state.recentActivity,
    setCases,
    addCase,
    updateCase,
    deleteCase,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    setFocalPersons,
    setDashboardStats,
    setRecentActivity,
    
    // Loading
    isLoading: state.isLoading,
    setLoading,
    
    // Filters
    filters: state.filters,
    setFilters,
    resetFilters,
    
    // Pagination
    pagination: state.pagination,
    setPagination,
    
    // Selections
    selectedCases: state.selectedCases,
    selectedUsers: state.selectedUsers,
    selectCase,
    selectUser,
    clearSelections,
    
    // Modals
    modals: state.modals,
    openModal,
    closeModal,
    closeAllModals,
    
    // Current Items
    currentCase: state.currentCase,
    currentUser: state.currentUser,
    currentReport: state.currentReport,
    setCurrentCase,
    setCurrentUser,
    setCurrentReport,
    
    // Permissions
    hasPermission,
    canPerformAction,
    
    // Statistics
    getCaseStatistics,
    getUserStatistics,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export individual hooks for easier imports
export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useApp();
  return { theme, toggleTheme, setTheme };
};

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useApp();
  return { user, isAuthenticated, setUser, logout };
};

export const useCases = () => {
  const { 
    cases, 
    selectedCases, 
    currentCase,
    filters,
    pagination,
    isLoading,
    setCases, 
    addCase, 
    updateCase, 
    deleteCase,
    selectCase,
    setCurrentCase,
    setFilters,
    setPagination,
    setLoading,
    getCaseStatistics,
  } = useApp();
  
  return {
    cases,
    selectedCases,
    currentCase,
    filters: filters.cases,
    pagination: pagination.cases,
    isLoading: isLoading.cases,
    setCases,
    addCase,
    updateCase,
    deleteCase,
    selectCase,
    setCurrentCase,
    setFilters: (filters) => setFilters('cases', filters),
    setPagination: (pagination) => setPagination('cases', pagination),
    setLoading: (loading) => setLoading({ cases: loading }),
    getCaseStatistics,
  };
};

export const useUsers = () => {
  const { 
    users, 
    selectedUsers, 
    currentUser,
    filters,
    pagination,
    isLoading,
    setUsers, 
    addUser, 
    updateUser, 
    deleteUser,
    selectUser,
    setCurrentUser,
    setFilters,
    setPagination,
    setLoading,
    getUserStatistics,
  } = useApp();
  
  return {
    users,
    selectedUsers,
    currentUser,
    filters: filters.users,
    pagination: pagination.users,
    isLoading: isLoading.users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    selectUser,
    setCurrentUser,
    setFilters: (filters) => setFilters('users', filters),
    setPagination: (pagination) => setPagination('users', pagination),
    setLoading: (loading) => setLoading({ users: loading }),
    getUserStatistics,
  };
};

export const useDashboard = () => {
  const { 
    dashboardStats, 
    recentActivity,
    isLoading,
    setDashboardStats,
    setRecentActivity,
    setLoading,
  } = useApp();
  
  return {
    dashboardStats,
    recentActivity,
    isLoading: isLoading.dashboard,
    setDashboardStats,
    setRecentActivity,
    setLoading: (loading) => setLoading({ dashboard: loading }),
  };
};

export const useNotifications = () => {
  const { 
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
  } = useApp();
  
  return {
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
  };
};

export const useModals = () => {
  const { 
    modals,
    openModal,
    closeModal,
    closeAllModals,
  } = useApp();
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};

export default AppContext;