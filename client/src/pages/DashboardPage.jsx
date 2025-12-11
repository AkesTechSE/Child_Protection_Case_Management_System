// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Button,
  useTheme,
  alpha
} from '@mui/material'
import {
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Assignment as CaseIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector, LabelList
} from 'recharts'
import dayjs from 'dayjs'
import { dashboardApi } from '../api/dashboard'

const DashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    newThisWeek: 0,
  })
  const [abuseTypeData, setAbuseTypeData] = useState([])
  const [monthlyCases, setMonthlyCases] = useState([])
  const [recentCases, setRecentCases] = useState([])
  const [activePieIndex, setActivePieIndex] = useState(0)
  const navigate = useNavigate()
  const theme = useTheme()

  // Enhanced color palette for charts
  const ABUSE_TYPE_COLORS = [
    '#E74C3C', // Red
    '#2ECC71', // Green
    '#3498DB', // Blue
    '#F39C12', // Orange
    '#9B59B6', // Purple
    '#1ABC9C', // Teal
    '#34495E', // Dark Blue
    '#E67E22', // Dark Orange
  ]

  const MONTHLY_COLORS = [
    '#E74C3C', '#C0392B', '#D35400', '#E67E22', '#F39C12',
    '#27AE60', '#16A085', '#2980B9', '#8E44AD', '#2C3E50'
  ]

  // Custom styled tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper 
          elevation={3}
          sx={{ 
            p: 2, 
            bgcolor: '#2C3E50',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            minWidth: 120
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: entry.color,
                  mr: 1 
                }} 
              />
              <Typography variant="body2">
                {entry.dataKey}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Paper>
      )
    }
    return null
  }

  // Custom legend for pie chart
  const renderCustomizedLegend = (props) => {
    const { payload } = props
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
        {payload.map((entry, index) => (
          <Chip
            key={`legend-${index}`}
            label={entry.value}
            size="small"
            sx={{
              bgcolor: alpha(entry.color, 0.1),
              color: entry.color,
              border: `1px solid ${alpha(entry.color, 0.3)}`,
              fontWeight: 500,
              '& .MuiChip-label': { px: 1.5 }
            }}
          />
        ))}
      </Box>
    )
  }

  // Active shape for pie chart on hover
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#2C3E50" fontSize={12}>
          {`${payload.name}: ${value}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={11}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    )
  }

  // Fetch dashboard data with real API responses
  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')

    try {
      const [statsResponse, abuseTypeResponse, recentCasesResponse] = await Promise.allSettled([
        dashboardApi.getStats(),
        dashboardApi.getAbuseTypeStats(),
        dashboardApi.getRecentCases()
      ])

      if (statsResponse.status === 'fulfilled') {
        const statsPayload = statsResponse.value || {}
        const recentFromStats = statsPayload.recent_cases || []
        const weeklyCount = recentFromStats.filter((item) =>
          dayjs(item.created_at).isAfter(dayjs().subtract(7, 'day'))
        ).length

        setStats({
          totalCases: statsPayload.total_cases || 0,
          activeCases: statsPayload.open_cases || 0,
          resolvedCases: statsPayload.closed_cases || 0,
          newThisWeek: weeklyCount,
        })

        setMonthlyCases(
          (statsPayload.monthly_stats || []).map((item) => ({
            month: item.month || item.month_name || 'N/A',
            cases: item.total ?? item.total_cases ?? 0,
            raw: item,
          }))
        )

        if (recentFromStats.length && recentCasesResponse.status !== 'fulfilled') {
          setRecentCases(recentFromStats)
        }

        if (statsPayload.by_type?.length) {
          setAbuseTypeData(statsPayload.by_type)
        }
      } else {
        console.error('Stats API failed:', statsResponse.reason)
        setError('Unable to load summary statistics.')
      }

      if (abuseTypeResponse.status === 'fulfilled') {
        const abuseData = abuseTypeResponse.value || []
        if (abuseData.length) {
          setAbuseTypeData(abuseData)
        }
      } else if (!abuseTypeResponse.reason && !abuseTypeData.length) {
        setAbuseTypeData([])
      }

      if (recentCasesResponse.status === 'fulfilled') {
        setRecentCases(recentCasesResponse.value || [])
      } else if (recentCasesResponse.status === 'rejected' && !recentCases.length) {
        setRecentCases([])
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Format abuse type names for display
  const formatAbuseTypeName = (name) => {
    if (!name) {
      return 'Unknown'
    }
    return name
      .toString()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formattedPieData = useMemo(() => {
    return (abuseTypeData || []).map((item) => {
      const rawName = item.abuse_type || item.name || item.label || 'unknown'
      const value = item.total ?? item.value ?? 0
      return {
        ...item,
        name: rawName,
        value,
        label: item.label || formatAbuseTypeName(rawName)
      }
    })
  }, [abuseTypeData])

  const abuseColorMap = useMemo(() => {
    const map = {}
    formattedPieData.forEach((item, index) => {
      map[item.name] = ABUSE_TYPE_COLORS[index % ABUSE_TYPE_COLORS.length]
    })
    return map
  }, [formattedPieData])

  const onPieEnter = (_, index) => {
    setActivePieIndex(index)
  }

  const activeCasePercent = stats.totalCases
    ? Math.min((stats.activeCases / stats.totalCases) * 100, 100)
    : 0

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#E74C3C' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>
            Dashboard Overview
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDashboardData}
            sx={{
              borderColor: '#E74C3C',
              color: '#E74C3C',
              '&:hover': {
                borderColor: '#C0392B',
                bgcolor: alpha('#E74C3C', 0.04)
              }
            }}
          >
            Refresh Data
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #E74C3C',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha('#E74C3C', 0.1),
                  mr: 2 
                }}>
                  <CaseIcon sx={{ color: '#E74C3C', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#7F8C8D', fontWeight: 600 }}>
                  Total Cases
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                {stats.totalCases}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: '#27AE60', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#27AE60' }}>
                  +{stats.newThisWeek} this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #3498DB',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha('#3498DB', 0.1),
                  mr: 2 
                }}>
                  <WarningIcon sx={{ color: '#3498DB', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#7F8C8D', fontWeight: 600 }}>
                  Active Cases
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                {stats.activeCases}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={activeCasePercent} 
                sx={{ 
                  mt: 2, 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: alpha('#3498DB', 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#3498DB',
                    borderRadius: 3
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #2ECC71',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha('#2ECC71', 0.1),
                  mr: 2 
                }}>
                  <CheckCircleIcon sx={{ color: '#2ECC71', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#7F8C8D', fontWeight: 600 }}>
                  Resolved Cases
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                {stats.resolvedCases}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#2C3E50' }}>
                  {stats.totalCases > 0 ? ((stats.resolvedCases / stats.totalCases) * 100).toFixed(1) : 0}% success rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: '#FFFFFF',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: '4px solid #9B59B6',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: alpha('#9B59B6', 0.1),
                  mr: 2 
                }}>
                  <GroupIcon sx={{ color: '#9B59B6', fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ color: '#7F8C8D', fontWeight: 600 }}>
                  This Week
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                {stats.newThisWeek}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7F8C8D', mt: 1 }}>
                New cases added
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Bar Chart - Monthly Cases */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BarChartIcon sx={{ color: '#E74C3C', fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                Monthly Case Statistics
              </Typography>
            </Box>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={monthlyCases}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#ecf0f1" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={{ stroke: '#bdc3c7' }}
                  tickLine={false}
                  tick={{ fill: '#7f8c8d', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={{ stroke: '#bdc3c7' }}
                  tickLine={false}
                  tick={{ fill: '#7f8c8d', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 20,
                    fontSize: 12 
                  }}
                />
                <Bar 
                  dataKey="cases" 
                  name="Number of Cases"
                  radius={[8, 8, 0, 0]}
                  background={{ fill: '#f5f5f5', radius: 8 }}
                >
                  {monthlyCases.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={MONTHLY_COLORS[index % MONTHLY_COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                  <LabelList 
                    dataKey="cases" 
                    position="top" 
                    fill="#2C3E50" 
                    fontSize={12}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart - Abuse Type Distribution */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PieChartIcon sx={{ color: '#9B59B6', fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                Abuse Type Distribution
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1, minHeight: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={formattedPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    paddingAngle={2}
                  >
                    {formattedPieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={ABUSE_TYPE_COLORS[index % ABUSE_TYPE_COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            
            {/* Custom Legend */}
            <Box sx={{ mt: 2 }}>
              {renderCustomizedLegend({ 
                payload: formattedPieData.map((entry, index) => ({
                  value: entry.label,
                  color: ABUSE_TYPE_COLORS[index % ABUSE_TYPE_COLORS.length]
                }))
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Cases Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TimelineIcon sx={{ color: '#3498DB', fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
                Recent Cases
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Date Opened</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCases.length > 0 ? (
                    recentCases.map((caseItem) => {
                      const typeColor = abuseColorMap[caseItem.abuse_type] || '#3498DB'
                      const createdLabel = caseItem.created_at
                        ? dayjs(caseItem.created_at).format('MMM D, YYYY')
                        : 'N/A'

                      return (
                        <TableRow 
                          key={caseItem.id}
                          sx={{ 
                            '&:hover': { bgcolor: alpha('#E74C3C', 0.02) },
                            cursor: 'pointer'
                          }}
                          onClick={() => navigate(`/cases/${caseItem.id}`)}
                        >
                          <TableCell>
                            <Chip 
                              label={caseItem.case_number || '—'}
                              size="small"
                              sx={{ 
                                bgcolor: alpha('#3498DB', 0.1),
                                color: '#3498DB',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500, color: '#2C3E50' }}>
                            {caseItem.case_title || 'Untitled Case'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={formatAbuseTypeName(caseItem.abuse_type)}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(typeColor, 0.15),
                                color: typeColor
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={caseItem.status}
                              size="small"
                              sx={{ 
                                bgcolor: 
                                  caseItem.status === 'active' ? alpha('#E74C3C', 0.1) :
                                  caseItem.status === 'resolved' || caseItem.status === 'closed' ? alpha('#2ECC71', 0.1) :
                                  alpha('#F39C12', 0.1),
                                color: 
                                  caseItem.status === 'active' ? '#E74C3C' :
                                  caseItem.status === 'resolved' || caseItem.status === 'closed' ? '#2ECC71' :
                                  '#F39C12',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#7F8C8D' }}>
                            {createdLabel}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/cases/${caseItem.id}`)
                              }}
                              sx={{ 
                                color: '#3498DB',
                                '&:hover': { bgcolor: alpha('#3498DB', 0.1) }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No recent cases found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage