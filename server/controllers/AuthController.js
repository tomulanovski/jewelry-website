import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rows.length > 0) {
            return res.status(400).send("Email already exists. Try logging in."); // 400 Bad Request
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS)); // Ensure SALT_ROUNDS is parsed to an integer

        // Insert the new user into the database
        const result = await db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        // Respond with the newly created user or a success message. need to redirect once i have pages
        return res.status(201).json({ user: result.rows[0] }); // 201 Created

    } catch (err) {
        console.error("User registration error:", err); // Log the error for debugging
        return res.status(500).json({ error: 'User registration failed' }); // 500 Internal Server Error
    }
});

// Login a user with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect here upon success - need to have dashboard page
    failureRedirect: '/login', // Redirect here upon failure 
}));


passport.use(new Strategy(async function verify(email,password,cb){
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                return cb(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return cb(null, user);
            } else {
                return cb(null, false, { message: 'Incorrect password.' });
            }
        } catch (error) {
            return cb(error);
        }
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

// Deserialize user to retrieve user details from ID
passport.deserializeUser(async (id, cb) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        cb(null, result.rows[0]);
    } catch (error) {
        cb(error);
    }
});

// Logout a user
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/'); // Redirect after logout
    });
});

export default router;