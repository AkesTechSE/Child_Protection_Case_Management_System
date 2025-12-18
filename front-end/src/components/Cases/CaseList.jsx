import { useState, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, TablePagination, Box
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { caseApi } from '../../api/cases'
import { formatDate } from '../../utils/formatters'
import { formatCaseStatus, formatAbuseType } from '../../utils/constants'
import LoadingSpinner from '../Common/LoadingSpinner'

const CaseList = ({ onEdit, onDelete, onView }) => {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchCases() }, [page, rowsPerPage])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const response = await caseApi.getCases({ page: page + 1, per_page: rowsPerPage })
      setCases(response.data)
      setTotal(response.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (loading) return <LoadingSpinner />
  if (!cases.length) return <Paper sx={{ p: 2, textAlign: 'center' }}>No cases found</Paper>

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case #</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Date Reported</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map(c => (
              <TableRow key={c.id} hover>
                <TableCell>{c.case_number}</TableCell>
                <TableCell>{c.case_title}</TableCell>
                <TableCell><Chip label={formatAbuseType(c.abuse_type)} size="small" color="primary" variant="outlined" /></TableCell>
                <TableCell><Chip label={formatCaseStatus(c.status)} size="small" color={c.status==='closed'||c.status==='resolved'?'success':'warning'} /></TableCell>
                <TableCell><Chip label={c.priority} size="small" color={c.priority==='high'||c.priority==='critical'?'error':'default'} /></TableCell>
                <TableCell>{formatDate(c.created_at)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => onView(c)} color="primary"><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => onEdit(c)} color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => onDelete(c.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5,10,25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default CaseList
