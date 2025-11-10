# Church Library Backend

Backend API for the Church Library Management System using Express, PostgreSQL, and Sequelize.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_library
DB_USER=postgres
DB_PASSWORD=your_password_here

DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### 3. Create Database

```bash
npm run db:create
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Demo User (Optional)

```bash
npm run db:seed
```

This creates a demo admin user:
- **Email:** `admin@church.local`
- **Password:** `password123`

### 5. Start Server

```bash
npm run dev
```

## 📁 Project Structure

```
ChurchLibraryBackend/
├── config/
│   ├── config.json      # Sequelize config (fallback)
│   └── config.js        # Sequelize config with env vars
├── migrations/          # Database migrations
├── models/              # Sequelize models
│   ├── index.js         # Models index
│   └── user.js          # User model
├── seeders/             # Database seeders
├── src/
│   └── config/
│       ├── database.js  # PostgreSQL connection pool
│       └── db.init.js  # Database initialization
└── .sequelizerc         # Sequelize CLI config
```

## 🗄️ Database Commands

```bash
# Create database
npm run db:create

# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Check migration status
npm run db:migrate:status

# Run seeders
npm run db:seed

# Undo seeders
npm run db:seed:undo
```

## 🔧 Configuration

### Database Connection

The project uses two connection methods:

1. **Sequelize ORM** - For models and migrations (configured in `config/config.js`)
2. **Raw PostgreSQL Pool** - For direct queries (configured in `src/config/database.js`)

Both use environment variables from `.env` file.

### Using the Database

#### With Sequelize Models

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

#### With Raw Pool

```javascript
const { query } = require('./src/config/database');

// Execute query
const result = await query('SELECT * FROM users WHERE email = $1', ['admin@church.local']);
```

## 📝 Notes

- All code uses **CommonJS** (require/module.exports)
- Database configuration supports both `config.json` and `config.js` (with env vars)
- Password hashing is handled automatically via model hooks
- User passwords are never returned in JSON responses

