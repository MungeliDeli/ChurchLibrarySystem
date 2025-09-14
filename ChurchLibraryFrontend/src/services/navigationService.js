import { toast } from "react-hot-toast";

// Navigation history tracking
let navigationHistory = [];
const MAX_HISTORY_LENGTH = 50;

// Route configuration
export const ROUTES = {
  // Public routes
  LOGIN: "/login",

  // Protected routes
  DASHBOARD: "/dashboard",
  LIBRARY: "/library",
  USERS: "/users",
  STATISTICS: "/statistics",
  SETTINGS: "/settings",

  // Error routes
  NOT_FOUND: "/404",
};

// All routes accessible to all authenticated users (admin panel)

// Navigation service class
class NavigationService {
  constructor() {
    this.history = [];
    this.listeners = new Set();
    this.currentRoute = null;
  }

  // Add route to history
  addToHistory(route, title = "") {
    const historyEntry = {
      path: route,
      title,
      timestamp: Date.now(),
    };

    this.history.unshift(historyEntry);

    // Keep history within limits
    if (this.history.length > MAX_HISTORY_LENGTH) {
      this.history = this.history.slice(0, MAX_HISTORY_LENGTH);
    }

    this.currentRoute = route;
    this.notifyListeners();
  }

  // Get navigation history
  getHistory() {
    return [...this.history];
  }

  // Get current route
  getCurrentRoute() {
    return this.currentRoute;
  }

  // Check if user can access route
  canAccessRoute(route, userRole) {
    return true; // All routes accessible to authenticated users
  }

  // Navigate with validation
  navigate(route, options = {}) {
    const {
      replace = false,
      state = {},
      validateAccess = true,
      userRole = null,
      showToast = true,
    } = options;


    // Add to history if not replacing
    if (!replace) {
      this.addToHistory(route, state.title);
    }

    return true;
  }

  // Go back in history
  goBack(fallbackRoute = ROUTES.DASHBOARD) {
    const previousRoute = this.history[1]?.path || fallbackRoute;
    this.navigate(previousRoute, { replace: true });
    return previousRoute;
  }

  // Clear history
  clearHistory() {
    this.history = [];
    this.currentRoute = null;
    this.notifyListeners();
  }

  // Subscribe to navigation changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of changes
  notifyListeners() {
    this.listeners.forEach((listener) =>
      listener(this.currentRoute, this.history)
    );
  }

  // Get breadcrumb data for current route
  getBreadcrumbs(currentPath) {
    const breadcrumbs = [];
    const pathSegments = currentPath.split("/").filter(Boolean);

    let currentPathBuilder = "";
    pathSegments.forEach((segment, index) => {
      currentPathBuilder += `/${segment}`;

      const title = this.getRouteTitle(currentPathBuilder);
      if (title) {
        breadcrumbs.push({
          path: currentPathBuilder,
          title,
          isLast: index === pathSegments.length - 1,
        });
      }
    });

    return breadcrumbs;
  }

  // Get route title
  getRouteTitle(path) {
    const routeTitles = {
      [ROUTES.DASHBOARD]: "Dashboard",
      [ROUTES.LIBRARY]: "Library",
      [ROUTES.USERS]: "Users",
      [ROUTES.STATISTICS]: "Statistics",
      [ROUTES.SETTINGS]: "Settings",
    };

    return routeTitles[path] || "Unknown";
  }

  // Check if route is active
  isActiveRoute(currentPath, targetPath) {
    if (targetPath === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(targetPath);
  }

  // Get route metadata
  getRouteMetadata(path) {
    const metadata = {
      [ROUTES.DASHBOARD]: {
        title: "Dashboard",
        description: "Overview and statistics",
        icon: "📊",
        requiresAuth: true,
      },
      [ROUTES.LIBRARY]: {
        title: "Library",
        description: "Manage books and resources",
        icon: "📚",
        requiresAuth: true,
      },
      [ROUTES.USERS]: {
        title: "Users",
        description: "User management and profiles",
        icon: "👥",
        requiresAuth: true,
      },
      [ROUTES.STATISTICS]: {
        title: "Statistics",
        description: "Reports and analytics",
        icon: "📈",
        requiresAuth: true,
      },
      [ROUTES.SETTINGS]: {
        title: "Settings",
        description: "Application configuration",
        icon: "⚙️",
        requiresAuth: true,
      },
    };

    return (
      metadata[path] || {
        title: "Unknown",
        description: "",
        icon: "❓",
        requiresAuth: false,
      }
    );
  }
}

// Create singleton instance
const navigationService = new NavigationService();

export default navigationService;
