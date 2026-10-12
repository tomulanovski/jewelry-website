import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../contexts/ProductContext";
import { brand, labelStyle } from "../theme";

const heroImages = ["gold_bracelt.jpg", "necklace.jpg", "ring.jpg"].map(
  (name) => `${process.env.PUBLIC_URL}/carousel_images/${name}`
);

// Product.type values, as used by the shop filter.
const homeCategories = [
  { label: "Rings", param: "rings", type: 0 },
  { label: "Necklaces", param: "necklaces", type: 1 },
  { label: "Earrings", param: "earrings", type: 2 },
  { label: "Bracelets", param: "bracelets", type: 3 },
];

const sectionSx = { maxWidth: 1200, mx: "auto", px: { xs: 2.5, md: 6 } };

function SectionHeader({ title, linkTo, linkLabel }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: { xs: 3, md: 4 } }}>
      <Typography variant="h3" sx={{ fontSize: { xs: "1.9rem", md: "2.4rem" } }}>
        {title}
      </Typography>
      {linkTo && (
        <Box component={Link} to={linkTo} sx={{ ...labelStyle, color: brand.gold, textDecoration: "none" }}>
          {linkLabel}
        </Box>
      )}
    </Box>
  );
}

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((i) => (i + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ position: "relative", height: { xs: "78vh", md: "82vh" }, minHeight: 480, overflow: "hidden" }}>
      {heroImages.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.6s ease",
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(0deg, rgba(11,10,9,0.92) 0%, rgba(11,10,9,0.35) 55%, rgba(11,10,9,0.1) 100%)",
            md: "linear-gradient(90deg, rgba(11,10,9,0.9) 0%, rgba(11,10,9,0.4) 50%, rgba(11,10,9,0) 100%)",
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: { xs: 24, md: 80 },
          right: { xs: 24, md: "auto" },
          bottom: { xs: 48, md: 96 },
          maxWidth: 480,
        }}
      >
        <Typography variant="overline" component="p">
          Handmade in Kadima, Israel
        </Typography>
        <Typography
          component="h1"
          variant="h1"
          sx={{ fontSize: { xs: "2.6rem", md: "3.8rem" }, lineHeight: 1.05, color: brand.text, my: 2 }}
        >
          Jewelry that carries a story
        </Typography>
        <Typography sx={{ color: brand.goldSoft, lineHeight: 1.7, mb: 4, maxWidth: 400 }}>
          14k and 18k gold with hand-set stones. Every piece is made by hand, from the first sketch to the final polish.
        </Typography>
        <Button variant="contained" component={Link} to="/shop">
          Shop the collection
        </Button>
      </Box>
    </Box>
  );
}

function Home() {
  const { products } = useProducts();
  const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
  const coverFor = (type) => products.find((p) => p.type === type)?.image1;

  return (
    <Box>
      <NavBar />
      <Hero />

      {newest.length > 0 && (
        <Box sx={{ ...sectionSx, pt: { xs: 8, md: 12 } }}>
          <SectionHeader title="New pieces" linkTo="/shop" linkLabel="View all" />
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {newest.map((product) => (
              <Grid item xs={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ ...sectionSx, py: { xs: 10, md: 14 }, textAlign: "center" }}>
        <Typography variant="overline" component="p">
          The maker
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: { xs: "1.6rem", md: "2.2rem" },
            lineHeight: 1.4,
            color: brand.text,
            maxWidth: 760,
            mx: "auto",
            my: 3,
          }}
        >
          Catherine draws, shapes, sets and polishes every piece herself. No factory, no casting house, just one pair of hands.
        </Typography>
        <Button variant="outlined" component={Link} to="/about">
          Meet Catherine
        </Button>
      </Box>

      <Box sx={sectionSx}>
        <SectionHeader title="Shop by category" />
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {homeCategories.map((cat) => (
            <Grid item xs={6} md={3} key={cat.param}>
              <Box
                component={Link}
                to={`/shop/${cat.param}`}
                sx={{
                  display: "block",
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  backgroundColor: brand.panel,
                  "&:hover img": { transform: "scale(1.04)" },
                }}
              >
                {coverFor(cat.type) && (
                  <Box
                    component="img"
                    src={coverFor(cat.type)}
                    alt=""
                    loading="lazy"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s ease" }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(0deg, rgba(11,10,9,0.8) 0%, rgba(11,10,9,0) 55%)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: { xs: 2, md: 3 },
                  }}
                >
                  <Typography sx={{ ...labelStyle, color: brand.text, fontSize: "0.8rem" }}>{cat.label}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ ...sectionSx, pt: { xs: 10, md: 14 } }}>
        <Box
          sx={{
            border: `1px solid ${brand.line}`,
            px: { xs: 3, md: 8 },
            py: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="overline" component="p">
              Also by Catherine
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: "1.9rem", md: "2.4rem" }, mt: 1 }}>
              Original paintings
            </Typography>
            <Typography sx={{ color: brand.muted, mt: 1, maxWidth: 520 }}>
              Acrylic on canvas, built up in layers with a palette knife. Each one is the only one.
            </Typography>
          </Box>
          <Button variant="outlined" component="a" href="/paintings">
            See the paintings
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
