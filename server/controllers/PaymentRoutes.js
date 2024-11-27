import express from 'express';
import axios from 'axios';

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
// Capture payment
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

    const paymentDetails = response.data;
    console.log('Payment captured:', orderId);

    // Here you would typically save to your database
    // For now, we'll just return the PayPal response
    res.json({
      status: 'success',
      details: paymentDetails
    });
  } catch (error) {
    console.error('Capture Payment Error:', error.response?.data || error);
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