import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  Chip,
} from '@mui/material'
import {
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material'
import { formatDate } from '../../utils/formatters'
import LoadingSpinner from '../Common/LoadingSpinner'

const PerpetratorList = ({ perpetrators, loading, onEdit, onDelete, onView }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!perpetrators || perpetrators.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <p>No perpetrators found</p>
      </Paper>
    )
  }

  const displayedPerpetrators = Array.isArray(perpetrators) 
    ? perpetrators.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : []

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Previous Records</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPerpetrators.map((perp) => (
              <TableRow key={perp.id} hover>
                <TableCell>{perp.first_name} {perp.last_name}</TableCell>
                <TableCell>{perp.gender}</TableCell>
                <TableCell>{perp.age || 'N/A'}</TableCell>
                <TableCell>{perp.contact_number || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={perp.previous_records ? 'Yes' : 'No'}
                    size="small"
                    color={perp.previous_records ? 'error' : 'default'}
                  />
                </TableCell>
                <TableCell>{formatDate(perp.created_at)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onView(perp)}
                      color="primary"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onEdit(perp)}
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(perp.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={perpetrators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default PerpetratorList