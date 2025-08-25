# Church Library Admin Dashboard

A modern React-based admin dashboard for managing church library operations.

## 🚀 Current Status

**Phase 4 Completed**: Redux store configuration with state management has been implemented.

### What's Working

- ✅ Project setup with React + Vite
- ✅ Tailwind CSS v4 configuration
- ✅ Complete component architecture
- ✅ Basic routing structure
- ✅ Authentication components (login form, protected routes)
- ✅ Dashboard layout with sidebar navigation
- ✅ Common UI components (Button, Card, LoadingSpinner, ConfirmDialog)
- ✅ Dashboard components (StatsCard, RecentActivity, QuickActions)
- ✅ Placeholder pages for all major sections
- ✅ Utility functions and constants
- ✅ Basic services (API, Storage)
- ✅ Redux store with Redux Toolkit
- ✅ Authentication slice with async thunks
- ✅ Theme slice with system theme detection
- ✅ UI slice for notifications and modals
- ✅ Redux Persist for state persistence
- ✅ Custom hooks (useAuth, useTheme)

### What's Next

- ✅ Redux store configuration (Phase 4)
- 🔄 Authentication system implementation (Phase 5)
- 🔄 Layout components refinement (Phase 6)
- 🔄 Dashboard pages enhancement (Phase 7)

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **State Management**: Redux Toolkit (planned)
- **UI Components**: Material-UI + Custom components

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── auth/            # Authentication components
│   └── dashboard/       # Dashboard-specific components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   └── NotFoundPage.jsx # 404 page
├── hooks/               # Custom React hooks
├── services/            # API and storage services
├── utils/               # Utility functions and constants
└── styles/              # Global styles and theme
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:

   ```bash
   cd ChurchLibraryFrontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🔐 Authentication

Currently, the authentication system is set up with placeholder logic. You can:

- Navigate to `/login` to see the login form
- Use any email/password combination (validation is in place)
- The system will redirect to `/dashboard` after "login"

## 🎨 Theme System

The application includes a theme system that supports:

- Light theme (default)
- Dark theme
- System theme preference

## 📱 Responsive Design

The dashboard is designed to be responsive across:

- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration is included
- Prettier formatting is recommended
- Follow React best practices

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with the new `@theme` directive. See `src/styles/index.css` for theme configuration.

## 📚 Next Steps

1. ✅ **Phase 4**: Redux store with authentication and theme slices implemented
2. **Phase 5**: Connect authentication to backend API
3. **Phase 6**: Enhance layout components and add responsive behavior
4. **Phase 7**: Implement actual dashboard functionality

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established component patterns
3. Ensure responsive design works on all screen sizes
4. Test authentication flows thoroughly

## 📄 License

This project is part of the Church Library Management System.

---

**Last Updated**: Phase 4 completed - Redux store configuration implemented
