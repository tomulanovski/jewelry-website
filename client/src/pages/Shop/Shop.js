import React from 'react';
import { 
  Box, Typography, Card, CardMedia, CardContent, Button,
  Snackbar, Alert, CircularProgress, useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/navbar';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">Something went wrong. Please try again later.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

function Shop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { products, isLoading, error } = useProducts();
  const { category } = useParams();
  const navigate = useNavigate();

  const { addItem, getItem, notification, clearNotification } = useCart();

  const categoryMap = {
    rings: 0,
    necklaces: 1,
    earrings: 2,
    bracelets: 3,
    wedding_engagement: 4
  };

  const filteredProducts = category
    ? products.filter(product => product.type === categoryMap[category])
    : products;

  const getStockMessage = (product) => {
    const cartItem = getItem(product.id);
    const availableStock = product.quantity - (cartItem?.quantity || 0);
    
    if (product.quantity === 0) {
      return 'Out of Stock';
    }
    if (cartItem) {
      if (availableStock === 0) {
        return `Maximum quantity in cart (${cartItem.quantity})`;
      }
      return `${availableStock} more available`;
    }
    if (product.quantity <= 5) {
      return `Only ${product.quantity} left`;
    }
    return null;
  };

  const isProductAvailable = (product) => {
    const cartItem = getItem(product.id);
    const availableStock = product.quantity - (cartItem?.quantity || 0);
    return availableStock > 0;
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();
    if (isProductAvailable(product)) {
      addItem({
        ...product,
        stock_quantity: product.quantity 
      }, 1);
    }
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'wedding_engagement') {
      return 'Wedding & Engagement';
    }
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return (
      <Box>
        <NavBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <NavBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box>
        <NavBar />
        <Typography
          align="center"
          variant="h4"
          component="h1"
          sx={{
            color: 'rgb(var(--color_21))',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
            letterSpacing: '2px',
            marginBottom: '20px',
          }}
        >
          {category ? formatCategoryName(category).toUpperCase() : 'SHOP'}
        </Typography>

        {/* Mobile-friendly category buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          gap: 2,
          padding: '0 16px',
          marginBottom: '32px'
        }}>
          <Button 
            color="inherit"
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              borderColor: '#888',
              '&:hover': { backgroundColor: '#333' }
            }}
            onClick={() => navigate('/shop')}
          >
            All Products
          </Button>
          {['rings', 'necklaces', 'earrings', 'bracelets', 'wedding_engagement'].map((cat) => (
            <Button
              key={cat}
              color="inherit"
              variant="outlined"
              sx={{
                color: theme.palette.text.primary,
                borderColor: '#888',
                '&:hover': { backgroundColor: '#333' }
              }}
              onClick={() => navigate(`/shop/${cat}`)}
            >
              {formatCategoryName(cat)}
            </Button>
          ))}
        </Box>

        <Grid container spacing={4} sx={{ padding: '20px' }}>
          {filteredProducts.length === 0 ? (
            <Box width="100%" textAlign="center" py={8}>
              <Typography variant="h6">
                No products found in this category.
              </Typography>
            </Box>
          ) : (
            filteredProducts.map((product) => {
              const stockMessage = getStockMessage(product);
              const available = isProductAvailable(product);
              const cartItem = getItem(product.id);

              return (
                <Grid item xs={6} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.image1}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography gutterBottom variant="h6" component="div" align="center" sx={{ fontWeight: 'bold' }}>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        ${product.price}
                      </Typography>
                      {stockMessage && (
                        <Typography 
                          variant="body2" 
                          color={available ? 'warning.main' : 'error.main'} 
                          sx={{ mt: 1, textAlign: 'center' }}
                        >
                          {stockMessage}
                        </Typography>
                      )}
                      <Button
                        sx={{
                          color: theme.palette.text.primary,
                          backgroundColor: '#333',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': { backgroundColor: '#515151', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
                          marginTop: '10px',
                        }}
                        variant="contained"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!available}
                      >
                        {cartItem && !available 
                          ? 'Maximum in Cart' 
                          : available 
                            ? 'Add to Cart' 
                            : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>

        <Snackbar
          open={notification !== null}
          autoHideDuration={3000}
          onClose={clearNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {notification && (
            <Alert
              onClose={clearNotification}
              severity={notification.type}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </ErrorBoundary>
  );
}

export default Shop;