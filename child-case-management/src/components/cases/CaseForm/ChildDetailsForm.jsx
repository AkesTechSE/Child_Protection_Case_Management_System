import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormikContext } from 'formik';
import { GENDER_OPTIONS } from '../../../utils/constants';

const ChildDetailsForm = () => {
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
      <h3>Child's Identity and Contact</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Legal Name"
            name="child_full_name"
            value={values.child_full_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.child_full_name && Boolean(errors.child_full_name)}
            helperText={touched.child_full_name && errors.child_full_name}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={values.child_dob}
              onChange={(date) => setFieldValue('child_dob', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  error={touched.child_dob && Boolean(errors.child_dob)}
                  helperText={touched.child_dob && errors.child_dob}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={touched.child_gender && Boolean(errors.child_gender)}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="child_gender"
              value={values.child_gender}
              label="Gender"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {GENDER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {touched.child_gender && errors.child_gender && (
              <FormHelperText>{errors.child_gender}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Current Address"
            name="child_address"
            value={values.child_address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.child_address && Boolean(errors.child_address)}
            helperText={touched.child_address && errors.child_address}
            required
            placeholder="Physical address, including any changes in residence history"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Information"
            name="child_contact"
            value={values.child_contact}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Parent/Guardian phone number, child's direct contact (if applicable/safe)"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="child_notes"
            value={values.child_notes}
            onChange={handleChange}
            multiline
            rows={2}
            placeholder="Any additional information about the child"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ChildDetailsForm;