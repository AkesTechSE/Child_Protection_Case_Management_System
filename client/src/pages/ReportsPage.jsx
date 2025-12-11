// src/pages/ReportsPage.jsx
import { useState } from 'react'
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
defaultStartDate.setMonth(defaultStartDate.getMonth() - 1)

const ReportsPage = () => {
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState(defaultEndDate)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const generateReport = async () => {
    setLoading(true)
    setError('')
    setReportData(null)
    try {
      const params = {}
      const formattedStart = startDate ? startDate.toISOString().split('T')[0] : null
      const formattedEnd = endDate ? endDate.toISOString().split('T')[0] : null

      if (formattedStart) params.start_date = formattedStart
      if (formattedEnd) {
        params.end_date = formattedEnd
        if (!formattedStart) {
          params.start_date = formattedEnd
        }
      }

      let data
      if (tabValue === 0) data = await reportApi.generateCasesReport(params)
      else if (tabValue === 1) data = await reportApi.generateVictimsReport(params)
      else data = await reportApi.generatePerpetratorsReport(params)

      setReportData({
        cases: data?.cases || [],
        victims: data?.victims || [],
        perpetrators: data?.perpetrators || []
      })
    } catch (err) {
      console.error('Failed to generate report:', err)
      setError('Failed to generate report. Please check server connection.')
      setReportData({ cases: [], victims: [], perpetrators: [] })
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
        v.name || '',
        v.age || '',
        v.gender || '',
        v.case_number || '',
        v.abuse_type?.replace('_', ' ') || '',
      ])
    } else {
      headers = ['Perpetrator Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
      rows = reportData.perpetrators.map(p => [
        p.name || '',
        p.age || '',
        p.gender || '',
        p.case_number || '',
        p.abuse_type?.replace('_', ' ') || '',
      ])
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
    } else {
      data = reportData.perpetrators
      columns = ['Perpetrator Name', 'Age', 'Gender', 'Case Number', 'Abuse Type']
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
                  <TableCell><Chip label={item.abuse_type?.replace('_', ' ') || 'N/A'} size="small" color="primary" /></TableCell>
                  <TableCell><Chip label={item.status?.replace('_', ' ') || 'N/A'} size="small" color={item.status === 'closed' ? 'success' : 'warning'} /></TableCell>
                  <TableCell>{formatDate(item.incident_date)}</TableCell>
                </>}
                {tabValue === 1 && <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.case_number}</TableCell>
                  <TableCell>{item.abuse_type?.replace('_', ' ') || 'N/A'}</TableCell>
                </>}
                {tabValue === 2 && <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.age}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.case_number}</TableCell>
                  <TableCell>{item.abuse_type?.replace('_', ' ') || 'N/A'}</TableCell>
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
        </Tabs>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} sx={{ mb:3 }}>
            <Grid item xs={12} md={4}>
              <DatePicker label="Start Date" value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} fullWidth />} />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker label="End Date" value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} fullWidth />} />
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

export default ReportsPage
