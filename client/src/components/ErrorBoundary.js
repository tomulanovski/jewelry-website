import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            px: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'rgb(227, 217, 177)',
              fontWeight: 300,
              letterSpacing: '0.1em',
            }}
          >
            Something went wrong
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgb(227, 217, 177)',
              opacity: 0.7,
              maxWidth: 400,
            }}
          >
            An unexpected error occurred. Please reload the page to continue.
          </Typography>

          <Button
            onClick={this.handleReload}
            variant="outlined"
            sx={{
              mt: 1,
              color: 'rgb(227, 217, 177)',
              borderColor: 'rgb(227, 217, 177)',
              letterSpacing: '0.15em',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgb(227, 217, 177)',
                color: '#000000',
                borderColor: 'rgb(227, 217, 177)',
              },
            }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
