# Church Library Backend

Backend API for the Church Library Management System using Express, PostgreSQL, and Sequelize.

---

## ⚙️ How to Run This Project (From a Clean State)

To ensure the application runs correctly with all the latest changes, please follow these steps in order in the `ChurchLibraryBackend` directory.

**1. Install Dependencies:** This installs all required libraries, including new ones like `cors`.
```bash
npm install
```

**2. Drop the Database:** This ensures you don't have any old or inconsistent data.
```bash
npm run db:drop
```

**3. Create the Database:**
```bash
npm run db:create
```

**4. Run Migrations:** This builds all the database tables with the correct structure.
```bash
npm run db:migrate
```

**5. Seed the Database:** This adds the default admin user.
```bash
npm run db:seed
```

**6. Start the Server:** This runs the backend server in development mode.
```bash
npm run dev
```
The backend will now be running, typically on `http://localhost:3001`.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root of the `ChurchLibraryBackend` directory and add the following variables.

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_library
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=a-very-secret-key-that-is-long-and-secure
JWT_EXPIRES_IN=24h

# AWS S3 Configuration for File Uploads
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
AWS_REGION=YOUR_S3_BUCKET_REGION
S3_BUCKET_NAME=YOUR_S3_BUCKET_NAME
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
- **Email:** `admin@example.com`
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

---

## ✅ Current Status (as of recent changes)

### Implemented Features:
- **Database Schema:** All required models have been created (`User`, `Category`, `LibraryItem`, `Review`, `ReadingList`, `Annotation`, `ActivityLog`, `Download`).
- **API Endpoints:**
    - `/api/auth`: User registration and login (`/register`, `/login`).
    - `/api/books`: Full CRUD (Create, Read, Update, Delete) for library items.
    - `/api/categories`: Full CRUD for categories.
- **File Uploads:**
    - Integrated `multer` and the AWS S3 SDK to handle file uploads.
    - The "Create Book" and "Update Book" endpoints now accept a `bookFile` and upload it to a configured S3 bucket.
- **Security:**
    - Administrative routes (creating/updating/deleting books and categories) are protected and require an 'admin' or 'librarian' role.
    - JWT (JSON Web Token) is used for authentication.
- **Data Integrity:**
    - Logic has been added to prevent the deletion of a category if it is currently in use by any books.
- **CORS:**
    - The server is configured to accept requests from the frontend development server.

### Default Admin User:
The database seeder (`npm run db:seed`) creates a default admin user with the following credentials:
- **Email:** `admin@example.com`
- **Password:** `password123`
You must log in with this user to access administrative features.
