import express from 'express';
import db from '../db.js';


const router = express.Router();

// Route to fetch product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  export default router;