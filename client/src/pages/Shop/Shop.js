import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, Link } from 'react-router-dom';
import NavBar, { categories } from '../../components/navbar';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../contexts/ProductContext';
import { brand, labelStyle } from '../../theme';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">Something went wrong. Please try again later.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

const categoryMap = {
  rings: 0,
  necklaces: 1,
  earrings: 2,
  bracelets: 3,
  wedding_engagement: 4
};

const pageSx = { maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 6 } };

function CategoryRow({ active }) {
  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        justifyContent: { xs: 'flex-start', md: 'center' },
        gap: { xs: 3, md: 5 },
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        pb: 1,
        mb: { xs: 4, md: 6 },
        borderBottom: `1px solid ${brand.line}`,
      }}
    >
      {categories.map(({ display, param }) => {
        const isActive = (active || '') === param;
        return (
          <Box
            key={param || 'all'}
            component={Link}
            to={`/shop/${param}`}
            sx={{
              ...labelStyle,
              textDecoration: 'none',
              color: isActive ? brand.goldSoft : brand.muted,
              borderBottom: `1px solid ${isActive ? brand.gold : 'transparent'}`,
              pb: 1.25,
              mb: '-9px',
              '&:hover': { color: brand.goldSoft },
            }}
          >
            {display}
          </Box>
        );
      })}
    </Box>
  );
}

function Shop() {
  const { products, isLoading, error } = useProducts();
  const { category } = useParams();

  const filteredProducts = category
    ? products.filter(product => product.type === categoryMap[category])
    : products;

  const title = categories.find(c => c.param === (category || ''))?.display || 'Shop';

  let content;
  if (isLoading) {
    content = (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={6} md={4} lg={3} key={index}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '4 / 5', height: 'auto', bgcolor: brand.panel }} />
            <Skeleton variant="text" width="70%" sx={{ bgcolor: brand.panel, mt: 1.5 }} />
            <Skeleton variant="text" width="30%" sx={{ bgcolor: brand.panel }} />
          </Grid>
        ))}
      </Grid>
    );
  } else if (error) {
    content = (
      <Typography color="error" align="center" sx={{ py: 10 }}>
        {error}
      </Typography>
    );
  } else if (filteredProducts.length === 0) {
    content = (
      <Typography align="center" sx={{ color: brand.muted, py: 10 }}>
        Nothing here right now. New pieces are added often, so check back soon.
      </Typography>
    );
  } else {
    content = (
      <Grid container spacing={{ xs: 2, md: 3 }} rowSpacing={{ xs: 4, md: 6 }}>
        {filteredProducts.map((product) => (
          <Grid item xs={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <ErrorBoundary>
      <Box>
        <NavBar />
        <Box sx={pageSx}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{ fontSize: { xs: '2.4rem', md: '3.2rem' }, pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 4 } }}
          >
            {title === 'Shop All' ? 'The Collection' : title}
          </Typography>
          <CategoryRow active={category} />
          {content}
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

export default Shop;
