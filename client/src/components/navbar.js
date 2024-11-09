// NavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Import the hook to use the theme

const NavBar = () => {
  const theme = useTheme(); // Get the theme object

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: theme.palette.text.primary }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>My Jewelry Store</Link>
        </Typography>

           {/* Navigation Links */}
           <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" sx={{ color: theme.palette.text.primary }} component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" sx={{ color: theme.palette.text.primary }} component={Link} to="/shop">
            Shop
          </Button>
          <Button color="inherit" sx={{ color: theme.palette.text.primary }} component={Link} to="/about">
            About
          </Button>
        </Box>

        {/* Cart and Account Icons */}
        <IconButton component={Link} to="/cart" sx={{ color: theme.palette.text.primary }}>
          <ShoppingCartIcon />
        </IconButton>
        <IconButton component={Link} to="/account" sx={{ color: theme.palette.text.primary }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
