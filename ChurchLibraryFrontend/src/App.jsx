import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsLoading } from "./store";
import RouteGuard from "./components/auth/RouteGuard";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ThemeProvider } from "./contexts/ThemeContext";
import ToastContainer from "./components/common/ToastContainer";
import "./App.css";

// Lazy load pages for code splitting
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const LibraryPage = lazy(() => import("./pages/dashboard/LibraryPage"));
const UsersPage = lazy(() => import("./pages/dashboard/UsersPage"));
const StatisticsPage = lazy(() => import("./pages/dashboard/StatisticsPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
    <LoadingSpinner size="lg" color="gray" />
  </div>
);

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  return (
    <ThemeProvider>
      <Router>
        <ToastContainer />
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <RouteGuard requireAuth={false}>
                    <LoginPage />
                  </RouteGuard>
                }
              />

              {/* Protected routes with nested structure */}
              <Route
                path="/dashboard"
                element={
                  <RouteGuard>
                    <DashboardPage />
                  </RouteGuard>
                }
              />

              <Route
                path="/library"
                element={
                  <RouteGuard>
                    <LibraryPage />
                  </RouteGuard>
                }
              />

              <Route
                path="/users"
                element={
                  <RouteGuard>
                    <UsersPage />
                  </RouteGuard>
                }
              />

              <Route
                path="/statistics"
                element={
                  <RouteGuard>
                    <StatisticsPage />
                  </RouteGuard>
                }
              />

              <Route
                path="/settings"
                element={
                  <RouteGuard>
                    <SettingsPage />
                  </RouteGuard>
                }
              />

              {/* Redirect root to dashboard or login */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={isAuthenticated ? "/dashboard" : "/login"}
                    replace
                  />
                }
              />

              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
