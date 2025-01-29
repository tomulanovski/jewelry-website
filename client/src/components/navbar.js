import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../contexts/CartContext';
import ProductSearch from './ProductSearch';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    if (!isMobile) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (category) => {
    navigate(`/shop/${category.toLowerCase()}`);
    handleMenuClose();
    setMobileMenuOpen(false);
  };

  const handleShopClick = () => {
    if (isMobile) {
      setMobileMenuOpen(true);
    } else {
      navigate('/shop');
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      if (user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } else {
      navigate('/register');
    }
    setMobileMenuOpen(false);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: theme.palette.background.default,
          width: '250px',
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
          <ListItemText primary="Home" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('')}>
          <ListItemText primary="Shop All" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('Earrings')}>
          <ListItemText primary="Earrings" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('Rings')}>
          <ListItemText primary="Rings" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('Necklaces')}>
          <ListItemText primary="Necklaces" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('Bracelets')}>
          <ListItemText primary="Bracelets" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button onClick={() => handleMenuItemClick('Engagements')}>
          <ListItemText primary="Engagements" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
        <ListItem button component={Link} to="/about" onClick={() => setMobileMenuOpen(false)}>
          <ListItemText primary="About" sx={{ color: theme.palette.text.primary }} />
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: theme.palette.background.default,
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          p: { xs: 1, sm: 2 },
          minHeight: { xs: '56px' },
          width: '100%',
          gap: 1,
          '& > *': {
            flexShrink: 0
          }
        }}
      >
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            marginRight: { xs: 1, sm: 2 }
          }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            CUBijoux
          </Link>
        </Typography>

        {/* Desktop Search Bar */}
        {!isMobile && (
          <Box sx={{ 
            width: '300px',
            mx: 2,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ProductSearch />
          </Box>
        )}

        {/* Navigation Links and Icons */}
        {isMobile ? (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 'auto'
          }}>
            {/* Search Container */}
            <Box sx={{ 
              width: '180px',
              position: 'relative',
              zIndex: 2,
              mr: 1
            }}>
              <ProductSearch />
            </Box>

            {/* Icons Container */}
            <Box sx={{
              display: 'flex',
              gap: 0.5,
              alignItems: 'center',
              zIndex: 1
            }}>
              <IconButton 
                component={Link} 
                to="/cart" 
                sx={{ 
                  color: theme.palette.text.primary,
                  padding: '6px'
                }}
              >
                <Badge 
                  badgeContent={getTotalItems()} 
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: theme.palette.text.primary,
                      color: 'black',
                      fontSize: '0.7rem'
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
                </Badge>
              </IconButton>
              
              <IconButton 
                onClick={handleAccountClick}
                sx={{ 
                  color: theme.palette.text.primary,
                  padding: '6px'
                }}
              >
                <AccountCircleIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>

              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuToggle}
                sx={{ 
                  color: theme.palette.text.primary,
                  padding: '6px'
                }}
              >
                <MenuIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
            <Button 
              color="inherit" 
              sx={{ color: theme.palette.text.primary }} 
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

            <Button 
              color="inherit" 
              sx={{ color: theme.palette.text.primary }} 
              component={Link} 
              to="/about"
            >
              About
            </Button>

            <IconButton 
              component={Link} 
              to="/cart" 
              sx={{ color: theme.palette.text.primary }}
            >
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

            <IconButton 
              onClick={handleAccountClick}
              sx={{ color: theme.palette.text.primary }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        )}

        {/* Desktop Shop Menu */}
        <Menu
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: theme.palette.background.default,
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
          <MenuItem onClick={() => handleMenuItemClick('')}>
            Full collection
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Earrings')}>
            Earrings
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Rings')}>
            Rings
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Necklaces')}>
            Necklaces
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Bracelets')}>
            Bracelets
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('Engagements')}>
            Engagements
          </MenuItem>
        </Menu>

        {/* Mobile Menu Drawer */}
        {mobileMenu}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;