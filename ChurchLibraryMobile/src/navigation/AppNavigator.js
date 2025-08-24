import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import SplashScreen from "../screens/auth/SplashScreen";
import AuthScreen from "../screens/auth/AuthScreen";
import IllustrationIntroScreen from "../screens/auth/IllustrationIntroScreen";
import DrawerNavigator from "./DrawerNavigator";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { hydrateAuth } from "../store/slices/authSlice";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["churchlibrary://", "https://church-library-app.example.com"],
  config: {
    screens: {
      Splash: "splash",
      Intro: "intro",
      Auth: "auth",
      Main: {
        screens: {
          MainTabs: {
            screens: {
              Home: "home",
              Library: "library",
              Bible: "bible",
              Profile: "profile",
            },
          },
        },
      },
    },
  },
};

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { status } = useAuth();
  const { isDark } = useTheme();
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  const [splashTimerDone, setSplashTimerDone] = React.useState(false);

  React.useEffect(() => {
    dispatch(hydrateAuth());
    const t = setTimeout(() => setSplashTimerDone(true), 3000);
    return () => clearTimeout(t);
  }, [dispatch]);

  const isHydrated = status !== "loading";
  const showSplash = !(isHydrated && splashTimerDone);

  return (
    <NavigationContainer linking={linking} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : status === "unauthenticated" ? (
          <>
            <Stack.Screen name="Intro" component={IllustrationIntroScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
