# Church Library App (Expo)

A React Native Expo application for a Church Library with authentication flow, bottom tabs, drawer navigation, and a comprehensive theming system.

## Requirements

- Node 18+
- Expo CLI

## Install & Run

```bash
# install
npm install

# start
npm run start
# or platform specific
npm run android
npm run ios
npm run web
```

## Project Structure

```
ChurchLibraryApp/
├── App.js
├── app.json
├── babel.config.js
├── metro.config.js
├── assets/
│   ├── images/
│   └── fonts/
└── src/
    ├── components/
    │   ├── common/
    │   └── auth/
    ├── screens/
    │   ├── auth/
    │   ├── main/
    │   └── drawer/
    ├── navigation/
    ├── store/
    │   └── slices/
    ├── services/
    ├── hooks/
    ├── utils/
    └── styles/
```

## Theme Usage

The theme is provided via a `ThemeProvider` and can be accessed with the `useTheme()` hook.

```jsx
import useTheme from "../hooks/useTheme";

export default function Example() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>Hello</Text>
      <Button title={isDark ? "Light" : "Dark"} onPress={toggleTheme} />
    </View>
  );
}
```

## Components

- Button variants: `primary | secondary | outline`. Supports `loading`, `disabled`, `accessibilityLabel`.
- Input: supports `label`, `error`, `secureTextEntry`, `left/right` icons, focus/error styling.
- Card: uses theme radius, spacing, and shadows.
- Loading: themed activity indicator with label.

## Navigation

- Root stack in `src/navigation/AppNavigator.js` switches between Splash → Auth → Main.
- Main navigators: `DrawerNavigator` (custom drawer) and `TabNavigator` (5 tabs).
- Deep linking configured for basic routes.

## State Management

- Redux Toolkit store in `src/store` with slices:
  - `authSlice`: LOADING/UNAUTHENTICATED/AUTHENTICATED/GUEST with persistence
  - `themeSlice`: light/dark mode with persistence

## Authentication

- `RegisterForm` validates name, email, password; dispatches authenticated user on success.
- `GoogleSignInButton` is stubbed with an alert.
- Skip button sets guest mode.

## Accessibility

- Buttons/inputs have accessibility labels; drawer items meet 44px touch target.

## Notes

- Splash screen shows for 3 seconds then transitions based on auth state.
- Replace placeholder images in `assets/images/` with production assets.
