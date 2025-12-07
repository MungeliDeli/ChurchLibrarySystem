import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Input from "../common/Input";
import Button from "../common/Button";
import useTheme from "../../hooks/useTheme";
import { isEmail } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";
import { login as loginService } from "../../services/authService";

export default function LoginForm({ onSuccess }) {
  const { theme } = useTheme();
  const { authenticate } = useAuth();

  const [values, setValues] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const setField = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const validate = () => {
    const e = {};
    if (!values.email.trim()) e.email = "Email is required";
    else if (!isEmail(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await loginService(values);
      if (res?.ok) {
        authenticate(res.data.user);
        onSuccess && onSuccess();
      } else {
        Alert.alert("Login failed", res?.message || "Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%", gap: theme.spacing.lg }}>
      <Input
        placeholder="Email"
        value={values.email}
        onChangeText={(t) => setField("email", t)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
        accessibilityLabel="Email address"
      />
      <Input
        placeholder="Password"
        value={values.password}
        onChangeText={(t) => setField("password", t)}
        secureTextEntry
        error={errors.password}
        accessibilityLabel="Password"
      />

      <TouchableOpacity
        onPress={() => Alert.alert("Forgot Password", "Feature coming soon")}
        accessibilityRole="button"
        style={{ alignSelf: "flex-end" }}
      >
        <Text
          style={{
            color: theme.colors.text.link,
            fontSize: 13,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Forgot your password?
        </Text>
      </TouchableOpacity>

      <Button
        title="Sign in"
        onPress={onSubmit}
        loading={loading}
        accessibilityLabel="Sign in"
      />
    </View>
  );
}
