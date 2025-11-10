require('dotenv').config();

// Generate config.json from environment variables first
require('./generate-config');

const { execSync } = require('child_process');

// Get all arguments passed to this script
const args = process.argv.slice(2).join(' ');

// Run sequelize-cli with the arguments
try {
  execSync(`npx sequelize-cli ${args}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  process.exit(error.status || 1);
}

