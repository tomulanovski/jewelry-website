import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { brand, labelStyle } from "../theme";

const linkSx = {
  color: brand.muted,
  fontSize: "0.9rem",
  lineHeight: 2,
  textDecoration: "none",
  display: "block",
  "&:hover": { color: brand.goldSoft },
};

function FooterLink({ to, href, external, children }) {
  if (href) {
    return (
      <Box
        component="a"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        sx={linkSx}
      >
        {children}
      </Box>
    );
  }
  return (
    <Box component={Link} to={to} sx={linkSx}>
      {children}
    </Box>
  );
}

function ColumnTitle({ children }) {
  return (
    <Typography sx={{ ...labelStyle, color: brand.gold, mb: 2 }}>
      {children}
    </Typography>
  );
}

function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;

  return (
    <Box
      component="footer"
      sx={{ borderTop: `1px solid ${brand.line}`, backgroundColor: brand.black, mt: { xs: 8, md: 12 } }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 6 }, pt: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 5, md: 6 }}>
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.6rem",
                color: brand.text,
                letterSpacing: "0.04em",
                mb: 1,
              }}
            >
              Catherine Ulanovski
            </Typography>
            <Typography sx={{ color: brand.muted, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 300 }}>
              Gold jewelry with natural stones, made by hand from start to finish.
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <ColumnTitle>Shop</ColumnTitle>
            <FooterLink to="/shop">All Jewelry</FooterLink>
            <FooterLink to="/shop/rings">Rings</FooterLink>
            <FooterLink to="/shop/necklaces">Necklaces</FooterLink>
            <FooterLink to="/shop/earrings">Earrings</FooterLink>
            <FooterLink to="/shop/bracelets">Bracelets</FooterLink>
            <FooterLink to="/shop/wedding_engagement">Wedding &amp; Engagement</FooterLink>
          </Grid>

          <Grid item xs={6} md={3}>
            <ColumnTitle>Catherine</ColumnTitle>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink href="/paintings">Paintings</FooterLink>
            <FooterLink href="https://www.etsy.com/il-en/shop/CJbijoux" external>Etsy Shop</FooterLink>
          </Grid>

          <Grid item xs={12} md={3}>
            <ColumnTitle>Contact</ColumnTitle>
            <Typography sx={{ color: brand.muted, fontSize: "0.9rem", lineHeight: 1.8, mb: 1 }}>
              Questions or a custom piece in mind? Write to Catherine.
            </Typography>
            <FooterLink href="mailto:info@cjbijoux.com">info@cjbijoux.com</FooterLink>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: `1px solid ${brand.line}`,
            mt: { xs: 6, md: 8 },
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ ...labelStyle, fontSize: "0.65rem", color: brand.muted }}>
            &copy; {new Date().getFullYear()} Catherine Ulanovski
          </Typography>
          <Box component="a" href="/" sx={{ ...labelStyle, fontSize: "0.65rem", color: brand.muted, textDecoration: "none", "&:hover": { color: brand.goldSoft } }}>
            catherineulanovski.com
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
