import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_STATES = {
  LOADING: "loading",
  UNAUTHENTICATED: "unauthenticated",
  AUTHENTICATED: "authenticated",
  GUEST: "guest",
};

const AUTH_STORAGE_KEY = "auth_state";

export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch {}
  return { status: AUTH_STATES.UNAUTHENTICATED, user: null };
});

async function persist(state) {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const authSlice = createSlice({
  name: "auth",
  initialState: { status: AUTH_STATES.LOADING, user: null },
  reducers: {
    setGuest(state) {
      state.status = AUTH_STATES.GUEST;
      state.user = { id: "guest", name: "Guest" };
      persist(state);
    },
    setAuthenticated(state, action) {
      state.status = AUTH_STATES.AUTHENTICATED;
      state.user = action.payload || {};
      persist(state);
    },
    setUnauthenticated(state) {
      state.status = AUTH_STATES.UNAUTHENTICATED;
      state.user = null;
      persist(state);
    },
    logout(state) {
      state.status = AUTH_STATES.UNAUTHENTICATED;
      state.user = null;
      persist(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      state.status = action.payload.status || AUTH_STATES.UNAUTHENTICATED;
      state.user = action.payload.user || null;
    });
  },
});


export const { setGuest, setAuthenticated, setUnauthenticated, logout } =
  authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
