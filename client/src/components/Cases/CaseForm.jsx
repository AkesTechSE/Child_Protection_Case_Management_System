import { useState, useEffect } from 'react'
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
  Alert,
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { userApi } from '../../api/users'
import { perpetratorApi } from '../../api/perpetrators'
import { caseApi } from '../../api/cases'
import { ABUSE_TYPES, PRIORITY_LEVELS, CASE_STATUS, formatAbuseType, formatCaseStatus } from '../../utils/constants'

const validationSchema = yup.object({
  case_title: yup.string().required('Case title is required'),
  abuse_type: yup.string().required('Abuse type is required'),
  priority: yup.string(),
  severity: yup.string(),
  location: yup.string(),
  incident_date: yup.date(),
  status: yup.string(),
  assigned_to: yup.number().nullable(),
})

const CaseForm = ({ initialData, onCancel, onSaved }) => {
  const [focalPersons, setFocalPersons] = useState([])
  const [perpetrators, setPerpetrators] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [personsResponse, perpsResponse] = await Promise.all([
        userApi.getFocalPersons(),
        perpetratorApi.getPerpetrators({ per_page: 100 }),
      ])
      setFocalPersons(personsResponse || [])
      setPerpetrators(perpsResponse || [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }

  const formik = useFormik({
    initialValues: initialData || {
      case_title: '',
      case_description: '',
      abuse_type: '',
      priority: 'medium',
      severity: 'medium',
      location: '',
      incident_date: '',
      status: 'reported',
      assigned_to: null,
      perpetrator_ids: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setLoading(true)
      try {
        if (initialData) {
          await caseApi.updateCase(initialData.id, values)
        } else {
          await caseApi.createCase(values)
        }
        onSaved && onSaved()
        onCancel()
      } catch (err) {
        setError(err.message || 'Failed to save case')
      } finally {
        setLoading(false)
      }
    },
  })

  const abuseTypes = Object.values(ABUSE_TYPES)
  const priorities = Object.values(PRIORITY_LEVELS)
  const statuses = Object.values(CASE_STATUS)

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>{initialData ? 'Edit Case' : 'Create New Case'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="case_title"
              label="Case Title"
              value={formik.values.case_title}
              onChange={formik.handleChange}
              error={formik.touched.case_title && Boolean(formik.errors.case_title)}
              helperText={formik.touched.case_title && formik.errors.case_title}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="case_description"
              label="Description"
              value={formik.values.case_description}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Abuse Type *</InputLabel>
              <Select
                name="abuse_type"
                value={formik.values.abuse_type}
                onChange={formik.handleChange}
                error={formik.touched.abuse_type && Boolean(formik.errors.abuse_type)}
                label="Abuse Type *"
              >
                {abuseTypes.map((type) => (
                  <MenuItem key={type} value={type}>{formatAbuseType(type)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                label="Priority"
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={formik.values.severity}
                onChange={formik.handleChange}
                label="Severity"
              >
                {priorities.map((s) => (
                  <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                label="Status"
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>{formatCaseStatus(s)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  )
}

export default CaseForm
