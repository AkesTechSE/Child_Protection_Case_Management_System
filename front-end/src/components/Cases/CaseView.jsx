import { useState, useEffect } from 'react'
import {
  Paper, Typography, Grid, Chip, Box, Divider, List, ListItem, ListItemText, Button, Dialog, TextField
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AssignmentIcon from '@mui/icons-material/Assignment'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { caseApi } from '../../api/cases'
import { formatDate } from '../../utils/formatters'
import { formatCaseStatus, formatAbuseType } from '../../utils/constants'
import LoadingSpinner from '../Common/LoadingSpinner'

const CaseView = ({ caseId }) => {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [noteDialog, setNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState('')

  useEffect(() => { fetchCase() }, [caseId])

  const fetchCase = async () => {
    setLoading(true)
    try {
      const c = await caseApi.getCase(caseId)
      setCaseData(c)
      const n = await caseApi.getCaseNotes(caseId)
      setNotes(n || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleAddNote = async () => {
    try {
      await caseApi.addNote(caseId, { content: newNote })
      const updatedNotes = await caseApi.getCaseNotes(caseId)
      setNotes(updatedNotes)
      setNewNote('')
      setNoteDialog(false)
    } catch (err) { console.error(err) }
  }

  if (loading) return <LoadingSpinner />
  if (!caseData) return <Paper sx={{ p: 3, textAlign:'center' }}><Typography>Case not found</Typography></Paper>

  return (
    <Box>
      <Paper sx={{ p: 3, mb:3 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
          <Typography variant="h5">{caseData.case_number} - {caseData.case_title}</Typography>
          <Chip label={formatCaseStatus(caseData.status)} color={caseData.status==='closed'||caseData.status==='resolved'?'success':'warning'} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">Description</Typography>
            <Typography>{caseData.case_description || 'No description provided'}</Typography>

            <Grid container spacing={2} sx={{ mt:1 }}>
              <Grid item xs={6}><AssignmentIcon fontSize="small" color="action" /> <Typography variant="body2">Type:</Typography>
                <Chip label={formatAbuseType(caseData.abuse_type)} size="small" color="primary" variant="outlined" sx={{ mt:0.5 }} />
              </Grid>
              <Grid item xs={6}><CalendarTodayIcon fontSize="small" color="action" /> <Typography variant="body2">Incident Date:</Typography>
                <Typography variant="body1" sx={{ mt:0.5 }}>{formatDate(caseData.incident_date)}</Typography>
              </Grid>
              <Grid item xs={6}><LocationOnIcon fontSize="small" color="action" /> <Typography variant="body2">Location:</Typography>
                <Typography variant="body1" sx={{ mt:0.5 }}>{caseData.location || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={6}><Typography variant="body2">Priority:</Typography>
                <Chip label={caseData.priority} size="small" color={caseData.priority==='high'||caseData.priority==='critical'?'error':'default'} sx={{ mt:0.5 }} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            {caseData.assignedTo && (
              <Box sx={{ mb:2 }}>
                <Typography variant="subtitle2" color="textSecondary">Assigned To</Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap:1, mt:1 }}>
                  <PersonIcon />
                  <Typography>{caseData.assignedTo.name} ({caseData.assignedTo.email})</Typography>
                </Box>
              </Box>
            )}

            <Typography variant="subtitle2" color="textSecondary">Additional Info</Typography>
            <Typography variant="body2" sx={{ mt:1 }}>
              {caseData.additional_info ? JSON.stringify(caseData.additional_info) : 'No additional info'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Notes Section */}
      <Paper sx={{ p:3 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
          <Typography variant="h6">Notes</Typography>
          <Button variant="contained" startIcon={<NoteAddIcon />} onClick={() => setNoteDialog(true)}>Add Note</Button>
        </Box>
        <Divider sx={{ mb:2 }} />
        {notes.length===0 ? (
          <Typography color="textSecondary" align="center">No notes added yet</Typography>
        ) : (
          <List>
            {notes.map(n => (
              <ListItem key={n.id} alignItems="flex-start">
                <ListItemText
                  primary={<Box sx={{ display:'flex', justifyContent:'space-between' }}><Typography variant="subtitle1">{n.user?.name || 'Unknown User'}</Typography><Typography variant="caption" color="textSecondary">{formatDate(n.created_at)}</Typography></Box>}
                  secondary={n.content}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Note Dialog */}
      <Dialog open={noteDialog} onClose={() => setNoteDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p:3 }}>
          <Typography variant="h6" gutterBottom>Add Note</Typography>
          <TextField fullWidth multiline rows={4} value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Enter your note here..." sx={{ mb:2 }} />
          <Box sx={{ display:'flex', justifyContent:'flex-end', gap:1 }}>
            <Button onClick={()=>setNoteDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddNote} disabled={!newNote.trim()}>Add Note</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default CaseView
