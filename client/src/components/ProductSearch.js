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
import { brand } from '../theme';

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
        backgroundColor: adminStyle ? 'background.paper' : brand.panel,
        '&:hover': {
          backgroundColor: adminStyle ? 'background.default' : brand.panel,
        },
        '& fieldset': {
          borderColor: adminStyle ? 'divider' : brand.line,
        },
        '&:hover fieldset': {
          borderColor: adminStyle ? 'primary.main' : brand.gold,
        },
      },
      '& .MuiOutlinedInput-input': {
        color: adminStyle ? 'text.primary' : brand.text,
        '&::placeholder': {
          color: adminStyle ? 'text.secondary' : brand.muted,
          opacity: 1,
        },
      },
      '& .MuiAutocomplete-clearIndicator': {
        color: adminStyle ? 'action.active' : brand.muted,
      },
    },
    optionStyles: {
      backgroundColor: adminStyle ? 'background.paper' : brand.black,
      color: adminStyle ? 'text.primary' : brand.text,
      '&:hover': {
        backgroundColor: adminStyle ? 'action.hover' : 'rgba(201, 169, 110, 0.08)',
      },
    },
    paperStyles: {
      backgroundColor: adminStyle ? 'background.paper' : brand.black,
      border: '1px solid',
      borderColor: adminStyle ? 'divider' : brand.line,
      '& .MuiAutocomplete-option': {
        '&:hover': {
          backgroundColor: adminStyle ? 'action.hover' : 'rgba(201, 169, 110, 0.08)',
        },
        '&[aria-selected="true"]': {
          backgroundColor: adminStyle ? 'action.selected' : 'rgba(201, 169, 110, 0.14)',
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
          placeholder="Search jewelry"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ 
                  color: adminStyle ? 'action.active' : brand.muted 
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
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {option.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: adminStyle ? 'text.secondary' : brand.muted 
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