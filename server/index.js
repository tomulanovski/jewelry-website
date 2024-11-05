import express from 'express';
import cors from 'cors';
import db from './db.js';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './controllers/AuthController.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "TOPSECRET", // need to have a real secret in env
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60, // one hour session 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

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