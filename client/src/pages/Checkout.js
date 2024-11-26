import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Grid, 
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useCart } from '../contexts/CartContext'; 
import NavBar from '../components/navbar';  
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderReview from '../components/checkout/OrderReview';
import axios from 'axios';

const steps = ['Shipping Details','Review Order', 'Payment'];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart , shippingMethod } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [orderData, setOrderData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      postalCode: '',
    },
    payment: {
      method: '',    
      details: null,        
      orderId: null         
    }
  });

  // handling shipping form. Changing the shipping data in object
  const handleShippingSubmit = (shippingData) => {
    setOrderData(prev => ({
      ...prev,
      shipping: shippingData
    }));
    setActiveStep(1);
  };

  // 
  const handlePaymentSubmit = async (paymentData) => {
    try {
      setIsProcessing(true);
      
      // Store payment details
      setOrderData(prev => ({
        ...prev,
        payment: {
          method: paymentData.method,
          details: paymentData.details,
          orderId: paymentData.details.orderId
        }
      }));
  
      setActiveStep(2);
      
      setNotification({
        type: 'success',
        message: 'Payment details confirmed!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.response?.data?.error || 'Failed to process payment'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleError = (error) => {
    setError(error.message);
    setNotification({
      type: 'error',
      message: error.message
    });
  };

  return (
    <Box>
      <NavBar />
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
          {activeStep === 0 && (
  <ShippingForm
    initialData={orderData.shipping}
    onSubmit={handleShippingSubmit}
  />
)}

{activeStep === 1 && (
  <OrderReview
    orderData={orderData}
    items={items}
    total={getTotalPrice()}
    onEdit={(step) => setActiveStep(step)}
    onPlaceOrder={() => setActiveStep(2)}
    isProcessing={isProcessing}
  />
)}

{activeStep === 2 && (
  <PaymentSection
    amount={getTotalPrice()}
    items={items}          
    onSubmit={(paymentData) => {
      handlePaymentSubmit(paymentData);
      navigate(`/order-confirmation/${paymentData.details.orderId}`, {
        state: {
          orderDetails: {
            id: paymentData.details.orderId,
            items: items,
            shipping: orderData.shipping,
            shippingMethod: shippingMethod,
            subtotal: getTotalPrice(),
            total: getTotalPrice() + (shippingMethod === 'express' ? 40 : 0),
            payment: paymentData
          }
        }
      });
      clearCart();
    }}
    onBack={() => setActiveStep(1)}
    onError={handleError}
  />
)}
          </Grid>

          <Grid item xs={12} md={4}>
            <OrderSummary
              items={items}
              totalItems={getTotalItems()}
              subtotal={getTotalPrice()}
              total={getTotalPrice()}
              isProcessing={isProcessing}
              shippingMethod = {shippingMethod}
            />
          </Grid>
        </Grid>

        <Snackbar
          open={notification !== null}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {notification && (
            <Alert
              onClose={() => setNotification(null)}
              severity={notification.type}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </Box>
  );
}

export default CheckoutPage;