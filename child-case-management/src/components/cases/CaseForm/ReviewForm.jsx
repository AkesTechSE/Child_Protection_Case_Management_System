import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { formatDate } from '../../../utils/helpers';
import { formatGender, formatAbuseType } from '../../../utils/formatters';

const ReviewForm = () => {
  const { values } = useFormikContext();

  return (
    <div className="form-section">
      <h3>Review Case Information</h3>
      
      <Grid container spacing={3}>
        {/* Child Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Child Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Full Name" 
                  secondary={values.child_full_name || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Date of Birth" 
                  secondary={values.child_dob ? formatDate(values.child_dob) : 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Gender" 
                  secondary={formatGender(values.child_gender) || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Address" 
                  secondary={values.child_address || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Contact" 
                  secondary={values.child_contact || 'Not provided'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Perpetrator Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Perpetrator Information
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Full Name" 
                  secondary={values.perpetrator_full_name || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Date of Birth" 
                  secondary={values.perpetrator_dob ? formatDate(values.perpetrator_dob) : 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Gender" 
                  secondary={values.perpetrator_gender || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Relationship to Child" 
                  secondary={values.relationship_to_child || 'Not provided'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="FAN Number" 
                  secondary={values.fan_number || 'Not provided'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Incident Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Incident Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Incident Date/Time
                </Typography>
                <Typography variant="body1">
                  {values.incident_date_time ? formatDate(values.incident_date_time, 'dd/MM/yyyy HH:mm') : 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Abuse Type
                </Typography>
                <Typography variant="body1">
                  {formatAbuseType(values.abuse_type) || 'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {values.incident_location || 'Not provided'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {values.description || 'Not provided'}
                </Typography>
              </Paper>
            </Box>
            
            {values.evidence_notes && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Evidence Notes
                </Typography>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {values.evidence_notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Risk Factors */}
        {(values.criminal_history || values.prior_reports || values.substance_abuse) && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Risk Factors
              </Typography>
              
              {values.criminal_history && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Criminal History
                  </Typography>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {values.criminal_history}
                  </Typography>
                </Box>
              )}
              
              {values.prior_reports && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Prior Abuse Reports
                  </Typography>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {values.prior_reports}
                  </Typography>
                </Box>
              )}
              
              {values.substance_abuse && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Substance Abuse/Mental Health
                  </Typography>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {values.substance_abuse}
                  </Typography>
                </Box>
              )}
              
              {(values.immediate_danger || values.medical_attention_needed || values.police_involved) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Emergency Flags
                  </Typography>
                  <Grid container spacing={1}>
                    {values.immediate_danger && (
                      <Grid item>
                        <Paper variant="outlined" sx={{ p: 1, backgroundColor: 'error.light', color: 'error.contrastText' }}>
                          <Typography variant="caption">Immediate Danger</Typography>
                        </Paper>
                      </Grid>
                    )}
                    {values.medical_attention_needed && (
                      <Grid item>
                        <Paper variant="outlined" sx={{ p: 1, backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
                          <Typography variant="caption">Medical Attention Needed</Typography>
                        </Paper>
                      </Grid>
                    )}
                    {values.police_involved && (
                      <Grid item>
                        <Paper variant="outlined" sx={{ p: 1, backgroundColor: 'info.light', color: 'info.contrastText' }}>
                          <Typography variant="caption">Police Involved</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
        Please review all information carefully before submitting. Once submitted, the case will be registered in the system.
      </Typography>
    </div>
  );
};

export default ReviewForm;