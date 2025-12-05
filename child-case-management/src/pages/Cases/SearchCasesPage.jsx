import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Search, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import { useCases } from '../../hooks/useCases';
import CaseTable from '../../components/cases/CaseTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ABUSE_TYPES, CASE_STATUS } from '../../utils/constants';

const SearchCasesPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { searchCases } = useCases();

  const formik = useFormik({
    initialValues: {
      child_name: '',
      perpetrator_name: '',
      case_id: '',
      abuse_type: '',
      status: '',
      start_date: null,
      end_date: null,
      location: '',
    },
    onSubmit: async (values) => {
      setIsSearching(true);
      try {
        const results = await searchCases(values);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    },
  });

  const handleClear = () => {
    formik.resetForm();
    setSearchResults([]);
  };

  return (
    <>
      <Helmet>
        <title>Search Cases - Case Management System</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Cases
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find cases using multiple search criteria
        </Typography>
      </Box>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Child Name"
                name="child_name"
                value={formik.values.child_name}
                onChange={formik.handleChange}
                placeholder="Enter child's full or partial name"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Perpetrator Name"
                name="perpetrator_name"
                value={formik.values.perpetrator_name}
                onChange={formik.handleChange}
                placeholder="Enter perpetrator's full or partial name"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Case ID"
                name="case_id"
                value={formik.values.case_id}
                onChange={formik.handleChange}
                placeholder="Enter case ID"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Abuse Type</InputLabel>
                <Select
                  name="abuse_type"
                  value={formik.values.abuse_type}
                  label="Abuse Type"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value={ABUSE_TYPES.SEXUAL_ABUSE}>Sexual Abuse</MenuItem>
                  <MenuItem value={ABUSE_TYPES.PHYSICAL_ABUSE}>Physical Abuse</MenuItem>
                  <MenuItem value={ABUSE_TYPES.NEGLECT}>Neglect</MenuItem>
                  <MenuItem value={ABUSE_TYPES.EMOTIONAL_ABUSE}>Emotional Abuse</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Case Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  label="Case Status"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value={CASE_STATUS.REPORTED}>Reported</MenuItem>
                  <MenuItem value={CASE_STATUS.ASSIGNED}>Assigned</MenuItem>
                  <MenuItem value={CASE_STATUS.UNDER_INVESTIGATION}>Under Investigation</MenuItem>
                  <MenuItem value={CASE_STATUS.RESOLVED}>Resolved</MenuItem>
                  <MenuItem value={CASE_STATUS.CLOSED}>Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.start_date}
                  onChange={(date) => formik.setFieldValue('start_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formik.values.end_date}
                  onChange={(date) => formik.setFieldValue('end_date', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                placeholder="Enter incident location"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search />}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Search Results
            <Chip
              label={`${searchResults.length} cases found`}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
        </Box>
      )}

      {isSearching ? (
        <LoadingSpinner />
      ) : searchResults.length > 0 ? (
        <CaseTable
          cases={searchResults}
          loading={false}
          showActions={false}
        />
      ) : formik.submitCount > 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No cases found matching your search criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search parameters
          </Typography>
        </Paper>
      ) : null}
    </>
  );
};

export default SearchCasesPage;