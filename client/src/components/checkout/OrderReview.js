import React from 'react';
import { 
 Box, 
 Typography, 
 Button, 
 Paper,
 Grid,
 Divider,
 CircularProgress
} from '@mui/material';

function OrderReview({ 
 orderData, 
 items, 
 subtotal,
 total,
 shippingMethod, 
 onEdit,
 isProcessing 
}) {

  const shippingCost = shippingMethod === 'express' ? 40 : 0;
  const sub = total + shippingCost;

 return (
   <Paper sx={{ p: { xs: 3, md: 4 } }}>
     <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 3 }}>
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
             <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
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

     <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
       Payment is handled securely by PayPal. If you pay by card, PayPal processes your details under its own privacy statement.
     </Typography>

     <Button
       fullWidth
       variant="contained"
       onClick={() => onEdit(2)}
       disabled={isProcessing}
       sx={{ height: 52 }}
     >
       {isProcessing ? (
         <CircularProgress size={24} color="inherit" />
       ) : (
         `Continue to payment · $${total.toFixed(2)}`
       )}
     </Button>

     <Button
       fullWidth
       onClick={() => onEdit(0)}
       disabled={isProcessing}
       sx={{ mt: 2 }}
     >
       Back to Shipping
     </Button>
   </Paper>
 );
}

export default OrderReview;