import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const categoriesWithBooks = useMemo(() => {
    if (!categories.length || !filteredBooks.length) {
      return [];
    }
    return categories
      .map(category => ({
        ...category,
        books: filteredBooks.filter(book => book.categoryId === category.categoryId),
      }))
      .filter(category => category.books.length > 0);
  }, [categories, filteredBooks]);

  const handleCategoryPress = (category) => {
    if (selectedCategory && selectedCategory.categoryId === category.categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory && selectedCategory.categoryId === item.categoryId;
    return (
      <TouchableOpacity onPress={() => handleCategoryPress(item)}>
        <View style={[
          styles.categoryItem,
          { backgroundColor: isSelected ? theme.colors.primary.main : theme.colors.surface.main }
        ]}>
          <Text style={{ color: isSelected ? theme.colors.surface.main : theme.colors.text.primary }}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

    const renderBookCarouselItem = ({ item }) => {

      return (

        <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>

          <View style={styles.bookItem}>

            <Image source={{ uri: item.coverImageUrl }} style={styles.bookCover} />

            <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginTop: 8 }}>{item.title}</Text>

          </View>

        </TouchableOpacity>

      );

    };

  

    const renderBookGridItem = ({ item }) => {

      return (

        <TouchableOpacity onPress={() => navigation.navigate('BookDetails', { book: item })}>

          <View style={styles.bookGridItem}>

            <Image source={{ uri: item.coverImageUrl }} style={styles.bookGridCover} />

            <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold', marginTop: 8 }} numberOfLines={2}>{item.title}</Text>

          </View>

        </TouchableOpacity>

      );

    };

  

      const BookGrid = ({ books }) => {

  

        return (

  

          <FlatList

  

            data={books}

  

            renderItem={renderBookGridItem}

  

            keyExtractor={(item) => item.itemId.toString()}

  

            numColumns={3}

  

            contentContainerStyle={styles.gridContainer}

  

          />

  

        );

  

      };

  

    

  

      const CategoryCarousel = ({ category }) => {

  

        return (

  

          <View>

  

            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{category.name}</Text>

  

            <FlatList

  

              horizontal

  

              data={category.books}

  

              renderItem={renderBookCarouselItem}

  

              keyExtractor={(item) => item.itemId.toString()}

  

              showsHorizontalScrollIndicator={false}

  

              contentContainerStyle={styles.listContainer}

  

            />

  

          </View>

  

        );

  

      };

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

            {selectedCategory ? (
              <BookGrid books={categoriesWithBooks.find(c => c.categoryId === selectedCategory.categoryId)?.books || []} />
            ) : (        <FlatList
          data={categoriesWithBooks}
          renderItem={({ item }) => <CategoryCarousel category={item} />}
          keyExtractor={(item) => item.categoryId.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderRadius: 25,
    marginRight: 12,
    height: 50,
    justifyContent: 'center'
  },
  bookItem: {
    marginRight: 16,
    width: 150,
  },
  bookCover: {
    width: 150,
    height: 220,
    borderRadius: 8,
  },
  gridContainer: {
    paddingBottom: 16,
  },
  bookGridItem: {
    flex: 1,
    margin: 4,
    alignItems: 'center',
  },
  bookGridCover: {
    width: 110,
    height: 160,
    borderRadius: 8,
  },
});

export default React.memo(LibraryScreen);
