import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/main/HomeScreen";
import LibraryScreen from "../screens/main/LibraryScreen";
import BibleScreen from "../screens/main/BibleScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BackHandler, Platform, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS !== "android") return;
      const onBackPress = () => {
        // Exit app if on a root tab and cannot go back
        if (!navigation.canGoBack()) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => sub.remove();
    }, [navigation])
  );

  const tabBarActive = theme.colors.primary.main;
  const tabBarInactive = isDark
    ? theme.colors.text.tertiary
    : theme.colors.text.tertiary;

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: theme.colors.primary.main },
        headerTitleStyle: { color: theme.colors.text.inverse },
        headerTintColor: theme.colors.text.inverse,
        tabBarActiveTintColor: tabBarActive,
        tabBarInactiveTintColor: tabBarInactive,
        tabBarStyle: { backgroundColor: theme.colors.components.tabBar },
        headerLeft: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 16 }}
            onPress={() => navigation.getParent()?.openDrawer?.()}
          >
            <Feather name="menu" size={22} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        ),
        lazy: true,
        detachInactiveScreens: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: "Library",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleScreen}
        options={{
          tabBarLabel: "Bible",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
