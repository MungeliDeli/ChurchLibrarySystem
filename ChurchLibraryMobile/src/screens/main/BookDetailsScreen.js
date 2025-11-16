import React from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import useTheme from '../../hooks/useTheme';

function BookDetailsScreen({ route }) {
  const { theme } = useTheme();
  const { book } = route.params;

  const handleRead = () => {
    if (book.downloadUrl) {
      Linking.openURL(book.downloadUrl);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>{book.title}</Text>
      <Text style={[styles.author, { color: theme.colors.text.secondary }]}>by {book.authors.join(', ')}</Text>
      <Text style={[styles.description, { color: theme.colors.text.primary }]}>{book.description}</Text>
      {book.downloadUrl && (
        <Button title="Read Book" onPress={handleRead} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
  },
});

export default React.memo(BookDetailsScreen);