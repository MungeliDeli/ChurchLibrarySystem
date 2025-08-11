import React from "react";
import { Provider } from "react-redux";
import store from "./src/store";
import { ThemeProvider } from "./src/hooks/useTheme";
import AppNavigator from "./src/navigation/AppNavigator";
import ErrorBoundary from "./src/components/common/ErrorBoundary";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
