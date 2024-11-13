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
  },
  {
    image: 'carousel_images/necklace.jpg',
    title: 'Golden Necklace',
  },
  {
    image: 'carousel_images/ring.jpg',
    title: 'Diamond Ring',
  },
];

function Home() {
  const theme = useTheme();

  return (
    <Box>
      <NavBar />
      <Box>
        {/* Set a smaller width for the carousel on the home page */}
        <ImageCarousel items={carouselItems} width="60%" />
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
              border: 1,
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
