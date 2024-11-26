import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Alert 
} from '@mui/material';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

function PaymentSection({total, shipping, items, onSubmit, onBack, onError }) {

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

  if (isPending || !isResolved) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (isRejected) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to initialize payment system. Please try again later.
        </Alert>
        <Button onClick={onBack} fullWidth sx={{ mt: 2 }}>
          Back to Shipping
        </Button>
      </Paper>
    );
  }

  const createOrder = async () => {
    try {
      console.log('Sending order data:', {
        items: items.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      });
      
      const response = await axios.post('/payment/create-order', {
        items: items.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity
        }))
      });
      
      console.log('Response:', response.data);
      return response.data.id;
    } catch (err) {
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      setIsProcessing(true);
      const response = await axios.post(`/payment/capture-payment/${data.orderID}`);
      
      onSubmit({
        method: 'paypal',
        details: response.data.details
      });
    } catch (err) {
      const errorMessage = err.response?.data?.details || 
                          err.response?.data?.error || 
                          'Payment failed';
      setError(errorMessage);
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Secure Payment
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Total: ${Number(total).toFixed(2)}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        {isProcessing ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <PayPalButtons
            forceReRender={[total]}
            style={{
              layout: "vertical",
              shape: "rect",
              height: 55
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error('PayPal Error:', err);
              setError('Payment failed. Please try again.');
            }}
            onCancel={() => setError('Payment was cancelled.')}
          />
        )}
      </Box>

      <Button
        onClick={onBack}
        disabled={isProcessing}
        fullWidth
        sx={{ mt: 2 }}
      >
        Back to Shipping
      </Button>
    </Paper>
  );
}

export default PaymentSection;