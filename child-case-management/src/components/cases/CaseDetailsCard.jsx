import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Grid,
  Chip,
  Avatar,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  LocationOn,
  CalendarToday,
  AccessTime,
  Warning,
  CheckCircle,
  Cancel,
  Assignment,
  Timeline,
  Folder,
  Security,
  Description,
  AttachFile,
  Phone,
  Email,
  Home,
  School,
  Public,
  Computer,
  MedicalServices,
  Gavel,
} from '@mui/icons-material';
import { formatDate, calculateAge, formatPhoneNumber } from '../../utils/helpers';
import { formatAbuseType, formatCaseStatus, formatGender } from '../../utils/formatters';
import { ABUSE_TYPES } from '../../utils/constants';
import CaseActions from './CaseActions';

const CaseDetailsCard = ({ caseData, showActions = true, onUpdate }) => {
  if (!caseData) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">No case data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    id,
    case_id,
    child_name,
    child_dob,
    child_gender,
    child_address,
    child_contact,
    perpetrator_name,
    perpetrator_dob,
    perpetrator_gender,
    perpetrator_address,
    perpetrator_contact,
    relationship_to_child,
    incident_date_time,
    incident_location,
    abuse_type,
    description,
    status,
    assigned_to,
    created_at,
    updated_at,
    evidence_count = 0,
    notes_count = 0,
    risk_level = 'medium',
  } = caseData;

  const childAge = calculateAge(child_dob);
  const perpetratorAge = calculateAge(perpetrator_dob);

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

  const getAbuseTypeColor = (type) => {
    const colors = {
      [ABUSE_TYPES.SEXUAL_ABUSE]: 'error',
      [ABUSE_TYPES.PHYSICAL_ABUSE]: 'warning',
      [ABUSE_TYPES.NEGLECT]: 'info',
      [ABUSE_TYPES.EMOTIONAL_ABUSE]: 'default',
    };
    return colors[type] || 'default';
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[level] || 'default';
  };

  const getRiskLevelProgress = (level) => {
    const values = {
      low: 25,
      medium: 50,
      high: 75,
      critical: 100,
    };
    return values[level] || 50;
  };

  const incidentLocationIcon = () => {
    if (incident_location?.toLowerCase().includes('home')) return <Home />;
    if (incident_location?.toLowerCase().includes('school')) return <School />;
    if (incident_location?.toLowerCase().includes('online')) return <Computer />;
    if (incident_location?.toLowerCase().includes('public')) return <Public />;
    return <LocationOn />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Case Header */}
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip
                  label={`Case #${case_id}`}
                  color="primary"
                  size="small"
                  icon={<Folder />}
                />
                <Chip
                  label={formatCaseStatus(status)}
                  color={getStatusColor(status)}
                  size="small"
                  icon={status === 'resolved' || status === 'closed' ? <CheckCircle /> : <Timeline />}
                />
                <Chip
                  label={formatAbuseType(abuse_type)}
                  color={getAbuseTypeColor(abuse_type)}
                  size="small"
                  variant="outlined"
                  icon={<Warning />}
                />
              </Box>
              <Typography variant="h5" gutterBottom>
                {child_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reported on {formatDate(created_at)} • Last updated {formatDate(updated_at, 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {showActions && (
                  <CaseActions
                    caseId={id}
                    caseData={caseData}
                    onUpdate={onUpdate}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Risk Level Indicator */}
      <Card>
        <CardHeader
          title="Risk Assessment"
          avatar={<Warning color="warning" />}
          action={
            <Chip
              label={risk_level.toUpperCase()}
              color={getRiskLevelColor(risk_level)}
              size="small"
            />
          }
        />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={getRiskLevelProgress(risk_level)}
              color={getRiskLevelColor(risk_level)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {risk_level === 'critical' && 'Immediate intervention required. Child is in immediate danger.'}
            {risk_level === 'high' && 'High risk situation. Requires urgent attention.'}
            {risk_level === 'medium' && 'Moderate risk. Monitor closely and follow up regularly.'}
            {risk_level === 'low' && 'Low risk. Standard monitoring procedures apply.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Child & Perpetrator */}
        <Grid item xs={12} md={6}>
          {/* Child Information */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Child Information"
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              }
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={child_name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date of Birth / Age"
                    secondary={`${formatDate(child_dob)} (${childAge} years old)`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={formatGender(child_gender)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Home color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={child_address}
                  />
                </ListItem>
                {child_contact && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Information"
                      secondary={formatPhoneNumber(child_contact)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Perpetrator Information */}
          <Card>
            <CardHeader
              title="Alleged Perpetrator"
              avatar={
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Security />
                </Avatar>
              }
              subheader={relationship_to_child && `Relationship: ${relationship_to_child}`}
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={perpetrator_name}
                  />
                </ListItem>
                {perpetrator_dob && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date of Birth / Age"
                      secondary={`${formatDate(perpetrator_dob)} ${perpetratorAge ? `(${perpetratorAge} years old)` : ''}`}
                    />
                  </ListItem>
                )}
                {perpetrator_gender && (
                  <ListItem>
                    <ListItemIcon>
                      <Person color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Gender"
                      secondary={formatGender(perpetrator_gender)}
                    />
                  </ListItem>
                )}
                {perpetrator_address && (
                  <ListItem>
                    <ListItemIcon>
                      <Home color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={perpetrator_address}
                    />
                  </ListItem>
                )}
                {perpetrator_contact && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact Information"
                      secondary={formatPhoneNumber(perpetrator_contact)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Incident & Case Management */}
        <Grid item xs={12} md={6}>
          {/* Incident Details */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title="Incident Details"
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Warning />
                </Avatar>
              }
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Incident Date/Time"
                    secondary={formatDate(incident_date_time, 'MMM dd, yyyy HH:mm')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {incidentLocationIcon()}
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={incident_location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Type of Abuse"
                    secondary={
                      <Chip
                        label={formatAbuseType(abuse_type)}
                        size="small"
                        color={getAbuseTypeColor(abuse_type)}
                        variant="outlined"
                      />
                    }
                  />
                </ListItem>
              </List>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {description || 'No description provided'}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>

          {/* Case Management */}
          <Card>
            <CardHeader
              title="Case Management"
              avatar={
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Assignment />
                </Avatar>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {evidence_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Evidence Files
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {notes_count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Case Notes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Assignment color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Assigned To"
                    secondary={assigned_to || 'Unassigned'}
                  />
                  {assigned_to && (
                    <Button size="small" startIcon={<Email />}>
                      Contact
                    </Button>
                  )}
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Case Duration"
                    secondary={`${Math.floor((new Date() - new Date(created_at)) / (1000 * 60 * 60 * 24))} days`}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Next Steps:
                </Typography>
                <List dense>
                  {status === 'reported' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Assign case to a focal person" />
                    </ListItem>
                  )}
                  {status === 'assigned' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Begin investigation and collect evidence" />
                    </ListItem>
                  )}
                  {status === 'under_investigation' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Complete investigation and prepare report" />
                    </ListItem>
                  )}
                  {status === 'resolved' && (
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Close case and archive documentation" />
                    </ListItem>
                  )}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {showActions && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<Description />}>
                Add Note
              </Button>
              <Button variant="outlined" startIcon={<AttachFile />}>
                Upload Evidence
              </Button>
              <Button variant="outlined" startIcon={<MedicalServices />}>
                Medical Report
              </Button>
              <Button variant="outlined" startIcon={<Gavel />}>
                Legal Action
              </Button>
              <Button variant="outlined" startIcon={<Email />}>
                Send Update
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CaseDetailsCard;