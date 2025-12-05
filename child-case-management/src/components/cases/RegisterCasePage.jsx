import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ChildDetailsForm from '../../components/cases/CaseForm/ChildDetailsForm';
import PerpetratorDetailsForm from '../../components/cases/CaseForm/PerpetratorDetailsForm';
import IncidentDetailsForm from '../../components/cases/CaseForm/IncidentDetailsForm';
import RiskFactorsForm from '../../components/cases/CaseForm/RiskFactorsForm';
import ReviewForm from '../../components/cases/CaseForm/ReviewForm';
import { caseValidationSchema } from '../../utils/validators';
import { useCases } from '../../hooks/useCases';
import { formatDate } from '../../utils/helpers';

const steps = [
  'Child Details',
  'Perpetrator Details',
  'Incident Details',
  'Risk Factors',
  'Review',
];

const RegisterCasePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const { registerCase, isRegistering } = useCases();
  const navigate = useNavigate();

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
    validationSchema: caseValidationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        
        // Format dates for API
        const formattedValues = {
          ...values,
          child_dob: formatDate(values.child_dob, 'yyyy-MM-dd'),
          perpetrator_dob: values.perpetrator_dob ? formatDate(values.perpetrator_dob, 'yyyy-MM-dd') : null,
          incident_date_time: values.incident_date_time ? formatDate(values.incident_date_time, "yyyy-MM-dd'T'HH:mm:ss") : null,
          report_date_time: formatDate(values.report_date_time, "yyyy-MM-dd'T'HH:mm:ss"),
        };
        
        await registerCase(formattedValues);
        navigate('/cases', { state: { message: 'Case registered successfully!' } });
      } catch (err) {
        setError(err.message || 'Failed to register case');
      }
    },
  });

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepFields = getStepFields(activeStep);
    const stepValidationSchema = getStepValidation(activeStep);
    
    if (stepValidationSchema) {
      stepValidationSchema
        .validate(formik.values, { abortEarly: false })
        .then(() => {
          setActiveStep((prevStep) => prevStep + 1);
        })
        .catch((errors) => {
          // Mark fields as touched to show errors
          errors.inner.forEach((error) => {
            formik.setFieldTouched(error.path, true);
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
      2: ['incident_date_time', 'abuse_type', 'incident_location', 'description'],
      3: [], // Optional fields
      4: [], // Review step
    };
    return stepFields[step] || [];
  };

  const getStepValidation = (step) => {
    const stepSchemas = {
      0: caseValidationSchema.pick(['child_full_name', 'child_dob', 'child_gender', 'child_address']),
      1: caseValidationSchema.pick(['perpetrator_full_name']),
      2: caseValidationSchema.pick(['incident_date_time', 'abuse_type', 'incident_location', 'description']),
    };
    return stepSchemas[step];
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <ChildDetailsForm />;
      case 1:
        return <PerpetratorDetailsForm />;
      case 2:
        return <IncidentDetailsForm />;
      case 3:
        return <RiskFactorsForm />;
      case 4:
        return <ReviewForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Register New Case - Case Management System</title>
      </Helmet>

      <Container maxWidth="lg">
        <Paper sx={{ p: { xs: 3, md: 4 }, mt: 4 }}>
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
              >
                Back
              </Button>
              
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Submitting...' : 'Submit Case'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
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