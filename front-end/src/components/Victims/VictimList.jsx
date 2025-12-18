import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const VictimList = ({ victims, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Case</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {victims.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.first_name} {v.last_name}</TableCell>
              <TableCell>
                <Chip label={v.gender} size="small" />
              </TableCell>
              <TableCell>{v.age}</TableCell>
              <TableCell>{v.case?.case_number}</TableCell>
              <TableCell>{v.contact_number}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(v)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(v.id)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VictimList;
