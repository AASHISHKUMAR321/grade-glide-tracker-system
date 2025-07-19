import mysql from 'mysql2/promise';
import config from '../config/config';
import logger from '../utils/logger';
import runMigrations from './migrate';

/**
 * Initialize the database by creating it if it doesn't exist
 * and then running migrations
 */
async function initializeDatabase() {
  try {
    logger.info('Initializing database...');
    
    // Create connection without specifying database
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      multipleStatements: true,
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database};`);
    logger.info(`Database ${config.db.database} created or already exists`);
    
    // Close connection
    await connection.end();
    
    // Run migrations
    await runMigrations();
    
    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;
