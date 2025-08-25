import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  // Notifications
  notifications: [],

  // Modals
  modals: {
    confirmDialog: {
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: null,
    },
    userProfile: {
      isOpen: false,
      userId: null,
    },
    addBook: {
      isOpen: false,
    },
    addUser: {
      isOpen: false,
    },
  },

  // Loading states
  loading: {
    global: false,
    auth: false,
    books: false,
    users: false,
    statistics: false,
  },

  // Sidebar state
  sidebar: {
    isOpen: true,
    isCollapsed: false,
    width: 256,
    collapsedWidth: 64,
  },

  // Header state
  header: {
    isSticky: true,
    height: 64,
    showSearch: false,
    searchQuery: "",
  },

  // Content area state
  content: {
    padding: 24,
    maxWidth: 1200,
    showBreadcrumbs: true,
  },

  // Responsive state
  responsive: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: "lg",
  },

  // Toast notifications
  toasts: [],

  // Search state
  search: {
    query: "",
    filters: {},
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    pageSize: 10,
  },
};

// UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);

      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (state, action) => {
      const { modalType, modalData } = action.payload;
      if (state.modals[modalType]) {
        state.modals[modalType] = {
          ...state.modals[modalType],
          ...modalData,
          isOpen: true,
        };
      }
    },

    closeModal: (state, action) => {
      const modalType = action.payload;
      if (state.modals[modalType]) {
        state.modals[modalType].isOpen = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modalType) => {
        state.modals[modalType].isOpen = false;
      });
    },

    // Loading states
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (key === "global") {
        state.loading.global = value;
      } else if (state.loading[key] !== undefined) {
        state.loading[key] = value;
      }
    },

    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },

    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload;
    },

    setSidebarCollapsed: (state, action) => {
      state.sidebar.isCollapsed = action.payload;
    },

    setSidebarWidth: (state, action) => {
      state.sidebar.width = action.payload;
    },

    // Header
    setHeaderSticky: (state, action) => {
      state.header.isSticky = action.payload;
    },

    setHeaderHeight: (state, action) => {
      state.header.height = action.payload;
    },

    toggleSearch: (state) => {
      state.header.showSearch = !state.header.showSearch;
      if (!state.header.showSearch) {
        state.header.searchQuery = "";
      }
    },

    setSearchQuery: (state, action) => {
      state.header.searchQuery = action.payload;
    },

    // Content
    setContentPadding: (state, action) => {
      state.content.padding = action.payload;
    },

    setContentMaxWidth: (state, action) => {
      state.content.maxWidth = action.payload;
    },

    toggleBreadcrumbs: (state) => {
      state.content.showBreadcrumbs = !state.content.showBreadcrumbs;
    },

    // Responsive
    setResponsiveState: (state, action) => {
      const { isMobile, isTablet, isDesktop, breakpoint } = action.payload;
      state.responsive.isMobile = isMobile;
      state.responsive.isTablet = isTablet;
      state.responsive.isDesktop = isDesktop;
      state.responsive.breakpoint = breakpoint;
    },

    // Toast notifications
    addToast: (state, action) => {
      const toast = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.toasts.push(toast);

      // Keep only last 5 toasts
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(-5);
      }
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    clearToasts: (state) => {
      state.toasts = [];
    },

    // Search
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },

    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
    },

    clearSearchFilters: (state) => {
      state.search.filters = {};
    },

    setSearchSort: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.search.sortBy = sortBy;
      state.search.sortOrder = sortOrder;
    },

    setSearchPagination: (state, action) => {
      const { page, pageSize } = action.payload;
      state.search.page = page;
      state.search.pageSize = pageSize;
    },

    resetSearch: (state) => {
      state.search.query = "";
      state.search.filters = {};
      state.search.sortBy = "name";
      state.search.sortOrder = "asc";
      state.search.page = 1;
      state.search.pageSize = 10;
    },

    // Reset UI state
    resetUI: (state) => {
      state.notifications = [];
      state.toasts = [];
      state.search = initialState.search;
      Object.keys(state.modals).forEach((modalType) => {
        state.modals[modalType].isOpen = false;
      });
    },
  },
});

// Export actions
export const {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  setSidebarWidth,
  setHeaderSticky,
  setHeaderHeight,
  toggleSearch,
  setSearchQuery,
  setContentPadding,
  setContentMaxWidth,
  toggleBreadcrumbs,
  setResponsiveState,
  addToast,
  removeToast,
  clearToasts,
  setSearchFilters,
  clearSearchFilters,
  setSearchSort,
  setSearchPagination,
  resetSearch,
  resetUI,
} = uiSlice.actions;

// Export selectors
export const selectUI = (state) => state.ui;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectModal = (modalType) => (state) => state.ui.modals[modalType];
export const selectLoading = (state) => state.ui.loading;
export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectHeader = (state) => state.ui.header;
export const selectContent = (state) => state.ui.content;
export const selectResponsive = (state) => state.ui.responsive;
export const selectToasts = (state) => state.ui.toasts;
export const selectSearch = (state) => state.ui.search;

// Helper selectors
export const selectIsModalOpen = (modalType) => (state) =>
  state.ui.modals[modalType]?.isOpen || false;

export const selectIsAnyModalOpen = (state) =>
  Object.values(state.ui.modals).some((modal) => modal.isOpen);

export const selectIsUILoading = (key) => (state) =>
  key === "global" ? state.ui.loading.global : state.ui.loading[key] || false;

export const selectIsAnyUILoading = (state) =>
  Object.values(state.ui.loading).some((loading) => loading);

// Export reducer
export default uiSlice.reducer;
