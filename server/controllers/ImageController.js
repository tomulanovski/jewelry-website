import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../utils/s3.js';
import db from '../db.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload image and get URL
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('Request received:', {
            hasFile: !!req.file,
            fileDetails: req.file ? {
                size: req.file.size,
                mimetype: req.file.mimetype,
                hasBuffer: !!req.file.buffer
            } : null,
            body: req.body
        });

        const file = req.file;
        const { productId, imageIndex } = req.body;

        if (!file) {
            console.log('No file in request');
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Generate unique filename
        const filename = `product_${productId || 'new'}_${Date.now()}_${imageIndex}.jpg`;
        console.log('Attempting S3 upload with filename:', filename);

        const imageUrl = await uploadToS3(file.buffer, filename);
        console.log('Upload successful, URL:', imageUrl);

        res.json({
            success: true,
            imageUrl,
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