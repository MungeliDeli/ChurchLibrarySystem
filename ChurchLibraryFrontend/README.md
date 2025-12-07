# Church Library Admin Dashboard

A modern React-based admin dashboard for managing church library operations.

---

## ⚙️ How to Run This Project

To ensure the application runs correctly with all the latest changes, please follow these steps in order in the `ChurchLibraryFrontend` directory.

**Prerequisite:** The backend server must be running first. Please follow the instructions in `ChurchLibraryBackend/Readme.md`.

**1. Install Dependencies:** This installs all required libraries.
```bash
npm install
```

**2. Start the Development Server:**
```bash
npm run dev
```
The frontend will now be running, typically on `http://localhost:5173`.

---

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

---

## ✅ Current Status (as of recent changes)

### Implemented Features:
- **Backend Connection:** The frontend is fully connected to the backend API.
- **State Management:** Redux Toolkit is implemented for managing application state for Authentication, Books, Categories, and UI.
- **Authentication:**
    - The login page is functional and authenticates against the backend `/api/auth/login` endpoint.
    - JWT tokens are stored and automatically sent with subsequent API requests.
    - The application correctly redirects based on authentication status.
- **Library Page:**
    - A tabbed interface allows for managing both Books and Categories.
    - **Book Management:** Full CRUD (Create, Read, Update, Delete) functionality is implemented. The Create and Edit modals now support file uploads for book files, which are sent to the backend for S3 storage.
    - **Category Management:** Full CRUD functionality is implemented for categories.
- **User Feedback:**
    - A Toast notification system is in place to provide feedback for actions like failed deletions.
    - Loading states are handled, showing spinners while data is being fetched.
- **Data Integrity:**
    - The frontend now displays a user-friendly error when attempting to delete a category that is in use, based on the backend's logic.
