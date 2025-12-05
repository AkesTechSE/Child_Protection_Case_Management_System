import { useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
  IconButton,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Assignment,
} from '@mui/icons-material';
import { formatDate, formatAbuseType, formatCaseStatus } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const CaseTable = ({ cases, loading, onDelete, onAssign, showActions = true }) => {
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const getStatusChip = (status) => {
    const statusColors = {
      reported: 'default',
      assigned: 'primary',
      under_investigation: 'warning',
      resolved: 'success',
      closed: 'secondary',
    };

    return (
      <Chip
        label={formatCaseStatus(status)}
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  const getAbuseTypeChip = (type) => {
    const typeColors = {
      sexual_abuse: 'error',
      physical_abuse: 'warning',
      neglect: 'info',
      emotional_abuse: 'default',
    };

    return (
      <Chip
        label={formatAbuseType(type)}
        color={typeColors[type] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  const columns = [
    {
      field: 'case_id',
      headerName: 'Case ID',
      width: 120,
    },
    {
      field: 'child_name',
      headerName: 'Child Name',
      width: 180,
    },
    {
      field: 'perpetrator_name',
      headerName: 'Perpetrator',
      width: 180,
    },
    {
      field: 'abuse_type',
      headerName: 'Abuse Type',
      width: 150,
      renderCell: (params) => getAbuseTypeChip(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'created_at',
      headerName: 'Report Date',
      width: 150,
      valueFormatter: (params) => formatDate(params.value, 'dd/MM/yyyy'),
    },
    {
      field: 'assigned_to',
      headerName: 'Assigned To',
      width: 180,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/cases/${params.row.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {showActions && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/cases/${params.row.id}/edit`)}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Assign">
                <IconButton
                  size="small"
                  onClick={() => onAssign && onAssign(params.row.id)}
                >
                  <Assignment fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => onDelete && onDelete(params.row.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <Box className="table-container" sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={cases}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 25, 50]}
        pagination
        disableSelectionOnClick
        loading={loading}
        components={{
          Toolbar: CustomToolbar,
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default CaseTable;