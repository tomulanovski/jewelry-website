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
import imageRoutes from './controllers/ImageController.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3001',
    'http://10.100.102.6:3001',
    'http://10.100.102.6:3001/',
    'https://catherineulanovski.com' // custom domain
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24H session
    httpOnly: true,
    secure: false,  // set to true if using HTTPS
    sameSite: 'lax'  
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
app.use('/images', imageRoutes);

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

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  // Adjust this path to match where your React build folder is located
  const buildPath = path.join(__dirname, '../client/build');
  
  app.use(express.static(buildPath));
  
  // This "catch-all" route must come AFTER all your API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});