import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RegisterForm from "../../components/auth/RegisterForm";
import LoginForm from "../../components/auth/LoginForm";
import Button from "../../components/common/Button";
import SocialIconButton from "../../components/common/SocialIconButton";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { TouchableOpacity } from "react-native";

export default function AuthScreen({ route, navigation }) {
  const { guest } = useAuth();
  const { theme } = useTheme();
  const initialTab = route?.params?.tab || "login";
  const [mode, setMode] = React.useState(initialTab);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.container]}
          keyboardShouldPersistTaps="handled"
        >
          {mode === "login" ? (
            <>
              <Text
                style={[
                  styles.loginTitle,
                  { color: theme.colors.primary.main },
                ]}
              >
                Login here
              </Text>
              <Text
                style={[
                  styles.subtitleStrong,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Sign in to continue your reading journey.
              </Text>
              <View style={{ height: 12 }} />
              <LoginForm onSuccess={() => {}} />
              <View style={{ height: 16 }} />
              <TouchableOpacity
                onPress={() => setMode("register")}
                accessibilityRole="button"
                style={{ alignSelf: "center", marginTop: 18 }}
              >
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontWeight: "700",
                  }}
                >
                  Create new account
                </Text>
              </TouchableOpacity>
              <View style={{ height: 70 }} />
              <Text style={[styles.orWith, { color: theme.colors.text.link }]}>
                Or sign in with
              </Text>
              <View style={{ height: 10 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <SocialIconButton
                  icon="google"
                  accessibilityLabel="Sign in with Google"
                  onPress={() => {}}
                />
                <SocialIconButton
                  icon="apple1"
                  accessibilityLabel="Sign in with Apple"
                  onPress={() => {}}
                />
              </View>
              <TouchableOpacity
                onPress={() => guest()}
                accessibilityRole="link"
                style={{ marginTop: 26 }}
              >
                <Text
                  style={{ color: theme.colors.text.link, textAlign: "center" }}
                >
                  Skip and proceed to browse
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.loginTitle,
                  { color: theme.colors.primary.main },
                ]}
              >
                Create Account
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Create an account to explore the latest books and resources.
              </Text>
              <View style={{ height: 12 }} />
              <RegisterForm submitLabel="Sign up" onSuccess={() => setMode('login')} />
              <View style={{ height: 16 }} />
              <TouchableOpacity
                onPress={() => setMode("login")}
                accessibilityRole="button"
                style={{ alignSelf: "center", marginTop: 18 }}
              >
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontWeight: "700",
                  }}
                >
                  Already have an account
                </Text>
              </TouchableOpacity>
              <View style={{ height: 70 }} />
              <Text style={[styles.orWith, { color: theme.colors.text.link }]}>
                Or sign up with
              </Text>
              <View style={{ height: 10 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <SocialIconButton
                  icon="google"
                  accessibilityLabel="Continue with Google"
                  onPress={() => {}}
                />
                <SocialIconButton
                  icon="apple1"
                  accessibilityLabel="Continue with Apple"
                  onPress={() => {}}
                />
              </View>
              <TouchableOpacity
                onPress={() => guest()}
                accessibilityRole="link"
                style={{ marginTop: 26 }}
              >
                <Text
                  style={{ color: theme.colors.text.link, textAlign: "center" }}
                >
                  Skip and proceed to browse
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: { padding: 36 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  loginTitle: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 22,
    marginTop: 50,
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 50 },
  subtitleStrong: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 50,
    alignSelf: "center",
    maxWidth: 300,
  },
  orWith: { fontSize: 14, textAlign: "center", fontWeight: "700" },
});
