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

function PaymentSection({ amount, items, onSubmit, onBack, onError }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Get PayPal script status
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

  // Show loading while PayPal initializes
  if (isPending) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  // Show error if PayPal failed to load
  if (isRejected) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load PayPal. Client ID: {process.env.REACT_APP_PAYPAL_CLIENT_ID}
        </Alert>
        <Button
          onClick={onBack}
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Shipping
        </Button>
      </Paper>
    );
  }

  const createOrder = async () => {
    try {
      setIsProcessing(true);
      console.log('Creating order with amount:', amount);
      
      const response = await axios.post('/payment/create-order', {
        items,
        amount: amount.toString()
      });
      
      console.log('Order created:', response.data);
      return response.data.id;
    } catch (err) {
      console.error('Create order error:', err);
      setError(err.response?.data?.error || 'Failed to create order');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setIsProcessing(true);
      console.log('Payment approved:', data);

      const response = await axios.post(`/payment/capture-payment/${data.orderID}`, {
        items
      });
      
      console.log('Payment captured:', response.data);
      
      onSubmit({
        method: 'paypal',
        details: response.data.details
      });
    } catch (err) {
      console.error('Payment capture error:', err);
      setError(err.response?.data?.error || 'Payment failed');
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
          Total: ${Number(amount).toFixed(2)}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        {isProcessing ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <PayPalButtons
              forceReRender={[amount]} // Add this to force re-render when amount changes
              style={{
                layout: "vertical",
                shape: "rect",
                height: 55
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={(err) => {
                console.error('PayPal Button Error:', err);
                setError('Payment failed. Please try again.');
              }}
              onCancel={() => {
                console.log('Payment cancelled');
                setError('Payment was cancelled. Please try again.');
              }}
            />
          </Box>
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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="caption" display="block">
            Debug Info:
          </Typography>
          <Typography variant="caption" display="block">
            PayPal Status: {isPending ? 'Loading' : isRejected ? 'Failed' : 'Ready'}
          </Typography>
          <Typography variant="caption" display="block">
            Amount: ${amount}
          </Typography>
          <Typography variant="caption" display="block">
            Client ID: {process.env.REACT_APP_PAYPAL_CLIENT_ID?.substring(0, 10)}...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default PaymentSection;