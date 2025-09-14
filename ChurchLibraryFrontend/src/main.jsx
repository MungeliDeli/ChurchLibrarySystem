import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import AppInitializer from "./components/common/AppInitializer";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AppInitializer>
            <App />
          </AppInitializer>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
