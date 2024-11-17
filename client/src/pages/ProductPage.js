import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import NavBar from '../components/navbar';
import ImageCarousel from '../components/imageSlider';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '@mui/material/styles';
import QuantityInput from '../components/quantityInput';

function ProductPage() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(location.state?.product);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
  const { addItem, getItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!product && id) {
        try {
          const response = await axios.get(`http://localhost:3000/product/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error loading product:', error);
        }
      }
    };

    fetchProduct();
  }, [id, product]);

  if (!product) {
    return (
      <Box>
        <NavBar />
        <Typography align="center" variant="h4" sx={{ marginTop: 5 }}>
          Product not found.
        </Typography>
      </Box>
    );
  }

  const images = [];
  for (let i = 1; i <= 10; i++) {
    const imageUrl = product[`image${i}`];
    if (imageUrl) {
      images.push({ image: imageUrl, title: product.title });
    }
  }

  const cartItem = getItem(product.id);

  const handleQuantityChange = (event, newValue) => {
    if (newValue !== null) {
      const value = Math.max(1, Math.min(newValue, product.quantity));
      setSelectedQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity <= product.quantity) {
      addItem(product, selectedQuantity);
      setSelectedQuantity(1);
    }
  };

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
          <Typography variant="h6" color='white'  sx={{ mb: 2 }}>
            ${product.price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          
          <Typography 
            variant="body2" 
            color= {theme.palette.text.primary} 
            sx={{ mb: 2 }}
          >
            {product.quantity > 0 ? `In Stock: ${product.quantity} available` : 'Out of Stock'}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {product.quantity > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 500 
                  }}
                >
                  Quantity:
                </Typography>
                <Box sx={{ width: '30%', minWidth: '120px' }}>
                <QuantityInput
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min={1}
                    max={product.quantity}
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
                  disabled={product.quantity === 0}
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
                Out of Stock
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductPage;