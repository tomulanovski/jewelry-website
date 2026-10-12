import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { brand, labelStyle } from '../theme';

/** "$1,440" for whole dollars, "$109.50" otherwise. */
export function formatPrice(price) {
  const n = Number(price);
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

const photoSx = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'opacity 0.5s ease, transform 0.8s ease',
};

function ProductCard({ product }) {
  return (
    <Box
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .main-photo': { transform: 'scale(1.03)' },
        '&:hover .hover-photo': { opacity: 1 },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', backgroundColor: brand.panel }}>
        <Box component="img" className="main-photo" src={product.image1} alt={product.title} loading="lazy" sx={photoSx} />
        {product.image2 && (
          <Box component="img" className="hover-photo" src={product.image2} alt="" loading="lazy" sx={{ ...photoSx, opacity: 0 }} />
        )}
      </Box>
      <Typography
        sx={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          color: brand.text,
          textTransform: 'capitalize',
          mt: 1.5,
          lineHeight: 1.3,
        }}
      >
        {product.title}
      </Typography>
      <Typography sx={{ color: brand.muted, fontSize: '0.9rem', mt: 0.25 }}>
        {formatPrice(product.price)}
      </Typography>
      {product.quantity > 0 && product.quantity <= 3 && (
        <Typography sx={{ ...labelStyle, fontSize: '0.62rem', color: brand.gold, mt: 0.75 }}>
          Only {product.quantity} left
        </Typography>
      )}
    </Box>
  );
}

export default ProductCard;
