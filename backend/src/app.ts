import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/config';
import logger from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import subjectRoutes from './routes/subjectRoutes';
import competencyRoutes from './routes/competencyRoutes';

/**
 * App class for Express application setup
 */
class App {
  public app: Application;

  /**
   * Initialize Express application
   */
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // CORS and body parsing
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.originalUrl}`);
      next();
    });
  }

  /**
   * Configure API routes
   */
  private configureRoutes(): void {
    // API routes
    this.app.use('/api/subjects', subjectRoutes);
    this.app.use('/api/competencies', competencyRoutes);

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date(),
        environment: config.nodeEnv,
      });
    });
  }

  /**
   * Configure error handling
   */
  private configureErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      logger.debug(`Route not found: ${req.originalUrl}`);
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }
}

// Create and export app instance
export default new App().app;
