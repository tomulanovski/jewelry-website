import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const db = new pg.Pool(
    isProduction
    ? {
        connectionString: process.env.DB_URL,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false } // DB_SSL=false for a local DB without SSL
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    }
);

db.on('connect', () => console.log(`Connected to PostgreSQL database in ${isProduction ? 'production' : 'development'} mode`));
db.on('error', (err) => console.error('PostgreSQL pool error', err.stack));

export default db;