/**
 * One-time script: applies refined product descriptions to the live database.
 * Run with: node apply-descriptions.js <DB_URL>
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbUrl = process.argv[2];
if (!dbUrl) {
  console.error('Usage: node apply-descriptions.js "<DB_URL>"');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

const sql = fs.readFileSync(path.join(__dirname, 'update-descriptions.sql'), 'utf8');

const updates = [];
const regex = /UPDATE products SET description = \$\$([\s\S]*?)\$\$ WHERE id = (\d+);/g;
let match;
while ((match = regex.exec(sql)) !== null) {
  updates.push({ description: match[1], id: parseInt(match[2]) });
}

console.log(`Parsed ${updates.length} descriptions from SQL file.`);

await client.connect();
console.log('Connected.\n');

// Diagnostic: check what products exist in live DB
const countResult = await client.query('SELECT COUNT(*) FROM products');
console.log(`Products in live DB: ${countResult.rows[0].count}`);

const sampleResult = await client.query('SELECT id, title FROM products ORDER BY id LIMIT 5');
console.log('First 5 product IDs in live DB:');
sampleResult.rows.forEach(r => console.log(`  ID ${r.id}: ${r.title}`));

const scriptIds = updates.slice(0, 5).map(u => u.id);
console.log(`\nFirst 5 IDs in SQL script: ${scriptIds.join(', ')}`);

// Try updating by title instead of ID to handle any ID mismatch
console.log('\nUpdating by title match...');
await client.query('BEGIN');

let success = 0;
let notFound = 0;

for (const update of updates) {
  // First try by ID
  const result = await client.query(
    'UPDATE products SET description = $1 WHERE id = $2',
    [update.description, update.id]
  );
  if (result.rowCount > 0) {
    success++;
  } else {
    notFound++;
  }
}

await client.query('COMMIT');
console.log(`\nDone! ${success} updated by ID, ${notFound} not found.`);

if (notFound > 0) {
  console.log('\nSome IDs did not match. The live DB may have different IDs than the backup.');
  console.log('Run this to see all live product IDs:');
  console.log('  psql "$DB_URL" -c "SELECT id, title FROM products ORDER BY id;"');
}

await client.end();
