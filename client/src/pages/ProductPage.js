import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import NavBar from '../components/navbar';
import ImageCarousel from '../components/imageSlider';

function ProductPage({ addItemToCart }) {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
  
    if (!product) {
      return (
        <Box>
          <Typography align="center" variant="h5" sx={{ marginTop: 5 }}>
            Product not found.
          </Typography>
          <Button onClick={() => navigate('/shop')}>Go Back to Shop</Button>
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
  
    return (
      <Box sx={{ padding: '20px' }}>
        <NavBar />
        <Button onClick={() => navigate(-1)}>Go Back</Button>
  
        {/* Flexbox Layout for Product Page */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            gap: 4,
            mt: 4,
          }}
        >
          {/* Left Side: Image Carousel (2/3 width) */}
          <Box
            sx={{
              flex: { xs: '1', md: '2' }, // Takes up 2/3 of space on medium screens and larger
              maxWidth: { xs: '100%', md: '66%' },
              margin: 'auto',
            }}
          >
            <ImageCarousel items={images} />
          </Box>
  
          {/* Right Side: Product Details (1/3 width) */}
          <Box
            sx={{
              flex: { xs: '1', md: '1' }, // Takes up 1/3 of space on medium screens and larger
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: { xs: 2, md: 4 },
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => addItemToCart(product.id, 1)}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
  
  export default ProductPage;