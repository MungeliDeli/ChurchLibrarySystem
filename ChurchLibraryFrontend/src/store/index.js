import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import slices
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";
import bookReducer from "./slices/bookSlice";
import categoryReducer from "./slices/categorySlice";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  ui: uiReducer,
  books: bookReducer,
  categories: categoryReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"], // Only persist auth and theme
  blacklist: ["ui", "books", "categories"], // Don't persist UI, book, or category state
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
