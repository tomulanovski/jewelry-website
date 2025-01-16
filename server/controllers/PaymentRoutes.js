import express from 'express';
import axios from 'axios';
import db from '../db.js';

const router = express.Router();

// Environment variables
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Validation middleware
const validateOrder = (req, res, next) => {
  const { items } = req.body;
  
  if (!items?.length) {
    return res.status(400).json({ error: 'No items provided' });
  }

  if (!items.every(item => item.price && item.quantity && item.title)) {
    return res.status(400).json({ error: 'Invalid item data' });
  }

  next();
};

// Get PayPal access token
async function getPayPalAccessToken() {
  try {
    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('PayPal Auth Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error('Failed to get PayPal access token');
  }
}


router.post('/create-order', async (req, res) => {
  try {
    const { items, shippingCost, total } = req.body;
    
    if (!items?.length) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Get PayPal access token first
    const accessToken = await getPayPalAccessToken();
    
    // Calculate totals
    const serverCalculatedSubtotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const serverCalculatedTotal = serverCalculatedSubtotal + Number(shippingCost);

    // Format all monetary values
    const formattedSubtotal = serverCalculatedSubtotal.toFixed(2);
    const formattedShipping = Number(shippingCost).toFixed(2);
    const formattedTotal = serverCalculatedTotal.toFixed(2);

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: formattedTotal,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: formattedSubtotal
            },
            shipping: {
              currency_code: "USD",
              value: formattedShipping
            }
          }
        },
        items: items.map(item => ({
          name: item.title,
          unit_amount: {
            currency_code: "USD",
            value: Number(item.price).toFixed(2)
          },
          quantity: item.quantity
        }))
      }]
    };

    const order = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(order.data);
  } catch (error) {
    console.error('Detailed error:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.response?.data
    });
  }
});

router.post('/capture-payment/:orderId', async (req, res) => {
  try {
    console.log('--------------------------------');
    console.log('Starting payment capture process');
    console.log('PayPal Order ID:', req.params.orderId);

    const { orderId } = req.params;
    
    // Get PayPal access token
    console.log('Getting PayPal access token...');
    const accessToken = await getPayPalAccessToken();
    console.log('Successfully got PayPal access token');

    // Capture the payment
    console.log('Capturing payment with PayPal...');
    const response = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const paymentDetails = response.data;
    console.log('Full PayPal Response:', JSON.stringify(paymentDetails, null, 2));
    
    // Get the payment amount from the correct location
    const purchaseUnit = paymentDetails.purchase_units[0];
    const payments = purchaseUnit.payments.captures[0];
    const amount = payments.amount.value;
    const shippingInfo = purchaseUnit.shipping;
    const payer = paymentDetails.payment_source.paypal;

    console.log('Extracted Details:', {
      amount,
      shippingInfo,
      payer
    });

    // Prepare order data
    console.log('--------------------------------');
    console.log('Preparing order data for database...');
    
    // Insert order into database
    const orderResult = await db.query(
      `INSERT INTO orders 
        (user_id, guest_email, paypal_order_id, total_amount, status, shipping_address, customer_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user?.id || null,
        payer.email_address,
        orderId,
        amount,
        'processing',
        JSON.stringify(shippingInfo),
        `${payer.name.given_name} ${payer.name.surname}`
      ]
    );

    const savedOrder = orderResult.rows[0];
    console.log('Order successfully saved to database:', savedOrder);

    // Get items from PayPal order
    console.log('--------------------------------');
    console.log('Getting items from purchase unit...');
    const items = purchaseUnit.items || [];
    console.log('Items:', items);

    // If there are items, save them to order_items
    if (items && items.length > 0) {
      const itemValues = items.map((item, index) => 
        `($1, $${index * 3 + 2}, $${index * 3 + 3}, $${index * 3 + 4})`
      ).join(', ');

      const itemParams = [savedOrder.id];
      items.forEach(item => {
        itemParams.push(
          item.sku,
          parseInt(item.quantity),
          parseFloat(item.unit_amount.value)
        );
      });

      await db.query(
        `INSERT INTO order_items 
          (order_id, product_id, quantity, price_at_time)
         VALUES ${itemValues}`,
        itemParams
      );
      console.log('Order items successfully saved to database');
    }

    console.log('--------------------------------');
    console.log('Payment capture process completed successfully');

    res.json({
      status: 'success',
      orderId: savedOrder.id,
      details: paymentDetails
    });

  } catch (error) {
    console.error('--------------------------------');
    console.error('Payment Capture Error:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error:', error);

    res.status(500).json({ 
      error: 'Failed to capture payment',
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});

// PayPal webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    console.log('Webhook received:', event.event_type);
    
    // Here you would verify the webhook signature
    // and process different event types
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;