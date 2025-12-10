# Church Library Management System

A comprehensive digital library management system designed specifically for churches, featuring a web-based admin dashboard, mobile application, and backend services. This system enables churches to add books that can be read by readers all over the world

## 🏗️ System Architecture

The Church Library System consists of three main components:

```
Church Library System/
├── ChurchLibraryBackend/     # Backend API services (In Development)
├── ChurchLibraryFrontend/    # Web Admin Dashboard
└── ChurchLibraryMobile/      # Mobile App for Members
```

### Component Overview

| Component | Technology | Purpose | Status |
|-----------|------------|---------|--------|
| **Frontend** | React 19 + Vite | Admin dashboard for library management | ✅ Active Development |
| **Mobile** | React Native + Expo | Member app for browsing and reading | ✅ Complete |
| **Backend** | TBD | API services and database | 🚧 Planned |

## 📱 Applications

### 1. Web Admin Dashboard (ChurchLibraryFrontend)

A modern React-based admin interface for library staff to manage the entire library system.

**Key Features:**
- 📚 Book catalog management
- 👥 Member management
- 🔐 Secure authentication system
- 🎨 Modern responsive UI with dark/light themes
- 📱 Mobile-responsive design

**Tech Stack:**
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Material-UI
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router v7
- **HTTP Client**: Axios

### 2. Mobile Member App (ChurchLibraryMobile)

A React Native Expo application for church members to browse the library, search books, and manage their borrowing.

**Key Features:**
- 📖 Browse library books
- 🔍 Search and filter books
- 🌙 Dark/light theme support
- 🔐 Authentication with Google Sign-In

**Tech Stack:**
- **Framework**: React Native + Expo
- **Navigation**: React Navigation v7 (Stack, Tabs, Drawer)
- **State Management**: Redux Toolkit
- **Authentication**: Expo Auth Session
- **Storage**: AsyncStorage + Secure Store
- **UI**: Styled Components + Custom Theme System

### 3. Backend Services (ChurchLibraryBackend)



**Planned Features:**
- RESTful API for all library operations
- User authentication and authorization
- Database management for books, members, and transactions
- Integration with external book databases
- Notification services
- Analytics and reporting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)

### Frontend Setup

```bash
cd ChurchLibraryFrontend
npm install
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

### Mobile App Setup

```bash
cd ChurchLibraryMobile
npm install
npm start
```

Use the Expo Go app to scan the QR code and run on your device.

## 🔐 Authentication System

Both applications feature comprehensive authentication systems:

### Web Dashboard Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (Admin)
- Protected routes with automatic redirects
- Session management with automatic token refresh
- Secure storage of authentication data

### Mobile App Authentication
- Multiple authentication methods:
  - Email/password registration and login
  - Google Sign-In integration
  - Guest mode for browsing
- Persistent authentication state
- Secure token storage using Expo SecureStore

## 🎨 Design System

### Theme Support
Both applications feature consistent theming:
- **Light Theme**: Clean, bright interface for daytime use
- **Dark Theme**: Eye-friendly dark interface for low-light conditions
- **System Theme**: Automatically follows device preferences

### Responsive Design
- **Desktop**: Full-featured admin interface (1024px+)
- **Tablet**: Optimized layout for medium screens (768px-1024px)
- **Mobile**: Touch-friendly interface for smartphones (<768px)




## 🛠️ Development

### Project Structure

```
ChurchLibraryFrontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Common UI elements
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   ├── store/              # Redux store and slices
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles and themes
└── public/                 # Static assets

ChurchLibraryMobile/
├── src/
│   ├── components/         # Reusable components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation configuration
│   ├── store/              # Redux store
│   ├── services/           # API and storage services
│   ├── hooks/              # Custom hooks
│   ├── styles/             # Theme and styling
│   └── utils/              # Utility functions
└── assets/                 # Images, fonts, and other assets
```

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
```

#### Mobile
```bash
npm start        # Start Expo development server
npm run android  # Run on Android device/emulator
npm run ios      # Run on iOS device/simulator
npm run web      # Run in web browser
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

#### Mobile
Configuration is handled through `app.json` and environment-specific settings.


## 🧪 Testing

### Frontend Testing
- Component testing with React Testing Library
- Integration testing for authentication flows
- E2E testing for critical user journeys

### Mobile Testing
- Unit testing for utility functions
- Component testing for UI elements
- Device testing on iOS and Android

## 📱 Mobile App Features

### Navigation Structure
- **Bottom Tabs**: Home, Library, Bible, Profile
- **Drawer Menu**: Additional features and settings
- **Stack Navigation**: Detailed views and forms

### Key Screens
- **Home**: Welcome screen with quick actions
- **Library**: Book browsing and search
- **Bible**: Digital Bible integration (planned)
- **Profile**: User account and settings

## 🔒 Security Features

### Data Protection
- Secure authentication with JWT tokens
- Encrypted storage of sensitive data
- HTTPS enforcement for all API calls
- Input validation and sanitization

### Access Control
- Role-based permissions system
- Protected routes and API endpoints
- Session timeout management
- Audit logging for admin actions

## 🚀 Deployment

### Frontend Deployment
The React application can be deployed to:
- Vercel, Netlify, or similar static hosting
- Traditional web servers with proper routing configuration
- Docker containers for scalable deployment

### Mobile App Deployment
- **Development**: Expo Go app for testing
- **Production**: Build standalone apps for App Store and Google Play
- **Enterprise**: Internal distribution for church staff

## 📈 Recent Updates

### 2025-11-18
- **Feature: Title-Based Filenames for S3 Uploads**
  - Book files and thumbnails uploaded to S3 are now named based on the book's title for better organization and readability.

- **Fix: Book Creation Timeout**
  - Resolved a critical bug where creating books with large PDF files would time out. The frontend API timeout has been significantly increased to 10 minutes to accommodate large file uploads and processing.

- **Fix: Mobile App Thumbnail Generation and Display**
  - Fixed an issue where thumbnails were not being generated or displayed correctly in the mobile app. The backend now correctly handles in-memory file buffers for thumbnail generation, and the mobile app's detail screen now displays the cover image.

- **Fix: Robust Book Deletion**
  - Improved the reliability of the delete functionality. The process is now more robust, ensuring that failures during S3 file deletion are properly handled to prevent orphaned files and inconsistent application state.

