import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider
} from '@mui/material';
import PayPalButton from './PayPalButton'; // You'll need to implement this based on PayPal SDK

function PaymentSection({ amount, onSubmit, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Payment Method
      </Typography>

      <RadioGroup
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <FormControlLabel 
          value="card" 
          control={<Radio />} 
          label="Credit/Debit Card"
        />
        <FormControlLabel 
          value="paypal" 
          control={<Radio />} 
          label="PayPal"
        />
      </RadioGroup>

      <Divider sx={{ my: 3 }} />

      {paymentMethod === 'card' ? (
        <Box sx={{ mb: 3 }}>
          {/* Implement your card payment form here */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Card payment implementation will depend on your chosen payment provider
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <PayPalButton 
            amount={amount}
            onSuccess={(details) => onSubmit({ method: 'paypal', details })}
          />
        </Box>
      )}

      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'space-between' 
      }}>
        <Button
          onClick={onBack}
          disabled={isProcessing}
        >
          Back to Shipping
        </Button>
        
        {paymentMethod === 'card' && (
          <Button
            variant="contained"
            onClick={() => onSubmit({ method: 'card' })}
            disabled={isProcessing}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' }
            }}
          >
            Continue to Review
          </Button>
        )}
      </Box>
    </Paper>
  );
}

export default PaymentSection;