import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const db = new pg.Client(
    isProduction 
    ? {
        connectionString: process.env.DB_URL,
        ssl: {
            rejectUnauthorized: false
        }
    } 
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    }
);

db.connect()
    .then(() => console.log(`Connected to PostgreSQL database in ${isProduction ? 'production' : 'development'} mode`))
    .catch(err => console.error('Connection error', err.stack));

export default db;