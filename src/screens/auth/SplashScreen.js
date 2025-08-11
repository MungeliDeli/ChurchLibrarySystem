import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import useTheme from "../../hooks/useTheme";

export default function SplashScreen() {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.primary.main }]}
    >
      <Image
        source={require("../../../assets/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: theme.colors.text.inverse }]}>
        Church Library
      </Text>
      <ActivityIndicator
        size="large"
        color={theme.colors.text.inverse}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 160, height: 160 },
  title: { marginTop: 12, fontSize: 22, fontWeight: "700" },
});
