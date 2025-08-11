import React from "react";
import { Alert, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

export default function GoogleSignInButton() {
  const { theme } = useTheme();
  const onPress = () => Alert.alert("Google Sign-In", "Not implemented yet");

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.primary,
        },
      ]}
      activeOpacity={0.85}
    >
      <Image
        source={require("../../../assets/images/google-icon.png")}
        style={styles.icon}
      />
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>
        Sign in with Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  icon: { width: 18, height: 18, marginRight: 8, resizeMode: "contain" },
  label: { fontSize: 16, fontWeight: "600" },
});
