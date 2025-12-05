import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  Collapse,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  FilterList,
  Clear,
  Search,
  DateRange,
  Person,
  LocationOn,
  CalendarToday,
  ExpandMore,
  ExpandLess,
  Timeline,
  Warning,
  Assignment,
  Download,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ABUSE_TYPES, CASE_STATUS, USER_ROLES } from '../../utils/constants';
import { formatAbuseType, formatCaseStatus } from '../../utils/formatters';

const CaseFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  onExport,
  showAdvanced = false,
  showSearch = true,
  showDateRange = true,
  showStatus = true,
  showAbuseType = true,
  showAssignedTo = true,
  showRiskLevel = true,
  showExport = true,
  focalPersons = [],
  sx = {}
}) => {
  const [expanded, setExpanded] = useState(showAdvanced);
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
    abuseType: filters.abuseType || '',
    assignedTo: filters.assignedTo || '',
    riskLevel: filters.riskLevel || [0, 100],
    dateRange: filters.dateRange || { start: null, end: null },
    hasEvidence: filters.hasEvidence || false,
    hasNotes: filters.hasNotes || false,
    urgent: filters.urgent || false,
    ...filters,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (key, date) => {
    const newDateRange = { ...localFilters.dateRange, [key]: date };
    handleFilterChange('dateRange', newDateRange);
  };

  const handleRiskLevelChange = (event, newValue) => {
    handleFilterChange('riskLevel', newValue);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      status: '',
      abuseType: '',
      assignedTo: '',
      riskLevel: [0, 100],
      dateRange: { start: null, end: null },
      hasEvidence: false,
      hasNotes: false,
      urgent: false,
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleExport = () => {
    if (onExport) {
      onExport(localFilters);
    }
  };

  const activeFiltersCount = Object.entries({
    search: localFilters.search,
    status: localFilters.status,
    abuseType: localFilters.abuseType,
    assignedTo: localFilters.assignedTo,
    riskLevel: localFilters.riskLevel[0] > 0 || localFilters.riskLevel[1] < 100 ? true : false,
    dateRange: localFilters.dateRange.start || localFilters.dateRange.end,
    hasEvidence: localFilters.hasEvidence,
    hasNotes: localFilters.hasNotes,
    urgent: localFilters.urgent,
  }).filter(([_, value]) => Boolean(value) && !(Array.isArray(value) && value[0] === 0 && value[1] === 100)).length;

  const renderActiveFilters = () => {
    const active = [];
    
    if (localFilters.search) {
      active.push(`Search: "${localFilters.search}"`);
    }
    if (localFilters.status) {
      active.push(`Status: ${formatCaseStatus(localFilters.status)}`);
    }
    if (localFilters.abuseType) {
      active.push(`Type: ${formatAbuseType(localFilters.abuseType)}`);
    }
    if (localFilters.assignedTo) {
      const person = focalPersons.find(p => p.id === localFilters.assignedTo);
      active.push(`Assigned: ${person?.name || localFilters.assignedTo}`);
    }
    if (localFilters.riskLevel[0] > 0 || localFilters.riskLevel[1] < 100) {
      active.push(`Risk: ${localFilters.riskLevel[0]}%-${localFilters.riskLevel[1]}%`);
    }
    if (localFilters.dateRange.start || localFilters.dateRange.end) {
      const start = localFilters.dateRange.start ? new Date(localFilters.dateRange.start).toLocaleDateString() : 'Any';
      const end = localFilters.dateRange.end ? new Date(localFilters.dateRange.end).toLocaleDateString() : 'Any';
      active.push(`Date: ${start} - ${end}`);
    }
    if (localFilters.hasEvidence) active.push('Has Evidence');
    if (localFilters.hasNotes) active.push('Has Notes');
    if (localFilters.urgent) active.push('Urgent');

    return active;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6">Filters</Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} active`}
              size="small" 
              color="primary"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          {activeFiltersCount > 0 && (
            <Button
              startIcon={<Clear />}
              onClick={handleReset}
              size="small"
            >
              Clear All
            </Button>
          )}
          {showExport && (
            <Button
              startIcon={<Download />}
              onClick={handleExport}
              variant="outlined"
              size="small"
            >
              Export
            </Button>
          )}
        </Box>
      </Box>

      {/* Basic Filters */}
      <Grid container spacing={2}>
        {showSearch && (
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Cases"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by ID, name, or description..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        {showStatus && (
          <Grid item xs={12} md={showSearch ? 4 : 6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={localFilters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Timeline fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(CASE_STATUS).map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatCaseStatus(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {showAbuseType && (
          <Grid item xs={12} md={showSearch ? 4 : 6}>
            <FormControl fullWidth size="small">
              <InputLabel>Abuse Type</InputLabel>
              <Select
                value={localFilters.abuseType}
                label="Abuse Type"
                onChange={(e) => handleFilterChange('abuseType', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Warning fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.values(ABUSE_TYPES).map((type) => (
                  <MenuItem key={type} value={type}>
                    {formatAbuseType(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Advanced Filters
        </Typography>

        <Grid container spacing={3}>
          {/* Date Range */}
          {showDateRange && (
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={localFilters.dateRange.start}
                      onChange={(date) => handleDateChange('start', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={localFilters.dateRange.end}
                      onChange={(date) => handleDateChange('end', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
          )}

          {/* Assigned To */}
          {showAssignedTo && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={localFilters.assignedTo}
                  label="Assigned To"
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Assignment fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Assignees</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  <MenuItem value="me">Assigned to Me</MenuItem>
                  <Divider />
                  {focalPersons.map((person) => (
                    <MenuItem key={person.id} value={person.id}>
                      {person.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Risk Level Slider */}
          {showRiskLevel && (
            <Grid item xs={12}>
              <Box sx={{ px: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Risk Level: {localFilters.riskLevel[0]}% - {localFilters.riskLevel[1]}%
                </Typography>
                <Slider
                  value={localFilters.riskLevel}
                  onChange={handleRiskLevelChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  sx={{ mt: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="success.main">
                    Low Risk
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    Medium
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    High Risk
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Checkbox Filters */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.hasEvidence}
                    onChange={(e) => handleFilterChange('hasEvidence', e.target.checked)}
                    size="small"
                  />
                }
                label="Has Evidence"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.hasNotes}
                    onChange={(e) => handleFilterChange('hasNotes', e.target.checked)}
                    size="small"
                  />
                }
                label="Has Notes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.urgent}
                    onChange={(e) => handleFilterChange('urgent', e.target.checked)}
                    size="small"
                  />
                }
                label="Urgent Cases"
              />
            </Stack>
          </Grid>
        </Grid>
      </Collapse>

      {/* Active Filters Display */}
      {renderActiveFilters().length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {renderActiveFilters().map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                size="small"
                onDelete={() => {
                  // Find which filter to clear based on label
                  if (filter.startsWith('Search:')) handleFilterChange('search', '');
                  else if (filter.startsWith('Status:')) handleFilterChange('status', '');
                  else if (filter.startsWith('Type:')) handleFilterChange('abuseType', '');
                  else if (filter.startsWith('Assigned:')) handleFilterChange('assignedTo', '');
                  else if (filter.startsWith('Risk:')) handleFilterChange('riskLevel', [0, 100]);
                  else if (filter.startsWith('Date:')) handleFilterChange('dateRange', { start: null, end: null });
                  else if (filter === 'Has Evidence') handleFilterChange('hasEvidence', false);
                  else if (filter === 'Has Notes') handleFilterChange('hasNotes', false);
                  else if (filter === 'Urgent') handleFilterChange('urgent', false);
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CaseFilters;