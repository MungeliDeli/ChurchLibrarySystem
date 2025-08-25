import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store";
import navigationService, { ROUTES } from "../services/navigationService";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Subscribe to navigation service updates
  useEffect(() => {
    const unsubscribe = navigationService.subscribe((route, history) => {
      setCurrentRoute(route);
      setNavigationHistory(history);
    });

    return unsubscribe;
  }, []);

  // Update navigation service when location changes
  useEffect(() => {
    navigationService.addToHistory(location.pathname);
  }, [location.pathname]);

  // Navigate to route with validation
  const navigateTo = useCallback(
    (route, options = {}) => {
      const {
        replace = false,
        state = {},
        validateAccess = true,
        showToast = true,
      } = options;

      const canNavigate = navigationService.navigate(route, {
        replace,
        state,
        validateAccess,
        userRole: user?.role,
        showToast,
      });

      if (canNavigate) {
        navigate(route, { replace, state });
      }

      return canNavigate;
    },
    [navigate, user?.role]
  );

  // Navigate to specific routes
  const goToDashboard = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.DASHBOARD, options);
    },
    [navigateTo]
  );

  const goToLibrary = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.LIBRARY, options);
    },
    [navigateTo]
  );

  const goToUsers = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.USERS, options);
    },
    [navigateTo]
  );

  const goToStatistics = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.STATISTICS, options);
    },
    [navigateTo]
  );

  const goToSettings = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.SETTINGS, options);
    },
    [navigateTo]
  );

  const goToLogin = useCallback(
    (options = {}) => {
      return navigateTo(ROUTES.LOGIN, options);
    },
    [navigateTo]
  );

  // Go back in history
  const goBack = useCallback(
    (fallbackRoute = ROUTES.DASHBOARD) => {
      const previousRoute = navigationService.goBack(fallbackRoute);
      navigate(previousRoute, { replace: true });
      return previousRoute;
    },
    [navigate]
  );

  // Check if user can access route
  const canAccessRoute = useCallback(
    (route) => {
      return navigationService.canAccessRoute(route, user?.role);
    },
    [user?.role]
  );

  // Get breadcrumbs for current route
  const getBreadcrumbs = useCallback(() => {
    return navigationService.getBreadcrumbs(currentRoute);
  }, [currentRoute]);

  // Get route metadata
  const getRouteMetadata = useCallback(
    (path = currentRoute) => {
      return navigationService.getRouteMetadata(path);
    },
    [currentRoute]
  );

  // Check if route is active
  const isActiveRoute = useCallback(
    (targetPath) => {
      return navigationService.isActiveRoute(currentRoute, targetPath);
    },
    [currentRoute]
  );

  // Get navigation history
  const getHistory = useCallback(() => {
    return navigationHistory;
  }, [navigationHistory]);

  // Clear navigation history
  const clearHistory = useCallback(() => {
    navigationService.clearHistory();
  }, []);

  return {
    // Current state
    currentRoute,
    navigationHistory,

    // Navigation methods
    navigateTo,
    goToDashboard,
    goToLibrary,
    goToUsers,
    goToStatistics,
    goToSettings,
    goToLogin,
    goBack,

    // Utility methods
    canAccessRoute,
    getBreadcrumbs,
    getRouteMetadata,
    isActiveRoute,
    getHistory,
    clearHistory,

    // Direct access to service
    navigationService,
  };
};
