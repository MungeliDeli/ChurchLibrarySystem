import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

export default function SocialIconButton({
  icon = "google",
  onPress,
  accessibilityLabel,
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: "transparent",
          borderRadius: theme.radius.md,
          ...theme.shadows.sm,
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        <AntDesign name={icon} size={18} color={theme.colors.text.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 48,
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: { alignItems: "center", justifyContent: "center" },
});
