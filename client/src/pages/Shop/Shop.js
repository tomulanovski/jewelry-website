import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Card, CardMedia, CardContent, Button,
  Snackbar, Alert, CircularProgress 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/navbar';
import { useTheme } from '@mui/material/styles';
import { useCart } from '../../contexts/CartContext';

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
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const navigate = useNavigate();

  const { addItem, getItem, notification, clearNotification } = useCart();

  const categoryMap = {
    rings: 0,
    necklaces: 1,
    earrings: 2,
    bracelets: 3,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/shop');
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading items:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          {category ? category.toUpperCase() : 'SHOP'}
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mb={4}>
          <Button
            variant="outlined"
            sx={{
              color: 'text.primary',
              borderColor: '#888',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderColor: '#555',
              },
              '&:focus': {
                borderColor: '#333',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
            onClick={() => navigate('/shop')}
          >
            All Products
          </Button>
          {['rings', 'necklaces', 'earrings', 'bracelets'].map((cat) => (
            <Button
              key={cat}
              variant="outlined"
              sx={{
                color: 'text.primary',
                borderColor: '#888',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderColor: '#555',
                },
                '&:focus': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              onClick={() => navigate(`/shop/${cat}`)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </Box>

        <Grid container spacing={4} sx={{ padding: '20px' }}>
          {filteredProducts.map((product) => {
            const stockMessage = getStockMessage(product);
            const available = isProductAvailable(product);
            const cartItem = getItem(product.id);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                  onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
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
          })}
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