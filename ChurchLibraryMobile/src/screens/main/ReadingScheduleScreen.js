import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getReadingList } from '../../services/libraryService';
import useTheme from '../../hooks/useTheme';

function ReadingScheduleScreen() {
  const { theme } = useTheme();
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const result = await getReadingList();
        if (result.ok) {
          setReadingList(result.data);
        } else {
          setError(result.message);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>{item.LibraryItem.title}</Text>
      <Text style={[styles.status, { color: theme.colors.text.secondary }]}>{item.status}</Text>
    </View>
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text.primary }]}>Reading Schedule</Text>
      <FlatList
        data={readingList}
        renderItem={renderItem}
        keyExtractor={(item) => item.listId.toString()}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default ReadingScheduleScreen;
