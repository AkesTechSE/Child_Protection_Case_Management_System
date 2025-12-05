import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useCases } from '../../hooks/useCases';
import CaseTable from '../../components/cases/CaseTable';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CaseListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cases, isLoading, deleteCase, setFilters } = useCases();

  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilters({
      search: value,
      page: 1,
      limit: 10,
    });
  };

  const handleDelete = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await deleteCase(caseId);
        toast.success('Case deleted successfully');
      } catch (error) {
        toast.error('Failed to delete case');
      }
    }
  };

  const handleAssign = (caseId) => {
    navigate(`/cases/${caseId}/assign`);
  };

  return (
    <>
      <Helmet>
        <title>All Cases - Case Management System</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              All Cases
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all registered cases
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/cases/register')}
            >
              Register New Case
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <SearchBar
          placeholder="Search cases by ID, child name, or perpetrator..."
          onSearch={handleSearch}
          value={searchTerm}
          fullWidth
        />
      </Paper>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CaseTable
          cases={cases}
          loading={isLoading}
          onDelete={handleDelete}
          onAssign={handleAssign}
          showActions={true}
        />
      )}
    </>
  );
};

export default CaseListPage;