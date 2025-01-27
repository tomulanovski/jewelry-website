import React from "react";
import ImageCarousel from "../components/imageSlider";
import { Button, Box, useMediaQuery } from "@mui/material";
import NavBar from "../components/navbar";
import { useTheme } from '@mui/material/styles';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <NavBar />
      <Box>
        <ImageCarousel 
          items={carouselItems} 
          width={isMobile ? "90%" : "60%"} 
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: { xs: 2, sm: 3 },
            padding: { xs: 2, sm: 0 }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? "medium" : "large"}
            sx={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              border: 1,
              width: isMobile ? '100%' : 'auto'
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