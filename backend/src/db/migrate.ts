import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import config from '../config/config';
import logger from '../utils/logger';

// This script runs migrations on the database
async function runMigrations() {
  logger.info('Starting database migrations...');
  
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      multipleStatements: true,
    });

    // Initialize drizzle
    const db = drizzle(connection);

    // Run migrations
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    logger.info('Migrations completed successfully');
    
    // Close connection
    await connection.end();
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export default runMigrations;
