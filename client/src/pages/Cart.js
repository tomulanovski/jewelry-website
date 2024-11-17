import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Paper,
  IconButton,
  Alert 
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuantityInput from '../components/quantityInput';

function Cart() {
    const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const handleQuantityChange = (itemId, newValue) => {
        if (newValue !== null) {
            const item = items.find(i => i.id === itemId);
            // Ensure the value is within stock limits
            const value = Math.max(1, Math.min(newValue, item.quantity));
            updateQuantity(itemId, value);
        }
    };

    return (
        <Box>
            <NavBar />
            <Box sx={{ 
                p: 4, 
                maxWidth: '1200px', 
                margin: '0 auto',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Shopping Cart</Typography>

                {items.length === 0 ? (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        flex: 1
                    }}>
                        <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                        <Button 
                            variant="contained"
                            onClick={() => navigate('/shop')}
                            sx={{ 
                                backgroundColor: '#333',
                                '&:hover': { 
                                    backgroundColor: '#515151',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Cart Items */}
                        <Box sx={{ flex: '1' }}>
                            {items.map(item => (
                                <Paper 
                                    key={item.id} 
                                    elevation={0}
                                    sx={{ 
                                        mb: 2,
                                        p: 2,
                                        border: '1px solid #eee',
                                        borderRadius: 2,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        {/* Image and Title Section */}
                                        <Box 
                                            onClick={() => handleProductClick(item)}
                                            sx={{ 
                                                display: 'flex', 
                                                gap: 3,
                                                flex: 1,
                                                cursor: 'pointer' 
                                            }}
                                        >
                                            {item.image1 && (
                                                <img 
                                                    src={item.image1} 
                                                    alt={item.title} 
                                                    style={{ 
                                                        width: '120px', 
                                                        height: '120px', 
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }} 
                                                />
                                            )}
                                            <Box>
                                                <Typography 
                                                    variant="h6"
                                                    sx={{ 
                                                        fontWeight: 500,
                                                        '&:hover': { 
                                                            color: '#666'
                                                        }
                                                    }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Typography 
                                                    variant="h6" 
                                                    color="text.secondary"
                                                    sx={{ mt: 1, fontWeight: 'bold' }}
                                                >
                                                    ${item.price}
                                                </Typography>
                                                {item.quantity <= 5 && (
                                                    <Alert 
                                                        severity="warning" 
                                                        sx={{ mt: 1, py: 0 }}
                                                    >
                                                        Only {item.quantity} left in stock
                                                    </Alert>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Quantity and Remove Section */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'flex-end',
                                            gap: 1
                                        }}>
                                            <Box sx={{ width: '120px' }}>
                                                <QuantityInput
                                                    value={item.quantity}
                                                    onChange={(e, newValue) => handleQuantityChange(item.id, newValue)}
                                                    min={1}
                                                    max={item.quantity}
                                                    aria-label="Quantity input"
                                                />
                                            </Box>
                                            <IconButton 
                                                onClick={() => removeItem(item.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>

                        {/* Order Summary */}
                        <Paper 
                            elevation={0}
                            sx={{ 
                                width: { xs: '100%', md: '300px' },
                                height: 'fit-content',
                                p: 3,
                                border: '1px solid #eee',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>Order Summary</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Items ({getTotalItems()}):</Typography>
                                <Typography>${getTotalPrice().toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Shipping:</Typography>
                                <Typography>Free</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">${getTotalPrice().toFixed(2)}</Typography>
                            </Box>
                            <Button 
                                variant="contained" 
                                fullWidth
                                size="large"
                                onClick={() => navigate('/checkout')}
                                sx={{ 
                                    backgroundColor: '#333',
                                    '&:hover': { 
                                        backgroundColor: '#515151',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                Proceed to Checkout
                            </Button>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Cart;