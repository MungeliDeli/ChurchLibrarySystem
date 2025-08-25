import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import slices
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  ui: uiReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"], // Only persist auth and theme, not UI state
  blacklist: ["ui"], // Don't persist UI state like modals, loading states
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Export all slice actions and selectors for easier imports
export * from "./slices/authSlice";
export * from "./slices/themeSlice";
export * from "./slices/uiSlice";
export * from "./hooks";
