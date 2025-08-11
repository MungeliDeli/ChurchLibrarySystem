import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Welcome to Church Library!
      </Text>
      {user?.name ? (
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Hello, {user.name}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 16 },
});
