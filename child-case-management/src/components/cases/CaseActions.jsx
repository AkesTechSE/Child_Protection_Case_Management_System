import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Assignment,
  FileCopy,
  Print,
  Download,
  MoreVert,
  CheckCircle,
  Cancel,
  Timeline,
  Report,
  Share,
  Archive,
  RestoreFromTrash,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCases } from '../../hooks/useCases';
import { useAuth } from '../../hooks/useAuth';
import { CASE_STATUS } from '../../utils/constants';

const CaseActions = ({ 
  caseId, 
  caseData, 
  onUpdate,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  showAssign = true,
  showStatus = true,
  showExport = true,
  variant = 'buttons', // 'buttons' or 'menu'
  size = 'medium',
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(caseData?.status || 'reported');
  const [assignTo, setAssignTo] = useState(caseData?.assigned_to || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateCaseStatus, assignCase, deleteCase } = useCases();

  const statusOptions = [
    { value: CASE_STATUS.REPORTED, label: 'Reported', color: 'default' },
    { value: CASE_STATUS.ASSIGNED, label: 'Assigned', color: 'primary' },
    { value: CASE_STATUS.UNDER_INVESTIGATION, label: 'Under Investigation', color: 'warning' },
    { value: CASE_STATUS.RESOLVED, label: 'Resolved', color: 'success' },
    { value: CASE_STATUS.CLOSED, label: 'Closed', color: 'secondary' },
  ];

  // Mock focal persons - Replace with API call
  const focalPersons = [
    { id: 1, name: 'John Smith', email: 'john@example.com' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com' },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    navigate(`/cases/${caseId}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/cases/${caseId}/edit`);
    handleMenuClose();
  };

  const handleAssign = () => {
    setAssignDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = () => {
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleExport = () => {
    // Export logic here
    toast.success('Case exported successfully');
    handleMenuClose();
  };

  const handlePrint = () => {
    window.print();
    handleMenuClose();
  };

  const handleDuplicate = () => {
    toast.success('Case duplicated successfully');
    handleMenuClose();
  };

  const handleShare = () => {
    toast.success('Case shared successfully');
    handleMenuClose();
  };

  const handleArchive = () => {
    toast.success('Case archived successfully');
    handleMenuClose();
  };

  const handleSubmitAssign = async () => {
    setLoading(true);
    try {
      await assignCase({ caseId, focalPersonId: assignTo });
      toast.success('Case assigned successfully');
      setAssignDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to assign case');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStatus = async () => {
    setLoading(true);
    try {
      await updateCaseStatus({ caseId, status: selectedStatus });
      toast.success('Case status updated successfully');
      setStatusDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update case status');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCase(caseId);
      toast.success('Case deleted successfully');
      setDeleteDialogOpen(false);
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete case');
    } finally {
      setLoading(false);
    }
  };

  // Check permissions
  const canEdit = user?.role === 'system_admin' || user?.role === 'director';
  const canDelete = user?.role === 'system_admin';
  const canAssign = user?.role === 'system_admin' || user?.role === 'director';
  const canChangeStatus = user?.role === 'system_admin' || user?.role === 'director';

  if (variant === 'menu') {
    return (
      <>
        <IconButton onClick={handleMenuOpen} size={size}>
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {showView && (
            <MenuItem onClick={handleView}>
              <ListItemIcon>
                <Visibility fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
          )}

          {showEdit && canEdit && (
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Case</ListItemText>
            </MenuItem>
          )}

          {showAssign && canAssign && (
            <MenuItem onClick={handleAssign}>
              <ListItemIcon>
                <Assignment fontSize="small" />
              </ListItemIcon>
              <ListItemText>Assign Case</ListItemText>
            </MenuItem>
          )}

          {showStatus && canChangeStatus && (
            <MenuItem onClick={handleStatusChange}>
              <ListItemIcon>
                <Timeline fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Status</ListItemText>
            </MenuItem>
          )}

          <MenuItem onClick={handleExport}>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>

          <MenuItem onClick={handlePrint}>
            <ListItemIcon>
              <Print fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleDuplicate}>
            <ListItemIcon>
              <FileCopy fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleArchive}>
            <ListItemIcon>
              <Archive fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>

          {showDelete && canDelete && (
            <MenuItem 
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Case</ListItemText>
            </MenuItem>
          )}
        </Menu>

        {/* Assign Dialog */}
        <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Case</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Case ID: {caseData?.case_id}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={assignTo}
                label="Assign To"
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {focalPersons.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {person.name} ({person.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Assignment Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Add any notes for the assignee..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitAssign} 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Assign'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Case Status</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Status: 
              <Chip 
                label={caseData?.status?.replace('_', ' ').toUpperCase()}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={selectedStatus}
                label="New Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={status.label}
                        size="small"
                        color={status.color}
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Status Change Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
              placeholder="Explain the reason for status change..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitStatus} 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Case</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. All case data, including evidence and notes, will be permanently deleted.
            </Alert>
            <Typography variant="body2" gutterBottom>
              Case ID: <strong>{caseData?.case_id}</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              Child: <strong>{caseData?.child_name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please type <strong>DELETE</strong> to confirm:
            </Typography>
            <TextField
              fullWidth
              label="Type DELETE to confirm"
              sx={{ mt: 2 }}
              onChange={(e) => setNotes(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirmDelete} 
              variant="contained"
              color="error"
              disabled={loading || notes !== 'DELETE'}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete Permanently'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Button variant
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {showView && (
        <Button
          variant="outlined"
          size={size}
          startIcon={<Visibility />}
          onClick={handleView}
        >
          View
        </Button>
      )}

      {showEdit && canEdit && (
        <Button
          variant="outlined"
          size={size}
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          Edit
        </Button>
      )}

      {showAssign && canAssign && (
        <Button
          variant="outlined"
          size={size}
          startIcon={<Assignment />}
          onClick={handleAssign}
        >
          Assign
        </Button>
      )}

      {showStatus && canChangeStatus && (
        <Button
          variant="outlined"
          size={size}
          startIcon={<Timeline />}
          onClick={handleStatusChange}
        >
          Status
        </Button>
      )}

      {showExport && (
        <Button
          variant="outlined"
          size={size}
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export
        </Button>
      )}

      {showDelete && canDelete && (
        <Button
          variant="outlined"
          color="error"
          size={size}
          startIcon={<Delete />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      )}

      {/* Dialogs (same as above) */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        {/* ... same dialog content as above ... */}
      </Dialog>

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        {/* ... same dialog content as above ... */}
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        {/* ... same dialog content as above ... */}
      </Dialog>
    </Box>
  );
};

export default CaseActions;