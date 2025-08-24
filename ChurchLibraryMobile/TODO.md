# Church Library App — Project TODOs

- [x] Phase 0 — Prep

  - [x] Verify Expo CLI and Node versions
  - [x] Run the app once to ensure baseline compiles

- [x] Phase 1 — Install Dependencies

  - [x] Install navigation, state, auth, UI, storage, utilities
  - [x] Configure native dependencies (reanimated, gesture-handler)
  - [x] Commands to run:
    - [x] `npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @reduxjs/toolkit react-redux expo-auth-session expo-crypto @expo/vector-icons react-native-svg styled-components react-native-super-grid @react-native-async-storage/async-storage expo-secure-store expo-constants expo-status-bar`
    - [x] `npm i react-native-vector-icons react-native-uuid @react-native-google-signin/google-signin`

- [x] Phase 2 — Configuration Files

  - [x] Create/update `babel.config.js` (add `react-native-reanimated/plugin` last)
  - [x] Create `metro.config.js` for SVG support
  - [x] Update `app.json` per spec (icons, splash, plugins, ios/android ids)
  - [x] Ensure `index.js` imports `react-native-gesture-handler` first if needed

- [x] Phase 3 — Assets & Structure

  - [x] Create folders/files exactly as specified in `src/`
  - [x] Add placeholder images: `assets/images/splash-logo.png`, `assets/images/app-icon.png`, `assets/images/google-icon.png`
  - [x] Leave `assets/fonts/` empty

- [x] Phase 4 — Theme System

  - [x] Implement `src/styles/theme.js` (as provided)
  - [x] Add `src/styles/globalStyles.js` for base container/typography helpers
  - [x] Create ThemeContext/provider with persistence (AsyncStorage)
  - [x] Apply theme to `StatusBar`

- [x] Phase 5 — Redux Store

  - [x] `src/store/index.js` configure store + `Provider` in `App.js`
  - [x] `authSlice.js`: states LOADING, UNAUTHENTICATED, AUTHENTICATED, GUEST; persist to AsyncStorage
  - [x] `themeSlice.js`: light/dark switch with persisted preference

- [x] Phase 6 — Navigation

  - [x] `AppNavigator.js`: root stack switching by auth state (Splash → Auth → Main)
  - [x] `TabNavigator.js`: 4 tabs with icons (Home, Library, Bible, Profile)
  - [x] `DrawerNavigator.js`: Drawer with custom `DrawerContent.js`
  - [x] Enable deep linking (basic linking config)
  - [x] Android back button handling

- [x] Phase 7 — Common Components

  - [x] `Button.js`: variants (primary, secondary, outline), loading, disabled, accessibility
  - [x] `Input.js`: types (text/email/password), error and focus styles, optional icons
  - [x] `Card.js`: themed elevation/radius/padding
  - [x] `Loading.js`: centered spinner with optional label

- [x] Phase 8 — Auth Components

  - [x] `RegisterForm.js`: Full Name, Email (validate), Password (min 6), Confirm Password; submit/validation, loading
  - [x] `GoogleSignInButton.js`: UI wired; for now show alert; prepare for `expo-auth-session` later

- [x] Phase 9 — Screens

  - [x] `SplashScreen.js`: 3s timer, logo, app name, spinner, transition to Auth
  - [x] `AuthScreen.js`: register form, Google Sign-In, prominent Skip (guest)
  - [x] Main tabs: `HomeScreen.js` (welcome + user greeting)
  - [x] Placeholders: `LibraryScreen.js`, `BibleScreen.js`, `ProfileScreen.js`

- [x] Phase 10 — Drawer

  - [x] `DrawerContent.js`: implement provided `drawerItems`; navigate or alert when screen is null

- [x] Phase 11 — Services & Hooks

  - [x] `authService.js`: stub register/login/googleSignIn; error normalization
  - [x] `storageService.js`: get/set/remove with AsyncStorage/SecureStore
  - [x] `useAuth.js`: selectors + helpers (login/register/guest/logout)
  - [x] `useTheme.js`: current theme + toggle

- [x] Phase 12 — Utilities

  - [x] `constants.js`: routes, validation regex, timeouts
  - [x] `helpers.js`: validation helpers, error formatter, debounce

- [x] Phase 13 — Error Handling & Boundaries

  - [x] Global ErrorBoundary; wrap root navigators
  - [x] Network error messages; standardized toasts/alerts (stubbed via helpers/services)

- [x] Phase 14 — Accessibility

  - [x] Add accessibilityLabel/role to buttons/inputs
  - [x] Ensure color contrast (use theme), minimum 44px touch targets
  - [x] Keyboard navigation and screen reader hints

- [x] Phase 15 — Performance

  - [x] Lazy-load heavy screens/assets (tabs lazy + detachInactiveScreens)
  - [x] Memoize components, avoid unnecessary re-renders (memo on screens/components)
  - [x] Ensure proper cleanup on unmount

- [x] Phase 16 — Testing (Skipped)

  - [x] Skipped for now

- [x] Phase 17 — Documentation

  - [x] `README.md`: install, scripts, structure, theme usage, component examples

- [x] Phase 18 — Final Polish
  - [x] Wire `App.js` to Provider, ThemeProvider, NavigationContainer
  - [x] Run on Android/iOS; fix warnings/errors
  - [x] Validate Deliverable Checklist items
  - [x] Commit and tag v1.0.0

---

## Acceptance Checklist

- [ ] App launches with splash screen
- [ ] Splash screen shows for 3 seconds then navigates to auth
- [ ] Auth screen has working register form with validation
- [ ] Google Sign-In button is present (can show alert for now)
- [ ] Skip button navigates to main app
- [ ] Main app shows 4 bottom tabs (Home, Library, Bible, Profile)
- [ ] HomeScreen shows welcome message
- [ ] Drawer menu opens with all dummy links
- [ ] Theme system is properly implemented
- [ ] Light/dark theme switching works
- [ ] All screens are properly styled with theme
- [ ] Redux store is configured and working
- [ ] No errors or warnings in console
- [ ] App works on both iOS and Android simulators
