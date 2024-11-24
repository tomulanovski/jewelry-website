import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

function OrderReview({ 
  orderData, 
  items, 
  total, 
  onEdit, 
  onPlaceOrder,
  isProcessing 
}) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Review Order
      </Typography>

      {/* Shipping Information */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Shipping Address
          </Typography>
          <Button 
            onClick={() => onEdit(0)}
            sx={{ color: 'primary.main' }}
            disabled={isProcessing}
          >
            Edit
          </Button>
        </Box>
        <Typography variant="body2">
          {orderData.shipping.firstName} {orderData.shipping.lastName}
        </Typography>
        <Typography variant="body2">
          {orderData.shipping.address}
          {orderData.shipping.apartment && `, ${orderData.shipping.apartment}`}
        </Typography>
        <Typography variant="body2">
          {orderData.shipping.city}, {orderData.shipping.postalCode}
        </Typography>
        <Typography variant="body2">
          {orderData.shipping.country}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {orderData.shipping.email}
        </Typography>
        <Typography variant="body2">
          {orderData.shipping.phone}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Payment Method */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Payment Method
          </Typography>
          <Button 
            onClick={() => onEdit(1)}
            sx={{ color: 'primary.main' }}
            disabled={isProcessing}
          >
            Edit
          </Button>
        </Box>
        <Typography variant="body2">
          {orderData.payment.method === 'card' ? 'Credit Card' : 'PayPal'}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Order Items */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Order Items
        </Typography>
        {items.map((item) => (
          <Box 
            key={item.id}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              mb: 2 
            }}
          >
            {item.image1 && (
              <img 
                src={item.image1} 
                alt={item.title}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Order Summary */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2">
            ${total.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mb: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Typography variant="body2">
            Free
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mb: 3,
        alignItems: 'center'
      }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">
          ${total.toFixed(2)}
        </Typography>
      </Box>

      {/* Terms and Conditions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        By placing this order, you agree to our Terms of Service and Privacy Policy.
      </Alert>

      {/* Place Order Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={onPlaceOrder}
        disabled={isProcessing}
        sx={{
          backgroundColor: '#333',
          '&:hover': { backgroundColor: '#555' },
          height: 48
        }}
      >
        {isProcessing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Place Order - $${total.toFixed(2)}`
        )}
      </Button>

      {/* Back Button */}
      <Button
        fullWidth
        onClick={() => onEdit(1)}
        disabled={isProcessing}
        sx={{ mt: 2 }}
      >
        Back to Payment
      </Button>
    </Paper>
  );
}

export default OrderReview;