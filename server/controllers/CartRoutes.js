import express from 'express';
import db from '../db.js';

const router = express.Router();

// Helper function to initialize the session cart for guest users
const initializeSessionCart = (req) => {
    req.session.cart = req.session.cart || [];
};

// Add item to cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    try {
        if (userId) {
            // Registered user: Save to database with upsert logic
            await db.query(
                `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3`,
                [userId, productId, quantity]
            );
        } else {
            // Guest user: Save to session
            initializeSessionCart(req); // Initialize session cart if it doesn't exist
            const itemIndex = req.session.cart.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                req.session.cart[itemIndex].quantity += quantity;
            } else {
                req.session.cart.push({ productId, quantity });
            }
        }
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});

// Get cart items
router.get('/', async (req, res) => {
    const { userId } = req.query;

    try {
        if (userId) {
            // Registered user: Retrieve from database
            const result = await db.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
            res.json(result.rows);
        } else {
            // Guest user: Retrieve from session
            initializeSessionCart(req);
            res.json(req.session.cart);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
});

// Update item quantity in cart
router.put('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    try {
        if (userId) {
            await db.query(
                'UPDATE cart SET quantity = $3 WHERE user_id = $1 AND product_id = $2',
                [userId, productId, quantity]
            );
        } else {
            initializeSessionCart(req);
            const itemIndex = req.session.cart.findIndex(item => item.productId === productId);

            if (itemIndex > -1) {
                req.session.cart[itemIndex].quantity = quantity;
            }
        }
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Error updating cart' });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        if (userId) {
            await db.query(
                'DELETE FROM cart WHERE user_id = $1 AND product_id = $2',
                [userId, productId]
            );
        } else {
            initializeSessionCart(req);
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
});

export default router;