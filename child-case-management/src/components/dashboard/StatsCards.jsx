import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Assessment,
  Timeline,
  Group,
  Assignment,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Cases',
      value: stats?.total_cases || 0,
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: stats?.cases_change || 0,
    },
    {
      title: 'Cases This Month',
      value: stats?.monthly_cases || 0,
      icon: <Timeline sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      change: stats?.monthly_change || 0,
    },
    {
      title: 'Active Cases',
      value: stats?.active_cases || 0,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Resolved Cases',
      value: stats?.resolved_cases || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Focal Persons',
      value: stats?.focal_persons || 0,
      icon: <Group sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
    {
      title: 'Cases Today',
      value: stats?.todays_cases || 0,
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#00acc1',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <Card className="hover-card">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ color: stat.color, mr: 2 }}>
                  {stat.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div">
                    {stat.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
              {stat.change !== undefined && (
                <Typography
                  variant="caption"
                  sx={{
                    color: stat.change >= 0 ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {stat.change >= 0 ? '↗' : '↘'} {Math.abs(stat.change)}% from last month
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;