const express = require('express');
const { sequelize } = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    const healthData = {
      success: true,
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'connected',
        dialect: sequelize.getDialect()
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    res.status(200).json(healthData);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service Unavailable',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected'
      },
      error: error.message
    });
  }
});

module.exports = router;