import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './controllers/AuthController.js';
import cartRoutes from './controllers/CartRoutes.js';
import orderRoutes from './controllers/OrderController.js';
import shopRoutes from './controllers/ShopController.js';
import productRoutes from './controllers/ProductController.js'
import paymentRoutes from './controllers/PaymentRoutes.js'

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // the frontend port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET, // need to have a real secret in env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24H session 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/shop', shopRoutes);
app.use('/product',productRoutes);
app.use('/payment',paymentRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Hello, Jewelry Store API!');
});

// API route to get products
app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});