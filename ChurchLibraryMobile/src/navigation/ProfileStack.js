import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/main/ProfileScreen";
import MyStatisticsScreen from "../screens/drawer/MyStatisticsScreen";
import NotesHighlightsScreen from "../screens/drawer/NotesHighlightsScreen";
import ReadingScheduleScreen from "../screens/drawer/ReadingScheduleScreen";
import DownloadsScreen from "../screens/drawer/DownloadsScreen";

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
    </Stack.Navigator>
  );
}
