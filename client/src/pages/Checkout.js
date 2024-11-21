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
  Alert
} from '@mui/material';
import { useCart } from '../contexts/CartContext'; 
import NavBar from '../components/navbar';  
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummary from '../components/checkout/OrderSummary';
import OrderReview from '../components/checkout/OrderReview';

const steps = ['Shipping Details', 'Payment', 'Review Order'];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
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
      method: 'card',
      cardDetails: null
    }
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleShippingSubmit = (shippingData) => {
    setOrderData(prev => ({
      ...prev,
      shipping: shippingData
    }));
    setActiveStep(1);
  };

  const handlePaymentSubmit = (paymentData) => {
    setOrderData(prev => ({
      ...prev,
      payment: paymentData
    }));
    setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          items: items,
          totalAmount: getTotalPrice()
        })
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      
      setNotification({
        type: 'success',
        message: 'Order placed successfully!'
      });

      clearCart();
      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
              <PaymentSection
                amount={getTotalPrice()}
                onSubmit={handlePaymentSubmit}
                onBack={() => setActiveStep(0)}
              />
            )}

            {activeStep === 2 && (
              <OrderReview
                orderData={orderData}
                items={items}
                total={getTotalPrice()}
                onEdit={(step) => setActiveStep(step)}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
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