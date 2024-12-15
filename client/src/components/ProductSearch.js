import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  TextField,
  Autocomplete,
  Box,
  Paper,
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useProducts } from '../contexts/ProductContext';

function ProductSearch() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Configure Fuse.js options
  const fuseOptions = {
    keys: ['title', 'description'],
    threshold: 0.3,
    includeScore: true,
    distance: 100
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
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    if (product) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={searchResults}
      getOptionLabel={(option) => option.title || ''}
      onChange={(event, newValue) => {
        if (newValue) {
          handleProductSelect(newValue);
        }
      }}
      onInputChange={(event, value) => {
        setSearchTerm(value);
      }}
      sx={{
        width: { xs: '200px', sm: '300px' }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search products..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
            '& .MuiAutocomplete-clearIndicator': {
              color: 'rgba(255, 255, 255, 0.7)',
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
            backgroundColor: '#1a1a1a',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
              <Typography variant="body1" sx={{ color: 'white' }}>
                {option.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                ${option.price}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      PaperComponent={props => (
        <Paper
          {...props}
          sx={{
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            '& .MuiAutocomplete-option': {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '&[aria-selected="true"]': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }
          }}
        />
      )}
    />
  );
}

export default ProductSearch;