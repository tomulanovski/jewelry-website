import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../contexts/CartContext';
import ProductSearch from './ProductSearch';
import { useAuth } from '../contexts/AuthContext';
import { brand, labelStyle } from '../theme';

// Category mapping to ensure consistency between display names and URL parameters
export const categories = [
  { display: 'Shop All', param: '' },
  { display: 'Rings', param: 'rings' },
  { display: 'Necklaces', param: 'necklaces' },
  { display: 'Earrings', param: 'earrings' },
  { display: 'Bracelets', param: 'bracelets' },
  { display: 'Wedding & Engagement', param: 'wedding_engagement' }
];

const linkSx = {
  ...labelStyle,
  color: brand.muted,
  padding: '6px 0',
  minWidth: 0,
  '&:hover': { color: brand.goldSoft, backgroundColor: 'transparent' },
};

const iconSx = { color: brand.goldSoft, '&:hover': { color: brand.gold } };

const NavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMenuItemClick = (categoryParam) => {
    navigate(`/shop/${categoryParam}`);
    setAnchorEl(null);
    setMobileMenuOpen(false);
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

  const cartIcon = (
    <IconButton component={Link} to="/cart" aria-label="Cart" sx={iconSx}>
      <Badge
        badgeContent={getTotalItems()}
        sx={{ '& .MuiBadge-badge': { backgroundColor: brand.gold, color: '#14110c', fontSize: '0.65rem' } }}
      >
        <ShoppingBagOutlinedIcon fontSize="small" />
      </Badge>
    </IconButton>
  );

  const drawerItem = { '& .MuiListItemText-primary': { ...labelStyle, fontSize: '0.8rem', color: brand.text } };

  const mobileMenu = (
    <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
      <Box sx={{ width: 280, pt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
          <IconButton aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} sx={iconSx}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItemButton component={Link} to="/" onClick={() => setMobileMenuOpen(false)} sx={drawerItem}>
            <ListItemText primary="Home" />
          </ListItemButton>
          {categories.map((category) => (
            <ListItemButton
              key={category.param || 'all'}
              onClick={() => handleMenuItemClick(category.param)}
              sx={drawerItem}
            >
              <ListItemText primary={category.display} />
            </ListItemButton>
          ))}
          <ListItemButton component={Link} to="/about" onClick={() => setMobileMenuOpen(false)} sx={drawerItem}>
            <ListItemText primary="About" />
          </ListItemButton>
          <ListItemButton component="a" href="/paintings" sx={drawerItem}>
            <ListItemText primary="Paintings" />
          </ListItemButton>
          <ListItemButton onClick={handleAccountClick} sx={drawerItem}>
            <ListItemText primary={isAuthenticated ? 'My Account' : 'Sign In'} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: brand.black, borderBottom: `1px solid ${brand.line}` }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 2, md: 5 },
          minHeight: { xs: 64, md: 76 },
        }}
      >
        <Link to="/" aria-label="Home" style={{ textDecoration: 'none' }}>
          <Box
            component="span"
            sx={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: brand.gold,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              letterSpacing: '0.3em',
            }}
          >
            CU
          </Box>
        </Link>

        {isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton aria-label="Search" onClick={() => setSearchOpen(!searchOpen)} sx={iconSx}>
              <SearchIcon fontSize="small" />
            </IconButton>
            {cartIcon}
            <IconButton aria-label="Menu" onClick={() => setMobileMenuOpen(true)} sx={iconSx}>
              <MenuIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Button
              sx={linkSx}
              onClick={() => navigate('/shop')}
              onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
              aria-controls={anchorEl ? 'shop-menu' : undefined}
              aria-haspopup="true"
            >
              Shop
            </Button>
            <Button sx={linkSx} component={Link} to="/about">
              About
            </Button>
            <Button sx={linkSx} component="a" href="/paintings">
              Paintings
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <IconButton aria-label="Search" onClick={() => setSearchOpen(!searchOpen)} sx={iconSx}>
                <SearchIcon fontSize="small" />
              </IconButton>
              {cartIcon}
              <IconButton aria-label="Account" onClick={handleAccountClick} sx={iconSx}>
                <PersonOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        <Menu
          id="shop-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{ onMouseLeave: () => setAnchorEl(null) }}
          PaperProps={{ sx: { backgroundColor: brand.black, border: `1px solid ${brand.line}`, mt: 1 } }}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.param || 'all'}
              onClick={() => handleMenuItemClick(category.param)}
              sx={{ ...labelStyle, color: brand.text, py: 1.25, '&:hover': { color: brand.gold } }}
            >
              {category.display}
            </MenuItem>
          ))}
        </Menu>

        {mobileMenu}
      </Toolbar>

      <Collapse in={searchOpen} unmountOnExit>
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 2, maxWidth: 640, mx: 'auto', width: '100%' }}>
          <ProductSearch />
        </Box>
      </Collapse>
    </AppBar>
  );
};

export default NavBar;
