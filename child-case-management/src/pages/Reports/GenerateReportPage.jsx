import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  Download,
  PictureAsPdf,
  InsertDriveFile,
  DateRange,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CSVLink } from 'react-csv';
import { ABUSE_TYPES, CASE_STATUS } from '../../utils/constants';

const GenerateReportPage = () => {
  const [reportType, setReportType] = useState('case_summary');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [abuseType, setAbuseType] = useState('');
  const [status, setStatus] = useState('');
  const [includeDetails, setIncludeDetails] = useState(false);
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { value: 'case_summary', label: 'Case Summary Report' },
    { value: 'abuse_type', label: 'Abuse Type Analysis' },
    { value: 'monthly', label: 'Monthly Case Report' },
    { value: 'yearly', label: 'Yearly Statistics' },
    { value: 'perpetrator', label: 'Perpetrator Analysis' },
    { value: 'focal_person', label: 'Focal Person Performance' },
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: <PictureAsPdf /> },
    { value: 'excel', label: 'Excel', icon: <InsertDriveFile /> },
    { value: 'csv', label: 'CSV', icon: <InsertDriveFile /> },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(`Report generated successfully! Would you like to download the ${format.toUpperCase()} file?`);
    }, 2000);
  };

  // Sample data for CSV export
  const csvData = [
    ['Case ID', 'Child Name', 'Perpetrator', 'Abuse Type', 'Status', 'Report Date'],
    ['CASE-001', 'John Doe', 'Jane Smith', 'Physical Abuse', 'Closed', '2023-10-15'],
    ['CASE-002', 'Sarah Johnson', 'Mike Brown', 'Sexual Abuse', 'Under Investigation', '2023-10-16'],
    ['CASE-003', 'Alex Wilson', 'Chris Davis', 'Neglect', 'Resolved', '2023-10-17'],
  ];

  return (
    <>
      <Helmet>
        <title>Generate Reports - Case Management System</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create custom reports from case data
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Report Configuration */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Output Format</InputLabel>
                  <Select
                    value={format}
                    label="Output Format"
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    {formatOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {option.icon}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Abuse Type Filter</InputLabel>
                  <Select
                    value={abuseType}
                    label="Abuse Type Filter"
                    onChange={(e) => setAbuseType(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {Object.values(ABUSE_TYPES).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Case Status Filter</InputLabel>
                  <Select
                    value={status}
                    label="Case Status Filter"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {Object.values(CASE_STATUS).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeDetails}
                      onChange={(e) => setIncludeDetails(e.target.checked)}
                    />
                  }
                  label="Include detailed case information"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<DateRange />}
                    onClick={() => {
                      setStartDate(new Date(new Date().getFullYear(), 0, 1));
                      setEndDate(new Date());
                    }}
                  >
                    This Year
                  </Button>
                  
                  {format === 'csv' ? (
                    <CSVLink
                      data={csvData}
                      filename={`report-${new Date().toISOString().split('T')[0]}.csv`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                      >
                        Download CSV
                      </Button>
                    </CSVLink>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleGenerate}
                      disabled={generating}
                    >
                      {generating ? 'Generating...' : 'Generate Report'}
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Report Preview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Preview
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              This is a preview of what your report will include
            </Alert>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Report Type:
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {reportTypes.find(t => t.value === reportType)?.label}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Date Range:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {startDate && endDate 
                    ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                    : 'All dates'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Filters Applied:
                </Typography>
                <Typography variant="body2">
                  {abuseType && `Abuse Type: ${abuseType}`}
                  {status && ` | Status: ${status}`}
                  {!abuseType && !status && 'No filters applied'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Output Format:
                </Typography>
                <Typography variant="body2">
                  {format.toUpperCase()} {includeDetails && '| With Details'}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> Generated reports will include all cases matching your criteria. For large datasets, generation may take a few moments.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default GenerateReportPage;