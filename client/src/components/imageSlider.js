import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box } from '@mui/material';

function ImageCarousel({ items, width = '100%' }) {
  return (
    <Box sx={{ width: width, margin: 'auto' }}>
      <Carousel
        animation="fade"
        duration={800}
        indicators
        autoPlay
        interval={4000}
        swipe
      >
        {items.map((item, index) => (
          <CarouselItem key={index} item={item} />
        ))}
      </Carousel>
    </Box>
  );
}

const CarouselItem = ({ item }) => (
  <Paper elevation={3} sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
    <Box
      component="div"
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        aspectRatio: '16/9',
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
