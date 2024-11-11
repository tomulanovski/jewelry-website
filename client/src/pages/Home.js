import React from "react";
import ImageCarousel from "../components/imageSlider";
import { Button, Box  } from "@mui/material";
import NavBar from "../components/navbar";
import { useTheme } from '@mui/material/styles'; // Import the hook to use the theme

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

function Home() {
    const theme = useTheme(); // Get the theme object
  return (
    <Box>
      <NavBar />
      <Box>
        <ImageCarousel items = {carouselItems} />
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: 3,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            border: 1
          }}
          href="/shop"
        >
          Shop
        </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;