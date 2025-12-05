import { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useDashboard } from '../hooks/useDashboard';
import StatsCards from '../components/dashboard/StatsCards';
import YearlyCasesChart from '../components/dashboard/Charts/YearlyCasesChart';
import MonthlyCasesChart from '../components/dashboard/Charts/MonthlyCasesChart';
import AbuseTypeChart from '../components/dashboard/Charts/AbuseTypeChart';
import RecentCasesTable from '../components/dashboard/RecentCasesTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const currentYear = new Date().getFullYear();
  const [yearFilter, setYearFilter] = useState(currentYear);
  const [monthFilter, setMonthFilter] = useState('all');

  const {
    dashboardData,
    yearlyStats,
    monthlyStats,
    abuseTypeStats,
    recentCases,
    isLoading,
  } = useDashboard(yearFilter, monthFilter);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Case Management System</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor case statistics and system performance
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                label="Year"
                onChange={(e) => setYearFilter(e.target.value)}
              >
                {[currentYear - 2, currentYear - 1, currentYear].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={monthFilter}
                label="Month"
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                <MenuItem value="all">All Months</MenuItem>
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <StatsCards stats={dashboardData} />
      </Box>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Yearly Cases */}
        <Grid item xs={12} lg={8}>
          <YearlyCasesChart data={yearlyStats} />
        </Grid>

        {/* Abuse Type Distribution */}
        <Grid item xs={12} lg={4}>
          <AbuseTypeChart data={abuseTypeStats} />
        </Grid>

        {/* Monthly Cases */}
        <Grid item xs={12}>
          <MonthlyCasesChart data={monthlyStats} year={yearFilter} />
        </Grid>

        {/* Recent Cases */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Cases
            </Typography>
            <RecentCasesTable cases={recentCases} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;