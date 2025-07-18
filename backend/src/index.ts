import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testConnection } from './config/db';

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Grade System API' });
});

// Import routes
import studentRoutes from './routes/students';
import healthRoutes from './routes/health';

// Use routes
app.use('/api/health', healthRoutes);
app.use('/api/students', studentRoutes);
// app.use('/api/assignments', require('./routes/assignments'));
// app.use('/api/grades', require('./routes/grades'));

// Start the server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
