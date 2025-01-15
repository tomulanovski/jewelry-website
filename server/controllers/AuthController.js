import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation
const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
            all_lowercase: true,
            gmail_convert_googlemaildotcom: false,
        })
        .withMessage('Must be a valid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Za-z])(?=.*\d).*$/)
        .withMessage('Password must contain at least one letter and one number')
];

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not authenticated' });
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const result = await db.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
        if (result.rows[0].is_admin) {
            return next();
        }
        res.status(403).json({ error: 'Not authorized' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Register a new user
router.post('/register', validateRegistration, async (req, res) => {
    console.log('Received registration request with body:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    console.log('Extracted data:', { username, email, password: '***' });

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rows.length > 0) {
            console.log('Email already exists:', email);
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        const result = await db.query(
            'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin',
            [username, email, hashedPassword, false]
        );

        console.log('User registered successfully:', result.rows[0]);
        return res.status(201).json({ 
            message: 'Registration successful',
            user: result.rows[0] 
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: 'Registration failed' });
    }
});

// Login configuration
passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query('SELECT id, username, email, is_admin FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

// Login endpoint
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.is_admin
                }
            });
        });
    })(req, res, next);
});

router.get('/me', isAuthenticated, (req, res) => {
    try {
        res.json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            isAdmin: req.user.is_admin
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Admin-only routes
router.get('/admin/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email, is_admin FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;