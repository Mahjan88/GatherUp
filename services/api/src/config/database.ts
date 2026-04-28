import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema/index.js';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let connection: ReturnType<typeof postgres> | null = null;

export function createDatabase(databaseUrl: string) {
  connection = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  db = drizzle(connection, { schema });
  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call createDatabase() first.');
  }
  return db;
}

export async function closeDatabase() {
  if (connection) {
    await connection.end();
    connection = null;
    db = null;
  }
}
