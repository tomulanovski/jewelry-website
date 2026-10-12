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
import { formatPrice } from '../components/ProductCard';
import { brand, labelStyle } from '../theme';

function Cart() {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeItem,
    notification,
    clearNotification,
    setShippingMethod
  } = useCart();
  const navigate = useNavigate();
  const [expressShipping, setExpressShipping] = useState(false);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleQuantityChange = (item) => (event, newValue) => {
    if (newValue !== null) {
      const value = Math.max(1, Math.min(newValue, item.stock_quantity));
      updateQuantity(item.id, value);
    }
  };

  const getStockWarning = (item) => {
    const availableStock = item.stock_quantity - item.quantity;
    if (availableStock <= 5) {
      return availableStock === 0 ? 'No more available' : `Only ${availableStock} more available`;
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 6 }, pt: { xs: 4, md: 8 }, minHeight: '60vh' }}>
        <Typography variant="h2" component="h1" sx={{ mb: { xs: 4, md: 6 }, fontSize: { xs: '2.4rem', md: '3.2rem' } }}>
          Your Cart
        </Typography>

        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: brand.muted, mb: 3 }}>Your cart is empty.</Typography>
            <Button variant="outlined" onClick={() => navigate('/shop')}>
              Browse the collection
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 6 }, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, width: '100%', borderTop: `1px solid ${brand.line}` }}>
              {items.map(item => {
                const stockWarning = getStockWarning(item);
                return (
                  <Box key={item.id} sx={{ display: 'flex', gap: { xs: 2, md: 3 }, py: 3, borderBottom: `1px solid ${brand.line}` }}>
                    <Box
                      onClick={() => handleProductClick(item)}
                      sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flex: 1, cursor: 'pointer', minWidth: 0 }}
                    >
                      {item.image1 && (
                        <Box
                          component="img"
                          src={item.image1}
                          alt={item.title}
                          loading="lazy"
                          sx={{ width: { xs: 84, md: 110 }, height: { xs: 104, md: 136 }, objectFit: 'cover', flex: '0 0 auto' }}
                        />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: { xs: '1.15rem', md: '1.35rem' }, textTransform: 'capitalize', '&:hover': { color: brand.gold } }}
                        >
                          {item.title}
                        </Typography>
                        <Typography sx={{ mt: 0.5, color: brand.goldSoft }}>
                          {formatPrice(item.price)}
                        </Typography>
                        {item.quantity > 1 && (
                          <Typography variant="body2" sx={{ mt: 0.5, color: brand.muted }}>
                            {item.quantity} × {formatPrice(item.price)} = {formatPrice(item.price * item.quantity)}
                          </Typography>
                        )}
                        {stockWarning && (
                          <Typography sx={{ ...labelStyle, fontSize: '0.6rem', color: brand.gold, mt: 1 }}>
                            {stockWarning}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ width: 112 }}>
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
                        size="small"
                        aria-label="Remove item"
                        sx={{ color: brand.muted, '&:hover': { color: brand.gold } }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Paper sx={{ width: { xs: '100%', md: 340 }, p: { xs: 3, md: 4 }, flex: '0 0 auto' }}>
              <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Items ({getTotalItems()})</Typography>
                <Typography>{formatPrice(getTotalPrice())}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={expressShipping}
                      onChange={(e) => setExpressShipping(e.target.checked)}
                      sx={{ color: brand.muted }}
                    />
                  }
                  label="Express shipping"
                  sx={{ mr: 0 }}
                />
                <Typography>{expressShipping ? '$40' : 'Free'}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: brand.muted, mb: 2, ml: 4 }}>
                {expressShipping ? 'Express delivery' : 'Standard shipping'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  {formatPrice(getTotalPrice() + (expressShipping ? 40 : 0))}
                </Typography>
              </Box>

              <Button variant="contained" fullWidth size="large" onClick={handleCheckout}>
                Checkout
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
            variant="filled"
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
