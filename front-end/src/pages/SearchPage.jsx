import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { caseApi } from '../api/cases'
import { victimApi } from '../api/victims'
import { perpetratorApi } from '../api/perpetrators'
import { useLocation, useNavigate } from 'react-router-dom'

const useQuery = () => new URLSearchParams(useLocation().search)

const filterItems = (items, term, fields) => {
  if (!term) return items
  const t = term.toLowerCase()
  return items.filter((item) =>
    fields.some((f) => (item[f] || '').toString().toLowerCase().includes(t))
  )
}

const Section = ({ title, loading, error, items, renderItem, emptyLabel }) => (
  <Paper sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
      {loading && <CircularProgress size={16} />}
      {items?.length > 0 && (
        <Chip label={`${items.length}`} size="small" sx={{ ml: 'auto' }} />
      )}
    </Stack>
    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
    {!loading && !error && items?.length === 0 && (
      <Typography variant="body2" color="text.secondary">{emptyLabel}</Typography>
    )}
    {!loading && !error && items?.length > 0 && (
      <List dense>
        {items.map(renderItem)}
      </List>
    )}
  </Paper>
)

const SearchPage = () => {
  const query = useQuery()
  const navigate = useNavigate()
  const initialTerm = query.get('q') || ''
  const [term, setTerm] = useState(initialTerm)

  const [cases, setCases] = useState([])
  const [victims, setVictims] = useState([])
  const [perps, setPerps] = useState([])

  const [loading, setLoading] = useState({
    cases: false,
    victims: false,
    perps: false,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setTerm(initialTerm)
  }, [initialTerm])

  const fetchData = async () => {
    setErrors({})
    setLoading({ cases: true, victims: true, perps: true })
    try {
      const [casesRes, victimsRes, perpsRes] = await Promise.allSettled([
        caseApi.getCases({ per_page: 200 }),
        victimApi.getVictims?.({ per_page: 200 }) || victimApi.getVictims?.(),
        perpetratorApi.getPerpetrators?.({ per_page: 200 }) || perpetratorApi.getPerpetrators?.(),
      ])

      const normalize = (res) => {
        if (res.status !== 'fulfilled') return []
        const data = res.value?.data ?? res.value
        return Array.isArray(data) ? data : (data?.data || [])
      }

      setCases(normalize(casesRes))
      setVictims(normalize(victimsRes))
      setPerps(normalize(perpsRes))
    } catch (err) {
      // Errors captured per promise above
    } finally {
      setLoading({ cases: false, victims: false, perps: false })
      setErrors({
        cases: cases instanceof Error ? cases.message : '',
        victims: victims instanceof Error ? victims.message : '',
        perps: perps instanceof Error ? perps.message : '',
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => ({
    cases: filterItems(cases, term, ['case_title', 'case_number', 'abuse_type', 'status', 'location']),
    victims: filterItems(victims, term, ['first_name', 'middle_name', 'last_name', 'gender', 'contact_number', 'child_contact']),
    perps: filterItems(perps, term, ['first_name', 'last_name', 'gender', 'phone', 'contact_number']),
  }), [cases, victims, perps, term])

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Search</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Search across cases, victims, perpetrators"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <RefreshIcon onClick={fetchData} sx={{ cursor: 'pointer' }} />
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Section
            title="Cases"
            loading={loading.cases}
            error={errors.cases}
            items={filtered.cases}
            emptyLabel="No matching cases"
            renderItem={(c) => (
              <ListItem key={`case-${c.id}`} button onClick={() => navigate(`/cases/${c.id || c.case_id || ''}`)}>
                <ListItemText
                  primary={c.case_title || c.title || 'Untitled Case'}
                  secondary={(c.case_number || '').toString() || 'No case number'}
                />
              </ListItem>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Section
            title="Victims"
            loading={loading.victims}
            error={errors.victims}
            items={filtered.victims}
            emptyLabel="No matching victims"
            renderItem={(v) => (
              <ListItem key={`victim-${v.id}`}>
                <ListItemText
                  primary={[v.first_name, v.middle_name, v.last_name].filter(Boolean).join(' ') || 'Unknown victim'}
                  secondary={[v.gender, v.contact_number, v.child_contact].filter(Boolean).join(' • ') || 'No details'}
                />
              </ListItem>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Perpetrators"
            loading={loading.perps}
            error={errors.perps}
            items={filtered.perps}
            emptyLabel="No matching perpetrators"
            renderItem={(p) => (
              <ListItem key={`perp-${p.id}`}>
                <ListItemText
                  primary={[p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown perpetrator'}
                  secondary={[p.gender, p.phone || p.contact_number].filter(Boolean).join(' • ') || 'No details'}
                />
              </ListItem>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchPage
