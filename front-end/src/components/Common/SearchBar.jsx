import { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search, Clear } from '@mui/icons-material'

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  )
}

export default SearchBar