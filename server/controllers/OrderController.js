import express from 'express';
import db from '../db.js';
const router = express.Router();

// TEMPORARY: Get last order details (remove after viewing)
router.get('/latest', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM orders ORDER BY id DESC LIMIT 1'
        );

        if (result.rows.length > 0) {
            const order = result.rows[0];
            res.json({
                orderId: order.id,
                userId: order.user_id,
                status: order.status,
                createdAt: order.created_at || null,
                items: JSON.parse(order.items),
                shippingDetails: JSON.parse(order.shipping_details)
            });
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error fetching last order:', error);
        res.status(500).json({
            error: 'Error fetching order',
            message: error.message,
            detail: error.detail || 'No additional details'
        });
    }
});

// TEMPORARY: Debug endpoint to check orders table
router.get('/debug', async (req, res) => {
    try {
        // Check if table exists and get count
        const countResult = await db.query('SELECT COUNT(*) FROM orders');

        // Get all orders (limited to 5 for safety)
        const ordersResult = await db.query('SELECT * FROM orders ORDER BY id DESC LIMIT 5');

        res.json({
            success: true,
            totalOrders: countResult.rows[0].count,
            orders: ordersResult.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code,
            detail: error.detail
        });
    }
});

router.post('/checkout', async (req, res) => {
    const { userId, cartItems, shippingDetails } = req.body;

    if (!userId || !cartItems || !shippingDetails) {
        return res.status(400).send('Missing required data.');
    }

    try {
        // Simulate saving the order to the database
        const order = {
            userId,
            cartItems,
            shippingDetails,
            status: 'Pending',
        };

        // In a real scenario, you would save this order to your database
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, items, shipping_details, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, JSON.stringify(cartItems), JSON.stringify(shippingDetails), 'Pending']
        );

        // Respond with the order information
        res.status(200).json({ message: 'Order placed successfully', order: orderResult.rows[0] });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Error placing the order.');
    }
});

export default router;