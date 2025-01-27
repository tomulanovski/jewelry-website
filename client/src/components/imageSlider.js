import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box, useTheme, useMediaQuery } from '@mui/material';

function ImageCarousel({ items, width = '100%' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      width: isMobile ? '95%' : width, // Wider on mobile
      margin: 'auto',
      mt: isMobile ? 2 : 0 // Add some top margin on mobile
    }}>
      <Carousel
        animation="fade"
        duration={800}
        indicators
        autoPlay
        interval={4000}
        swipe
      >
        {items.map((item, index) => (
          <CarouselItem key={index} item={item} isMobile={isMobile} />
        ))}
      </Carousel>
    </Box>
  );
}

const CarouselItem = ({ item, isMobile }) => (
  <Paper elevation={3} sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        aspectRatio: isMobile ? '4/3' : '16/9', // Taller aspect ratio on mobile
      }}
    >
      <Box
        component="img"
        src={item.image}
        alt={item.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </Box>
  </Paper>
);

export default ImageCarousel;