# Church Library Admin Dashboard

A modern React-based admin dashboard for managing church library operations.

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

### Tailwind Configuration

The project uses Tailwind CSS v4 with the new `@theme` directive. See `src/styles/index.css` for theme configuration.

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established component patterns
3. Ensure responsive design works on all screen sizes
4. Test authentication flows thoroughly

## 📄 License

This project is part of the Church Library Management System.
