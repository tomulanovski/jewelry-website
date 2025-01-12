import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Basic frontend validation
    if (formData.password.length < 8) {
      setErrors(['Password must be at least 8 characters long']);
      return;
    }

    if (!formData.email.includes('@')) {
      setErrors(['Please enter a valid email address']);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      // Handle validation errors from express-validator
      if (err?.errors && Array.isArray(err.errors)) {
        const formattedErrors = err.errors.map(error => {
          // Format error messages to be more user-friendly
          switch (error.path) {
            case 'username':
              return `Username: ${error.msg}`;
            case 'email':
              if (error.msg.includes('exists')) {
                return '⚠️ This email is already registered. Please use a different email or sign in.';
              }
              return `Email: ${error.msg}`;
            case 'password':
              return `Password Requirements: ${error.msg}`;
            default:
              return error.msg;
          }
        });
        setErrors(formattedErrors);
      }
      // Handle general error message
      else if (err?.error) {
        if (err.error.toLowerCase().includes('email')) {
          setErrors(['⚠️ This email is already registered. Please use a different email or sign in.']);
        } else {
          setErrors([err.error]);
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Create Account
          </Typography>
          
          {errors.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              {errors.map((error, index) => (
                <Alert 
                  key={index} 
                  severity={error.includes('already registered') ? "warning" : "error"}
                  sx={{ 
                    mt: 1,
                    '& .MuiAlert-message': {
                      fontSize: '0.95rem',
                      fontWeight: error.includes(':') ? 500 : 400
                    }
                  }}
                >
                  {error}
                </Alert>
              ))}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => navigate('/login')}
                sx={{ 
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Already have an account? Sign in
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};