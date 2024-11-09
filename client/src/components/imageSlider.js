import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Box } from '@mui/material';

// the images for the carousel
const carouselItems = [
  {
    image: 'carousel_images/gold_bracelt.jpg',
    title: 'Elegant Bracelet',
    description: 'Exquisite craftsmanship for a timeless look.',
  },
  {
    image: 'carousel_images/necklace.jpg',
    title: 'Golden Necklace',
    description: 'A piece that defines elegance and sophistication.',
  },
  {
    image: 'carousel_images/ring.jpg',
    title: 'Diamond Ring',
    description: 'Shine bright with our exclusive diamond rings.',
  },
];

const ImageCarousel = () => {
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
        {carouselItems.map((item, index) => (
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
