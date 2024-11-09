import express from 'express';
import db from '../db.js';

const router = express.Router();

// Middleware to ensure session cart is initialized for guest users
const ensureSessionCart = (req, res, next) => {
    req.session.cart = req.session.cart || [];
    next();
};

router.use(ensureSessionCart);

// Add item to cart
router.post('/add', async (req, res, next) => {
    const { email, productId, quantity } = req.body;

    if (!email || !productId || !quantity) {
        return res.status(400).json({ error: 'Email, Product ID, and quantity are required' });
    }

    try {
        // Registered user: Save to database
        await db.query(
            `INSERT INTO cart (email, product_id, quantity) VALUES ($1, $2, $3)
             ON CONFLICT (email, product_id) DO UPDATE SET quantity = cart.quantity + $3`,
            [email, productId, quantity]
        );
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        next(error);
    }
});

// Get cart items
router.get('/', async (req, res, next) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Registered user: Retrieve items from database
        const result = await db.query(`
            SELECT c.product_id, c.quantity, p.name, p.price, p.image_url 
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.email = $1
        `, [email]);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Update item quantity in cart
router.put('/update', async (req, res, next) => {
    const { email, productId, quantity } = req.body;

    if (!email || !productId || quantity <= 0) {
        return res.status(400).json({ error: 'Email, Product ID, and valid quantity are required' });
    }

    try {
        // Registered user: Update item quantity in database
        await db.query(
            'UPDATE cart SET quantity = $3 WHERE email = $1 AND product_id = $2',
            [email, productId, quantity]
        );
        res.json({ message: 'Cart updated' });
    } catch (error) {
        next(error);
    }
});

// Remove item from cart
router.delete('/remove', async (req, res, next) => {
    const { email, productId } = req.body;

    if (!email || !productId) {
        return res.status(400).json({ error: 'Email and Product ID are required' });
    }

    try {
        // Registered user: Remove item from database
        await db.query(
            'DELETE FROM cart WHERE email = $1 AND product_id = $2',
            [email, productId]
        );
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'An internal server error occurred' });
});

export default router;