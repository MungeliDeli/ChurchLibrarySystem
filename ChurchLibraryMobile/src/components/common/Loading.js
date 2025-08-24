import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

export default function Loading({ label = "Loading...", style }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: 16 },
  label: { marginTop: 8 },
});
