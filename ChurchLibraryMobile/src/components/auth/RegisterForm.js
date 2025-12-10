import React from "react";
import { View, Alert } from "react-native";
import Input from "../common/Input";
import Button from "../common/Button";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { isEmail } from "../../utils/helpers";
import uuid from "react-native-uuid";
import { register as registerService } from "../../services/authService";

export default function RegisterForm({
  submitLabel = "Create Account",
  onSuccess,
}) {
  const { theme } = useTheme();
  const { authenticate } = useAuth();

  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Full name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!isEmail(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerService(values);
      if (res?.ok) {
        Alert.alert("Registration successful", "You can now log in.", [
          { text: "OK", onPress: () => onSuccess && onSuccess() },
        ]);
      } else {
        Alert.alert("Registration failed", res?.message || "Please try again.");
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
        placeholder="Full Name"
        value={values.name}
        onChangeText={(t) => setField("name", t)}
        autoCapitalize="words"
        autoCorrect={false}
        error={errors.name}
        accessibilityLabel="Full name"
      />
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
      <View style={{ height: 5 }} />

      <Button
        title={submitLabel}
        onPress={onSubmit}
        loading={loading}
        accessibilityLabel="Create account"
      />
    </View>
  );
}
