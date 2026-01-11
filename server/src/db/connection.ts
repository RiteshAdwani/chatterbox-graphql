import knex from 'knex';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use DATABASE_PATH env variable in production, or default to local path
const dbPath = process.env.DATABASE_PATH || join(__dirname, '../data/db.sqlite3');

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});
