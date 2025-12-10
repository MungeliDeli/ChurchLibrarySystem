import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';

function BookCard({ book, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={() => onPress(book)} style={styles.cardContainer}>
      <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
      <Text style={[styles.bookTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>
        {book.title}
      </Text>
      {book.authors && book.authors.length > 0 && (
        <Text style={[styles.bookAuthor, { color: theme.colors.text.secondary }]} numberOfLines={1}>
          {book.authors.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default BookCard;
