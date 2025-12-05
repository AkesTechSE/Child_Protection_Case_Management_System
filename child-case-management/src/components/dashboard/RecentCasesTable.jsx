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
  Typography,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { formatCaseStatus, formatAbuseType } from '../../utils/formatters';

const RecentCasesTable = ({ cases }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      reported: 'default',
      assigned: 'primary',
      under_investigation: 'warning',
      resolved: 'success',
      closed: 'secondary',
    };
    return colors[status] || 'default';
  };

  if (!cases || cases.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
        No recent cases found
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Case ID</TableCell>
            <TableCell>Child Name</TableCell>
            <TableCell>Abuse Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Report Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((caseItem) => (
            <TableRow key={caseItem.id} hover>
              <TableCell>{caseItem.case_id}</TableCell>
              <TableCell>{caseItem.child_name}</TableCell>
              <TableCell>
                <Chip
                  label={formatAbuseType(caseItem.abuse_type)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={formatCaseStatus(caseItem.status)}
                  color={getStatusColor(caseItem.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(caseItem.created_at)}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/cases/${caseItem.id}`)}
                  title="View Details"
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentCasesTable;