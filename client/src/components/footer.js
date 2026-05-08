import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const GOLD = "rgb(227, 217, 177)";
const HEADING_FONT = "'Cormorant Garamond', Georgia, serif";

const footerLinkStyle = {
  color: GOLD,
  textDecoration: "none",
  display: "inline-block",
};

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={footerLinkStyle}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{
          color: GOLD,
          fontSize: "0.875rem",
          lineHeight: 1.8,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {children}
      </Typography>
    </Link>
  );
}

function ExternalLink({ href, children, target }) {
  return (
    <a
      href={href}
      target={target || "_self"}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={footerLinkStyle}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{
          color: GOLD,
          fontSize: "0.875rem",
          lineHeight: 1.8,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {children}
      </Typography>
    </a>
  );
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0a0a0a",
        color: GOLD,
        pt: { xs: 4, md: 6 },
        pb: 0,
        mt: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          px: { xs: 3, md: 6 },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Column 1: Brand */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: HEADING_FONT,
                color: GOLD,
                letterSpacing: "0.15em",
                fontWeight: 400,
                mb: 0.5,
              }}
            >
              Catherine Ulanovski
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: GOLD,
                opacity: 0.8,
                fontSize: "0.875rem",
                lineHeight: 1.7,
                mb: 1,
              }}
            >
              Handcrafted jewelry
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: GOLD,
                opacity: 0.6,
                fontSize: "0.8rem",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              Each piece made by hand, start to finish.
            </Typography>
          </Grid>

          {/* Column 2: Shop */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: HEADING_FONT,
                color: GOLD,
                letterSpacing: "0.12em",
                fontWeight: 400,
                mb: 2,
                fontSize: "1.1rem",
                textTransform: "uppercase",
              }}
            >
              Shop
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <FooterLink to="/shop">All Jewelry</FooterLink>
              <FooterLink to="/shop/rings">Rings</FooterLink>
              <FooterLink to="/shop/necklaces">Necklaces</FooterLink>
              <FooterLink to="/shop/earrings">Earrings</FooterLink>
              <FooterLink to="/shop/bracelets">Bracelets</FooterLink>
              <FooterLink to="/shop/wedding_engagement">Wedding &amp; Engagement</FooterLink>
            </Box>
          </Grid>

          {/* Column 3: Connect */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: HEADING_FONT,
                color: GOLD,
                letterSpacing: "0.12em",
                fontWeight: 400,
                mb: 2,
                fontSize: "1.1rem",
                textTransform: "uppercase",
              }}
            >
              Connect
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <FooterLink to="/about">About Catherine</FooterLink>
              <ExternalLink href="mailto:info@cjbijoux.com">Custom Orders</ExternalLink>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: GOLD,
                opacity: 0.7,
                fontSize: "0.875rem",
                mt: 2,
                mb: 0.5,
                lineHeight: 1.7,
              }}
            >
              Questions? Get in touch:
            </Typography>
            <ExternalLink href="mailto:info@cjbijoux.com">
              info@cjbijoux.com
            </ExternalLink>
            <Box sx={{ mt: 0.5 }}>
              <ExternalLink href="https://www.etsy.com/il-en/shop/CJbijoux" target="_blank">
                Visit the Etsy shop
              </ExternalLink>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Divider
          sx={{
            borderColor: GOLD,
            opacity: 0.15,
            mt: { xs: 4, md: 6 },
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            py: 2.5,
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: GOLD,
              opacity: 0.5,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
            }}
          >
            &copy; 2025 Catherine Ulanovski
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
