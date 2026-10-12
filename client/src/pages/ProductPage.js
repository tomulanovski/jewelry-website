import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert, Divider } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import NavBar from '../components/navbar';
import QuantityInput from '../components/quantityInput';
import { formatPrice } from '../components/ProductCard';
import { brand, labelStyle } from '../theme';

function Gallery({ images, title }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [images[0]]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box sx={{ aspectRatio: '1 / 1', backgroundColor: brand.panel, overflow: 'hidden' }}>
        <Box
          component="img"
          src={images[selected]}
          alt={title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, overflowX: 'auto' }}>
          {images.map((src, i) => (
            <Box
              key={src}
              component="button"
              onClick={() => setSelected(i)}
              aria-label={`Photo ${i + 1}`}
              sx={{
                p: 0,
                flex: '0 0 auto',
                width: { xs: 64, md: 84 },
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                background: 'none',
                border: `1px solid ${i === selected ? brand.gold : 'transparent'}`,
                opacity: i === selected ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
                '&:hover': { opacity: 1 },
              }}
            >
              <Box component="img" src={src} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading: contextLoading, getProduct } = useProducts();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addItem, getItem, notification, clearNotification } = useCart();

  // Get product directly from context
  const product = getProduct(parseInt(id));

  // Reset quantity when product changes
  useEffect(() => {
    setSelectedQuantity(1);
  }, [product?.id]);

  if (contextLoading) {
    return (
      <Box>
        <NavBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box>
        <NavBar />
        <Box sx={{ textAlign: 'center', py: 12, px: 3 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            This piece isn't available
          </Typography>
          <Typography sx={{ color: brand.muted, mb: 4 }}>
            It may have sold. Have a look at what's in the collection now.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/shop')}>
            Back to the shop
          </Button>
        </Box>
      </Box>
    );
  }

  const images = Object.entries(product)
    .filter(([key, value]) => key.startsWith('image') && value)
    .map(([_, value]) => value);

  const cartItem = getItem(product.id);
  const availableStock = (cartItem?.stock_quantity || product.quantity) - (cartItem?.quantity || 0);

  const handleQuantityChange = (event, newValue) => {
    if (newValue !== null) {
      const value = Math.max(1, Math.min(newValue, availableStock));
      setSelectedQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (selectedQuantity <= availableStock) {
      const success = addItem(product, selectedQuantity);
      if (success) {
        setSelectedQuantity(1);
      }
    }
  };

  const getStockMessage = () => {
    if (product.quantity === 0) {
      return 'Sold out';
    }
    if (cartItem) {
      if (availableStock === 0) {
        return `All available pieces are in your cart (${cartItem.quantity})`;
      }
      return `${availableStock} more available (${cartItem.quantity} in your cart)`;
    }
    if (product.quantity <= 5) {
      return `Only ${product.quantity} left`;
    }
    return null;
  };

  const isMaxInCart = cartItem && availableStock === 0;
  const stockMessage = getStockMessage();

  return (
    <Box>
      <NavBar />

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 6 }, pt: { xs: 3, md: 6 } }}>
        <Box
          component={Link}
          to="/shop"
          sx={{ ...labelStyle, fontSize: '0.65rem', color: brand.muted, textDecoration: 'none', '&:hover': { color: brand.goldSoft } }}
        >
          &larr; Back to the collection
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.15fr) minmax(0, 1fr)' },
            gap: { xs: 4, md: 8 },
            mt: { xs: 2, md: 3 },
            alignItems: 'start',
          }}
        >
          <Gallery images={images} title={product.title} />

          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontSize: { xs: '2.2rem', md: '2.8rem' }, textTransform: 'capitalize', lineHeight: 1.1 }}
            >
              {product.title}
            </Typography>
            <Typography sx={{ fontSize: '1.15rem', color: brand.goldSoft, mt: 1.5 }}>
              {formatPrice(product.price)}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography sx={{ color: brand.text, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
            {product.materials && (
              <Typography sx={{ color: brand.muted, mt: 2, fontSize: '0.9rem' }}>
                <Box component="span" sx={{ ...labelStyle, fontSize: '0.62rem', color: brand.gold, mr: 1 }}>
                  Materials
                </Box>
                {product.materials.split(',').map(m => m.trim()).filter(Boolean).join(', ')}
              </Typography>
            )}

            {stockMessage && (
              <Typography sx={{ ...labelStyle, fontSize: '0.65rem', color: brand.gold, mt: 3 }}>
                {stockMessage}
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              {product.quantity > 0 && !isMaxInCart ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                  <Box sx={{ width: 120, flex: '0 0 auto' }}>
                    <QuantityInput
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                      min={1}
                      max={availableStock}
                      aria-label="Quantity input"
                    />
                  </Box>
                  <Button variant="contained" fullWidth onClick={handleAddToCart}>
                    Add to cart
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" disabled fullWidth>
                  {isMaxInCart ? 'All available pieces are in your cart' : 'Sold out'}
                </Button>
              )}
            </Box>

            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${brand.line}` }}>
              <Typography sx={{ color: brand.muted, fontSize: '0.88rem', lineHeight: 1.8 }}>
                Made by hand in Catherine's studio and shipped within about a week. Free standard shipping, or express for $40.
              </Typography>
            </Box>
          </Box>
        </Box>
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

export default ProductPage;
