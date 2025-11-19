require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

console.log('Password from env:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD?.length > 0 ? 'exists' : 'missing');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log,
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect:', err));

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// API Routes
const authRoutes = require('./src/routes/auth.routes');
const libraryRoutes = require('./src/routes/library.routes');
app.use('/api/auth', authRoutes);
app.use('/api/books', libraryRoutes);

const categoryRoutes = require('./src/routes/category.routes');
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

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await testDbConnection();
});

module.exports = app;