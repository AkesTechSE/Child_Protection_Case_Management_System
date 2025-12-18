import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'
import { formatCaseStatus, formatAbuseType } from '../../utils/constants'

const RecentCases = ({ cases }) => {
  const navigate = useNavigate()

  if (!cases || cases.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <p>No recent cases</p>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Case Number</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id} hover>
              <TableCell>{caseItem.case_number}</TableCell>
              <TableCell>{caseItem.case_title}</TableCell>
              <TableCell>
                <Chip 
                  label={formatAbuseType(caseItem.abuse_type)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={formatCaseStatus(caseItem.status)}
                  size="small"
                  color={
                    caseItem.status === 'closed' || caseItem.status === 'resolved'
                      ? 'success'
                      : 'warning'
                  }
                />
              </TableCell>
              <TableCell>{formatDate(caseItem.created_at)}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/cases/${caseItem.id}`)}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecentCases