import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "app_theme_preference";

export const hydrateTheme = createAsyncThunk("theme/hydrate", async () => {
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
  } catch {}
  return "light";
});

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "light" },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_STORAGE_KEY, state.mode).catch(() => {});
    },
    setTheme(state, action) {
      state.mode = action.payload === "dark" ? "dark" : "light";
      AsyncStorage.setItem(THEME_STORAGE_KEY, state.mode).catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateTheme.fulfilled, (state, action) => {
      state.mode = action.payload === "dark" ? "dark" : "light";
    });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectThemeMode = (state) => state.theme.mode;
export default themeSlice.reducer;
