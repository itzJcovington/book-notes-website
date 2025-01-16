import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client, Pool } = pg;

const connectionConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false, 
          },
      }
    : {
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT || 5432,
      };

const db = new Pool(connectionConfig);

export default db;
