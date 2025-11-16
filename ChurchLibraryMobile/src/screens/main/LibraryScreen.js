import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllCategories } from '../../services/categoryService';
import { getAllBooks } from '../../services/libraryService';
import useTheme from '../../hooks/useTheme';
import Input from '../../components/common/Input';

function LibraryScreen({ navigation }) { // Add navigation prop
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, bookRes] = await Promise.all([
          getAllCategories(),
          getAllBooks(),
        ]);

        if (catRes.ok) {
          setCategories(catRes.data);
        } else {
          setError(catRes.message);
        }

        if (bookRes.ok) {
          setBooks(bookRes.data);
        } else {
          setError(bookRes.message);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return books;
    }
    return books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [books, searchQuery]);

  const renderCategory = ({ item }) => (
    <View style={[styles.categoryItem, { backgroundColor: theme.colors.surface.main }]}>
      <Text style={{ color: theme.colors.text.primary }}>{item.name}</Text>
    </View>
  );

  const renderBook = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>
      <View style={[styles.bookItem, { backgroundColor: theme.colors.surface.main }]}>
        <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: theme.colors.text.secondary }}>by {item.authors.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text.primary }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Input
        placeholder="Search for books..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.categoryId.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>All Books</Text>
      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.itemId.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  categoryItem: {
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    height: 50,
    justifyContent: 'center'
  },
  bookItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default React.memo(LibraryScreen);
