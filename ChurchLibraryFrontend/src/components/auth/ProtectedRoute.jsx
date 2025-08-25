import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  isAuthenticated,
  redirectTo = "/login",
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the current location for redirecting back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
