import { useState, useEffect, useMemo } from 'react';
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
    Button,
    Tabs,
    Tab,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { Refresh as RefreshIcon, Visibility as UnhideIcon, Add as AddIcon } from '@mui/icons-material';
import NavBar from '../../components/navbar';
import api from '../../services/api';
import { useProducts } from '../../contexts/ProductContext';

const TYPES = [
    { value: 0, label: 'Rings' },
    { value: 1, label: 'Necklaces' },
    { value: 2, label: 'Earrings' },
    { value: 3, label: 'Bracelets' }
];

export const AdminSoldOut = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [reactivatingProducts, setReactivatingProducts] = useState(new Set());
    const [reactivateDialog, setReactivateDialog] = useState({ open: false, product: null, quantity: 1 });
    const [unhideDialog, setUnhideDialog] = useState({ open: false, product: null, quantity: 1 });

    // Fetch all products including hidden/sold out for admin
    const fetchAllProducts = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await api.get('/product');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    // Filter products
    const soldOutProducts = useMemo(() => {
        return products.filter(p => p.quantity === 0);
    }, [products]);

    const hiddenProducts = useMemo(() => {
        return products.filter(p => p.quantity === -1);
    }, [products]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleReactivate = async (product, quantity) => {
        try {
            setReactivatingProducts(prev => new Set(prev).add(product.id));
            setError('');
            setSuccess('');

            await api.put(`/product/${product.id}`, {
                title: product.title,
                description: product.description,
                price: product.price,
                quantity: quantity,
                materials: product.materials,
                type: product.type,
                imgs: [
                    product.image1,
                    product.image2,
                    product.image3,
                    product.image4,
                    product.image5,
                    product.image6,
                    product.image7,
                    product.image8,
                    product.image9,
                    product.image10
                ].filter(Boolean)
            });

            setSuccess(`Product "${product.title}" reactivated with quantity ${quantity}`);
            setReactivateDialog({ open: false, product: null, quantity: 1 });
            await fetchAllProducts();
        } catch (err) {
            console.error('Reactivate error:', err);
            setError('Failed to reactivate product: ' + (err.response?.data?.error || err.message));
        } finally {
            setReactivatingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    const handleUnhide = async (product, quantity) => {
        try {
            setReactivatingProducts(prev => new Set(prev).add(product.id));
            setError('');
            setSuccess('');

            await api.put(`/product/${product.id}`, {
                title: product.title,
                description: product.description,
                price: product.price,
                quantity: quantity,
                materials: product.materials,
                type: product.type,
                imgs: [
                    product.image1,
                    product.image2,
                    product.image3,
                    product.image4,
                    product.image5,
                    product.image6,
                    product.image7,
                    product.image8,
                    product.image9,
                    product.image10
                ].filter(Boolean)
            });

            setSuccess(`Product "${product.title}" unhidden with quantity ${quantity}`);
            setUnhideDialog({ open: false, product: null, quantity: 1 });
            await fetchAllProducts();
        } catch (err) {
            console.error('Unhide error:', err);
            setError('Failed to unhide product: ' + (err.response?.data?.error || err.message));
        } finally {
            setReactivatingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    const openReactivateDialog = (product) => {
        setReactivateDialog({ open: true, product, quantity: 1 });
    };

    const closeReactivateDialog = () => {
        setReactivateDialog({ open: false, product: null, quantity: 1 });
    };

    const openUnhideDialog = (product) => {
        setUnhideDialog({ open: true, product, quantity: 1 });
    };

    const closeUnhideDialog = () => {
        setUnhideDialog({ open: false, product: null, quantity: 1 });
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

            {(error || success) && (
                <Alert 
                    severity={error ? 'error' : 'success'} 
                    sx={{ mb: 2 }}
                    onClose={() => {
                        setError('');
                        setSuccess('');
                    }}
                >
                    {error || success}
                </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ color: 'black' }}>
                    Sold Out & Hidden Products
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchAllProducts}
                >
                    Refresh
                </Button>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab 
                        label={`Sold Out (${soldOutProducts.length})`} 
                        sx={{ color: 'black' }}
                    />
                    <Tab 
                        label={`Hidden (${hiddenProducts.length})`} 
                        sx={{ color: 'black' }}
                    />
                </Tabs>
            </Paper>

            {/* Sold Out Products Tab */}
            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Materials</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {soldOutProducts.map((product) => {
                                const isReactivating = reactivatingProducts.has(product.id);
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell sx={{ color: 'black' }}>{product.title}</TableCell>
                                        <TableCell sx={{ color: 'black' }}>
                                            {TYPES.find(type => type.value === product.type)?.label || 'Unknown'}
                                        </TableCell>
                                        <TableCell sx={{ color: 'black' }}>${product.price}</TableCell>
                                        <TableCell sx={{ color: 'black' }}>{product.materials || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => openReactivateDialog(product)}
                                                disabled={isReactivating}
                                            >
                                                Reactivate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {soldOutProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ color: 'black' }}>
                                        No sold out products
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Hidden Products Tab */}
            {tabValue === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Materials</TableCell>
                                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hiddenProducts.map((product) => {
                                const isReactivating = reactivatingProducts.has(product.id);
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell sx={{ color: 'black' }}>{product.title}</TableCell>
                                        <TableCell sx={{ color: 'black' }}>
                                            {TYPES.find(type => type.value === product.type)?.label || 'Unknown'}
                                        </TableCell>
                                        <TableCell sx={{ color: 'black' }}>${product.price}</TableCell>
                                        <TableCell sx={{ color: 'black' }}>{product.materials || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<UnhideIcon />}
                                                onClick={() => openUnhideDialog(product)}
                                                disabled={isReactivating}
                                            >
                                                Unhide
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {hiddenProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ color: 'black' }}>
                                        No hidden products
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Reactivate Dialog */}
            <Dialog open={reactivateDialog.open} onClose={closeReactivateDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: 'black' }}>
                    Reactivate Product
                </DialogTitle>
                <DialogContent sx={{ color: 'black' }}>
                    {reactivateDialog.product && (
                        <Box sx={{ pt: 2 }}>
                            <Typography sx={{ mb: 2, color: 'black' }}>
                                Product: <strong>{reactivateDialog.product.title}</strong>
                            </Typography>
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                value={reactivateDialog.quantity}
                                onChange={(e) => setReactivateDialog({
                                    ...reactivateDialog,
                                    quantity: Math.max(1, parseInt(e.target.value) || 1)
                                })}
                                inputProps={{ min: 1 }}
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'black' },
                                    '& .MuiOutlinedInput-input': { color: 'black' },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeReactivateDialog} sx={{ color: 'black' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleReactivate(reactivateDialog.product, reactivateDialog.quantity)}
                        disabled={reactivatingProducts.has(reactivateDialog.product?.id)}
                    >
                        {reactivatingProducts.has(reactivateDialog.product?.id) ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Reactivating...
                            </>
                        ) : (
                            'Reactivate'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

