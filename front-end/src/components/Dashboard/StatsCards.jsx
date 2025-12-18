import { Grid, Paper, Typography, Box } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import PieChartIcon from '@mui/icons-material/PieChart'

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
      {icon}
    </Box>
    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="subtitle1" color="textSecondary">
      {title}
    </Typography>
  </Paper>
)

const StatsCards = ({ stats }) => {
  if (!stats) return null

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Cases"
          value={stats.total_cases || 0}
          icon={<AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Open Cases"
          value={stats.open_cases || 0}
          icon={<AssignmentLateIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Closed Cases"
          value={stats.closed_cases || 0}
          icon={<AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'success.main' }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Abuse Types"
          value={stats.by_type?.length || 0}
          icon={<PieChartIcon sx={{ fontSize: 40, color: 'secondary.main' }} />}
        />
      </Grid>
    </Grid>
  )
}

export default StatsCards