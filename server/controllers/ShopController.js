import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM products WHERE quantity > 0');
        res.json(products.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/rings', async (req, res) => {
    try {
        const rings = await db.query('SELECT * FROM products WHERE type=0 AND quantity > 0');
        res.json(rings.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/neckalces', async (req, res) => {
    try {
        const neckalces = await db.query('SELECT * FROM products WHERE type=1 AND quantity > 0');
        res.json(neckalces.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/earrings', async (req, res) => {
    try {
        const earrings = await db.query('SELECT * FROM products WHERE type=2 AND quantity > 0');
        res.json(earrings.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/braclets', async (req, res) => {
    try {
        const braclets = await db.query('SELECT * FROM products WHERE type=3 AND quantity > 0');
        res.json(braclets.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
export default router;

