import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Button,
  FormControl,
  FormLabel,
  Paper
} from '@mui/material';

function ShippingForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'postalCode'];
    
    required.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Shipping Details
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel required>First Name</FormLabel>
              <TextField
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel required>Last Name</FormLabel>
              <TextField
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel required>Email</FormLabel>
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel required>Phone</FormLabel>
              <TextField
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel required>Address</FormLabel>
              <TextField
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel>Apartment (optional)</FormLabel>
              <TextField
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel required>City</FormLabel>
              <TextField
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel required>Postal Code</FormLabel>
              <TextField
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                error={!!errors.postalCode}
                helperText={errors.postalCode}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel required>Country</FormLabel>
              <TextField
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
                fullWidth
                size="small"
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' }
            }}
          >
            Continue to Payment
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default ShippingForm;