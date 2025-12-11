import { useState, useEffect } from 'react'
import { DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { childApi } from '../../api/children'

const validationSchema = yup.object({
  name: yup.string().required('Child name is required'),
  gender: yup.string().required('Gender is required'),
  age: yup.number().required('Age is required').min(0, 'Age must be >= 0'),
  birth_date: yup.date(),
  guardian_name: yup.string(),
  guardian_contact: yup.string(),
})

const ChildForm = ({ initialData, onCancel, onSaved }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: initialData || {
      name: '',
      gender: '',
      age: '',
      birth_date: '',
      guardian_name: '',
      guardian_contact: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setLoading(true)
      try {
        if (initialData) {
          await childApi.updateChild(initialData.id, values)
        } else {
          await childApi.createChild(values)
        }
        onSaved && onSaved()
        onCancel()
      } catch (err) {
        setError(err.message || 'Failed to save child')
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>{initialData ? 'Edit Child' : 'Add New Child'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Child Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              name="age"
              label="Age"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              name="birth_date"
              label="Birth Date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.birth_date}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="guardian_name"
              label="Guardian Name"
              value={formik.values.guardian_name}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="guardian_contact"
              label="Guardian Contact"
              value={formik.values.guardian_contact}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </form>
  )
}

export default ChildForm
