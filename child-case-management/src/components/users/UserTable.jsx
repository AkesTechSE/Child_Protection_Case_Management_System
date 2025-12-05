import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Chip,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Search,
  FilterList,
  PersonAdd,
  Email,
  Phone,
  CalendarToday,
  CheckCircle,
  Cancel,
  Block,
  Refresh,
  Download,
  Visibility,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { formatDate } from '../../utils/helpers';
import RoleBadge from './RoleBadge';
import { USER_ROLES } from '../../utils/constants';

/**
 * UserTable Component - Displays users in a sortable, filterable table
 */
const UserTable = ({ 
  users = [], 
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
  onSelect,
  selectedUsers = [],
  onSelectAll,
  page = 0,
  rowsPerPage = 10,
  totalUsers = 0,
  onPageChange,
  onRowsPerPageChange,
  searchTerm = '',
  onSearch,
  onRefresh,
  onExport,
  allowSelection = true,
  showActions = true,
  showExport = true,
  showSearch = true,
  dense = false,
  sx = {}
}) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Columns configuration
  const columns = [
    {
      id: 'name',
      label: 'User',
      minWidth: 200,
      sortable: true,
      render: (user) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontSize: '1rem',
            }}
          >
            {user.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight={500}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 120,
      sortable: true,
      render: (user) => <RoleBadge role={user.role} size="small" />,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      render: (user) => (
        <Chip
          label={user.status === 'active' ? 'Active' : 'Inactive'}
          size="small"
          color={user.status === 'active' ? 'success' : 'error'}
          variant="outlined"
          icon={user.status === 'active' ? <CheckCircle /> : <Cancel />}
          sx={{ 
            fontWeight: 500,
            '& .MuiChip-icon': { fontSize: 14 }
          }}
        />
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 130,
      sortable: false,
      render: (user) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">
            {user.phone || 'Not provided'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      sortable: true,
      render: (user) => user.department || '—',
    },
    {
      id: 'created_at',
      label: 'Joined Date',
      minWidth: 120,
      sortable: true,
      render: (user) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2">
            {formatDate(user.created_at)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'last_login',
      label: 'Last Login',
      minWidth: 120,
      sortable: true,
      render: (user) => user.last_login ? formatDate(user.last_login) : 'Never',
    },
  ];

  // Handle sort
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle action menu
  const handleActionClick = (event, userId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedUserId(null);
  };

  // Handle actions
  const handleEdit = () => {
    if (selectedUserId && onEdit) {
      onEdit(selectedUserId);
    }
    handleActionClose();
  };

  const handleDelete = () => {
    if (selectedUserId && onDelete) {
      onDelete(selectedUserId);
    }
    handleActionClose();
  };

  const handleView = () => {
    if (selectedUserId) {
      navigate(`/users/${selectedUserId}`);
    }
    handleActionClose();
  };

  const handleStatusToggle = () => {
    if (selectedUserId && onStatusChange) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        onStatusChange(selectedUserId, user.status === 'active' ? 'inactive' : 'active');
      }
    }
    handleActionClose();
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc' 
        ? a.name?.localeCompare(b.name)
        : b.name?.localeCompare(a.name);
    }
    if (orderBy === 'role') {
      return order === 'asc'
        ? a.role?.localeCompare(b.role)
        : b.role?.localeCompare(a.role);
    }
    if (orderBy === 'status') {
      return order === 'asc'
        ? a.status?.localeCompare(b.status)
        : b.status?.localeCompare(a.status);
    }
    if (orderBy === 'created_at') {
      return order === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    if (orderBy === 'last_login') {
      return order === 'asc'
        ? new Date(a.last_login || 0) - new Date(b.last_login || 0)
        : new Date(b.last_login || 0) - new Date(a.last_login || 0);
    }
    return 0;
  });

  // Prepare data for export
  const exportData = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Status: user.status,
    Phone: user.phone || '',
    Department: user.department || '',
    'Joined Date': formatDate(user.created_at),
    'Last Login': user.last_login ? formatDate(user.last_login) : 'Never',
  }));

  // Check if all users on current page are selected
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;

  // Handle select all
  const handleSelectAllClick = (event) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked ? users.map(user => user.id) : []);
    }
  };

  // Handle individual selection
  const handleSelectClick = (event, userId) => {
    event.stopPropagation();
    if (onSelect) {
      const selectedIndex = selectedUsers.indexOf(userId);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = [...selectedUsers, userId];
      } else {
        newSelected = selectedUsers.filter(id => id !== userId);
      }

      onSelect(newSelected);
    }
  };

  // Render table head
  const renderTableHead = () => (
    <TableHead>
      <TableRow>
        {allowSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
              checked={isAllSelected}
              onChange={handleSelectAllClick}
              disabled={loading || users.length === 0}
            />
          </TableCell>
        )}
        
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            style={{ minWidth: column.minWidth }}
            sortDirection={orderBy === column.id ? order : false}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={() => handleRequestSort(column.id)}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {column.label}
                </Typography>
              </TableSortLabel>
            ) : (
              <Typography variant="subtitle2" fontWeight={600}>
                {column.label}
              </Typography>
            )}
          </TableCell>
        ))}
        
        {showActions && (
          <TableCell align="right">
            <Typography variant="subtitle2" fontWeight={600}>
              Actions
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );

  // Render table body
  const renderTableBody = () => {
    if (loading) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length + (allowSelection ? 1 : 0) + (showActions ? 1 : 0)}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (sortedUsers.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length + (allowSelection ? 1 : 0) + (showActions ? 1 : 0)}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No users found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Try adjusting your search' : 'Add your first user to get started'}
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {sortedUsers.map((user) => {
          const isSelected = selectedUsers.includes(user.id);
          return (
            <TableRow
              hover
              key={user.id}
              selected={isSelected}
              onClick={(event) => allowSelection && handleSelectClick(event, user.id)}
              sx={{ cursor: allowSelection ? 'pointer' : 'default' }}
            >
              {allowSelection && (
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onChange={(event) => handleSelectClick(event, user.id)}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.render ? column.render(user) : user[column.id]}
                </TableCell>
              ))}
              
              {showActions && (
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(user.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="More Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionClick(e, user.id)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', ...sx }}>
      {/* Toolbar */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Users ({totalUsers})
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {showSearch && (
              <TextField
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                size="small"
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            
            {showExport && (
              <CSVLink
                data={exportData}
                filename={`users-${new Date().toISOString().split('T')[0]}.csv`}
                style={{ textDecoration: 'none' }}
              >
                <Tooltip title="Export to CSV">
                  <IconButton>
                    <Download />
                  </IconButton>
                </Tooltip>
              </CSVLink>
            )}
            
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/users/new')}
            >
              Add User
            </Button>
          </Box>
        </Box>

        {/* Selected users actions */}
        {selectedUsers.length > 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-action': { alignItems: 'center' }
            }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Block />}
                  onClick={() => {
                    selectedUsers.forEach(userId => {
                      onStatusChange && onStatusChange(userId, 'inactive');
                    });
                  }}
                >
                  Deactivate
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
                      selectedUsers.forEach(userId => {
                        onDelete && onDelete(userId);
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            }
          >
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </Alert>
        )}
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size={dense ? 'small' : 'medium'}>
          {renderTableHead()}
          {renderTableBody()}
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalUsers > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleStatusToggle}>
          <ListItemIcon>
            {users.find(u => u.id === selectedUserId)?.status === 'active' ? (
              <Lock fontSize="small" />
            ) : (
              <LockOpen fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {users.find(u => u.id === selectedUserId)?.status === 'active' 
              ? 'Deactivate User' 
              : 'Activate User'}
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default UserTable;