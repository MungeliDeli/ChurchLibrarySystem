import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../screens/drawer/DrawerContent";
import TabNavigator from "./TabNavigator";
import useTheme from "../hooks/useTheme";
import { Dimensions } from "react-native";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { theme } = useTheme();
  const { width } = Dimensions.get("window");
  const drawerWidth = Math.floor(width * 0.7);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.components.drawer,
          width: drawerWidth,
        },
        drawerActiveTintColor: theme.colors.text.primary,
        drawerInactiveTintColor: theme.colors.text.secondary,
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}
