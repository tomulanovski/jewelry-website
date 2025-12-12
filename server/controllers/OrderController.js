import express from 'express';
import db from '../db.js';
const router = express.Router();

// Get all orders with full details (for admin dashboard)
router.get('/admin/all', async (req, res) => {
    try {
        // Get all orders
        const ordersResult = await db.query(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );

        // For each order, get the items with product details
        const ordersWithItems = await Promise.all(
            ordersResult.rows.map(async (order) => {
                const itemsResult = await db.query(
                    'SELECT * FROM order_items WHERE order_id = $1',
                    [order.id]
                );

                // Get product details for each item
                const itemsWithProducts = await Promise.all(
                    itemsResult.rows.map(async (item) => {
                        const productResult = await db.query(
                            'SELECT * FROM products WHERE id = $1',
                            [item.product_id]
                        );
                        return {
                            ...item,
                            product: productResult.rows[0] || null
                        };
                    })
                );

                return {
                    ...order,
                    items: itemsWithProducts
                };
            })
        );

        res.json({
            success: true,
            orders: ordersWithItems
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
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