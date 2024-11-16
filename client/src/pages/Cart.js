import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { Box, Typography, Button } from '@mui/material';

function Cart() {
    // Get all the cart functions we need
    const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    return (
        <Box>
            <NavBar />
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>Your Cart</Typography>

                {items.length === 0 ? (
                    <Typography>Your cart is empty.</Typography>
                ) : (
                    <Box>
                        {items.map(item => (
                            <Box 
                                key={item.id} 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2, 
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid #eee',
                                    borderRadius: 1
                                }}
                            >
                                {/* Optional: Show product image */}
                                {item.image1 && (
                                    <img 
                                        src={item.image1} 
                                        alt={item.title} 
                                        style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover' 
                                        }} 
                                    />
                                )}

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Typography color="text.secondary">
                                        ${item.price}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button 
                                        variant="outlined"
                                        size="small"
                                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                    >
                                        -
                                    </Button>
                                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                    <Button 
                                        variant="outlined"
                                        size="small"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </Box>

                                <Button 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}

                        <Box sx={{ mt: 4, textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Total Items: {getTotalItems()}
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Total: ${getTotalPrice().toFixed(2)}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                size="large"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Cart;