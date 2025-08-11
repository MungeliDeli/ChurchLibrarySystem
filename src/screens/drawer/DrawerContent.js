import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const drawerItems = [
  { name: "Home Dashboard", icon: "home", screen: "Home" },
  { name: "Browse Categories", icon: "folder", screen: null },
  { name: "Advanced Search", icon: "search", screen: null },
  { name: "Reading Schedule", icon: "calendar", screen: null },
  { name: "Downloads", icon: "download", screen: null },
  { name: "My Statistics", icon: "bar-chart", screen: null },
  { name: "Notes & Highlights", icon: "edit", screen: null },
  { name: "Notifications", icon: "bell", screen: null },
  { name: "Settings", icon: "settings", screen: null },
  { name: "Help & Support", icon: "help-circle", screen: null },
  { name: "About", icon: "info", screen: null },
];

export default function DrawerContent() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handlePress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(item.name, "This feature is coming soon.");
    }
  };

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

      {drawerItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.row}
          onPress={() => handlePress(item)}
          accessibilityRole="button"
          accessibilityLabel={item.name}
          activeOpacity={0.7}
        >
          <Feather
            name={item.icon}
            size={20}
            color={theme.colors.text.primary}
            style={{ width: 26 }}
          />
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
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
