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
});

export default theme;
