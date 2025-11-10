require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Generate config.json from environment variables
const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'church_library',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: true,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_TEST || 'church_library_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  },
};

// Write config.json
const configPath = path.join(__dirname, '..', 'config', 'config.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ Generated config.json from environment variables');

