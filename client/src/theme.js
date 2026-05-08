import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#000000', // Set the default background color to black
    },
    text: {
      primary: 'rgb(227, 217, 177)', // White text for contrast
    },
  },
  typography: {
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, letterSpacing: '0.02em' },
    h2: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, letterSpacing: '0.02em' },
    h3: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, letterSpacing: '0.02em' },
    h4: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400, letterSpacing: '0.02em' },
    h5: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, letterSpacing: '0.02em' },
    h6: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, letterSpacing: '0.02em' },
  },
});

export default theme;
