// src/routes/payment.js
import express from 'express';
import axios from 'axios';
const router = express.Router();

// Environment variables setup
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await axios.post(`${PAYPAL_API_URL}/v1/oauth2/token`, 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('PayPal Auth Error:', error);
    throw new Error('Failed to get PayPal access token');
  }
}

// Create order route
router.post('/create-order', async (req, res) => {
  try {
    const { items, shipping } = req.body;
    const accessToken = await getPayPalAccessToken();

    // Calculate order total
    const orderTotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    ).toFixed(2);

    const order = await axios.post(
      `${PAYPAL_API_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: orderTotal,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: orderTotal
              }
            }
          },
          items: items.map(item => ({
            name: item.title,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: item.price.toString()
            }
          }))
        }],
        application_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
          user_action: "PAY_NOW",
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(order.data);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Capture payment route
router.post('/capture-payment/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const accessToken = await getPayPalAccessToken();

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

    // Save order to database
    const paymentDetails = response.data;
    const order = await saveOrderToDatabase({
      paypalOrderId: paymentDetails.id,
      status: paymentDetails.status,
      amount: paymentDetails.purchase_units[0].amount.value,
      payerEmail: paymentDetails.payer.email_address,
      shippingAddress: paymentDetails.purchase_units[0].shipping,
      items: req.body.items
    });

    res.json({
      orderId: order.id,
      status: 'success',
      details: paymentDetails
    });
  } catch (error) {
    console.error('Capture Payment Error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// Webhook handler for PayPal notifications
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await updateOrderStatus(event.resource.custom_id, 'paid');
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await updateOrderStatus(event.resource.custom_id, 'failed');
        break;
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

export default router;