import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormikContext } from 'formik';
import { ABUSE_TYPES } from '../../../utils/constants';

const IncidentDetailsForm = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  return (
    <div className="form-section">
      <h3>Incident Details</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Incident Date/Time"
              value={values.incident_date_time}
              onChange={(date) => setFieldValue('incident_date_time', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={touched.incident_date_time && Boolean(errors.incident_date_time)}
                  helperText={touched.incident_date_time && errors.incident_date_time}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={touched.abuse_type && Boolean(errors.abuse_type)}>
            <InputLabel>Type of Abuse (Primary)</InputLabel>
            <Select
              name="abuse_type"
              value={values.abuse_type}
              label="Type of Abuse (Primary)"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value={ABUSE_TYPES.SEXUAL_ABUSE}>Sexual Abuse</MenuItem>
              <MenuItem value={ABUSE_TYPES.PHYSICAL_ABUSE}>Physical Abuse</MenuItem>
              <MenuItem value={ABUSE_TYPES.NEGLECT}>Neglect</MenuItem>
              <MenuItem value={ABUSE_TYPES.EMOTIONAL_ABUSE}>Emotional Abuse</MenuItem>
            </Select>
            {touched.abuse_type && errors.abuse_type && (
              <FormHelperText>{errors.abuse_type}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Location of Incident"
            name="incident_location"
            value={values.incident_location}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.incident_location && Boolean(errors.incident_location)}
            helperText={touched.incident_location && errors.incident_location}
            required
            placeholder="Address or place (Home, School, Online, Public Place)"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Detailed Description of Harm"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
            required
            placeholder="The narrative of the incident, injuries, or pattern of neglect (Crucial)"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Evidence Collected"
            name="evidence_notes"
            value={values.evidence_notes}
            onChange={handleChange}
            placeholder="Photos, medical reports, police reports, statements, etc."
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Witness Information"
            name="witness_info"
            value={values.witness_info}
            onChange={handleChange}
            multiline
            rows={2}
            placeholder="Names and contact information of witnesses"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reporting Agency"
            name="reporting_agency"
            value={values.reporting_agency}
            onChange={handleChange}
            placeholder="Agency that reported the incident"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default IncidentDetailsForm;