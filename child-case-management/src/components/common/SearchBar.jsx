import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  fullWidth = true,
  size = 'medium',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = debounce((value) => {
    if (onSearch) {
      onSearch(value);
    }
  }, delay);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        size={size}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

export default SearchBar;