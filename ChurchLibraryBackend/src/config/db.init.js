import db from '../models/index.js';
import { query, closePool } from './database.js';

/**
 * Initialize database connection and sync models
 * @param {boolean} force - Force sync (drop and recreate tables) - USE ONLY IN DEVELOPMENT
 * @returns {Promise<void>}
 */
const initializeDatabase = async (force = false) => {
  try {
    // Test connection using Sequelize
    await db.sequelize.authenticate();
    console.log('✅ Sequelize database connection has been established successfully.');

    // Test raw connection
    const result = await query('SELECT NOW()');
    console.log('✅ Raw database connection working. Server time:', result.rows[0].now);

    // Sync models (only in development, use migrations in production)
    if (process.env.NODE_ENV === 'development' && force) {
      console.warn('⚠️  WARNING: Force syncing database. All data will be lost!');
      await db.sequelize.sync({ force });
      console.log('✅ Database models synced.');
    } else if (process.env.NODE_ENV === 'development') {
      // In development, sync without force to add missing columns
      await db.sequelize.sync({ alter: false });
      console.log('✅ Database models checked.');
    }

    return db;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

/**
 * Close database connections gracefully
 * @returns {Promise<void>}
 */
const closeDatabase = async () => {
  try {
    await db.sequelize.close();
    await closePool();
    console.log('✅ Database connections closed.');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
    throw error;
  }
};

export {
  initializeDatabase,
  closeDatabase,
  db,
};

