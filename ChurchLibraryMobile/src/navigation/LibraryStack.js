import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/main/LibraryScreen';
import BookDetailsScreen from '../screens/main/BookDetailsScreen';
import BookReaderScreen from '../screens/main/BookReaderScreen';

const Stack = createNativeStackNavigator();

function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryList" component={LibraryScreen} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="BookReader" component={BookReaderScreen} />
    </Stack.Navigator>
  );
}

export default LibraryStack;
