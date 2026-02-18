import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/helpers";

function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const InfoRow = ({ label, value }) => (
    <View style={[styles.infoRow, { borderBottomColor: theme.colors.border.secondary }]}>
      <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text.primary }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary.light }]}>
            <Text style={[styles.avatarText, { color: theme.colors.primary.main }]}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.colors.text.primary }]}>
            {user?.name || "Guest User"}
          </Text>
          <Text style={[styles.email, { color: theme.colors.text.secondary }]}>
            {user?.email || "No email provided"}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary.main }]}>
            Account Details
          </Text>
          <InfoRow label="Role" value={user?.role || "Member"} />
          <InfoRow
            label="Member Since"
            value={user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
          />
        </View>

        <View style={styles.actions}>
          <Button
            title="Logout"
            onPress={logout}
            variant="outline"
            style={{ borderColor: theme.colors.status.error }}
            textStyle={{ color: theme.colors.status.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: "bold" },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 16 },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: "500" },
  actions: { marginTop: "auto" },
});

export default React.memo(ProfileScreen);
