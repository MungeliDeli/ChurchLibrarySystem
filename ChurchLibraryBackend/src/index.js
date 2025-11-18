require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('../models');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// API Routes
const authRoutes = require('./routes/auth.routes');
const libraryRoutes = require('./routes/library.routes');
app.use('/api/auth', authRoutes);
app.use('/api/books', libraryRoutes);

const categoryRoutes = require('./routes/category.routes');
app.use('/api/categories', categoryRoutes);

// Test Database Connection
const testDbConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// A simple root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Church Library Backend API!' });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await testDbConnection();
});

server.setTimeout(120000);

module.exports = app;
