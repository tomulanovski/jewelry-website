// NavBar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const NavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State for dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle opening the dropdown menu on hover
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle clicking on dropdown items
  const handleMenuItemClick = (category) => {
    navigate(`/shop/${category.toLowerCase()}`);
    handleMenuClose();
  };

  // Handle clicking the main "Shop" button
  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: 'none', color: theme.palette.text.primary }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>My Jewelry Store</Link>
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" sx={{ color: theme.palette.text.primary , '&:hover': { backgroundColor: '#333' } }} component={Link} to="/">
            Home
          </Button>

          {/* Shop Button with Dropdown Menu */}
          <Button
            color="inherit"
            sx={{ color: theme.palette.text.primary }}
            onClick={handleShopClick}
            onMouseEnter={handleMenuOpen}
            aria-controls={anchorEl ? 'shop-menu' : undefined}
            aria-haspopup="true"
          >
            Shop
          </Button>

          {/* Dropdown Menu for Categories */}
          <Menu
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#000', // Black background for the menu
              },
            }}
            id="shop-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              onMouseLeave: handleMenuClose,
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick('')}
            sx={{ '&:hover': { backgroundColor: '#333' } }}>
            Full collection</MenuItem>

            <MenuItem onClick={() => handleMenuItemClick('Earrings')} 
            sx={{ '&:hover': { backgroundColor: '#333' } }} >
            Earrings</MenuItem>

            <MenuItem onClick={() => handleMenuItemClick('Rings')}
            sx={{ '&:hover': { backgroundColor: '#333' } }}>
            Rings </MenuItem>

            <MenuItem onClick={() => handleMenuItemClick('Necklaces')}
            sx={{ '&:hover': { backgroundColor: '#333' } }} >
            Necklaces </MenuItem>

            <MenuItem onClick={() => handleMenuItemClick('Bracelets')}
            sx={{ '&:hover': { backgroundColor: '#333' } }}>
            Bracelets </MenuItem>
  
            <MenuItem onClick={() => handleMenuItemClick('Engagements')}
            sx={{ '&:hover': { backgroundColor: '#333' } }} >
            Engagements</MenuItem>
            </Menu>

          <Button color="inherit" sx={{ color: theme.palette.text.primary , '&:hover': { backgroundColor: '#333' } }} component={Link} to="/about">
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
