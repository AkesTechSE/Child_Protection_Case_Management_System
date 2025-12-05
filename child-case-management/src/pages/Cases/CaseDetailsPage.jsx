import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  Edit,
  Assignment,
  Print,
  Download,
  ArrowBack,
} from '@mui/icons-material';
import { useCases } from '../../hooks/useCases';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, calculateAge } from '../../utils/helpers';
import { formatGender, formatAbuseType, formatCaseStatus, formatRoleName } from '../../utils/formatters';

const CaseDetailsPage = () => {
  const { id } = useParams();
  const { useCase } = useCases();
  const { data: caseData, isLoading, error } = useCase(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !caseData) {
    return (
      <Alert severity="error">
        {error?.message || 'Case not found'}
      </Alert>
    );
  }

  const {
    child_full_name,
    child_dob,
    child_gender,
    child_address,
    child_contact,
    perpetrator_full_name,
    perpetrator_dob,
    perpetrator_gender,
    perpetrator_address,
    perpetrator_contact,
    relationship_to_child,
    fan_number,
    fin_number,
    incident_date_time,
    incident_location,
    abuse_type,
    description,
    status,
    assigned_to,
    created_at,
    updated_at,
    evidence_notes,
    criminal_history,
    prior_reports,
    substance_abuse,
    weapons_access,
  } = caseData;

  const childAge = calculateAge(child_dob);
  const perpetratorAge = calculateAge(perpetrator_dob);

  return (
    <>
      <Helmet>
        <title>Case Details - {caseData.case_id}</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" gutterBottom>
              Case Details: {caseData.case_id}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={formatCaseStatus(status)}
                color="primary"
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Reported on {formatDate(created_at)}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<Edit />} variant="outlined">
                Edit Case
              </Button>
              <Button startIcon={<Assignment />} variant="outlined">
                Assign Case
              </Button>
              <Button startIcon={<Print />} variant="outlined">
                Print
              </Button>
              <Button startIcon={<Download />} variant="contained">
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Child Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Child Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Full Name" 
                  secondary={child_full_name}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Date of Birth / Age" 
                  secondary={`${formatDate(child_dob)} (${childAge} years old)`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Gender" 
                  secondary={formatGender(child_gender)}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Address" 
                  secondary={child_address}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Contact Information" 
                  secondary={child_contact || 'Not provided'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Perpetrator Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Perpetrator Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Full Name" 
                  secondary={perpetrator_full_name}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Date of Birth / Age" 
                  secondary={`${formatDate(perpetrator_dob)} ${perpetratorAge ? `(${perpetratorAge} years old)` : ''}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Gender" 
                  secondary={formatGender(perpetrator_gender)}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Relationship to Child" 
                  secondary={relationship_to_child}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="FAN/FIN Numbers" 
                  secondary={`FAN: ${fan_number || 'N/A'}, FIN: ${fin_number || 'N/A'}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Incident Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Incident Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Incident Date/Time
                </Typography>
                <Typography variant="body1">
                  {formatDate(incident_date_time, 'dd/MM/yyyy HH:mm')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Abuse Type
                </Typography>
                <Chip
                  label={formatAbuseType(abuse_type)}
                  color="secondary"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {incident_location}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {description}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Evidence and Risk Factors */}
        {(evidence_notes || criminal_history || prior_reports || substance_abuse) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Additional Information
              </Typography>
              
              <Grid container spacing={3}>
                {evidence_notes && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Evidence Collected
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {evidence_notes}
                    </Typography>
                  </Grid>
                )}
                
                {criminal_history && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Criminal History
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {criminal_history}
                    </Typography>
                  </Grid>
                )}
                
                {prior_reports && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Prior Abuse Reports
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {prior_reports}
                    </Typography>
                  </Grid>
                )}
                
                {substance_abuse && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Substance Abuse/Mental Health
                    </Typography>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {substance_abuse}
                    </Typography>
                  </Grid>
                )}
                
                {weapons_access && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Weapons Access
                    </Typography>
                    <Chip
                      label={weapons_access === 'yes' ? 'Yes - Weapons Access' : 'No Weapons Access'}
                      color={weapons_access === 'yes' ? 'error' : 'success'}
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Case Metadata */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Case Management
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assigned To
                </Typography>
                <Typography variant="body1">
                  {assigned_to?.name || 'Not assigned'}
                  {assigned_to?.role && (
                    <Chip
                      label={formatRoleName(assigned_to.role)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Report Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(created_at, 'dd/MM/yyyy HH:mm')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(updated_at, 'dd/MM/yyyy HH:mm')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CaseDetailsPage;