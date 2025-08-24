import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

export default function Input({
  label,
  error,
  style,
  inputStyle,
  left,
  right,
  secureTextEntry,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...rest
}) {
  const { theme } = useTheme();
  const [focused, setFocused] = React.useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus && onFocus(e);
  };
  const handleBlur = (e) => {
    setFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surface.secondary,
            borderColor: focused
              ? theme.colors.border.focus
              : theme.colors.components.input.border,
            minHeight: 48,
          },
          focused && {
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 3,
            borderWidth: 1,
          },
          error && {
            borderColor: theme.colors.border.error,
            backgroundColor: theme.colors.background.secondary,
            borderWidth: 1,
          },
        ]}
        accessible
        accessibilityRole="none"
      >
        {left}
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary },
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel || label}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <Text style={[styles.error, { color: theme.colors.text.error }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { marginBottom: 6, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 10 },
  error: { marginTop: 4, fontSize: 12 },
});
