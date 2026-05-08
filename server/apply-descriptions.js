/**
 * One-time script: applies refined product descriptions to the live database.
 * Matches products by title (case-insensitive) since IDs differ between backup and live DB.
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

// --- Step 1: Parse backup.sql to get id → title mapping ---
const backupSql = fs.readFileSync(path.join(__dirname, '..', 'backup.sql'), 'utf8');
const backupIdToTitle = new Map();

const copyBlockMatch = backupSql.match(/COPY public\.products[^;]+FROM stdin;\n([\s\S]*?)\\\./);
if (copyBlockMatch) {
  const rows = copyBlockMatch[1].trim().split('\n');
  for (const row of rows) {
    const cols = row.split('\t');
    if (cols.length >= 3) {
      const id = parseInt(cols[0]);
      const title = cols[1].trim();
      if (!isNaN(id) && title) backupIdToTitle.set(id, title);
    }
  }
}
console.log(`Loaded ${backupIdToTitle.size} titles from backup.sql`);

// --- Step 2: Parse update-descriptions.sql to get id → refined description ---
const updateSql = fs.readFileSync(path.join(__dirname, 'update-descriptions.sql'), 'utf8');
const idToRefinedDesc = new Map();
const regex = /UPDATE products SET description = \$\$([\s\S]*?)\$\$ WHERE id = (\d+);/g;
let match;
while ((match = regex.exec(updateSql)) !== null) {
  idToRefinedDesc.set(parseInt(match[2]), match[1]);
}
console.log(`Parsed ${idToRefinedDesc.size} refined descriptions`);

// --- Step 3: Build title (normalized) → refined description ---
const normalize = t => t.toLowerCase().replace(/[-\s]+/g, ' ').trim();
const titleToDesc = new Map();
for (const [id, title] of backupIdToTitle) {
  const desc = idToRefinedDesc.get(id);
  if (desc) titleToDesc.set(normalize(title), desc);
}
console.log(`Built ${titleToDesc.size} title→description pairs\n`);

// --- Step 4: Connect and update live products by title ---
const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

await client.connect();
console.log('Connected to database.');

const liveProducts = await client.query('SELECT id, title FROM products ORDER BY id');
console.log(`Found ${liveProducts.rows.length} products in live DB\n`);

await client.query('BEGIN');

let updated = 0;
let notMatched = [];

for (const product of liveProducts.rows) {
  const key = normalize(product.title);
  let desc = titleToDesc.get(key);

  // Fallback: partial match (live title contains backup title or vice versa)
  if (!desc) {
    for (const [backupTitle, backupDesc] of titleToDesc) {
      if (key.includes(backupTitle) || backupTitle.includes(key)) {
        desc = backupDesc;
        break;
      }
    }
  }

  if (desc) {
    await client.query('UPDATE products SET description = $1 WHERE id = $2', [desc, product.id]);
    updated++;
  } else {
    notMatched.push(`ID ${product.id}: "${product.title}"`);
  }
}

await client.query('COMMIT');
console.log(`Done! ${updated} products updated.`);

if (notMatched.length > 0) {
  console.log(`\n${notMatched.length} products had no matching description (new products not in backup):`);
  notMatched.forEach(p => console.log(`  ${p}`));
}

await client.end();
