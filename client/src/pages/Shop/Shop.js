import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/navbar';
import { useTheme } from '@mui/material/styles';
import CartContext from '../../contexts/CartContext'; // Use the default import

function Shop() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();

  // Use the CartContext
  const { addItemToCart } = useContext(CartContext);

  // Map category names to product type values
  const categoryMap = {
    rings: 0,
    necklaces: 1,
    earrings: 2,
    bracelets: 3,
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/shop');
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on the type if category exists
  const filteredProducts = category
    ? products.filter(product => product.type === categoryMap[category])
    : products;

  // Function to handle adding item to cart
  const handleAddToCart = (product) => {
    addItemToCart(product);  // Call the function from CartContext
  };

  return (
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

      {/* Product Grid */}
      <Grid container spacing={4} sx={{ padding: '20px' }}>
        {filteredProducts.map((product) => (
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
              onClick={() => navigate(`/product/${product.id}`, { state: { product } })} // Pass product data as state
            >
              <CardMedia
                component="img"
                height="250"
                image={product.image1}
                alt={product.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography gutterBottom variant="h6" component="div" align="center" sx={{ fontWeight: 'bold' }}>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card click event from triggering
                    handleAddToCart(product);
                  }}
                  sx={{ marginTop: '10px' }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Shop;
