import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', md: '10rem' },
          fontWeight: 300,
          color: 'rgb(227, 217, 177)',
          letterSpacing: '0.2em',
          lineHeight: 1,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: 'rgb(227, 217, 177)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          opacity: 0.8,
        }}
      >
        Page not found
      </Typography>

      <Button
        onClick={() => navigate('/shop')}
        variant="outlined"
        sx={{
          mt: 2,
          color: 'rgb(227, 217, 177)',
          borderColor: 'rgb(227, 217, 177)',
          letterSpacing: '0.15em',
          px: 4,
          py: 1.5,
          '&:hover': {
            backgroundColor: 'rgb(227, 217, 177)',
            color: '#000000',
            borderColor: 'rgb(227, 217, 177)',
          },
        }}
      >
        Back to Shop
      </Button>
    </Box>
  );
}

export default NotFound;
