import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from "../styles/theme";
import {
  selectThemeMode,
  toggleTheme as toggleThemeAction,
  hydrateTheme,
} from "../store/slices/themeSlice";

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  React.useEffect(() => {
    dispatch(hydrateTheme());
  }, [dispatch]);

  return (
    <ThemeContextProvider theme={theme} mode={mode}>
      <StatusBar style="light" />
      {children}
    </ThemeContextProvider>
  );
}

// Minimal internal context to provide the computed theme object
const ThemeContext = React.createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

function ThemeContextProvider({ children, theme, mode }) {
  const dispatch = useDispatch();
  const value = useMemo(
    () => ({
      theme,
      isDark: mode === "dark",
      toggleTheme: () => dispatch(toggleThemeAction()),
    }),
    [theme, mode, dispatch]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default function useTheme() {
  return React.useContext(ThemeContext);
}
