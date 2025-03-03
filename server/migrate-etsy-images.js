import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import db from './db.js'; // Uses your existing db configuration
import { uploadToS3 } from './utils/s3.js';
import dotenv from 'dotenv';

dotenv.config();

// Set to true to run against production DB
const TARGET_PRODUCTION = true;

// Force production mode if specified
if (TARGET_PRODUCTION && process.env.NODE_ENV !== 'production') {
  console.log('⚠️ Forcing production mode for database connection');
  process.env.NODE_ENV = 'production';
}

// Configuration
const IMAGE_DOWNLOAD_FOLDER = path.resolve('./temp_images');
const BATCH_SIZE = 5; // Smaller batch for production to reduce load
const LOG_FILE = path.resolve('./migration_log.txt');
const ETSY_URL_PATTERNS = [
  'img.etsystatic.com',
  'i.etsystatic.com',
  'etsy.com',
  'listing-photos.etsystatic.com'
];

// Ensure temp directory exists
if (!fs.existsSync(IMAGE_DOWNLOAD_FOLDER)) {
  fs.mkdirSync(IMAGE_DOWNLOAD_FOLDER, { recursive: true });
}

// Setup logging
const log = (message, includeConsole = true) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logMessage);
  if (includeConsole) {
    console.log(message);
  }
};

// Initialize log file
fs.writeFileSync(LOG_FILE, `--- Etsy to S3 Migration Log - Started ${new Date().toISOString()} ---\n`);
log(`Running against ${process.env.NODE_ENV} database`);

// Helper function to check if URL is from Etsy
function isEtsyUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return ETSY_URL_PATTERNS.some(pattern => url.includes(pattern));
}

// Download image from URL with retry logic
async function downloadImage(url, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      log(`Downloading: ${url}`, false);
      const response = await fetch(url, {
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      return await response.buffer();
    } catch (error) {
      retries++;
      log(`Download attempt ${retries}/${maxRetries} failed: ${error.message}`, false);
      
      if (retries >= maxRetries) {
        throw new Error(`Failed to download after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
}

// Process an image - download from Etsy and upload to S3
async function processImage(url, productId, imageField) {
  try {
    // Download the image from Etsy
    const imageBuffer = await downloadImage(url);
    
    // Determine file extension from URL or default to jpg
    const urlObj = new URL(url);
    const ext = path.extname(urlObj.pathname) || '.jpg';
    
    // Generate S3 key - include environment to keep prod/dev separate
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const s3Key = `${env}/product_${productId}_${Date.now()}_${imageField}${ext}`;
    
    // Upload to S3
    const s3Url = await uploadToS3(imageBuffer, s3Key);
    log(`Uploaded to S3: ${s3Url}`);
    
    return s3Url;
  } catch (error) {
    log(`Failed to process image ${url}: ${error.message}`);
    return null;
  }
}

// Main migration function
async function migrateEtsyImages() {
  log('Starting migration of Etsy images to Amazon S3...');
  
  // Stats tracking
  const stats = {
    totalProducts: 0,
    productsWithEtsyImages: 0,
    totalImages: 0,
    migratedImages: 0,
    failedImages: 0,
    startTime: Date.now()
  };
  
  try {
    // Test database connection
    const testResult = await db.query('SELECT NOW()');
    log(`Database connection successful, server time: ${testResult.rows[0].now}`);
    
    // Count total products
    const countResult = await db.query('SELECT COUNT(*) FROM products');
    stats.totalProducts = parseInt(countResult.rows[0].count);
    log(`Total products in database: ${stats.totalProducts}`);
    
    // Get all products with Etsy images
    const result = await db.query(`
      SELECT id, title, image1, image2, image3, image4, image5, 
             image6, image7, image8, image9, image10 
      FROM products 
      WHERE 
        image1 LIKE '%etsy%' OR image2 LIKE '%etsy%' OR
        image3 LIKE '%etsy%' OR image4 LIKE '%etsy%' OR
        image5 LIKE '%etsy%' OR image6 LIKE '%etsy%' OR
        image7 LIKE '%etsy%' OR image8 LIKE '%etsy%' OR
        image9 LIKE '%etsy%' OR image10 LIKE '%etsy%'
    `);
    
    const productsWithEtsyImages = result.rows;
    stats.productsWithEtsyImages = productsWithEtsyImages.length;
    
    log(`Found ${productsWithEtsyImages.length} products with Etsy images (${Math.round(productsWithEtsyImages.length / stats.totalProducts * 100)}% of total)`);
    
    // Confirmation for production
    if (process.env.NODE_ENV === 'production') {
      log('🚨 RUNNING IN PRODUCTION MODE 🚨');
      log('Press Ctrl+C in the next 10 seconds to abort...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      log('Proceeding with production migration...');
    }
    
    // Process products in batches
    for (let i = 0; i < productsWithEtsyImages.length; i += BATCH_SIZE) {
      const batch = productsWithEtsyImages.slice(i, i + BATCH_SIZE);
      log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(productsWithEtsyImages.length / BATCH_SIZE)} (${batch.length} products)`);
      
      // Process each product in the batch sequentially
      for (const product of batch) {
        log(`\nProduct ${product.id}: ${product.title}`);
        
        const updates = [];
        const values = [product.id];
        let valueIndex = 2;
        
        // Check each image field
        for (let imgIdx = 1; imgIdx <= 10; imgIdx++) {
          const imageField = `image${imgIdx}`;
          const imageUrl = product[imageField];
          
          if (isEtsyUrl(imageUrl)) {
            stats.totalImages++;
            log(`Processing ${imageField}: ${imageUrl}`);
            
            try {
              const s3Url = await processImage(imageUrl, product.id, imgIdx);
              
              if (s3Url) {
                updates.push(`${imageField} = $${valueIndex}`);
                values.push(s3Url);
                valueIndex++;
                stats.migratedImages++;
                log(`Migrated ${imageField} to ${s3Url}`);
              } else {
                stats.failedImages++;
                log(`Failed to migrate ${imageField}`);
              }
            } catch (error) {
              stats.failedImages++;
              log(`Error processing ${imageField}: ${error.message}`);
            }
          }
        }
        
        // Update product in database if there are changes
        if (updates.length > 0) {
          const updateQuery = `
            UPDATE products
            SET ${updates.join(', ')}
            WHERE id = $1
          `;
          
          try {
            await db.query(updateQuery, values);
            log(`Updated product ${product.id} with ${updates.length} new S3 image URLs`);
          } catch (error) {
            log(`Database update failed for product ${product.id}: ${error.message}`);
          }
        } else {
          log(`No Etsy images to update for product ${product.id}`);
        }
      }
      
      log(`Completed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
      
      // Sleep between batches to reduce server load
      if (i + BATCH_SIZE < productsWithEtsyImages.length) {
        log('Pausing for 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Print summary
    const duration = Math.floor((Date.now() - stats.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    log('\n=== Migration Summary ===');
    log(`Environment: ${process.env.NODE_ENV}`);
    log(`Total products in database: ${stats.totalProducts}`);
    log(`Products with Etsy images: ${stats.productsWithEtsyImages} (${Math.round(stats.productsWithEtsyImages / stats.totalProducts * 100)}%)`);
    log(`Total Etsy images found: ${stats.totalImages}`);
    log(`Successfully migrated: ${stats.migratedImages} (${Math.round(stats.migratedImages / stats.totalImages * 100)}%)`);
    log(`Failed migrations: ${stats.failedImages} (${Math.round(stats.failedImages / stats.totalImages * 100)}%)`);
    log(`Time taken: ${minutes}m ${seconds}s`);
    
    // Check if any images still need migration
    if (stats.migratedImages < stats.totalImages) {
      log('\n⚠️ Some images could not be migrated. Re-run the script to attempt them again.');
    } else {
      log('\n✅ All images have been successfully migrated!');
    }
    
  } catch (error) {
    log(`Migration failed with error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
  } finally {
    // Clean up temp directory
    try {
      fs.rmdirSync(IMAGE_DOWNLOAD_FOLDER, { recursive: true });
      log('Temporary files cleaned up');
    } catch (error) {
      log(`Error cleaning up temp directory: ${error.message}`);
    }
    
    // Close database connection
    try {
      await db.end();
      log('Database connection closed');
    } catch (error) {
      log(`Error closing database connection: ${error.message}`);
    }
    
    log(`--- Migration completed at ${new Date().toISOString()} ---`);
  }
}

// Run the migration
migrateEtsyImages().catch(err => {
  log(`Unhandled error in migration process: ${err.message}`);
  log(`Stack trace: ${err.stack}`);
  process.exit(1);
});