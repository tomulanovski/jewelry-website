import express from 'express';
import multer from 'multer';
import { uploadToS3, deleteFromS3 } from '../utils/s3.js';
import db from '../db.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper: derive a safe file extension from the mime type
const extFromMime = (mimetype) => {
    if (mimetype.startsWith('video/')) {
        const sub = mimetype.split('/')[1];
        // Map common video subtypes to extensions
        const videoExts = { mp4: 'mp4', quicktime: 'mov', webm: 'webm', 'x-msvideo': 'avi', 'x-matroska': 'mkv' };
        return videoExts[sub] || sub;
    }
    // Images
    const sub = mimetype.split('/')[1];
    const imgExts = { jpeg: 'jpg', jpg: 'jpg', png: 'png', gif: 'gif', webp: 'webp', svg: 'svg' };
    return imgExts[sub] || sub || 'jpg';
};

// Upload multiple images/videos and return an array of URLs
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files;
        const { productId, imageIndex } = req.body;

        console.log('Request received:', {
            fileCount: files ? files.length : 0,
            fileDetails: files ? files.map(f => ({ size: f.size, mimetype: f.mimetype })) : null,
            body: req.body
        });

        // --- Multi-file path ---
        if (files && files.length > 0) {
            const uploadPromises = files.map((file, i) => {
                const ext = extFromMime(file.mimetype);
                const filename = `product_${productId || 'new'}_${Date.now()}_${i}.${ext}`;
                console.log('Uploading to S3:', filename, file.mimetype);
                return uploadToS3(file.buffer, filename, file.mimetype);
            });

            const urls = await Promise.all(uploadPromises);
            console.log('Multi-upload successful, URLs:', urls);

            return res.json({
                success: true,
                urls,
                // Backward-compat alias for callers that still read imageUrl
                imageUrl: urls[0],
                message: `${urls.length} file(s) uploaded successfully`
            });
        }

        // --- Backward-compatible single-file fallback (field name: 'image') ---
        // Re-parse for legacy single upload (req.file is not set when using array())
        // Clients that POST with field name 'image' (single) won't match array('images')
        // so this branch handles truly empty requests
        console.log('No files in request');
        return res.status(400).json({ error: 'No image/video files provided' });

    } catch (error) {
        console.error('Detailed upload error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'Failed to upload file(s)',
            details: error.message
        });
    }
});

// Upload a single image (legacy endpoint — kept for backward compatibility)
router.post('/upload-single', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const { productId, imageIndex } = req.body;

        if (!file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const ext = extFromMime(file.mimetype);
        const filename = `product_${productId || 'new'}_${Date.now()}_${imageIndex}.${ext}`;
        const imageUrl = await uploadToS3(file.buffer, filename, file.mimetype);

        res.json({
            success: true,
            imageUrl,
            urls: [imageUrl],
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Detailed upload error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'Failed to upload image',
            details: error.message
        });
    }
});

// Delete a single image from S3
router.delete('/delete', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'No image URL provided' });
        }
        
        await deleteFromS3(imageUrl);
        
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            error: 'Failed to delete image',
            details: error.message 
        });
    }
});

// Delete multiple images from S3
router.post('/delete-multiple', async (req, res) => {
    try {
        const { imageUrls } = req.body;
        
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return res.status(400).json({ error: 'No image URLs provided' });
        }
        
        const results = [];
        const errors = [];
        
        // Process each URL
        for (const url of imageUrls) {
            try {
                await deleteFromS3(url);
                results.push({ url, success: true });
            } catch (err) {
                console.error(`Error deleting ${url}:`, err);
                errors.push({ url, error: err.message });
            }
        }
        
        res.json({
            success: errors.length === 0,
            deletedCount: results.length,
            failedCount: errors.length,
            results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({ 
            error: 'Failed to process delete request',
            details: error.message 
        });
    }
});

// Update product with image URLs
router.put('/update-product-images/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { imageUrls } = req.body; // Array of up to 10 URLs
        
        // Create dynamic query based on provided URLs
        const updates = [];
        const values = [productId];
                
        imageUrls.forEach((url, index) => {
            if (url) {
                updates.push(`image${index + 1} = $${values.length + 1}`);
                values.push(url);
            } else {
                updates.push(`image${index + 1} = NULL`);
            }
        });
        
        const query = `
            UPDATE products 
            SET ${updates.join(', ')} 
            WHERE id = $1 
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ 
            success: true, 
            product: result.rows[0],
            message: 'Product images updated successfully'
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update product images' });
    }
});
 
export default router;