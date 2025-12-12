import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import NavBar from '../../components/navbar';
import api from '../../services/api';

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/orders/admin/all');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'info';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <NavBar />
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <NavBar />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Orders Management
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Total Orders: {orders.length}
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No orders found</Typography>
                </Paper>
            ) : (
                <Box>
                    {orders.map((order) => (
                        <Accordion key={order.id} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Order #{order.id}
                                    </Typography>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status)}
                                        size="small"
                                    />
                                    <Typography sx={{ flex: 1 }}>
                                        {order.customer_name || 'Guest'}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        ${order.total_amount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(order.created_at)}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {/* Customer Information */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Customer Information
                                            </Typography>
                                            <Typography><strong>Name:</strong> {order.customer_name || 'N/A'}</Typography>
                                            <Typography><strong>Email:</strong> {order.guest_email || 'N/A'}</Typography>
                                            <Typography><strong>Phone:</strong> {order.shipping_address?.phone || 'N/A'}</Typography>
                                        </Paper>
                                    </Grid>

                                    {/* Shipping Address */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Shipping Address
                                            </Typography>
                                            {order.shipping_address ? (
                                                <>
                                                    <Typography>{order.shipping_address.address}</Typography>
                                                    {order.shipping_address.apartment && (
                                                        <Typography>{order.shipping_address.apartment}</Typography>
                                                    )}
                                                    <Typography>
                                                        {order.shipping_address.city}, {order.shipping_address.postalCode}
                                                    </Typography>
                                                    <Typography>{order.shipping_address.country}</Typography>
                                                </>
                                            ) : (
                                                <Typography>No address provided</Typography>
                                            )}
                                        </Paper>
                                    </Grid>

                                    {/* Order Items */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Order Items
                                            </Typography>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Image</TableCell>
                                                            <TableCell>Product</TableCell>
                                                            <TableCell>Description</TableCell>
                                                            <TableCell>Materials</TableCell>
                                                            <TableCell align="center">Quantity</TableCell>
                                                            <TableCell align="right">Price</TableCell>
                                                            <TableCell align="right">Total</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {order.items?.map((item) => (
                                                            <TableRow key={item.id}>
                                                                <TableCell>
                                                                    {item.product?.image1 && (
                                                                        <CardMedia
                                                                            component="img"
                                                                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                                                                            image={item.product.image1}
                                                                            alt={item.product.title}
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {item.product?.title || `Product ID: ${item.product_id}`}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ maxWidth: 300 }}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {item.product?.description?.substring(0, 100)}
                                                                        {item.product?.description?.length > 100 ? '...' : ''}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2">
                                                                        {item.product?.materials || 'N/A'}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="center">{item.quantity}</TableCell>
                                                                <TableCell align="right">${item.price_at_time}</TableCell>
                                                                <TableCell align="right">
                                                                    ${(parseFloat(item.price_at_time) * item.quantity).toFixed(2)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    </Grid>

                                    {/* Payment Information */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Payment Information
                                            </Typography>
                                            <Typography><strong>PayPal Order ID:</strong> {order.paypal_order_id || 'N/A'}</Typography>
                                            <Typography><strong>Total Amount:</strong> ${order.total_amount}</Typography>
                                            <Typography><strong>Status:</strong> {order.status}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Container>
    );
};
