import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/main/ProfileScreen";
import MyStatisticsScreen from "../screens/drawer/MyStatisticsScreen";
import NotesHighlightsScreen from "../screens/drawer/NotesHighlightsScreen";
import ReadingScheduleScreen from "../screens/drawer/ReadingScheduleScreen";
import DownloadsScreen from "../screens/drawer/DownloadsScreen";
import SettingsScreen from "../screens/drawer/SettingsScreen";
import HelpSupportScreen from "../screens/drawer/HelpSupportScreen";
import AboutScreen from "../screens/drawer/AboutScreen";

import EditNoteScreen from "../screens/drawer/EditNoteScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyStatistics"
        component={MyStatisticsScreen}
        options={{ title: "My Statistics" }}
      />
      <Stack.Screen
        name="NotesHighlights"
        component={NotesHighlightsScreen}
        options={{ title: "Notes & Highlights" }}
      />
      <Stack.Screen
        name="ReadingSchedule"
        component={ReadingScheduleScreen}
        options={{ title: "Reading Schedule" }}
      />
      <Stack.Screen
        name="Downloads"
        component={DownloadsScreen}
        options={{ title: "Downloads" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ title: "Help & Support" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{ title: "Edit Note" }}
      />
    </Stack.Navigator>
  );
}
