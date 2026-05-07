import { useState, useMemo, useEffect } from 'react';
import ImageUploader, { MultiFileUploader } from '../../components/ImageUploader';
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
    InputAdornment,
    Chip,
    Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, VisibilityOff as HideIcon, Visibility as UnhideIcon, PlayCircleOutline as VideoIcon } from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductContext';
import NavBar from '../../components/navbar';
import api from '../../services/api';

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
    const { addProduct, updateProduct, deleteProduct } = useProducts();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [editingId, setEditingId] = useState(null);
    const [operationError, setOperationError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingUploads, setPendingUploads] = useState({});
    const [bulkFiles, setBulkFiles] = useState([]); // files from multi-file uploader
    const [submitting, setSubmitting] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [hidingProducts, setHidingProducts] = useState(new Set());

    // Fetch all products including hidden/sold out for admin
    const fetchAllProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/product');
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

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
        setPendingUploads({});
        setBulkFiles([]);
        setImagesToDelete([]);
        setOpenDialog(true);
    };

    const handleEdit = (product) => {
        // Collect all image URLs for tracking changes
        const currentImages = [
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
        ].filter(Boolean);

        setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            materials: product.materials,
            type: product.type,
            imgs: currentImages.length > 0 ? currentImages : ['']
        });
        
        setEditingId(product.id);
        setPendingUploads({});
        setBulkFiles([]);
        setImagesToDelete([]);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            // Find the product to get its images
            const productToDelete = products.find(p => p.id === id);
            if (productToDelete) {
                // Collect all image URLs to delete from S3
                const imagesToDelete = [
                    productToDelete.image1,
                    productToDelete.image2,
                    productToDelete.image3,
                    productToDelete.image4,
                    productToDelete.image5,
                    productToDelete.image6,
                    productToDelete.image7,
                    productToDelete.image8,
                    productToDelete.image9,
                    productToDelete.image10
                ].filter(Boolean);
                
                // Delete the product first
                await deleteProduct(id);
                
                // Then delete all associated images
                if (imagesToDelete.length > 0) {
                    await api.post('/images/delete-multiple', {
                        imageUrls: imagesToDelete
                    });
                }
            } else {
                await deleteProduct(id);
            }
            
            await fetchAllProducts();
        } catch (err) {
            console.error('Delete error:', err);
            if (err.response?.data?.message) {
                setOperationError(err.response.data.message);
            } else {
                setOperationError('Failed to delete product');
            }
        }
    };

    const getProductStatus = (product) => {
        if (product.quantity === -1) return { label: 'Hidden', color: 'warning' };
        if (product.quantity === 0) return { label: 'Sold Out', color: 'error' };
        return { label: 'Available', color: 'success' };
    };

    const handleHide = async (product) => {
        if (!window.confirm(`Are you sure you want to hide "${product.title}"?`)) return;

        try {
            setHidingProducts(prev => new Set(prev).add(product.id));
            await updateProduct(product.id, {
                ...product,
                quantity: -1
            });
            await fetchAllProducts();
        } catch (err) {
            console.error('Hide error:', err);
            setOperationError('Failed to hide product');
        } finally {
            setHidingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    const handleUnhide = async (product) => {
        try {
            setHidingProducts(prev => new Set(prev).add(product.id));
            // Set quantity to 1 when unhiding
            await updateProduct(product.id, {
                ...product,
                quantity: 1
            });
            await fetchAllProducts();
        } catch (err) {
            console.error('Unhide error:', err);
            setOperationError('Failed to unhide product');
        } finally {
            setHidingProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    // Upload all pending files (both single-slot and bulk) and return the merged URL list.
    const uploadPendingImages = async (productId) => {
        let uploadedUrls = [...formData.imgs];

        // --- 1. Single-slot pending uploads (one file per index) ---
        const singleEntries = Object.entries(pendingUploads);
        if (singleEntries.length > 0) {
            for (const [index, file] of singleEntries) {
                try {
                    const fd = new FormData();
                    fd.append('images', file);
                    fd.append('productId', productId || 'new');
                    fd.append('imageIndex', parseInt(index) + 1);

                    const response = await api.post('/images/upload', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    // Server returns { urls: [...] } — take the first URL
                    const url = response.data.urls?.[0] || response.data.imageUrl;
                    uploadedUrls[parseInt(index)] = url;
                } catch (error) {
                    console.error('Single upload error:', error);
                    throw new Error(`Failed to upload image ${parseInt(index) + 1}`);
                }
            }
        }

        // --- 2. Bulk multi-file uploads ---
        if (bulkFiles.length > 0) {
            const fd = new FormData();
            bulkFiles.forEach(file => fd.append('images', file));
            fd.append('productId', productId || 'new');

            const response = await api.post('/images/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newUrls = response.data.urls || [];
            // Append new URLs after any existing ones (fill slots left by pending_upload placeholders first,
            // then add to the end — up to 10 total)
            let insertIdx = 0;
            for (const url of newUrls) {
                // Find next available empty/placeholder slot
                while (insertIdx < uploadedUrls.length && uploadedUrls[insertIdx] && uploadedUrls[insertIdx] !== 'pending_upload') {
                    insertIdx++;
                }
                if (insertIdx < uploadedUrls.length) {
                    uploadedUrls[insertIdx] = url;
                } else if (uploadedUrls.length < 10) {
                    uploadedUrls.push(url);
                }
                insertIdx++;
            }
        }

        // Remove pending_upload placeholders that were not filled
        return uploadedUrls.map(url => (url === 'pending_upload' ? '' : url)).filter(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOperationError('');
        setSubmitting(true);
        
        try {
            // First, upload any pending images
            const hasUploads = Object.keys(pendingUploads).length > 0 || bulkFiles.length > 0;
            let processedImageUrls = [...formData.imgs];
            
            if (hasUploads) {
                processedImageUrls = await uploadPendingImages(editingId);
            }
            
            const productData = {
                ...formData,
                imgs: processedImageUrls
            };
            
            // Save the product data
            if (editingId) {
                await updateProduct(editingId, productData);
                
                // Delete any images that were removed
                if (imagesToDelete.length > 0) {
                    await api.post('/images/delete-multiple', {
                        imageUrls: imagesToDelete
                    });
                }
            } else {
                await addProduct(productData);
            }
            
            // Refresh the product list to show all products including hidden/sold out
            await fetchAllProducts();
            setOpenDialog(false);
            setFormData(initialFormData);
            setEditingId(null);
            setPendingUploads({});
            setBulkFiles([]);
            setImagesToDelete([]);
        } catch (err) {
            console.error('Frontend error:', err.response?.data || err);
            setOperationError(err.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
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
        // If there's a real URL (not empty and not pending), add it to delete list
        const imageUrl = formData.imgs[index];
        if (imageUrl && imageUrl !== 'pending_upload' && imageUrl.startsWith('http')) {
            setImagesToDelete(prev => [...prev, imageUrl]);
        }
        
        // Remove from pending uploads if needed
        if (pendingUploads[index]) {
            const newPendingUploads = { ...pendingUploads };
            delete newPendingUploads[index];
            setPendingUploads(newPendingUploads);
        }
        
        // Remove from form data
        setFormData({
            ...formData,
            imgs: formData.imgs.filter((_, i) => i !== index)
        });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPendingUploads({});
        setBulkFiles([]);
        setImagesToDelete([]);
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
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => {
                            const status = getProductStatus(product);
                            const isHiding = hidingProducts.has(product.id);
                            return (
                                <TableRow key={product.id}>
                                    <TableCell sx={{ color: 'black' }}>{product.title}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>
                                        {TYPES.find(type => type.value === product.type)?.label || 'Unknown'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black' }}>${product.price}</TableCell>
                                    <TableCell sx={{ color: 'black' }}>{product.quantity === -1 ? 'Hidden' : product.quantity}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={status.label} 
                                            color={status.color} 
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleEdit(product)} 
                                            color="primary"
                                            disabled={isHiding}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        {product.quantity === -1 ? (
                                            <IconButton 
                                                onClick={() => handleUnhide(product)} 
                                                color="success"
                                                disabled={isHiding}
                                                title="Unhide product"
                                            >
                                                <UnhideIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton 
                                                onClick={() => handleHide(product)} 
                                                color="warning"
                                                disabled={isHiding}
                                                title="Hide product"
                                            >
                                                <HideIcon />
                                            </IconButton>
                                        )}
                                        <IconButton 
                                            onClick={() => handleDelete(product.id)} 
                                            color="error"
                                            disabled={isHiding}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: 'black' }}>
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ color: 'black' }}>
                        {editingId ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogContent sx={{ color: 'black' }}>
                        <TextField
                            margin="dense"
                            label="Title"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Materials"
                            fullWidth
                            value={formData.materials}
                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        />
                        <TextField
                            margin="dense"
                            select
                            label="Type"
                            fullWidth
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        >
                            {TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value} sx={{ color: 'black' }}>
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
                            sx={{
                                '& .MuiInputLabel-root': { color: 'black' },
                                '& .MuiOutlinedInput-input': { color: 'black' },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.23)' }
                            }}
                        />
                        
                        {/* ── Existing images grid (with per-image delete) ── */}
                        {formData.imgs.filter(url => url && url !== 'pending_upload' && url.startsWith('http')).length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'black', mb: 1 }}>
                                    Current Images / Videos
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.imgs.map((url, index) => {
                                        if (!url || url === 'pending_upload' || !url.startsWith('http')) return null;
                                        const isVid = /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url);
                                        return (
                                            <Box
                                                key={index}
                                                sx={{
                                                    position: 'relative',
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                {isVid ? (
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            bgcolor: 'grey.200',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <VideoIcon color="action" />
                                                        <Typography variant="caption" sx={{ fontSize: 9, textAlign: 'center', px: 0.5 }}>
                                                            Video
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <img
                                                        src={url}
                                                        alt={`Product image ${index + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <Tooltip title="Remove this image">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveImage(index)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            bgcolor: 'rgba(0,0,0,0.5)',
                                                            color: 'white',
                                                            p: 0.25,
                                                            '&:hover': { bgcolor: 'rgba(200,0,0,0.8)' },
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}

                        {/* ── Bulk multi-file uploader ── */}
                        {formData.imgs.filter(Boolean).length < 10 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'black', mb: 0.5 }}>
                                    Add Images / Videos
                                </Typography>
                                <MultiFileUploader
                                    disabled={submitting}
                                    onFilesSelected={(files) => {
                                        // Cap at 10 total
                                        const existingCount = formData.imgs.filter(u => u && u.startsWith('http')).length;
                                        const allowed = Math.max(0, 10 - existingCount);
                                        setBulkFiles(files.slice(0, allowed));
                                    }}
                                />
                            </Box>
                        )}

                        {/* ── Single-slot uploaders (for manual URL entry or individual replacements) ── */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'black', mb: 0.5 }}>
                                Or add individual image/video slots
                            </Typography>
                            {formData.imgs.map((url, index) => (
                                <ImageUploader
                                    key={index}
                                    value={url}
                                    index={index}
                                    onChange={handleImageChange}
                                    onRemove={handleRemoveImage}
                                    pendingUploads={pendingUploads}
                                    setPendingUploads={setPendingUploads}
                                />
                            ))}

                            {formData.imgs.length < 10 && (
                                <Button
                                    onClick={handleAddImage}
                                    sx={{ mt: 1 }}
                                >
                                    Add Another Image/Video Slot
                                </Button>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 1 }} />
                                    {editingId ? 'Saving...' : 'Adding...'}
                                </>
                            ) : (
                                editingId ? 'Save Changes' : 'Add Product'
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
};