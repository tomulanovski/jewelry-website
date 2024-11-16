import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import NavBar from '../components/navbar';
import ImageCarousel from '../components/imageSlider';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '@mui/material/styles';

function ProductPage() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(location.state?.product);
  
  // Get cart functions from context
  const { addItem, getItem, updateQuantity } = useCart();

  // Fetch product if not available in state
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

  // Extract images dynamically from product object
  const images = [];
  for (let i = 1; i <= 10; i++) {
    const imageUrl = product[`image${i}`];
    if (imageUrl) {
      images.push({ image: imageUrl, title: product.title });
    }
  }

  // Get current quantity in cart (if any)
  const cartItem = getItem(product.id);
  
  // Handle add to cart
  const handleAddToCart = () => {
    addItem(product, 1);
    // Optional: Show some feedback
    // could use MUI's Snackbar for this
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
        {/* Left Side: Image Carousel */}
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

        {/* Right Side: Product Details */}
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
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Price: ${product.price}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Material: {product.material}
          </Typography>
          
          {/* Cart Section */}
          <Box sx={{ mt: 2 }}>
            {cartItem ? (
              // Show quantity controls if item is in cart
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                >
                  -
                </Button>
                <Typography>{cartItem.quantity}</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                >
                  +
                </Button>
              </Box>
            ) : (
              // Show add to cart if item is not in cart
              <Button
                sx={{ color: theme.palette.text.primary , 
                  backgroundColor: '#333' ,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { backgroundColor: '#515151' , boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } }}
                variant="contained"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductPage;