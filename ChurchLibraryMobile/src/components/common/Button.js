import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import useTheme from "../../hooks/useTheme";

export default function Button({
  title = "Button",
  onPress,
  variant = "primary", // primary | secondary | outline
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) {
  const { theme } = useTheme();

  const { containerStyle, labelStyle, spinnerColor } = useMemo(() => {
    const baseContainer = {
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    const baseLabel = {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
    };

    const stylesByVariant = {
      primary: {
        container: {
          backgroundColor: theme.colors.components.button.primary,
        },
        label: { color: theme.colors.text.inverse },
      },
      secondary: {
        container: {
          backgroundColor: theme.colors.components.button.secondary,
        },
        label: { color: theme.colors.text.primary },
      },
      outline: {
        container: {
          backgroundColor: theme.colors.components.button.outline,
          borderWidth: 1,
          borderColor: theme.colors.border.focus,
        },
        label: { color: theme.colors.primary.main },
      },
    };

    const chosen = stylesByVariant[variant] || stylesByVariant.primary;
    const computedContainer = [baseContainer, chosen.container];
    const computedLabel = [baseLabel, chosen.label];
    const spinner = chosen.label.color || theme.colors.text.inverse;

    return {
      containerStyle: computedContainer,
      labelStyle: computedLabel,
      spinnerColor: spinner,
    };
  }, [theme, variant]);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      disabled={isDisabled}
      style={[containerStyle, isDisabled && { opacity: 0.6 }, style]}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={[styles.textReset, labelStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textReset: { includeFontPadding: false },
});
