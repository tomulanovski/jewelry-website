import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import NavBar from '../../components/navbar';

function Shop({ addItemToCart }) {
  const [products, setProducts] = useState([]);

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

  return (
    <Box>
      <NavBar />
      <Typography
        align='center'
        variant="h4"
        component="h1"
        sx={{
          color: 'rgb(var(--color_21))',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
          letterSpacing: '2px',
        }}
      >
        SHOP
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image1}
                alt={product.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => addItemToCart(product.id, 1)}
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