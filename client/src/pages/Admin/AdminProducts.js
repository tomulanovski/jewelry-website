import { useState, useMemo } from 'react';
import ImageUploader from '../../components/ImageUploader';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Typography,
    IconButton,
    Box,
    Alert,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductContext';
import NavBar from '../../components/navbar';

const TYPES = [
    { value: 0, label: 'Rings' },
    { value: 1, label: 'Necklaces' },
    { value: 2, label: 'Earrings' },
    { value: 3, label: 'Bracelets' }
];

const initialFormData = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    materials: '',
    type: '',
    imgs: ['']
};

export const AdminProducts = () => {
    const { products, isLoading, error, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [editingId, setEditingId] = useState(null);
    const [operationError, setOperationError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        
        const searchLower = searchTerm.toLowerCase();
        return products.filter(product => {
            return (
                product.title?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.materials?.toLowerCase().includes(searchLower) ||
                TYPES.find(type => type.value === product.type)?.label.toLowerCase().includes(searchLower) ||
                product.price?.toString().includes(searchTerm) ||
                product.quantity?.toString().includes(searchTerm)
            );
        });
    }, [products, searchTerm]);

    const handleAddNew = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setOpenDialog(true);
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
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
        setEditingId(product.id);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(id);
            await refreshProducts();
        } catch (err) {
            setOperationError('Failed to delete product');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOperationError('');

        try {
            if (editingId) {
                await updateProduct(editingId, formData);
            } else {
                await addProduct(formData);
            }
            await refreshProducts();
            setOpenDialog(false);
            setFormData(initialFormData);
            setEditingId(null);
        } catch (err) {
            console.error('Frontend error:', err.response?.data || err);
            setOperationError('Failed to save product');
        }
    };

    const handleAddImage = () => {
        if (formData.imgs.length < 10) {
            setFormData({
                ...formData,
                imgs: [...formData.imgs, '']
            });
        }
    };

    const handleImageChange = (index, value) => {
        const newImgs = [...formData.imgs];
        newImgs[index] = value;
        setFormData({
            ...formData,
            imgs: newImgs
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imgs: formData.imgs.filter((_, i) => i !== index)
        });
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

            {(error || operationError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || operationError}
                </Alert>
            )}
<Box display="flex" alignItems="center" gap={2} mb={3}>
    <TextField
        sx={{ flex: 1 }}
        variant="outlined"
        placeholder="Search products by title, description, type, price..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
            )
        }}
    />
    <Button variant="contained" color="primary" onClick={handleAddNew}>
        Add New Product
    </Button>
</Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>
                                    {TYPES.find(type => type.value === product.type)?.label || 'Unknown'}
                                </TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(product)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {editingId ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Title"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Materials"
                            fullWidth
                            value={formData.materials}
                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            select
                            label="Type"
                            fullWidth
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            {TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        
                        {/* Image URLs */}
                        {formData.imgs.map((url, index) => (
                                <ImageUploader
                                    key={index}
                                    value={url}
                                    index={index}
                                    onChange={handleImageChange}
                                    onRemove={handleRemoveImage}
                                />
                            ))}
                        
                        {formData.imgs.length < 10 && (
                            <Button 
                                onClick={handleAddImage}
                                sx={{ mt: 1 }}
                            >
                                Add Another Image URL
                            </Button>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            {editingId ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};