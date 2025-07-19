import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import config from '../config/config';
import logger from '../utils/logger';

class Database {
  private static instance: Database;
  private connection: any;
  private db: any;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      logger.info('Connecting to MySQL database...');
      this.connection = await mysql.createConnection({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
      });
      
      this.db = drizzle(this.connection);
      logger.info('Connected to MySQL database successfully');
    } catch (error) {
      logger.error('Failed to connect to MySQL database:', error);
      throw error;
    }
  }

  public getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.end();
        logger.info('Disconnected from MySQL database');
      }
    } catch (error) {
      logger.error('Error disconnecting from MySQL database:', error);
      throw error;
    }
  }
}

export default Database;
