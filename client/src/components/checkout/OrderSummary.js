import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Paper 
} from '@mui/material';

function OrderSummary({ 
  items, 
  totalItems, 
  subtotal, 
  total,
  isProcessing 
}) {
  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Order Summary
      </Typography>

      <Box sx={{ mb: 3 }}>
        {items.map((item) => (
          <Box 
            key={item.id} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mb: 2 
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {item.quantity}x
              </Typography>
              <Typography variant="body2">
                {item.title}
              </Typography>
            </Box>
            <Typography variant="body2">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mb: 1 
        }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal ({totalItems} items)
          </Typography>
          <Typography variant="body2">
            ${subtotal.toFixed(2)}
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

      <Divider sx={{ my: 2 }} />

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">
          ${total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
}

export default OrderSummary;