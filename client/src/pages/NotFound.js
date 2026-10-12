import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { brand } from '../theme';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box>
      <NavBar />
      <Box sx={{ textAlign: 'center', py: { xs: 12, md: 16 }, px: 3 }}>
        <Typography variant="overline" component="p">
          404
        </Typography>
        <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, color: brand.text, my: 2 }}>
          This page doesn't exist
        </Typography>
        <Typography sx={{ color: brand.muted, mb: 4 }}>
          The link may be old. The collection is a good place to start.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/shop')}>
          Back to the shop
        </Button>
      </Box>
    </Box>
  );
}

export default NotFound;
