import React from "react";
import { View, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

function Card({ children, style, ...rest }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface.elevated,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.md,
          ...theme.shadows.md,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export default React.memo(Card);

const styles = StyleSheet.create({
  card: {},
});
