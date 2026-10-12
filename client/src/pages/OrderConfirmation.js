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
    CheckCircleOutline
} from '@mui/icons-material';
import NavBar from '../components/navbar';
import api from '../services/api';
import { generateReceipt } from '../utils/generateReceipt';

function OrderConfirmation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const orderDetails = location.state?.orderDetails;

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
                    <Typography sx={{ color: 'text.secondary', mt: 6 }}>
                        We couldn't show this order's details here. If you just paid, your confirmation email has everything.
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/shop')}
                        sx={{ mt: 3 }}
                    >
                        Back to the shop
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
                        p: { xs: 4, md: 6 },
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    <CheckCircleOutline
                        sx={{
                            fontSize: 48,
                            color: 'primary.main',
                            mb: 2
                        }}
                    />

                    <Typography variant="h3" component="h1" gutterBottom>
                        Thank you for your order
                    </Typography>

                    <Typography variant="overline" component="p" gutterBottom>
                        Order #{id}
                    </Typography>

                    <Typography sx={{ color: 'text.secondary', mt: 2, maxWidth: 480, mx: 'auto' }}>
                        A confirmation email is on its way{orderDetails.shipping?.email ? ` to ${orderDetails.shipping.email}` : ''}. Catherine will prepare your piece and ship it within about a week.
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
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Shipping Details
                            </Typography>
                            {orderDetails.shipping && (
                                <>
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
                                                ? 'Express Shipping'
                                                : 'Standard Shipping'}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={6}>
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: 3,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            
                            {(orderDetails.items ?? []).map((item) => (
                                <Box 
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1
                                    }}
                                >
                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
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
                                    ${(orderDetails.subtotal ?? 0).toFixed(2)}
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
                                    ${(orderDetails.total ?? 0).toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            try {
                                generateReceipt(orderDetails, orderDetails.items);
                            } catch (err) {
                                console.error('generateReceipt failed:', err);
                                alert('Could not generate receipt. Please try again.');
                            }
                        }}
                    >
                        Download receipt
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/shop')}
                    >
                        Continue shopping
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default OrderConfirmation;