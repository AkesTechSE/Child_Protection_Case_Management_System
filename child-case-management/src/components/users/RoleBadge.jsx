import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import {
  Security,
  SupervisorAccount,
  Person,
  AdminPanelSettings,
  VerifiedUser,
} from '@mui/icons-material';
import { USER_ROLES } from '../../utils/constants';

/**
 * RoleBadge Component - Displays user role with appropriate styling
 * @param {string} role - The user role
 * @param {string} variant - 'chip' or 'badge'
 * @param {boolean} showIcon - Whether to show icon
 * @param {string} size - 'small', 'medium', 'large'
 */
const RoleBadge = ({ 
  role, 
  variant = 'chip', 
  showIcon = true, 
  size = 'medium',
  onClick,
  onDelete,
  deletable = false,
  sx = {}
}) => {
  // Role configurations
  const roleConfig = {
    [USER_ROLES.SYSTEM_ADMIN]: {
      label: 'System Admin',
      color: 'error',
      icon: <AdminPanelSettings />,
      description: 'Full system access, can manage all users and settings',
      backgroundColor: '#ffebee',
      textColor: '#c62828',
    },
    [USER_ROLES.DIRECTOR]: {
      label: 'Director',
      color: 'primary',
      icon: <SupervisorAccount />,
      description: 'Can view all cases, manage focal persons, generate reports',
      backgroundColor: '#e3f2fd',
      textColor: '#1565c0',
    },
    [USER_ROLES.FOCAL_PERSON]: {
      label: 'Focal Person',
      color: 'success',
      icon: <Person />,
      description: 'Can register new cases and search perpetrators',
      backgroundColor: '#e8f5e9',
      textColor: '#2e7d32',
    },
    admin: {
      label: 'Admin',
      color: 'error',
      icon: <Security />,
      description: 'Administrative privileges',
      backgroundColor: '#ffebee',
      textColor: '#c62828',
    },
    manager: {
      label: 'Manager',
      color: 'warning',
      icon: <VerifiedUser />,
      description: 'Management level access',
      backgroundColor: '#fff8e1',
      textColor: '#ff8f00',
    },
    user: {
      label: 'User',
      color: 'default',
      icon: <Person />,
      description: 'Standard user access',
      backgroundColor: '#f5f5f5',
      textColor: '#616161',
    },
  };

  // Get role configuration or default to user
  const config = roleConfig[role] || roleConfig.user;

  // Size configurations
  const sizeConfig = {
    small: {
      chipSize: 'small',
      iconSize: 14,
      fontSize: '0.75rem',
      padding: '2px 8px',
    },
    medium: {
      chipSize: 'medium',
      iconSize: 16,
      fontSize: '0.875rem',
      padding: '4px 12px',
    },
    large: {
      chipSize: 'medium', // Chip doesn't have large size
      iconSize: 20,
      fontSize: '1rem',
      padding: '6px 16px',
    },
  };

  const { chipSize, iconSize, fontSize, padding } = sizeConfig[size];

  // Custom badge variant
  if (variant === 'badge') {
    return (
      <Tooltip title={config.description}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            padding,
            borderRadius: '16px',
            backgroundColor: config.backgroundColor,
            color: config.textColor,
            fontSize,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              opacity: 0.9,
              transform: 'translateY(-1px)',
            },
            ...sx,
          }}
          onClick={onClick}
        >
          {showIcon && (
            <Box sx={{ 
              display: 'flex',
              '& svg': { 
                fontSize: `${iconSize}px`,
              }
            }}>
              {config.icon}
            </Box>
          )}
          {config.label}
        </Box>
      </Tooltip>
    );
  }

  // Chip variant (default)
  return (
    <Tooltip title={config.description}>
      <Chip
        label={config.label}
        color={config.color}
        size={chipSize}
        icon={showIcon ? config.icon : undefined}
        onClick={onClick}
        onDelete={deletable ? onDelete : undefined}
        deleteIcon={deletable ? undefined : null}
        sx={{
          fontWeight: 500,
          '& .MuiChip-icon': {
            fontSize: iconSize,
          },
          '& .MuiChip-label': {
            fontSize,
          },
          ...sx,
        }}
      />
    </Tooltip>
  );
};

/**
 * RoleBadgeGroup Component - Displays multiple roles
 */
export const RoleBadgeGroup = ({ roles, maxDisplay = 3, size = 'small', ...props }) => {
  if (!roles || roles.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        No roles assigned
      </Typography>
    );
  }

  const displayRoles = roles.slice(0, maxDisplay);
  const extraCount = roles.length - maxDisplay;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      {displayRoles.map((role, index) => (
        <RoleBadge
          key={`${role}-${index}`}
          role={role}
          size={size}
          variant="badge"
          {...props}
        />
      ))}
      
      {extraCount > 0 && (
        <Tooltip title={`+${extraCount} more roles`}>
          <Chip
            label={`+${extraCount}`}
            size="small"
            sx={{
              backgroundColor: 'grey.200',
              color: 'grey.700',
              fontSize: '0.7rem',
              height: '20px',
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

/**
 * RoleSelector Component - For selecting roles in forms
 */
export const RoleSelector = ({ value, onChange, multiple = false, sx = {} }) => {
  const roles = [
    { value: USER_ROLES.SYSTEM_ADMIN, label: 'System Admin' },
    { value: USER_ROLES.DIRECTOR, label: 'Director' },
    { value: USER_ROLES.FOCAL_PERSON, label: 'Focal Person' },
  ];

  const handleRoleClick = (roleValue) => {
    if (multiple) {
      const newValue = value.includes(roleValue)
        ? value.filter(v => v !== roleValue)
        : [...value, roleValue];
      onChange(newValue);
    } else {
      onChange(roleValue);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ...sx }}>
      {roles.map((role) => {
        const isSelected = multiple 
          ? value.includes(role.value)
          : value === role.value;

        return (
          <Box
            key={role.value}
            onClick={() => handleRoleClick(role.value)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: `2px solid ${isSelected ? '#1976d2' : '#e0e0e0'}`,
              backgroundColor: isSelected ? '#e3f2fd' : 'white',
              color: isSelected ? '#1976d2' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <RoleBadge
              role={role.value}
              variant="badge"
              showIcon={true}
              size="small"
              sx={{ pointerEvents: 'none' }}
            />
            <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
              {role.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

/**
 * RoleStatusIndicator - Shows role with status
 */
export const RoleStatusIndicator = ({ role, status = 'active', size = 'medium' }) => {
  const statusColors = {
    active: '#4caf50',
    inactive: '#f44336',
    pending: '#ff9800',
    suspended: '#9e9e9e',
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <RoleBadge role={role} size={size} />
      <Box
        sx={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColors[status] || '#9e9e9e',
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Typography>
    </Box>
  );
};

export default RoleBadge;