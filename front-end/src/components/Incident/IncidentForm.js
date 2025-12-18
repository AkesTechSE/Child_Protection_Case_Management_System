import { useState, useEffect } from 'react'
import { DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { incidentApi } from '../../api/incidents'

const validationSchema = yup.object({
  title: yup.string().required('Title required'),
  description: yup.string(),
  incident_date: yup.date(),
  location: yup.string(),
})

const IncidentForm = ({ initialData, onCancel, onSaved }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: initialData || { title:'', description:'', incident_date:'', location:'', evidence_files:[] },
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setLoading(true)
      try {
        if (initialData) {
          await incidentApi.updateIncident(initialData.id, values)
        } else {
          await incidentApi.createIncident(values)
        }
        onSaved && onSaved()
        onCancel()
      } catch (err) { setError(err.message||'Failed to save incident') }
      finally { setLoading(false) }
    }
  })

  const handleFileChange = (e) => formik.setFieldValue('evidence_files', Array.from(e.target.files))

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>{initialData ? 'Edit Incident' : 'Create Incident'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt:1 }}>
          <Grid item xs={12}><TextField fullWidth name="title" label="Title" value={formik.values.title} onChange={formik.handleChange} error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} required /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={3} name="description" label="Description" value={formik.values.description} onChange={formik.handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth type="date" name="incident_date" label="Incident Date" InputLabelProps={{ shrink: true }} value={formik.values.incident_date} onChange={formik.handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="location" label="Location" value={formik.values.location} onChange={formik.handleChange} /></Grid>
          <Grid item xs={12}><input type="file" multiple onChange={handleFileChange} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : initialData?'Update':'Create'}</Button>
      </DialogActions>
    </form>
  )
}

export default IncidentForm
