import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box } from '@mui/material';


function ImageCarousel (props) {
  return (
    <Box sx={{ width: '70%', margin: 'auto', mt: 5 }}>
      <Carousel
        animation="fade"
        duration={800}
        indicators
        navButtonsAlwaysVisible
        autoPlay
        interval={4000}
        swipe
      >
        {props.items.map((item, index) => (
          <CarouselItem key={index} item={item} />
        ))}
      </Carousel>
    </Box>
  );
};

const CarouselItem = ({ item }) => (
  <Paper elevation={3} sx={{ position: 'relative', borderRadius: 4 }}>
    <Box
      component="img"
      src={item.image}
      alt={item.title}
      sx={{
        width: '100%',
        height: { xs: '200px', sm: '400px', md: '500px' },
        objectFit: 'cover',
        borderRadius: 4,
      }}
    />
  </Paper>
);

export default ImageCarousel;
