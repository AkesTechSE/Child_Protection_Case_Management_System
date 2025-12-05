import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAutoSave from '../../hooks/useAutoSave';

const steps = ['Child Details', 'Perpetrator Details', 'Incident Details', 'Review'];

const RegisterCasePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    // Child Details
    child_full_name: Yup.string().required('Full name is required'),
    child_dob: Yup.date().required('Date of birth is required').max(new Date(), 'Date cannot be in the future'),
    child_gender: Yup.string().required('Gender is required'),
    child_address: Yup.string().required('Address is required'),
    
    // Perpetrator Details
    perpetrator_full_name: Yup.string().required('Perpetrator name is required'),
    
    // Incident Details
    incident_date_time: Yup.date().required('Incident date is required'),
    abuse_type: Yup.string().required('Abuse type is required'),
    description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  });

  const formik = useFormik({
    initialValues: {
      // Child Details
      child_full_name: '',
      child_dob: null,
      child_gender: '',
      child_address: '',
      child_contact: '',
      child_notes: '',
      
      // Perpetrator Details
      perpetrator_full_name: '',
      perpetrator_dob: null,
      perpetrator_gender: '',
      perpetrator_race: '',
      perpetrator_address: '',
      perpetrator_contact: '',
      relationship_to_child: '',
      fan_number: '',
      fin_number: '',
      perpetrator_occupation: '',
      
      // Incident Details
      incident_date_time: null,
      incident_location: '',
      abuse_type: '',
      description: '',
      evidence_notes: '',
      witness_info: '',
      reporting_agency: '',
      
      // Risk Factors
      criminal_history: '',
      prior_reports: '',
      substance_abuse: '',
      weapons_access: '',
      additional_risk_factors: '',
      immediate_danger: false,
      medical_attention_needed: false,
      police_involved: false,
      
      // Metadata
      report_date_time: new Date(),
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Case data:', values);
        toast.success('Case registered successfully!');
        
        // Reset form and navigate
        formik.resetForm();
        setActiveStep(0);
        navigate('/dashboard');
        
      } catch (err) {
        setError('Failed to register case. Please try again.');
        toast.error('Failed to register case');
      } finally {
        setLoading(false);
      }
    },
  });

  const DRAFT_KEY = 'case_draft_v1';
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          formik.setValues((prev) => ({ ...prev, ...parsed }));
          setDraftLoaded(true);
          toast.success('Loaded saved draft');
        }
      }
    } catch (err) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save form values to localStorage (and optionally server via onSave)
  useAutoSave(formik.values, {
    key: DRAFT_KEY,
    delay: 1500,
    onSave: async (values) => {
      // Optional: implement server-side draft sync here.
      // Example (if backend supports drafts):
      // await caseService.saveDraft(values);
    },
  });

  const handleNext = () => {
    // Validate current step
    const currentStepFields = getStepFields(activeStep);
    const stepValidation = getStepValidation(activeStep);
    
    if (stepValidation) {
      // Validate only fields in current step
      const stepValues = {};
      currentStepFields.forEach(field => {
        stepValues[field] = formik.values[field];
      });
      
      stepValidation
        .validate(stepValues, { abortEarly: false })
        .then(() => {
          setActiveStep((prevStep) => prevStep + 1);
        })
        .catch((errors) => {
          errors.inner.forEach((error) => {
            formik.setFieldTouched(error.path, true, false);
          });
        });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepFields = (step) => {
    const stepFields = {
      0: ['child_full_name', 'child_dob', 'child_gender', 'child_address'],
      1: ['perpetrator_full_name'],
      2: ['incident_date_time', 'abuse_type', 'description', 'incident_location'],
      3: [],
    };
    return stepFields[step] || [];
  };

  const getStepValidation = (step) => {
    const stepSchemas = {
      0: Yup.object({
        child_full_name: Yup.string().required('Full name is required'),
        child_dob: Yup.date().required('Date of birth is required'),
        child_gender: Yup.string().required('Gender is required'),
        child_address: Yup.string().required('Address is required'),
      }),
      1: Yup.object({
        perpetrator_full_name: Yup.string().required('Perpetrator name is required'),
      }),
      2: Yup.object({
        incident_date_time: Yup.date().required('Incident date is required'),
        abuse_type: Yup.string().required('Abuse type is required'),
        description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
        incident_location: Yup.string().required('Incident location is required'),
      }),
    };
    return stepSchemas[step];
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Child's Identity and Contact
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Legal Name *"
                  name="child_full_name"
                  value={formik.values.child_full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.child_full_name && Boolean(formik.errors.child_full_name)}
                  helperText={formik.touched.child_full_name && formik.errors.child_full_name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth *"
                    value={formik.values.child_dob}
                    onChange={(date) => formik.setFieldValue('child_dob', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formik.touched.child_dob && Boolean(formik.errors.child_dob)}
                        helperText={formik.touched.child_dob && formik.errors.child_dob}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formik.touched.child_gender && Boolean(formik.errors.child_gender)}>
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    name="child_gender"
                    value={formik.values.child_gender}
                    label="Gender *"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer_not_to_disclose">Prefer Not to Disclose</MenuItem>
                  </Select>
                  {formik.touched.child_gender && formik.errors.child_gender && (
                    <FormHelperText>{formik.errors.child_gender}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Current Address *"
                  name="child_address"
                  value={formik.values.child_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.child_address && Boolean(formik.errors.child_address)}
                  helperText={formik.touched.child_address && formik.errors.child_address}
                  placeholder="Physical address, including any changes in residence history"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Information"
                  name="child_contact"
                  value={formik.values.child_contact}
                  onChange={formik.handleChange}
                  placeholder="Parent/Guardian phone number, child's direct contact"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="child_notes"
                  value={formik.values.child_notes}
                  onChange={formik.handleChange}
                  multiline
                  rows={2}
                  placeholder="Any additional information about the child"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Perpetrator's Identity and Contact
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Legal Name (including aliases) *"
                  name="perpetrator_full_name"
                  value={formik.values.perpetrator_full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.perpetrator_full_name && Boolean(formik.errors.perpetrator_full_name)}
                  helperText={formik.touched.perpetrator_full_name && formik.errors.perpetrator_full_name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth / Age"
                    value={formik.values.perpetrator_dob}
                    onChange={(date) => formik.setFieldValue('perpetrator_dob', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="perpetrator_gender"
                    value={formik.values.perpetrator_gender}
                    label="Gender"
                    onChange={formik.handleChange}
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
                  value={formik.values.perpetrator_race}
                  onChange={formik.handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="FAN Number"
                  name="fan_number"
                  value={formik.values.fan_number}
                  onChange={formik.handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Current/Last Known Address"
                  name="perpetrator_address"
                  value={formik.values.perpetrator_address}
                  onChange={formik.handleChange}
                  placeholder="Physical residence"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Information"
                  name="perpetrator_contact"
                  value={formik.values.perpetrator_contact}
                  onChange={formik.handleChange}
                  placeholder="Phone number, email address"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship to Child</InputLabel>
                  <Select
                    name="relationship_to_child"
                    value={formik.values.relationship_to_child}
                    label="Relationship to Child"
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="stepparent">Stepparent</MenuItem>
                    <MenuItem value="grandparent">Grandparent</MenuItem>
                    <MenuItem value="relative">Relative</MenuItem>
                    <MenuItem value="babysitter">Babysitter</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="stranger">Stranger</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="FIN Number"
                  name="fin_number"
                  value={formik.values.fin_number}
                  onChange={formik.handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation/Employer"
                  name="perpetrator_occupation"
                  value={formik.values.perpetrator_occupation}
                  onChange={formik.handleChange}
                  placeholder="Current job and place of work"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Incident Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Incident Date/Time *"
                    value={formik.values.incident_date_time}
                    onChange={(date) => formik.setFieldValue('incident_date_time', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formik.touched.incident_date_time && Boolean(formik.errors.incident_date_time)}
                        helperText={formik.touched.incident_date_time && formik.errors.incident_date_time}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={formik.touched.abuse_type && Boolean(formik.errors.abuse_type)}>
                  <InputLabel>Type of Abuse (Primary) *</InputLabel>
                  <Select
                    name="abuse_type"
                    value={formik.values.abuse_type}
                    label="Type of Abuse (Primary) *"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="sexual_abuse">Sexual Abuse</MenuItem>
                    <MenuItem value="physical_abuse">Physical Abuse</MenuItem>
                    <MenuItem value="neglect">Neglect</MenuItem>
                    <MenuItem value="emotional_abuse">Emotional Abuse</MenuItem>
                  </Select>
                  {formik.touched.abuse_type && formik.errors.abuse_type && (
                    <FormHelperText>{formik.errors.abuse_type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Location of Incident *"
                  name="incident_location"
                  value={formik.values.incident_location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.incident_location && Boolean(formik.errors.incident_location)}
                  helperText={formik.touched.incident_location && formik.errors.incident_location}
                  placeholder="Address or place (Home, School, Online, Public Place)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Detailed Description of Harm *"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
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
                  value={formik.values.evidence_notes}
                  onChange={formik.handleChange}
                  placeholder="Photos, medical reports, police reports, statements, etc."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Witness Information"
                  name="witness_info"
                  value={formik.values.witness_info}
                  onChange={formik.handleChange}
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
                  value={formik.values.reporting_agency}
                  onChange={formik.handleChange}
                  placeholder="Agency that reported the incident"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Case Information
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Child Information:
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {formik.values.child_full_name || 'Not provided'}
              </Typography>
              <Typography variant="body2">
                <strong>Date of Birth:</strong> {formik.values.child_dob ? new Date(formik.values.child_dob).toLocaleDateString() : 'Not provided'}
              </Typography>
              <Typography variant="body2">
                <strong>Gender:</strong> {formik.values.child_gender || 'Not provided'}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Perpetrator Information:
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {formik.values.perpetrator_full_name || 'Not provided'}
              </Typography>
              <Typography variant="body2">
                <strong>Relationship:</strong> {formik.values.relationship_to_child || 'Not provided'}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Incident Details:
              </Typography>
              <Typography variant="body2">
                <strong>Abuse Type:</strong> {formik.values.abuse_type || 'Not provided'}
              </Typography>
              <Typography variant="body2">
                <strong>Incident Date:</strong> {formik.values.incident_date_time ? new Date(formik.values.incident_date_time).toLocaleDateString() : 'Not provided'}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {formik.values.description ? (formik.values.description.substring(0, 100) + '...') : 'Not provided'}
              </Typography>
            </Paper>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              Please review all information carefully before submitting. Once submitted, the case will be registered in the system.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Register New Case - Case Management System</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" gutterBottom align="center">
            Register New Case
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Please fill in all required information for the abuse case
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={formik.handleSubmit}>
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                  >
                    {loading ? 'Submitting...' : 'Submit Case'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    size="large"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterCasePage;