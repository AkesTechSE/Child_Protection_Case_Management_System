import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormikContext } from 'formik';
import { RELATIONSHIP_OPTIONS } from '../../../utils/constants';

const PerpetratorDetailsForm = () => {
  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  return (
    <div className="form-section">
      <h3>Perpetrator's Identity and Contact</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Legal Name (including any aliases)"
            name="perpetrator_full_name"
            value={values.perpetrator_full_name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth / Age"
              value={values.perpetrator_dob}
              onChange={(date) => setFieldValue('perpetrator_dob', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="perpetrator_gender"
              value={values.perpetrator_gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Race/Ethnicity"
            name="perpetrator_race"
            value={values.perpetrator_race}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="FAN Number"
            name="fan_number"
            value={values.fan_number}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Current/Last Known Address"
            name="perpetrator_address"
            value={values.perpetrator_address}
            onChange={handleChange}
            placeholder="Physical residence"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Information"
            name="perpetrator_contact"
            value={values.perpetrator_contact}
            onChange={handleChange}
            placeholder="Phone number, email address"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Relationship to Child</InputLabel>
            <Select
              name="relationship_to_child"
              value={values.relationship_to_child}
              label="Relationship to Child"
              onChange={handleChange}
            >
              {RELATIONSHIP_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="FIN Number"
            name="fin_number"
            value={values.fin_number}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Occupation/Employer"
            name="perpetrator_occupation"
            value={values.perpetrator_occupation}
            onChange={handleChange}
            placeholder="Current job and place of work"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PerpetratorDetailsForm;