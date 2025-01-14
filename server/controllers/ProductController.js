import express from 'express';
import db from '../db.js';


const router = express.Router();

// Route to fetch product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/', async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM products');
        res.json(products.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/rings', async (req, res) => {
    try {
        const rings = await db.query('SELECT * FROM products WHERE type=0');
        res.json(rings.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/neckalces', async (req, res) => {
    try {
        const neckalces = await db.query('SELECT * FROM products WHERE type=1');
        res.json(neckalces.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/earrings', async (req, res) => {
    try {
        const earrings = await db.query('SELECT * FROM products WHERE type=2');
        res.json(earrings.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});
router.get('/braclets', async (req, res) => {
    try {
        const braclets = await db.query('SELECT * FROM products WHERE type=3');
        res.json(braclets.rows);
    } catch(err) {
        console.error(err);
         res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/', async (req, res) => {
    console.log('Backend: Received POST request to /shop');
    console.log('Backend: Request body:', req.body);
    
    try {
        const { title, description, price, quantity, materials, imgs, type } = req.body;
        
        // Log the extracted values
        console.log('Backend: Extracted values:', {
            title, description, price, quantity, materials, type,
            imgsLength: imgs ? imgs.length : 0
        });
        
        // Validate images array length
        if (imgs && imgs.length > 10) {
            console.log('Backend: Error - too many images:', imgs.length);
            return res.status(400).json({ error: 'Maximum 10 images allowed' });
        }

        // Create image columns object
        const imageColumns = {};
        for (let i = 1; i <= 10; i++) {
            imageColumns[`image${i}`] = imgs[i-1] || null;
        }
        console.log('Backend: Prepared image columns:', imageColumns);

        const query = `
            INSERT INTO products (
                title, description, price, quantity, materials, type,
                image1, image2, image3, image4, image5, 
                image6, image7, image8, image9, image10
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `;

        const values = [
            title, description, price, quantity, materials, type,
            imageColumns.image1, imageColumns.image2, imageColumns.image3, 
            imageColumns.image4, imageColumns.image5, imageColumns.image6, 
            imageColumns.image7, imageColumns.image8, imageColumns.image9, 
            imageColumns.image10
        ];
        
        console.log('Backend: Executing query with values:', values);

        const newProduct = await db.query(query, values);
        console.log('Backend: Product created successfully:', newProduct.rows[0]);
        
        res.json(newProduct.rows[0]);
    } catch(err) {
        console.error('Backend: Error creating product:', err);
        res.status(500).json({ error: 'Failed to add product', details: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedProduct = await db.query(
          'DELETE FROM products WHERE id = $1 RETURNING *', 
          [id]
      );
      
      if (deletedProduct.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { title, description, price, quantity, materials, imgs, type } = req.body;

      if (imgs && imgs.length > 10) {
          return res.status(400).json({ error: 'Maximum 10 images allowed' });
      }

      // Create image columns object
      const imageColumns = {};
      for (let i = 1; i <= 10; i++) {
          imageColumns[`image${i}`] = imgs[i-1] || null;
      }

      const query = `
          UPDATE products 
          SET title = $1, 
              description = $2, 
              price = $3, 
              quantity = $4, 
              materials = $5, 
              type = $6,
              image1 = $7, 
              image2 = $8, 
              image3 = $9, 
              image4 = $10, 
              image5 = $11, 
              image6 = $12, 
              image7 = $13, 
              image8 = $14, 
              image9 = $15, 
              image10 = $16
          WHERE id = $17
          RETURNING *
      `;

      const values = [
          title, 
          description, 
          price, 
          quantity, 
          materials, 
          type,
          imageColumns.image1, 
          imageColumns.image2, 
          imageColumns.image3, 
          imageColumns.image4, 
          imageColumns.image5, 
          imageColumns.image6, 
          imageColumns.image7, 
          imageColumns.image8, 
          imageColumns.image9, 
          imageColumns.image10,
          id
      ];

      const updatedProduct = await db.query(query, values);
      
      if (updatedProduct.rows.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(updatedProduct.rows[0]);
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update product' });
  }
});
  
  export default router;

