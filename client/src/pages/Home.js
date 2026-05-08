import React, { useEffect, useState } from "react";
import ImageCarousel from "../components/imageSlider";
import { Box, Button, Typography, Divider, useMediaQuery } from "@mui/material";
import NavBar from "../components/navbar";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const GOLD = "#e3d9b1";

const carouselItems = [
  { image: "carousel_images/gold_bracelt.jpg", title: "Elegant Bracelet" },
  { image: "carousel_images/necklace.jpg",     title: "Golden Necklace"  },
  { image: "carousel_images/ring.jpg",          title: "Diamond Ring"     },
];

/* ─── tiny keyframe injected once ─── */
const FADE_STYLE = `
  @keyframes cj-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  .cj-panel-1 { animation: cj-fade-up 0.9s ease both; animation-delay: 0.15s; }
  .cj-panel-2 { animation: cj-fade-up 0.9s ease both; animation-delay: 0.40s; }
  .cj-panel-3 { animation: cj-fade-up 0.9s ease both; animation-delay: 0.65s; }
  .cj-panel-4 { animation: cj-fade-up 0.9s ease both; animation-delay: 0.85s; }
`;

function Home() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  /* inject keyframes once */
  const [stylesReady, setStylesReady] = useState(false);
  useEffect(() => {
    if (!document.getElementById("cj-home-styles")) {
      const tag = document.createElement("style");
      tag.id        = "cj-home-styles";
      tag.innerHTML = FADE_STYLE;
      document.head.appendChild(tag);
    }
    setStylesReady(true);
  }, []);

  return (
    <Box sx={{ bgcolor: "#000", minHeight: "100vh", color: GOLD }}>
      <NavBar />

      {/* ── 1. Announcement bar ─────────────────────────────────── */}
      <Box
        sx={{
          width: "100%",
          bgcolor: `rgba(227,217,177,0.06)`,
          borderBottom: `1px solid rgba(227,217,177,0.10)`,
          py: "10px",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: `rgba(227,217,177,0.70)`,
            userSelect: "none",
          }}
        >
          Handcrafted in Israel&nbsp;&nbsp;·&nbsp;&nbsp;Made to Order&nbsp;&nbsp;·&nbsp;&nbsp;Each Piece Unique
        </Typography>
      </Box>

      {/* ── 2. Hero ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 2, md: 6 },
          pt: { xs: 4, md: 7 },
          pb: { xs: 5, md: 8 },
          gap: { xs: 5, md: 0 },
        }}
      >
        {/* ── Carousel (left) ── */}
        <Box
          sx={{
            flex: isMobile ? "none" : "0 0 58%",
            width: isMobile ? "100%" : "58%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ImageCarousel
            items={carouselItems}
            width="100%"
          />
        </Box>

        {/* ── Brand text panel (right) ── */}
        <Box
          sx={{
            flex: isMobile ? "none" : "1 1 42%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pl: isMobile ? 0 : 7,
            pr: isMobile ? 0 : 1,
            pt: isMobile ? 0 : 2,
          }}
        >
          {/* label */}
          <Typography
            className={stylesReady ? "cj-panel-1" : ""}
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: `rgba(227,217,177,0.55)`,
              mb: 2.5,
              fontVariant: "small-caps",
            }}
          >
            CJbijoux
          </Typography>

          {/* headline */}
          <Typography
            className={stylesReady ? "cj-panel-2" : ""}
            component="h1"
            sx={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 300,
              lineHeight: 1.15,
              color: GOLD,
              mb: 3,
              letterSpacing: "0.01em",
            }}
          >
            Jewelry that carries<br />a story
          </Typography>

          {/* sub-text */}
          <Typography
            className={stylesReady ? "cj-panel-3" : ""}
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              lineHeight: 1.75,
              color: `rgba(227,217,177,0.70)`,
              mb: 3.5,
              maxWidth: 340,
            }}
          >
            14k &amp; 18k gold, handset gemstones.
            <br />
            Every piece built by hand — from drawing to final polish.
          </Typography>

          {/* rule */}
          <Divider
            className={stylesReady ? "cj-panel-3" : ""}
            sx={{
              borderColor: `rgba(227,217,177,0.20)`,
              mb: 3.5,
              maxWidth: 280,
            }}
          />

          {/* CTA button */}
          <Box className={stylesReady ? "cj-panel-4" : ""}>
            <Button
              variant="outlined"
              onClick={() => navigate("/shop")}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                color: GOLD,
                borderColor: `rgba(227,217,177,0.55)`,
                borderRadius: 0,
                px: 4,
                py: 1.4,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: GOLD,
                  bgcolor: `rgba(227,217,177,0.07)`,
                  boxShadow: `0 0 18px rgba(227,217,177,0.08)`,
                },
              }}
            >
              Shop the Collection
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── 3. Feature pills ────────────────────────────────────── */}
      <Box
        sx={{
          width: "100%",
          borderTop:    `1px solid rgba(227,217,177,0.09)`,
          borderBottom: `1px solid rgba(227,217,177,0.09)`,
          py: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 2, sm: 0 },
          flexWrap: "wrap",
        }}
      >
        {["14k & 18k Solid Gold", "Natural Gemstones", "Made to Order"].map(
          (label, i, arr) => (
            <React.Fragment key={label}>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color: `rgba(227,217,177,0.58)`,
                  userSelect: "none",
                  px: { xs: 0, sm: 3 },
                }}
              >
                {label}
              </Typography>
              {i < arr.length - 1 && (
                <Typography
                  aria-hidden
                  sx={{
                    color: `rgba(227,217,177,0.22)`,
                    fontSize: "0.65rem",
                    display: { xs: "none", sm: "block" },
                    userSelect: "none",
                  }}
                >
                  ·
                </Typography>
              )}
            </React.Fragment>
          )
        )}
      </Box>
    </Box>
  );
}

export default Home;
