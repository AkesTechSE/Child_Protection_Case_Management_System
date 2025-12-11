import { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Box, List, ListItem, ListItemText, Button, Dialog, TextField, Divider } from '@mui/material'
import { incidentApi } from '../../api/incidents'
import LoadingSpinner from '../Common/LoadingSpinner'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { formatDate } from '../../utils/formatters'

const IncidentView = ({ incidentId }) => {
  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [noteDialog, setNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState('')

  useEffect(() => { fetchIncident() }, [incidentId])

  const fetchIncident = async () => {
    setLoading(true)
    try {
      const inc = await incidentApi.getIncident(incidentId)
      setIncident(inc)
      setNotes(inc.notes || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleAddNote = async () => {
    try {
      await incidentApi.createIncident({ ...incident, notes: [...notes, { content:newNote }] })
      setNotes([...notes, { content:newNote, id: Date.now(), created_at: new Date().toISOString(), user:{name:'Current User'} }])
      setNewNote('')
      setNoteDialog(false)
    } catch (err) { console.error(err) }
  }

  if (loading) return <LoadingSpinner />
  if (!incident) return <Paper sx={{ p:3, textAlign:'center' }}><Typography>Incident not found</Typography></Paper>

  return (
    <Box>
      <Paper sx={{ p:3, mb:3 }}>
        <Typography variant="h5">{incident.title}</Typography>
        <Typography variant="body2" color="textSecondary">{formatDate(incident.incident_date)}</Typography>
        <Typography sx={{ mt:1 }}>{incident.description}</Typography>
        <Typography sx={{ mt:1 }}>Location: {incident.location}</Typography>
      </Paper>

      {/* Notes Section */}
      <Paper sx={{ p:3 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
          <Typography variant="h6">Notes</Typography>
          <Button variant="contained" startIcon={<NoteAddIcon />} onClick={()=>setNoteDialog(true)}>Add Note</Button>
        </Box>
        <Divider sx={{ mb:2 }} />
        {notes.length===0 ? <Typography color="textSecondary" align="center">No notes</Typography> : (
          <List>
            {notes.map(n => (
              <ListItem key={n.id}><ListItemText primary={n.user?.name || 'Unknown'} secondary={n.content} /></ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={noteDialog} onClose={()=>setNoteDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p:3 }}>
          <TextField fullWidth multiline rows={4} value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Enter note..." sx={{ mb:2 }} />
          <Box sx={{ display:'flex', justifyContent:'flex-end', gap:1 }}>
            <Button onClick={()=>setNoteDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddNote} disabled={!newNote.trim()}>Add Note</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default IncidentView
