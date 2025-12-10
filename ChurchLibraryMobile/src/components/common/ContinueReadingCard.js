import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import useTheme from '../../hooks/useTheme';
import ProgressBar from './ProgressBar'; // Assuming ProgressBar.js is in the same directory or adjust path

function ContinueReadingCard({ book, onPress }) {
  const { theme } = useTheme();
  const progress = book.progress || 0; // progress is a number between 0 and 1

  return (
    <TouchableOpacity onPress={() => onPress(book)} style={[styles.card, { backgroundColor: theme.colors.surface.main }]}>
      <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={2}>
          {book.title}
        </Text>
        {book.authors && book.authors.length > 0 && (
            <Text style={[styles.author, { color: theme.colors.text.secondary }]} numberOfLines={1}>
            {book.authors.join(', ')}
            </Text>
        )}
        <View style={styles.progressBarContainer}>
          <ProgressBar progress={progress} color={theme.colors.primary.main} />
          <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
            {`${Math.round(progress * 100)}%`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    marginLeft: 8,
  },
});

export default ContinueReadingCard;
