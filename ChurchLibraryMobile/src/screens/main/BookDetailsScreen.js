import React from 'react';
import { View, Text, StyleSheet, Button, Linking, Image } from 'react-native';
import useTheme from '../../hooks/useTheme';

function BookDetailsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { book } = route.params;

  const handleRead = () => {
    if (book.downloadUrl) {
      navigation.navigate('BookReader', { downloadUrl: book.downloadUrl, itemId: book.itemId });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {book.coverImageUrl && (
        <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
      )}
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
    alignItems: 'center',
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default React.memo(BookDetailsScreen);