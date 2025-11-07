# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Church Library Backend.

## Prerequisites

- PostgreSQL installed and running
- Node.js 18+ installed
- All npm dependencies installed (`npm install`)

## Environment Variables

Create a `.env` file in the root of `ChurchLibraryBackend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_library
DB_USER=postgres
DB_PASSWORD=your_password_here

# Database Connection Pool Settings
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# SSL Configuration (set to 'true' for production with SSL)
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Database Setup Steps

### 1. Create the Database

First, create the PostgreSQL database:

```bash
# Option 1: Using psql command line
createdb church_library

# Option 2: Using sequelize-cli (recommended)
npm run db:create
```

### 2. Run Migrations

Run the migrations to create the database tables:

```bash
npm run db:migrate
```

This will create the `users` table with the following structure:
- `id` - Primary key (auto-increment)
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `role` - Enum: 'admin', 'librarian', 'member'
- `isActive` - Boolean flag for account status
- `lastLogin` - Timestamp of last login
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update

### 3. Seed Demo User (Optional)

To add the demo user that matches the frontend credentials:

```bash
npm run db:seed
```

This will create a user with:
- **Email:** `admin@church.local`
- **Password:** `password123`
- **Role:** `admin`

### 4. Verify Setup

Check migration status:

```bash
npm run db:migrate:status
```

## Available Database Commands

```bash
# Create database
npm run db:create

# Drop database
npm run db:drop

# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Check migration status
npm run db:migrate:status

# Run seeders
npm run db:seed

# Undo seeders
npm run db:seed:undo
```

## Database Connection

The database connection is configured in two ways:

### 1. Raw PostgreSQL Pool (for direct queries)
Located in `src/config/database.js`:
- Provides connection pooling using `pg` library
- Use for raw SQL queries or when you need transaction control
- Exports: `pool`, `query()`, `getClient()`, `closePool()`

### 2. Sequelize ORM (for models and migrations)
Located in `src/models/index.js`:
- Uses Sequelize ORM for model definitions
- Handles migrations and associations
- Use for model-based queries

## Using the Database

### Using Sequelize Models

```javascript
const { User } = require('./models');

// Find user by email
const user = await User.findByEmail('admin@church.local');

// Create new user
const newUser = await User.create({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
  role: 'member',
});

// Compare password
const isValid = await user.comparePassword('password123');
```

### Using Raw Pool Connection

```javascript
const { query, pool } = require('./config/database');

// Execute query
const result = await query('SELECT * FROM users WHERE email = $1', ['admin@church.local']);

// Using transactions
const client = await getClient();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users ...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running
- Check that `DB_HOST` and `DB_PORT` are correct
- Verify database credentials in `.env`

### Migration Errors
- Ensure database exists before running migrations
- Check that all previous migrations completed successfully
- Use `npm run db:migrate:status` to check current state

### Authentication Errors
- Verify PostgreSQL user has proper permissions
- Check that database user can create tables and indexes

## Production Considerations

1. **Change Default Passwords**: Update all default passwords and secrets
2. **Enable SSL**: Set `DB_SSL=true` for production databases
3. **Connection Pooling**: Adjust pool settings based on expected load
4. **Backup Strategy**: Implement regular database backups
5. **Environment Variables**: Never commit `.env` file to version control

