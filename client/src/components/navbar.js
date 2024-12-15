import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../contexts/CartContext';
import ProductSearch from './ProductSearch';

const NavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (category) => {
    navigate(`/shop/${category.toLowerCase()}`);
    handleMenuClose();
  };

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>My Jewelry Store</Link>
        </Typography>

        {/* Search Bar */}
        <Box sx={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '300px'
        }}>
          <ProductSearch />
        </Box>

        {/* Navigation Links and Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: '#333' } }} 
            component={Link} 
            to="/"
          >
            Home
          </Button>

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

          <Menu
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#000',
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
            <MenuItem onClick={() => handleMenuItemClick('')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Full collection
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Earrings')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Earrings
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Rings')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Rings
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Necklaces')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Necklaces
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Bracelets')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Bracelets
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Engagements')} sx={{ '&:hover': { backgroundColor: '#333' } }}>
              Engagements
            </MenuItem>
          </Menu>

          <Button 
            color="inherit" 
            sx={{ color: theme.palette.text.primary, '&:hover': { backgroundColor: '#333' } }} 
            component={Link} 
            to="/about"
          >
            About
          </Button>

          <IconButton component={Link} to="/cart" sx={{ color: theme.palette.text.primary }}>
            <Badge 
              badgeContent={getTotalItems()} 
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.text.primary,
                  color: 'black'
                }
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton component={Link} to="/account" sx={{ color: theme.palette.text.primary }}>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;