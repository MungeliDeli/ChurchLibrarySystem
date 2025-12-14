import React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import useTheme from '../../hooks/useTheme';

function BookDetailsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { book } = route.params;

  const handleRead = () => {
    if (book.downloadUrl) {
      // Determine format from book.format or file extension
      let format = 'epub'; // default
      if (book.format) {
        format = book.format.toLowerCase();
      } else if (book.downloadUrl) {
        if (book.downloadUrl.includes('.pdf')) {
          format = 'pdf';
        } else if (book.downloadUrl.includes('.epub')) {
          format = 'epub';
        }
      }

      navigation.navigate('BookReader', { 
        downloadUrl: book.downloadUrl, 
        itemId: book.itemId,
        format: format
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {book.coverImageUrl && (
          <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
        )}
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{book.title}</Text>
        <Text style={[styles.author, { color: theme.colors.text.secondary }]}>
          by {book.authors.join(', ')}
        </Text>
        {book.format && (
          <Text style={[styles.format, { color: theme.colors.text.tertiary }]}>
            Format: {book.format.toUpperCase()}
          </Text>
        )}
        <Text style={[styles.description, { color: theme.colors.text.primary }]}>
          {book.description}
        </Text>
        {book.downloadUrl && (
          <Button title="Read Book" onPress={handleRead} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
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
    marginBottom: 8,
    textAlign: 'center',
  },
  format: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default React.memo(BookDetailsScreen);