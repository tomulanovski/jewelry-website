/**
 * One-time script: applies refined product descriptions to the live database.
 * Run with: node apply-descriptions.js <DB_URL>
 * Example:  node apply-descriptions.js "postgresql://user:pass@host/dbname?sslmode=require"
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = process.argv[2];
if (!dbUrl) {
  console.error('Usage: node apply-descriptions.js "<DB_URL>"');
  console.error('Get your DB_URL from Render dashboard → your PostgreSQL service → Connect tab → External Database URL');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const sqlFile = path.join(__dirname, 'update-descriptions.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Split into individual UPDATE statements
const statements = sql
  .split('\n')
  .filter(line => line.trim().startsWith('UPDATE'))
  .join('\n');

// Parse dollar-quoted statements
const updates = [];
const regex = /UPDATE products SET description = \$\$([\s\S]*?)\$\$ WHERE id = (\d+);/g;
let match;
while ((match = regex.exec(sql)) !== null) {
  updates.push({ description: match[1], id: parseInt(match[2]) });
}

console.log(`Found ${updates.length} descriptions to apply...`);

await client.connect();
console.log('Connected to database.');

let success = 0;
let failed = 0;

for (const update of updates) {
  try {
    const result = await client.query(
      'UPDATE products SET description = $1 WHERE id = $2',
      [update.description, update.id]
    );
    if (result.rowCount > 0) {
      success++;
    }
  } catch (err) {
    console.error(`Failed for product ID ${update.id}:`, err.message);
    failed++;
  }
}

await client.end();
console.log(`\nDone! ${success} products updated, ${failed} failed.`);
