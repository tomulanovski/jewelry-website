import React from 'react';
import NavBar from '../components/navbar';
import { Box, ButtonGroupButtonContext, Typography } from '@mui/material';

function Shop({ addItemToCart }) {
    const products = [
        { id: 1, name: 'Necklace', price: 100 },
        { id: 2, name: 'Bracelet', price: 50 },
        { id: 3, name: 'Earrings', price: 30 },
    ];

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
            <Box>
                {products.map((product) => (
                    <Box key={product.id}>
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <button onClick={() => addItemToCart(product.id, 1)}>Add to Cart</button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Shop;