import { Server } from 'http';
import app from './app';
import config from './config/config';
import logger from './utils/logger';
import Database from './db/connection';

/**
 * Server class for managing the application server
 */
class ServerManager {
  private server: Server | null = null;
  private db: Database;

  /**
   * Initialize server manager
   */
  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Start the server and connect to database
   */
  public async start(): Promise<void> {
    try {
      // Connect to the database
      await this.db.connect();
      logger.info('Connected to MySQL database');

      // Start the server
      this.server = app.listen(config.port, () => {
        logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      });

      this.setupErrorHandling();
    } catch (error) {
      logger.error('Error starting server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup error handling for the server
   */
  private setupErrorHandling(): void {
    // Handle unhandled rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! Shutting down...', err);
      this.shutdown(1);
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      this.shutdown(0);
    });

    // Handle SIGINT signal (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully');
      this.shutdown(0);
    });
  }

  /**
   * Gracefully shutdown the server
   */
  private shutdown(exitCode: number): void {
    if (this.server) {
      this.server.close(async () => {
        await this.db.disconnect();
        logger.info(`Process terminated with exit code ${exitCode}!`);
        process.exit(exitCode);
      });
    } else {
      process.exit(exitCode);
    }
  }
}

// Create and start server
const serverManager = new ServerManager();
serverManager.start();
