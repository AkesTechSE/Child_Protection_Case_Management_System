// src/pages/ReportsPage.jsx
import React, { useRef, useState } from 'react'
import {
  Paper,
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Download, Refresh } from '@mui/icons-material'
import { reportApi } from '../api/reports'
import { formatDate } from '../utils/formatters'

const defaultEndDate = new Date()
const defaultStartDate = new Date()
// Default to last 12 months to reduce empty results
defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1)

const buildFullName = (first, last) => [first, last].filter(Boolean).join(' ').trim()
const toLocalYMD = (date) => {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  // Normalize to local day to avoid timezone shifting the requested date
  const tzAdjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tzAdjusted.toISOString().split('T')[0]
}

const ReportsPage = () => {
  const abortRef = useRef(null)
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState(defaultEndDate)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const buildComprehensiveRows = (data) => {
    const summary = data?.summary || {}
    const period = summary?.period || {}

    const cases = summary?.cases || {}
    const victims = summary?.victims || {}
    const perpetrators = summary?.perpetrators || {}
    const incidents = summary?.incidents || {}

    return [
      ['Period Start', period.start_date || ''],
      ['Period End', period.end_date || ''],
      ['Cases - Total', cases.total ?? ''],
      ['Cases - Open', cases.open ?? ''],
      ['Cases - Closed', cases.closed ?? ''],
      ['Victims - Total', victims.total ?? ''],
      ['Victims - Average Age', victims.average_age ?? ''],
      ['Perpetrators - Total', perpetrators.total ?? ''],
      ['Perpetrators - With Previous Records', perpetrators.with_previous_records ?? ''],
      ['Incidents - Total', incidents.total ?? ''],
    ]
  }

  const generateReport = async () => {
    // Cancel any in-flight request to avoid blocking and stale updates
    if (abortRef.current) {
      try { abortRef.current.abort() } catch {}
    }
    abortRef.current = new AbortController()

    setLoading(true)
    setError('')
    try {
      const params = {}
      const formattedStart = toLocalYMD(startDate)
      const formattedEnd = toLocalYMD(endDate)

      if (formattedStart) params.start_date = formattedStart
      if (formattedEnd) {
        params.end_date = formattedEnd
        if (!formattedStart) {
          params.start_date = formattedEnd
        }
      }

      // Laravel's `boolean` validation can be strict with query strings.
      // When we want "false" we send 0 to avoid 422 validation errors.
      if (tabValue === 2) params.summary = 0

      let data
      if (tabValue === 0) data = await reportApi.generateCasesReport(params, { signal: abortRef.current.signal })
      else if (tabValue === 1) data = await reportApi.generateVictimsReport(params, { signal: abortRef.current.signal })
      else if (tabValue === 2) data = await reportApi.generatePerpetratorsReport(params, { signal: abortRef.current.signal })
      else data = await reportApi.generateComprehensiveReport(params, { signal: abortRef.current.signal })

      const normalizedVictims = (data?.victims || []).map(victim => ({
        fullName: buildFullName(victim.first_name, victim.last_name),
        age: victim.age ?? '',
        gender: victim.gender || '',
        case_number: victim.case?.case_number || '',
        abuse_type: victim.case?.abuse_type || ''
      }))

      const normalizedPerpetrators = (data?.perpetrators || []).map(perpetrator => {
        const caseNumbers = (perpetrator.cases || []).map(c => c.case_number).filter(Boolean)
        const abuseTypes = (perpetrator.cases || []).map(c => c.abuse_type).filter(Boolean)

        return {
          fullName: buildFullName(perpetrator.first_name, perpetrator.last_name),
          age: perpetrator.age ?? '',
          gender: perpetrator.gender || '',
          case_number: caseNumbers.length ? caseNumbers.join(', ') : '',
          abuse_type: abuseTypes.length ? abuseTypes.join(', ') : ''
        }
      })

      setReportData({
        cases: data?.cases || [],
        victims: normalizedVictims,
        perpetrators: normalizedPerpetrators,
        comprehensive: tabValue === 3 ? data : null,
      })
    } catch (err) {
      // Handle cancellation quietly
      if (err?.original?.name === 'CanceledError' || err?.message === 'canceled') {
        setLoading(false)
        return
      }
      console.error('Failed to generate report:', err)

      const status = err?.status
      const validationDetails = err?.errors
        ? Object.values(err.errors).flat().filter(Boolean).join(' ')
        : ''
      const baseMessage = err?.message || 'Failed to generate report.'

      let message = baseMessage
      if (status === 401) message = 'Unauthorized. Please log in again and retry.'
      else if (status === 403) message = baseMessage || 'Access denied.'
      else if (status === 422) message = validationDetails ? `${baseMessage} ${validationDetails}` : baseMessage

      setError(message)
      setReportData({ cases: [], victims: [], perpetrators: [], comprehensive: null })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!reportData) return alert('No data to export.')

    let headers = []
    let rows = []

    if (tabValue === 0) {
      headers = ['Case Number', 'Title', 'Type', 'Status', 'Incident Date']
      rows = reportData.cases.map(c => [
        c.case_number || '',
        c.case_title || '',
        c.abuse_type?.replace('_', ' ') || '',
        c.status?.replace('_', ' ') || '',
        formatDate(c.incident_date) || '',
      ])
    } else if (tabValue === 1) {
      headers = ['Victim Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
      rows = reportData.victims.map(v => [
        v.fullName || '',
        v.age || '',
        v.gender || '',
        v.case_number || '',
        v.abuse_type?.replace('_', ' ') || '',
      ])
    } else if (tabValue === 2) {
      headers = ['Perpetrator Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
      rows = reportData.perpetrators.map(p => [
        p.fullName || '',
        p.age || '',
        p.gender || '',
        p.case_number || '',
        p.abuse_type?.replace('_', ' ') || '',
      ])
    } else {
      const comp = reportData.comprehensive
      if (!comp) return alert('No system report data to export.')

      headers = ['Metric', 'Value']
      rows = buildComprehensiveRows(comp)

      const casesByMonth = comp?.summary?.timeline?.cases_by_month || {}
      const monthEntries = Object.entries(casesByMonth)
        .sort(([a], [b]) => a.localeCompare(b))

      if (monthEntries.length) {
        rows.push(['', ''])
        rows.push(['Cases By Month', ''])
        rows.push(['Month', 'Cases'])
        monthEntries.forEach(([month, count]) => rows.push([month, String(count ?? 0)]))
      }
    }

    if (rows.length === 0) return alert('No data to export.')

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const renderTable = () => {
    if (!reportData) return null

    let data = []
    let columns = []

    if (tabValue === 0) {
      data = reportData.cases
      columns = ['Case Number', 'Title', 'Type', 'Status', 'Incident Date']
    } else if (tabValue === 1) {
      data = reportData.victims
      columns = ['Victim Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
    } else if (tabValue === 2) {
      data = reportData.perpetrators
      columns = ['Perpetrator Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
    } else {
      const comp = reportData.comprehensive
      if (!comp) {
        return <Box sx={{ py: 4, textAlign: 'center' }}><Typography>No data found for selected dates.</Typography></Box>
      }

      const metricRows = buildComprehensiveRows(comp)
      const casesByMonth = comp?.summary?.timeline?.cases_by_month || {}
      const monthEntries = Object.entries(casesByMonth)
        .sort(([a], [b]) => a.localeCompare(b))

      return (
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>System Summary</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metricRows.map(([metric, value]) => (
                    <TableRow key={metric}>
                      <TableCell>{metric}</TableCell>
                      <TableCell>{String(value ?? '')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Cases By Month</Typography>
            {monthEntries.length === 0 ? (
              <Typography color="text.secondary">No monthly data available for the selected period.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cases</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthEntries.map(([month, count]) => (
                      <TableRow key={month}>
                        <TableCell>{month}</TableCell>
                        <TableCell>{count ?? 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      )
    }

    if (data.length === 0) {
      return <Box sx={{ py: 4, textAlign: 'center' }}><Typography>No data found for selected dates.</Typography></Box>
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(c => <TableCell key={c} sx={{ fontWeight: 600 }}>{c}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                {tabValue === 0 && <>
                  <TableCell>{item.case_number}</TableCell>
                  <TableCell>{item.case_title}</TableCell>
                  <TableCell>{item.abuse_type ? <Chip label={item.abuse_type.replace('_', ' ')} size="small" color="primary" /> : null}</TableCell>
                  <TableCell>{item.status ? <Chip label={item.status.replace('_', ' ')} size="small" color={item.status === 'closed' ? 'success' : 'warning'} /> : null}</TableCell>
                  <TableCell>{formatDate(item.incident_date)}</TableCell>
                </>}
                {tabValue === 1 && <>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.case_number}</TableCell>
                  <TableCell>{item.abuse_type ? item.abuse_type.replace('_', ' ') : ''}</TableCell>
                </>}
                {tabValue === 2 && <>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.case_number}</TableCell>
                  <TableCell>{item.abuse_type ? item.abuse_type.replace('_', ' ') : ''}</TableCell>
                </>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Reports</Typography>

      <Paper sx={{ p:3, mb:3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb:2 }}>
          <Tab label="Cases Report" />
          <Tab label="Victims Report" />
          <Tab label="Perpetrators Report" />
          <Tab label="System Report" />
        </Tabs>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ mb:3 }}>
            <Grid item xs={12} md={4}>
              <DatePicker 
                label="Start Date" 
                value={startDate} 
                onChange={setStartDate} 
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker 
                label="End Date" 
                value={endDate} 
                onChange={setEndDate} 
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display:'flex', gap:2 }}>
              <Button variant="contained" onClick={generateReport} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}>
                {loading ? 'Generating...' : 'Generate'}
              </Button>
              <Button variant="outlined" onClick={exportToCSV} disabled={!reportData} startIcon={<Download />}>Export CSV</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {error && <Alert severity="error" sx={{ mb:3 }}>{error}</Alert>}
      {reportData && <Paper sx={{ p:3 }}><Typography variant="h6" gutterBottom>Report Results</Typography>{renderTable()}</Paper>}
    </Box>
  )
}

export default ReportsPage;
