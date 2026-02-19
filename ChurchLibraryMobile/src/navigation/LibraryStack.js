import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/main/LibraryScreen';
import BookDetailsScreen from '../screens/main/BookDetailsScreen';
import BookReaderScreen from '../screens/main/BookReaderScreen';
import useTheme from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

function LibraryStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryList" component={LibraryScreen} />
      <Stack.Screen
        name="BookDetails"
        component={BookDetailsScreen}
        options={{
          headerShown: true,
          title: 'Book Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background.primary,
          },
          headerTintColor: theme.colors.text.primary,
          headerShadowVisible: false, // Optional: remove shadow for cleaner look
          headerTitleStyle: {
            color: theme.colors.text.primary,
            fontWeight: '600',
          }
        }}
      />
      <Stack.Screen name="BookReader" component={BookReaderScreen} />
    </Stack.Navigator>
  );
}

export default LibraryStack;
