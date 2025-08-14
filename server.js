const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const stateRoutes = require('./routes/stateRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const nocRoutes = require('./routes/nocRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/noc', nocRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CRUD API is running with auto-restart',
    timestamp: new Date().toISOString(),
    mode: 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CRUD API with User Management, States & Trades',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      states: '/api/states',
      trades: '/api/trades',
      auth: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login'
      },
      states_endpoints: {
        getAllStates: 'GET /api/states',
        getStateById: 'GET /api/states/:id',
        createState: 'POST /api/states (auth required)',
        updateState: 'PUT /api/states/:id (auth required)',
        deleteState: 'DELETE /api/states/:id (auth required)',
        searchStates: 'GET /api/states/search?q=term',
        getStats: 'GET /api/states/stats'
      },
      trades_endpoints: {
        getAllTrades: 'GET /api/trades',
        getTradeById: 'GET /api/trades/:id',
        createTrade: 'POST /api/trades (auth required)',
        updateTrade: 'PUT /api/trades/:id (auth required)',
        deleteTrade: 'DELETE /api/trades/:id (auth required)',
        searchTrades: 'GET /api/trades/search?q=term',
        getFeatured: 'GET /api/trades/featured',
        getStats: 'GET /api/trades/stats'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
