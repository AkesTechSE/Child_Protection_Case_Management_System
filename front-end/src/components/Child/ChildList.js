import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { childApi } from '../../api/children'
import LoadingSpinner from '../Common/LoadingSpinner'

const ChildList = ({ onEdit, onDelete }) => {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchChildren() }, [page, rowsPerPage])

  const fetchChildren = async () => {
    setLoading(true)
    try {
      const response = await childApi.getChildren({ page: page+1, per_page: rowsPerPage })
      setChildren(response.data)
      setTotal(response.total || 0)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleChangePage = (e, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value,10)); setPage(0) }

  if (loading) return <LoadingSpinner />
  if (!children.length) return <Paper sx={{ p:2, textAlign:'center' }}>No children found</Paper>

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map(c => (
              <TableRow key={c.id} hover>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.gender}</TableCell>
                <TableCell>{c.age}</TableCell>
                <TableCell>
                  <Box sx={{ display:'flex', gap:1 }}>
                    <IconButton size="small" onClick={()=>onEdit(c)} color="primary"><EditIcon fontSize="small"/></IconButton>
                    <IconButton size="small" onClick={()=>onDelete(c.id)} color="error"><DeleteIcon fontSize="small"/></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[5,10,25]} component="div" count={total} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
    </Paper>
  )
}

export default ChildList
