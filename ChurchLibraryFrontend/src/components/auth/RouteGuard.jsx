import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectUser,
  refreshUser,
  logoutUser,
} from "../../store";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-hot-toast";

const RouteGuard = ({
  children,
  requireAuth = true,
  requiredRoles = [],
  redirectTo = "/login",
  fallback = null,
  onUnauthorized = null,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  // Check if we need to refresh the user data
  useEffect(() => {
    const checkAuthentication = async () => {
      if (requireAuth && token && !isAuthenticated) {
        setIsCheckingAuth(true);
        try {
          // We have a token but not authenticated, try to refresh
          await dispatch(refreshUser()).unwrap();
        } catch (error) {
          console.error("Authentication refresh failed:", error);
          // Token is invalid, logout user
          dispatch(logoutUser());
          toast.error("Session expired. Please login again.");
        } finally {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuthentication();
  }, [requireAuth, token, isAuthenticated, dispatch]);

  // Check role-based access
  const hasRequiredRole = () => {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  };

  // Show loading spinner while checking authentication
  if (isLoading || isCheckingAuth) {
    return fallback || <LoadingSpinner />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Call custom unauthorized handler if provided
    if (onUnauthorized) {
      onUnauthorized(location);
    }

    // Redirect to login with the current location for redirecting back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authentication is not required but user is authenticated, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access control
  if (requireAuth && !hasRequiredRole()) {
    toast.error("You don't have permission to access this page.");
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected content
  return children;
};

export default RouteGuard;
