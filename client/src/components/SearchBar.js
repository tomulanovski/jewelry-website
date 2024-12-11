import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { 
  TextField, 
  Autocomplete, 
  Box, 
  Paper,
  Typography 
} from '@mui/material';

function SearchBar({ products, onProductSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Configure Fuse.js options
  const fuseOptions = {
    keys: ['title', 'description'], // Fields to search
    threshold: 0.3, // Lower number means more strict matching
    includeScore: true
  };
  
  const fuse = new Fuse(products, fuseOptions);

  // Update search results when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    
    const results = fuse.search(searchTerm);
    setSearchResults(results.map(result => result.item));
  }, [searchTerm]);

  return (
    <Autocomplete
      freeSolo
      options={searchResults}
      getOptionLabel={(option) => option.title || ''}
      onChange={(event, newValue) => {
        if (newValue) {
          onProductSelect(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search products"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#bdbdbd',
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <Paper
          component="li"
          {...props}
          elevation={0}
          sx={{ 
            mb: 1, 
            '&:hover': { 
              backgroundColor: '#f5f5f5' 
            } 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            {option.image1 && (
              <img
                src={option.image1}
                alt={option.title}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: 'cover',
                  marginRight: 16,
                  borderRadius: 4
                }}
              />
            )}
            <Box>
              <Typography variant="body1">{option.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${option.price}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    />
  );
}

export default SearchBar;