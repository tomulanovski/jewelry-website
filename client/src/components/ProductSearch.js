import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

function ProductSearch({ onProductSelect, adminStyle = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const isAdminPage = location.pathname.startsWith('/admin');

  const fuseOptions = {
    keys: ['title', 'description', 'materials'],
    threshold: 0.3,
    includeScore: true,
    distance: 100,
    minMatchCharLength: 2
  };

  const fuse = new Fuse(products, fuseOptions);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const results = fuse.search(searchTerm);
    setSearchResults(results.map(result => result.item));
  }, [searchTerm, products]);

  const handleProductSelect = (product) => {
    if (!product) return;

    if (isAdminPage && onProductSelect) {
      onProductSelect(product);
      setSearchTerm('');
      return;
    }

    navigate(`/product/${product.id}`);
    setSearchTerm('');
  };

  const getStyles = () => ({
    regularStyles: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: adminStyle ? 'background.paper' : 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: adminStyle ? 'background.default' : 'rgba(255, 255, 255, 0.15)',
        },
        '& fieldset': {
          borderColor: adminStyle ? 'divider' : 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover fieldset': {
          borderColor: adminStyle ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
        },
      },
      '& .MuiOutlinedInput-input': {
        color: adminStyle ? 'text.primary' : 'white',
        '&::placeholder': {
          color: adminStyle ? 'text.secondary' : 'rgba(255, 255, 255, 0.7)',
          opacity: 1,
        },
      },
      '& .MuiAutocomplete-clearIndicator': {
        color: adminStyle ? 'action.active' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    optionStyles: {
      backgroundColor: adminStyle ? 'background.paper' : '#1a1a1a',
      color: adminStyle ? 'text.primary' : 'white',
      '&:hover': {
        backgroundColor: adminStyle ? 'action.hover' : 'rgba(255, 255, 255, 0.05)',
      },
    },
    paperStyles: {
      backgroundColor: adminStyle ? 'background.paper' : '#1a1a1a',
      border: '1px solid',
      borderColor: adminStyle ? 'divider' : 'rgba(255, 255, 255, 0.12)',
      '& .MuiAutocomplete-option': {
        '&:hover': {
          backgroundColor: adminStyle ? 'action.hover' : 'rgba(255, 255, 255, 0.05)',
        },
        '&[aria-selected="true"]': {
          backgroundColor: adminStyle ? 'action.selected' : 'rgba(255, 255, 255, 0.1)',
        },
      },
    }
  });

  const styles = getStyles();

  return (
    <Autocomplete
      freeSolo
      options={searchResults}
      getOptionLabel={(option) => option.title || ''}
      value={null}
      inputValue={searchTerm}
      onChange={(event, newValue) => handleProductSelect(newValue)}
      onInputChange={(event, value) => setSearchTerm(value)}
      sx={{
        width: '100%',
        '& .MuiAutocomplete-popper': {
          zIndex: 1400
        }
      }}
      PopperProps={{
        style: { 
          zIndex: 1400,
          position: 'absolute'
        }
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
                <SearchIcon sx={{ 
                  color: adminStyle ? 'action.active' : 'rgba(255, 255, 255, 0.7)' 
                }} />
              </InputAdornment>
            )
          }}
          sx={styles.regularStyles}
        />
      )}
      renderOption={(props, option) => (
        <Paper
          component="li"
          {...props}
          elevation={0}
          sx={styles.optionStyles}
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
              <Typography variant="body1">
                {option.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: adminStyle ? 'text.secondary' : 'rgba(255, 255, 255, 0.7)' 
                }}
              >
                ${option.price}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      PaperComponent={props => (
        <Paper {...props} sx={styles.paperStyles} />
      )}
    />
  );
}

export default ProductSearch;