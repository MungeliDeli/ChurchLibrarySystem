import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import useTheme from "../../hooks/useTheme";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // TODO: send to crash reporting service
    console.log("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <Fallback onRetry={this.handleReset} />;
    }
    return this.props.children;
  }
}

function Fallback({ onRetry }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Something went wrong
      </Text>
      <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
        An unexpected error occurred. You can try again.
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={[styles.button, { backgroundColor: theme.colors.primary.main }]}
      >
        <Text
          style={[styles.buttonLabel, { color: theme.colors.text.inverse }]}
        >
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  message: { textAlign: "center", marginBottom: 16 },
  button: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: { fontWeight: "700" },
});
