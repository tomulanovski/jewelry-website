import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import {
  Container,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Store as StoreIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon, VisibilityOff as HideIcon } from '@mui/icons-material';
import NavBar from '../../components/navbar';

export const AdminDashboard = () => {
  const {logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
             <Typography
               align="center"
               variant="h4"
               component="h1"
               sx={{
                 color: 'rgb(var(--color_21))',
                 textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                 letterSpacing: '2px',
                 marginBottom: '20px',
               }}
             >
               Hello Catherine!
             </Typography>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Products Management Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <StoreIcon sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Products Management
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  Add, edit, or remove products from your inventory
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate('/admin/products')}
                >
                  Manage Products
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Orders Management Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShoppingCartIcon sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Orders Management
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  View all customer orders and details
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/orders')}
                >
                  View Orders
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Sold Out & Hidden Products Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <HideIcon sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Sold Out & Hidden Products
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  View and reactivate sold out or hidden products
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/sold-out')}
                >
                  Manage Inactive Products
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Users Overview Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PeopleIcon sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    Users Overview
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  View and manage user accounts
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate('/admin/users')}
                >
                  View Users
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};