import { createTheme } from '@mui/material/styles';

// Brand colors, shared by the theme and by the few components that style
// themselves (navbar, footer, home hero).
export const brand = {
  black: '#0b0a09',
  panel: '#141210',
  line: 'rgba(201, 169, 110, 0.22)',
  gold: '#c9a96e',
  goldSoft: '#e3d4b1',
  text: '#ece6da',
  muted: '#9a9185',
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif";

// Small spaced capitals used for labels, buttons and the menu.
export const labelStyle = {
  fontFamily: sans,
  fontSize: '0.72rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
};

const heading = (weight = 400) => ({ fontFamily: serif, fontWeight: weight, letterSpacing: '0.01em' });

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: brand.gold, contrastText: '#14110c' },
    secondary: { main: brand.goldSoft },
    background: { default: brand.black, paper: brand.panel },
    text: { primary: brand.text, secondary: brand.muted },
    divider: brand.line,
    error: { main: '#d98c7a' },
    warning: { main: brand.gold },
    success: { main: '#a8b98a' },
    info: { main: brand.goldSoft },
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: sans,
    h1: heading(300),
    h2: heading(300),
    h3: heading(),
    h4: heading(),
    h5: heading(500),
    h6: heading(500),
    button: { ...labelStyle, fontWeight: 500 },
    overline: { ...labelStyle, fontSize: '0.68rem', color: brand.gold },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: brand.black } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { padding: '12px 28px', transition: 'all 0.25s ease' },
        sizeSmall: { padding: '8px 18px' },
        containedPrimary: { '&:hover': { backgroundColor: brand.goldSoft } },
        outlined: {
          borderColor: brand.gold,
          color: brand.goldSoft,
          '&:hover': { borderColor: brand.goldSoft, backgroundColor: 'rgba(201, 169, 110, 0.08)' },
        },
        text: { color: brand.goldSoft },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none', border: `1px solid ${brand.line}` } },
    },
    MuiAppBar: {
      styleOverrides: { root: { border: 'none' } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: brand.line },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: brand.gold },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: { root: { color: brand.muted, fontSize: '0.85rem', marginBottom: 6 } },
    },
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { backgroundColor: brand.panel } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: brand.line } },
    },
    MuiStepIcon: {
      styleOverrides: { text: { fill: '#14110c' } },
    },
    MuiMenu: {
      styleOverrides: { paper: { backgroundColor: brand.black } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: brand.black, border: 'none' } },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: { root: { color: brand.goldSoft } },
    },
  },
});

// The admin pages were built for light panels on black; they keep that look.
export const adminTheme = createTheme({
  palette: {
    background: { default: '#000000' },
    text: { primary: 'rgb(227, 217, 177)' },
  },
  typography: {
    fontFamily: sans,
    h1: heading(),
    h2: heading(),
    h3: heading(),
    h4: heading(),
    h5: heading(500),
    h6: heading(500),
  },
});

export default theme;
