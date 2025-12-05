import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const caseValidationSchema = Yup.object({
  child_full_name: Yup.string()
    .required('Child full name is required')
    .max(100, 'Name is too long'),
  
  child_dob: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date cannot be in the future'),
  
  child_gender: Yup.string()
    .required('Gender is required'),
  
  child_address: Yup.string()
    .required('Address is required')
    .max(500, 'Address is too long'),
  
  perpetrator_full_name: Yup.string()
    .required('Perpetrator name is required')
    .max(100, 'Name is too long'),
  
  abuse_type: Yup.string()
    .required('Abuse type is required'),
  
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description is too long'),
  
  incident_date_time: Yup.date()
    .required('Incident date is required')
    .max(new Date(), 'Date cannot be in the future'),
  
  incident_location: Yup.string()
    .required('Incident location is required'),
});

export const userValidationSchema = Yup.object({
  name: Yup.string()
    .required('Full name is required')
    .max(100, 'Name is too long'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  role: Yup.string()
    .required('Role is required'),
  
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
});