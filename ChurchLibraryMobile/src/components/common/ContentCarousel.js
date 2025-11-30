import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import BookCard from './BookCard'; // Assuming BookCard.js is in the same directory

function ContentCarousel({ title, data, onBookPress, navigation }) {
  const { theme } = useTheme();

  const renderBook = ({ item }) => (
    <BookCard book={item} onPress={() => onBookPress(item)} />
  );

  return (
    <View style={styles.carouselContainer}>
      <Text style={[styles.carouselTitle, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <FlatList
        horizontal
        data={data}
        renderItem={renderBook}
        keyExtractor={(item) => item.itemId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 20,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default ContentCarousel;
