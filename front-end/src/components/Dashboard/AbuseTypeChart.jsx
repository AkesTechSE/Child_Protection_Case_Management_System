import { Paper, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const AbuseTypeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No data available</Typography>
      </Paper>
    )
  }

  const chartData = {
    labels: data.map(item => item.abuse_type?.replace('_', ' ') || 'Unknown'),
    datasets: [
      {
        data: data.map(item => item.total || 0),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  }

  return (
    <div style={{ height: 250 }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default AbuseTypeChart