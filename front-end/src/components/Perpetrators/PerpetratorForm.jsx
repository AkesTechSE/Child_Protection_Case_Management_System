import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

const validationSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  gender: yup.string().required('Gender is required'),
})

const PerpetratorForm = ({ initialData, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: initialData || {
      first_name: '',
      last_name: '',
      gender: '',
      age: '',
      date_of_birth: '',
      contact_number: '',
      address: '',
      occupation: '',
      relationship_to_victim: '',
      previous_records: false,
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values)
        onCancel()
      } catch (error) {
        console.error('Failed to save perpetrator:', error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>{initialData ? 'Edit Perpetrator' : 'Add Perpetrator'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="first_name"
              label="First Name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              error={formik.touched.first_name && Boolean(formik.errors.first_name)}
              helperText={formik.touched.first_name && formik.errors.first_name}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="last_name"
              label="Last Name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              error={formik.touched.last_name && Boolean(formik.errors.last_name)}
              helperText={formik.touched.last_name && formik.errors.last_name}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Gender *</InputLabel>
              <Select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                label="Gender *"
              >
                {genderOptions.map((option) => (
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
              name="age"
              label="Age"
              type="number"
              value={formik.values.age}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="date_of_birth"
              label="Date of Birth"
              value={formik.values.date_of_birth}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="contact_number"
              label="Contact Number"
              value={formik.values.contact_number}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="occupation"
              label="Occupation"
              value={formik.values.occupation}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="relationship_to_victim"
              label="Relationship to Victim"
              value={formik.values.relationship_to_victim}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="previous_records"
                  checked={formik.values.previous_records}
                  onChange={formik.handleChange}
                />
              }
              label="Has Previous Records"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  )
}

export default PerpetratorForm