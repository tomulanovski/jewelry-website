import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { useTheme } from '@mui/material/styles';
import NavBar from '../components/navbar';
import ImageCarousel from '../components/imageSlider';
import QuantityInput from '../components/quantityInput';

function ProductPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, isLoading: contextLoading, getProduct } = useProducts();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addItem, getItem, notification, clearNotification } = useCart();

  // Get product directly from context
  const product = getProduct(parseInt(id));

  // Reset quantity when product changes
  useEffect(() => {
    setSelectedQuantity(1);
  }, [product?.id]);

  if (contextLoading) {
    return (
      <Box>
        <NavBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box>
        <NavBar />
        <Typography align="center" variant="h4" sx={{ marginTop: 5, color: 'error.main' }}>
          Product not found
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" onClick={() => navigate('/shop')}>
            Return to Shop
          </Button>
        </Box>
      </Box>
    );
  }

  const images = Object.entries(product)
    .filter(([key, value]) => key.startsWith('image') && value)
    .map(([_, value]) => ({ image: value, title: product.title }));

  const cartItem = getItem(product.id);
  const availableStock = (cartItem?.stock_quantity || product.quantity) - (cartItem?.quantity || 0);

  const handleQuantityChange = (event, newValue) => {
    if (newValue !== null) {
      const value = Math.max(1, Math.min(newValue, availableStock));
      setSelectedQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity <= availableStock) {
      const success = addItem(product, selectedQuantity);
      if (success) {
        setSelectedQuantity(1);
      }
    }
  };

  const getStockMessage = () => {
    if (product.quantity === 0) {
      return 'Out of Stock';
    }
    if (cartItem) {
      if (availableStock === 0) {
        return `Maximum quantity (${cartItem.quantity}) already in cart`;
      }
      return `${availableStock} more available (${cartItem.quantity} in cart)`;
    }
    if (product.quantity <= 5) {
      return `Only ${product.quantity} left in stock`;
    }
    return `${product.quantity} items available`;
  };

  const isMaxInCart = cartItem && availableStock === 0;

  return (
    <Box sx={{ padding: '20px' }}>
      <NavBar />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'center', lg: 'flex-start' },
          gap: 6,
          mt: 4,
        }}
      >
        <Box
          sx={{
            flex: { xs: '1', lg: '2' },
            maxWidth: { xs: '100%', lg: '70%' },
            width: '100%',
            margin: 'auto',
          }}
        >
          <ImageCarousel items={images} width="100%" />
        </Box>

        <Box
          sx={{
            flex: { xs: '1', lg: '1' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: { xs: '100%', lg: '30%' },
            padding: { xs: 2, lg: 4 },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            {product.title}
          </Typography>
          <Typography variant="h6" color="white" sx={{ mb: 2 }}>
            ${product.price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Typography 
            variant="body2" 
            color={availableStock <= 5 ? 'error.main' : theme.palette.text.primary}
            sx={{ mb: 2, fontWeight: availableStock <= 5 ? 'bold' : 'normal' }}
          >
            {getStockMessage()}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {product.quantity > 0 && !isMaxInCart ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 500 }}>
                  Quantity:
                </Typography>
                <Box sx={{ width: '30%', minWidth: '120px' }}>
                  <QuantityInput
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min={1}
                    max={availableStock}
                    aria-label="Quantity input"
                  />
                </Box>
                <Button
                  sx={{ 
                    color: theme.palette.text.primary,
                    backgroundColor: '#333',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': { 
                      backgroundColor: '#515151',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}
                  variant="contained"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                disabled
                sx={{ width: '100%' }}
              >
                {isMaxInCart ? 'Maximum Quantity in Cart' : 'Out of Stock'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

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
  );
}

export default ProductPage;