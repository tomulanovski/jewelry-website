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

  return (
    <Box sx={{ padding: '20px' }}>
      <NavBar />

      {/* Flexbox Layout for Product Page */}
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
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
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
