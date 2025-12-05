import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormikContext } from 'formik';

const RiskFactorsForm = () => {
  const {
    values,
    handleChange,
    setFieldValue,
  } = useFormikContext();

  return (
    <div className="form-section">
      <h3>History and Risk Factors (Optional)</h3>
      <Grid container spacing={3}>
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
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Weapons Access</InputLabel>
            <Select
              name="weapons_access"
              value={values.weapons_access}
              label="Weapons Access"
              onChange={handleChange}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Criminal History"
            name="criminal_history"
            value={values.criminal_history}
            onChange={handleChange}
            placeholder="Prior convictions, especially for violence, drug, or sexual offenses"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Prior Abuse Reports"
            name="prior_reports"
            value={values.prior_reports}
            onChange={handleChange}
            placeholder="Any previous reports made against this individual"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Substance Abuse/Mental Health"
            name="substance_abuse"
            value={values.substance_abuse}
            onChange={handleChange}
            placeholder="Known history of drug/alcohol abuse or severe mental illness"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Risk Factors"
            name="additional_risk_factors"
            value={values.additional_risk_factors}
            onChange={handleChange}
            placeholder="Any other relevant risk factors"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.immediate_danger || false}
                onChange={(e) => setFieldValue('immediate_danger', e.target.checked)}
              />
            }
            label="Child in immediate danger"
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={values.medical_attention_needed || false}
                onChange={(e) => setFieldValue('medical_attention_needed', e.target.checked)}
              />
            }
            label="Medical attention needed"
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={values.police_involved || false}
                onChange={(e) => setFieldValue('police_involved', e.target.checked)}
              />
            }
            label="Police already involved"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default RiskFactorsForm;