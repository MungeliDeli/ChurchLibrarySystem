# Church Library Admin Dashboard - Authentication System

## Overview

This document describes the complete authentication system implemented for the Church Library Admin Dashboard. The system provides secure user authentication, token management, and route protection using modern React patterns and Redux state management.

## 🏗️ Architecture

### Core Components

```
src/
├── components/auth/
│   ├── LoginForm.jsx          # Login form with validation
│   ├── ProtectedRoute.jsx     # Basic route protection (legacy)
│   └── RouteGuard.jsx         # Enhanced route protection
├── contexts/
│   └── AuthContext.jsx        # Authentication context provider
├── hooks/
│   └── useAuth.js             # Redux-based authentication hook
├── services/
│   ├── api.js                 # API service with interceptors
│   ├── authService.js         # Authentication service
│   └── storageService.js      # Local storage management
├── store/slices/
│   └── authSlice.js           # Redux auth state management
└── utils/
    ├── constants.js           # App constants including storage keys
    └── authTest.js            # Testing utilities
```

## 🔐 Authentication Flow

### 1. User Login

```
User Input → Validation → API Call → Token Storage → State Update → Redirect
```

### 2. Token Management

- **Access Token**: Short-lived token for API calls
- **Refresh Token**: Long-lived token for token renewal
- **Automatic Refresh**: Tokens are refreshed automatically on 401 errors

### 3. Route Protection

- **Public Routes**: Accessible without authentication
- **Protected Routes**: Require valid authentication
- **Loading States**: Show loading indicators during auth checks

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React 18+
- Redux Toolkit
- React Router v7

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

## 📱 Usage

### Basic Authentication

#### Login Component

```jsx
import { useAuth } from "../hooks/useAuth";

const LoginComponent = () => {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirect to dashboard
    }
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
};
```

#### Protected Routes

```jsx
import RouteGuard from "../components/auth/RouteGuard";

const ProtectedPage = () => (
  <RouteGuard>
    <DashboardContent />
  </RouteGuard>
);
```

#### User Profile & Logout

```jsx
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header>
      <div className="user-profile">
        <span>{user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};
```

### Advanced Features

#### Role-Based Access Control

```jsx
import { useAuth } from "../hooks/useAuth";

const AdminOnlyComponent = () => {
  const { hasRole } = useAuth();

  if (!hasRole("admin")) {
    return <AccessDenied />;
  }

  return <AdminContent />;
};
```

#### Permission-Based Access

```jsx
import { useAuth } from "../hooks/useAuth";

const BookManagement = () => {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission("books:read") && <BookList />}
      {hasPermission("books:write") && <AddBookButton />}
    </div>
  );
};
```

## 🔧 Configuration

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### API Endpoints

```javascript
// src/utils/constants.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
};
```

### Storage Keys

```javascript
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  SIDEBAR_STATE: "sidebar_state",
};
```

## 🧪 Testing

### Browser Console Testing

The authentication system includes testing utilities accessible via browser console:

```javascript
// Test basic system functionality
testAuthSystem();

// Test authentication flow
testAuthFlow();

// Clear test data
clearTestData();

// Access mock data
console.log(mockAuthData);
```

### Manual Testing Steps

1. Navigate to `/login`
2. Enter test credentials
3. Verify Redux state updates
4. Check localStorage persistence
5. Test protected route access
6. Verify logout functionality

## 🔒 Security Features

### Token Security

- JWT tokens stored securely in localStorage
- Automatic token refresh on expiration
- Secure token transmission via HTTP headers
- Token cleanup on logout

### Route Protection

- Client-side route guards
- Server-side token validation
- Automatic redirects for unauthorized access
- Session timeout management

### Data Protection

- Secure storage of sensitive information
- Automatic cleanup of expired data
- Error handling without information leakage
- CSRF protection via token validation

## 📊 State Management

### Redux Store Structure

```javascript
const authState = {
  user: null, // User information
  token: null, // Access token
  refreshToken: null, // Refresh token
  isAuthenticated: false, // Authentication status
  isLoading: false, // Loading state
  error: null, // Error messages
  lastLogin: null, // Last login timestamp
};
```

### Persistence

- Redux Persist for state persistence
- localStorage synchronization
- Automatic state restoration on app reload
- Secure token storage

## 🚨 Error Handling

### Common Error Scenarios

1. **Invalid Credentials**: User-friendly error messages
2. **Token Expiration**: Automatic refresh attempt
3. **Network Errors**: Graceful fallback handling
4. **Server Errors**: Proper error categorization

### Error Recovery

- Automatic retry mechanisms
- User notification system
- Fallback authentication flows
- Graceful degradation

## 🔄 Token Refresh

### Automatic Refresh

```javascript
// API interceptor automatically handles token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const newToken = await refreshToken();
      // Retry original request
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Manual Refresh

```javascript
import { useAuth } from "../hooks/useAuth";

const { refresh } = useAuth();

// Manually refresh tokens
const handleRefresh = async () => {
  const result = await refresh();
  if (result.success) {
    console.log("Tokens refreshed successfully");
  }
};
```

## 📱 Mobile Considerations

### Responsive Design

- Mobile-friendly login forms
- Touch-optimized interactions
- Responsive layout components
- Mobile-first design approach

### Performance

- Optimized token storage
- Efficient state management
- Minimal API calls
- Fast authentication checks

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Configuration

- Set production API endpoints
- Configure HTTPS requirements
- Set appropriate token expiration times
- Enable security headers

### Monitoring

- Authentication success/failure rates
- Token refresh frequency
- User session duration
- Error rate monitoring

## 🔍 Troubleshooting

### Common Issues

#### Token Not Persisting

- Check localStorage availability
- Verify Redux Persist configuration
- Check for storage quota issues

#### Route Protection Not Working

- Verify RouteGuard implementation
- Check authentication state
- Ensure proper Redux integration

#### API Calls Failing

- Verify token inclusion in headers
- Check API endpoint configuration
- Verify CORS settings

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem("debug", "auth:*");

// Check authentication state
console.log("Auth State:", store.getState().auth);
```

## 📚 Additional Resources

### Related Documentation

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [JWT Token Best Practices](https://jwt.io/introduction)

### Code Examples

- See `src/examples/` directory for usage examples
- Check `src/tests/` for testing patterns
- Review `src/stories/` for component stories

## 🤝 Contributing

### Development Guidelines

1. Follow existing code patterns
2. Add comprehensive error handling
3. Include proper TypeScript types
4. Write unit tests for new features
5. Update documentation

### Testing Requirements

- Unit tests for all auth functions
- Integration tests for auth flow
- E2E tests for critical paths
- Security testing for vulnerabilities

---

**Last Updated**: [Current Date]  
**Version**: 1.0.0  
**Maintainer**: Development Team
