import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button,
    Grid,
    Divider,
    Alert
} from '@mui/material';
import { 
    CheckCircleOutline, 
    Email as EmailIcon,
    LocalShipping as ShippingIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import NavBar from '../components/navbar';
import api from '../services/api';

function OrderConfirmation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [emailSent, setEmailSent] = useState(true);
    const [error, setError] = useState(null);

    const orderDetails = location.state?.orderDetails;

    const handleResendEmail = async () => {
        try {
            await api.post(`/orders/${id}/resend-email`, {
                orderDetails: orderDetails
            });
            setEmailSent(true);
            setError(null);
        } catch (err) {
            setError('Failed to resend confirmation email');
        }
    };

    if (!orderDetails) {
        return (
            <Box>
                <NavBar />
                <Box sx={{ 
                    maxWidth: '1000px', 
                    margin: '0 auto', 
                    padding: { xs: 2, md: 4 },
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" color="error">
                        Order details not found
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/shop')}
                        sx={{ 
                            mt: 2,
                            backgroundColor: '#333',
                            '&:hover': { 
                                backgroundColor: '#515151',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        Return to Shop
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <NavBar />
            <Box sx={{ 
                maxWidth: '1000px', 
                margin: '0 auto', 
                padding: { xs: 2, md: 4 },
            }}>
                {/* Success Message */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        textAlign: 'center',
                        border: '1px solid #eee',
                        borderRadius: 2
                    }}
                >
                    <CheckCircleOutline 
                        sx={{ 
                            fontSize: 64, 
                            color: 'success.main',
                            mb: 2
                        }} 
                    />
                    
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Thank You for Your Order!
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Order #{id}
                    </Typography>

                    {/* Status Icons - COMMENTED OUT
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: 4,
                            my: 4 
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <EmailIcon sx={{ fontSize: 40, color: '#333', mb: 1 }} />
                            <Typography variant="body2">
                                Confirmation Email Sent
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <ShippingIcon sx={{ fontSize: 40, color: '#333', mb: 1 }} />
                            <Typography variant="body2">
                                Processing Order
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <TimeIcon sx={{ fontSize: 40, color: '#333', mb: 1 }} />
                            <Typography variant="body2">
                                {orderDetails.shippingMethod === 'express' 
                                    ? 'Next Day Delivery' 
                                    : '5-7 Business Days'}
                            </Typography>
                        </Box>
                    </Box>
                    */}

                    {/* Error and Email Resend - COMMENTED OUT
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {!emailSent && (
                        <Button
                            startIcon={<EmailIcon />}
                            onClick={handleResendEmail}
                            sx={{ mb: 3 }}
                        >
                            Resend Confirmation Email
                        </Button>
                    )}
                    */}
                </Paper>

                <Grid container spacing={3}>
                    {/* Shipping Information */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3,
                                height: '100%',
                                border: '1px solid #eee',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Shipping Details
                            </Typography>
                            <Typography variant="body2">
                                {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}
                            </Typography>
                            <Typography variant="body2">
                                {orderDetails.shipping.email}
                            </Typography>
                            <Typography variant="body2">
                                {orderDetails.shipping.phone}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {orderDetails.shipping.address}
                                {orderDetails.shipping.apartment && `, ${orderDetails.shipping.apartment}`}
                            </Typography>
                            <Typography variant="body2">
                                {orderDetails.shipping.city}, {orderDetails.shipping.postalCode}
                            </Typography>
                            <Typography variant="body2">
                                {orderDetails.shipping.country}
                            </Typography>
                            
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Shipping Method:
                                </Typography>
                                <Typography variant="body2">
                                    {orderDetails.shippingMethod === 'express' 
                                        ? 'Express Shipping (Next Day Delivery)' 
                                        : 'Standard Shipping (5-7 Business Days)'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3,
                                height: '100%',
                                border: '1px solid #eee',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            
                            {orderDetails.items.map((item) => (
                                <Box 
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1
                                    }}
                                >
                                    <Typography variant="body2">
                                        {item.title} × {item.quantity}
                                    </Typography>
                                    <Typography variant="body2">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Subtotal:</Typography>
                                <Typography variant="body2">
                                    ${orderDetails.subtotal.toFixed(2)}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Shipping:</Typography>
                                <Typography variant="body2">
                                    {orderDetails.shippingMethod === 'express' ? '$40.00' : 'Free'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total:
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    ${orderDetails.total.toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
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
            </Box>
        </Box>
    );
}

export default OrderConfirmation;