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
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Grid
} from '@mui/material';
import NavBar from '../../components/navbar';
import api from '../../services/api';

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError('');
            console.log('Fetching orders...');
            const response = await api.get('/orders/admin/all');
            console.log('Orders response:', response.data);

            if (response.data.success) {
                // Filter out test orders
                const filteredOrders = response.data.orders.filter(order => {
                    const customerName = order.customer_name?.toLowerCase() || '';
                    return customerName !== 'john doe' && customerName !== 'tom ulanovski';
                });
                setOrders(filteredOrders);
            } else {
                setError('Failed to load orders: ' + (response.data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
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

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <NavBar />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'black' }}>
                Orders Management
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
                Total Orders: {orders.length}
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell sx={{ color: 'black' }}>#{order.id}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{order.customer_name || 'Guest'}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{order.guest_email || 'N/A'}</TableCell>
                                <TableCell sx={{ color: 'black' }}>{formatDate(order.created_at)}</TableCell>
                                <TableCell sx={{ color: 'black' }}>${order.total_amount}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'black' }}>
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ color: 'black' }}>Order #{selectedOrder?.id} Details</DialogTitle>
                <DialogContent sx={{ color: 'black' }}>
                    {selectedOrder && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={3}>
                                {/* Customer Information */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Customer Information</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Name:</strong> {selectedOrder.customer_name || 'N/A'}</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Email:</strong> {selectedOrder.guest_email || 'N/A'}</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Phone:</strong> {selectedOrder.shipping_address?.phone || 'N/A'}</Typography>
                                </Grid>

                                {/* Shipping Address */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Shipping Address</Typography>
                                    {selectedOrder.shipping_address ? (
                                        <>
                                            <Typography sx={{ color: 'black' }}>{selectedOrder.shipping_address.address}</Typography>
                                            {selectedOrder.shipping_address.apartment && (
                                                <Typography sx={{ color: 'black' }}>Apt: {selectedOrder.shipping_address.apartment}</Typography>
                                            )}
                                            <Typography sx={{ color: 'black' }}>
                                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                                            </Typography>
                                            <Typography sx={{ color: 'black' }}>{selectedOrder.shipping_address.country}</Typography>
                                        </>
                                    ) : (
                                        <Typography sx={{ color: 'black' }}>No address provided</Typography>
                                    )}
                                </Grid>

                                {/* Order Items */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Order Items</Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Product</TableCell>
                                                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Materials</TableCell>
                                                    <TableCell align="center" sx={{ color: 'black', fontWeight: 'bold' }}>Qty</TableCell>
                                                    <TableCell align="right" sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                                                    <TableCell align="right" sx={{ color: 'black', fontWeight: 'bold' }}>Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedOrder.items?.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell sx={{ color: 'black' }}>
                                                            {item.product?.title || `Product ID: ${item.product_id}`}
                                                            {item.product?.image1 && (
                                                                <Box
                                                                    component="img"
                                                                    src={item.product.image1}
                                                                    alt={item.product.title}
                                                                    sx={{ width: 50, height: 50, objectFit: 'cover', mt: 1, borderRadius: 1 }}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'black' }}>{item.product?.materials || 'N/A'}</TableCell>
                                                        <TableCell align="center" sx={{ color: 'black' }}>{item.quantity}</TableCell>
                                                        <TableCell align="right" sx={{ color: 'black' }}>${item.price_at_time}</TableCell>
                                                        <TableCell align="right" sx={{ color: 'black' }}>
                                                            ${(parseFloat(item.price_at_time) * item.quantity).toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                {/* Payment Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>Payment Information</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>PayPal Order ID:</strong> {selectedOrder.paypal_order_id || 'N/A'}</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Total Amount:</strong> ${selectedOrder.total_amount}</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Status:</strong> {selectedOrder.status}</Typography>
                                    <Typography sx={{ color: 'black' }}><strong>Order Date:</strong> {formatDate(selectedOrder.created_at)}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </Box>
            </Dialog>
        </Container>
    );
};
