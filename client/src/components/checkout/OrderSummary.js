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
   isProcessing,
   shippingMethod
}) {
   const shippingCost = shippingMethod === 'express' ? 40 : 0;
   const finalTotal = total + shippingCost;

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
                           <Typography variant="body2" color="text.secondary">
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
                       Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})
                   </Typography>
                   <Typography variant="body2">
                       {shippingMethod === 'express' ? '$40.00' : 'Free'}
                   </Typography>
               </Box>
           </Box>

           <Divider sx={{ my: 2 }} />

           <Box sx={{
               display: 'flex',
               justifyContent: 'space-between',
               mb: 3
           }}>
               <Typography variant="h6" color="text.secondary">Total</Typography>
               <Typography variant="h6">
                   ${finalTotal.toFixed(2)}
               </Typography>
           </Box>
       </Paper>
   );
}

export default OrderSummary;