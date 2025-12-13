import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const drawerItems = [
  {
    name: "Home Dashboard",
    icon: "home",
    screen: "MainTabs",
    params: { screen: "Home" },
    routeName: "Home",
  },
  {
    name: "Browse Categories",
    icon: "folder",
    screen: "MainTabs",
    params: { screen: "Library", params: { screen: "BrowseCategories" } },
    routeName: "BrowseCategories",
  },
  {
    name: "Advanced Search",
    icon: "search",
    screen: "MainTabs",
    params: { screen: "Library", params: { screen: "AdvancedSearch" } },
    routeName: "AdvancedSearch",
  },
  {
    name: "Reading Schedule",
    icon: "calendar",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "ReadingSchedule" } },
    routeName: "ReadingSchedule",
  },
  {
    name: "Downloads",
    icon: "download",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "Downloads" } },
    routeName: "Downloads",
  },
  {
    name: "My Statistics",
    icon: "bar-chart",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "MyStatistics" } },
    routeName: "MyStatistics",
  },
  {
    name: "Notes & Highlights",
    icon: "edit",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "NotesHighlights" } },
    routeName: "NotesHighlights",
  },
  {
    name: "Notifications",
    icon: "bell",
    screen: "MainTabs",
    params: { screen: "Library", params: { screen: "Notifications" } },
    routeName: "Notifications",
  },
  {
    name: "Settings",
    icon: "settings",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "Settings" } },
    routeName: "Settings",
  },
  {
    name: "Help & Support",
    icon: "help-circle",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "HelpSupport" } },
    routeName: "HelpSupport",
  },
  {
    name: "About",
    icon: "info",
    screen: "MainTabs",
    params: { screen: "Profile", params: { screen: "About" } },
    routeName: "About",
  },
  { name: "Logout", icon: "log-out", screen: "Auth", routeName: "Auth" },
];

export default function DrawerContent({ navigation, state }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePress = (item) => {
    if (item.name === "Logout") {
      handleLogout();
      return;
    }
    if (item.screen) {
      navigation.navigate(item.screen, item.params);
    }
  };

  let currentRoute = state.routes[state.index];
  while (currentRoute.state) {
    currentRoute = currentRoute.state.routes[currentRoute.state.index];
  }
  const focusedRouteName = currentRoute.name;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.components.drawer },
      ]}
    >
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: theme.colors.primary.main,
            paddingTop: insets.top + 16,
          },
        ]}
      >
        <Image
          source={require("../../../assets/images/splash-logo.png")}
          style={styles.headerIcon}
        />
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.inverse }]}
        >
          Church Library
        </Text>
      </View>

      {drawerItems.map((item) => {
        const isFocused = item.routeName === focusedRouteName;
        return (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.row,
              isFocused && {
                backgroundColor: theme.colors.background.tertiary,
              },
            ]}
            onPress={() => handlePress(item)}
            accessibilityRole="button"
            accessibilityLabel={item.name}
            activeOpacity={0.7}
          >
            <Feather
              name={item.icon}
              size={20}
              color={
                isFocused
                  ? theme.colors.primary.main
                  : theme.colors.text.primary
              }
              style={{ width: 26 }}
            />
            <Text
              style={[
                styles.label,
                { color: theme.colors.text.primary },
                isFocused && {
                  fontWeight: "600",
                  color: theme.colors.primary.main,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerIcon: { width: 32, height: 32, borderRadius: 6, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  label: { marginLeft: 8, fontSize: 15 },
});
