import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export default function SearchInput({ value, onChange, onClear }) {
  const theme = useTheme();

  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      value={value}
      onChange={onChange}
      fullWidth
      sx={{
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: theme.palette.primary.main }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              onClick={onClear}
              size="small"
              aria-label="clear"
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  color: theme.palette.primary.dark, // Optional: Adjust hover color
                  backgroundColor: 'transparent', // Optional: Remove hover background
                },
              }}
            >
              <ClearIcon 
                fontSize="small" 
                sx={{ 
                  color: `${theme.palette.primary.main} !important`,
                }} 
              />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}