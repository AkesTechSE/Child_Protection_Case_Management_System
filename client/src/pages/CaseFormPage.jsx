import { Box, Typography } from '@mui/material'
import CaseForm from '../components/Cases/CaseForm'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { caseApi } from '../api/cases'

const CaseFormPage = () => {
  const { id } = useParams() // for edit
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      // Edit mode, fetch case details
      setLoading(true)
      caseApi.getCase(id)
        .then(res => setInitialData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleSubmit = async (data) => {
    try {
      if (id) {
        await caseApi.updateCase(id, data)
      } else {
        await caseApi.createCase(data)
      }
      navigate('/cases') // redirect back to cases page
    } catch (err) {
      console.error('Failed to save case:', err)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {id ? 'Edit Case' : 'New Case'}
      </Typography>
      <CaseForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading}
      />
    </Box>
  )
}

export default CaseFormPage
