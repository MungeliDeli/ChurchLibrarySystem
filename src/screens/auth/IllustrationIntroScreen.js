import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import { splashIllustrationXml } from "../../assets/illustrations";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function IllustrationIntroScreen({ navigation }) {
  const { theme } = useTheme();
  const { guest } = useAuth();
  const halfHeight = SCREEN_HEIGHT * 0.45; // about half the screen

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <View style={{ alignItems: "center" }}>
          <SvgXml
            xml={splashIllustrationXml}
            width="100%"
            height={halfHeight}
          />
        </View>

        <Text style={[styles.title, { color: theme.colors.primary.main }]}>
          Discover Your Next Read Here
        </Text>
        <Text
          style={[styles.paragraph, { color: theme.colors.text.secondary }]}
        >
          Explore a curated library of faith-centered books, study plans, and
          resources tailored for your spiritual growth.
        </Text>

        <View style={styles.buttonsRow}>
          <View style={styles.half}>
            <Button
              title="Login"
              style={styles.fullWidth}
              onPress={() => navigation.replace("Auth", { tab: "login" })}
            />
          </View>
          <View style={{ width: 16 }} />
          <View style={styles.half}>
            <TouchableOpacity
              style={[styles.registerTap, styles.fullWidth]}
              onPress={() => navigation.replace("Auth", { tab: "register" })}
              accessibilityRole="button"
              accessibilityLabel="Register"
            >
              <Text
                style={[
                  styles.registerLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => guest()}
          accessibilityRole="link"
          style={{ marginTop: 26 }}
        >
          <Text style={{ color: theme.colors.text.link, textAlign: "center" }}>
            Skip and proceed to browse
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  title: {
    fontSize: 28,
    letterSpacing: 2,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 54,
  },
  paragraph: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
  buttonsRow: { flexDirection: "row", alignItems: "center", marginTop: 70 },
  half: { flex: 1 },
  fullWidth: { width: "100%" },
  registerTap: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  registerLabel: { fontSize: 16, fontWeight: "700" },
});
