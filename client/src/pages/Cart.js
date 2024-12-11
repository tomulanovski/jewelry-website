import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { useCart } from '../contexts/CartContext';
import { 
 Box, Typography, Button, Divider, Paper,
 IconButton, Alert, Snackbar, FormControlLabel, Checkbox 
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuantityInput from '../components/quantityInput';

function Cart() {
    const { 
      items, 
      getTotalItems, 
      getTotalPrice, 
      updateQuantity, 
      removeItem, 
      notification, 
      clearNotification,
      setShippingMethod,
      addItem
    } = useCart();
    const navigate = useNavigate();
    const [expressShipping, setExpressShipping] = useState(false);
  
    const handleProductClick = (product) => {
      navigate(`/product/${product.id}`, { state: { product } });
    };
  
    const handleQuantityChange = (item) => (event, newValue) => {
        if (newValue !== null) {
            const value = Math.max(1, Math.min(newValue, item.stock_quantity));
            updateQuantity(item.id,value)
        }
    };
  
    const getStockWarning = (item) => {
      const availableStock = item.stock_quantity - item.quantity;
      if (availableStock <= 5) {
        return `Only ${availableStock} more available in stock`;
      }
      return null;
    };

   const handleCheckout = () => {
       setShippingMethod(expressShipping ? 'express' : 'standard');
       navigate('/checkout');
   };

   return (
       <Box>
           <NavBar />
           <Box sx={{ 
               p: 4, 
               maxWidth: '1200px', 
               margin: '0 auto',
               minHeight: '80vh',
               display: 'flex',
               flexDirection: 'column'
           }}>
               <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Shopping Cart</Typography>

               {items.length === 0 ? (
                   <Box sx={{ 
                       display: 'flex', 
                       flexDirection: 'column', 
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: 2,
                       flex: 1
                   }}>
                       <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                       <Button 
                           variant="contained"
                           onClick={() => navigate('/shop')}
                           sx={{ 
                               backgroundColor: '#333',
                               '&:hover': { 
                                   backgroundColor: '#515151',
                                   boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                               }
                           }}
                       >
                           Continue Shopping
                       </Button>
                   </Box>
               ) : (
                   <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                       <Box sx={{ flex: '1' }}>
                           {items.map(item => {
                               const stockWarning = getStockWarning(item);
                               return (
                                   <Paper 
                                       key={item.id} 
                                       elevation={0}
                                       sx={{ 
                                           mb: 2,
                                           p: 2,
                                           border: '1px solid #eee',
                                           borderRadius: 2,
                                           '&:hover': {
                                               boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                           }
                                       }}
                                   >
                                       <Box sx={{ display: 'flex', gap: 3 }}>
                                           <Box 
                                               onClick={() => handleProductClick(item)} // i pass item here so it handle it bad in product page becuase in context it checks for its quantity and if i pass thru shop it check product quantity and not item quantity. i want it to check product and not item so i need to have a way to pass product 
                                               sx={{ 
                                                   display: 'flex', 
                                                   gap: 3,
                                                   flex: 1,
                                                   cursor: 'pointer' 
                                               }}
                                           >
                                               {item.image1 && (
                                                   <img 
                                                       src={item.image1} 
                                                       alt={item.title} 
                                                       style={{ 
                                                           width: '120px', 
                                                           height: '120px', 
                                                           objectFit: 'cover',
                                                           borderRadius: '8px'
                                                       }} 
                                                       loading="lazy"
                                                   />
                                               )}
                                               <Box>
                                                   <Typography 
                                                       variant="h6"
                                                       sx={{ 
                                                           fontWeight: 500,
                                                           '&:hover': { color: '#666' }
                                                       }}
                                                   >
                                                       {item.title}
                                                   </Typography>
                                                   <Typography 
                                                       variant="h6" 
                                                       color="text.secondary"
                                                       sx={{ mt: 1, fontWeight: 'bold' }}
                                                   >
                                                       ${item.price}
                                                   </Typography>
                                                   <Typography variant="body2" sx={{ mt: 1 }}>
                                                       Total: ${(item.price * item.quantity).toFixed(2)}
                                                   </Typography>
                                                   {stockWarning && (
                                                       <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                                                           {stockWarning}
                                                       </Alert>
                                                   )}
                                               </Box>
                                           </Box>

                                           <Box sx={{ 
                                               display: 'flex', 
                                               flexDirection: 'column', 
                                               alignItems: 'flex-end',
                                               gap: 1
                                           }}>
                                               <Box sx={{ width: '120px' }}>
                                               <QuantityInput
                                                    value={item.quantity}
                                                    onChange={handleQuantityChange(item)}
                                                    min={1}
                                                    max={item.stock_quantity}
                                                    aria-label="Quantity input"
                                                />
                                               </Box>
                                               <IconButton 
                                                   onClick={() => removeItem(item.id)}
                                                   color="error"
                                                   size="small"
                                                   aria-label="Remove item"
                                               >
                                                   <DeleteOutlineIcon />
                                               </IconButton>
                                           </Box>
                                       </Box>
                                   </Paper>
                               );
                           })}
                       </Box>
                    


                       <Paper 
                           elevation={0}
                           sx={{ 
                               width: { xs: '100%', md: '300px' },
                               height: 'fit-content',
                               p: 3,
                               border: '1px solid #eee',
                               borderRadius: 2
                           }}
                       >
                           <Typography variant="h6" sx={{ mb: 3 }}>Order Summary</Typography>
                           
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                               <Typography>Items ({getTotalItems()}):</Typography>
                               <Typography>${getTotalPrice().toFixed(2)}</Typography>
                           </Box>

                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                               <Typography>
                                   <FormControlLabel
                                       control={
                                           <Checkbox 
                                               checked={expressShipping}
                                               onChange={(e) => setExpressShipping(e.target.checked)}
                                               sx={{ 
                                                   color: '#333',
                                                   '&.Mui-checked': {
                                                       color: '#333',
                                                   }
                                               }}
                                           />
                                       }
                                       label="Express Shipping"
                                       sx={{ marginRight: 0 }}
                                   />
                               </Typography>
                               <Typography>{expressShipping ? '$40.00' : 'FREE'}</Typography>
                           </Box>

                           {expressShipping && (
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 4 }}>
                                   Express Delivery
                               </Typography>
                           )}

                           {!expressShipping && (
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 4 }}>
                                   Standard Shipping 
                               </Typography>
                           )}

                           <Divider sx={{ my: 2 }} />
                           
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                               <Typography variant="h6">Total:</Typography>
                               <Typography variant="h6">
                                   ${(getTotalPrice() + (expressShipping ? 40 : 0)).toFixed(2)}
                               </Typography>
                           </Box>

                           <Button 
                               variant="contained" 
                               fullWidth
                               size="large"
                               onClick={handleCheckout}
                               sx={{ 
                                   backgroundColor: '#333',
                                   '&:hover': { 
                                       backgroundColor: '#515151',
                                       boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                   }
                               }}
                           >
                               Proceed to Checkout
                           </Button>
                       </Paper>
                   </Box>
               )}
           </Box>

           <Snackbar
               open={notification !== null}
               autoHideDuration={3000}
               onClose={clearNotification}
               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
           >
               {notification && (
                   <Alert
                       onClose={clearNotification}
                       severity={notification.type}
                       sx={{ width: '100%' }}
                   >
                       {notification.message}
                   </Alert>
               )}
           </Snackbar>
       </Box>
   );
}

export default Cart;