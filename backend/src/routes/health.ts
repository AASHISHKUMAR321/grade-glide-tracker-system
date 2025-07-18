import express from 'express';
import { testConnection } from '../config/db';

const router = express.Router();

// GET health status
router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      service: 'Grade System API'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
      service: 'Grade System API',
      error: 'Failed to check database connection'
    });
  }
});

export default router;
