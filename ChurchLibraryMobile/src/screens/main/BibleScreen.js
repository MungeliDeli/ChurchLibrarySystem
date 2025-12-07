import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Button } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { bibleBooks } from '../../utils/bibleBooks';
import { bibleChapterCount } from '../../utils/bibleChapterCount';

const allBooks = [...bibleBooks.oldTestament, ...bibleBooks.newTestament];

function BibleScreen() {
  const { theme } = useTheme();
  const [view, setView] = useState('books'); // 'books', 'chapters', 'text'
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterText, setChapterText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalChapters = useMemo(() => {
    if (!selectedBook) return 0;
    return bibleChapterCount[selectedBook];
  }, [selectedBook]);

  const chapters = useMemo(() => {
    if (totalChapters === 0) return [];
    return Array.from({ length: totalChapters }, (_, i) => i + 1);
  }, [totalChapters]);

  const hasNextChapter = useMemo(() => selectedChapter < totalChapters, [selectedChapter, totalChapters]);
  const hasPreviousChapter = useMemo(() => selectedChapter > 1, [selectedChapter]);

  const fetchChapter = useCallback(async (book, chapter) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://bible-api.com/${book.replace(/ /g, '%20')}%20${chapter}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setChapterText(null); // Clear previous text on error
      } else {
        setChapterText(data);
      }
    } catch (e) {
      setError('Failed to fetch chapter. Please check your connection.');
      setChapterText(null); // Clear previous text on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setView('text');
    fetchChapter(selectedBook, chapter);
  };
  
  const goToNextChapter = () => {
    if (!hasNextChapter) return;
    const newChapter = selectedChapter + 1;
    setSelectedChapter(newChapter);
    fetchChapter(selectedBook, newChapter);
  };

  const goToPreviousChapter = () => {
    if (!hasPreviousChapter) return;
    const newChapter = selectedChapter - 1;
    setSelectedChapter(newChapter);
    fetchChapter(selectedBook, newChapter);
  };

  const handleBack = () => {
    setError(null);
    setChapterText(null);
    if (view === 'text') {
      setView('chapters');
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
      setSelectedChapter(null);
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookSelect(item)}>
      <View style={[styles.item, { borderBottomColor: theme.colors.surface.main }]}>
        <Text style={{ color: theme.colors.text.primary, fontSize: 16 }}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity style={styles.chapterItemContainer} onPress={() => handleChapterSelect(item)}>
      <View style={[styles.chapterItem, { backgroundColor: theme.colors.surface.main }]}>
        <Text style={{ color: theme.colors.text.primary, fontSize: 16 }}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  if (view === 'books') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <FlatList
          data={allBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  }

  if (view === 'chapters') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <Button title="< Back to Books" onPress={handleBack} color={theme.colors.primary.main} />
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{selectedBook}</Text>
        <FlatList
            data={chapters}
            renderItem={renderChapterItem}
            keyExtractor={(item) => item.toString()}
            numColumns={5}
            contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  }

  if (view === 'text') {
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
            <Button title="< Back to Chapters" onPress={handleBack} color={theme.colors.primary.main} />
            <View style={styles.header}>
              <TouchableOpacity onPress={goToPreviousChapter} disabled={!hasPreviousChapter || loading} style={styles.navButton}>
                <Text style={[styles.navButtonText, { color: hasPreviousChapter ? theme.colors.primary.main : theme.colors.disabled }]}>‹ Prev</Text>
              </TouchableOpacity>
              <Text style={[styles.reference, { color: theme.colors.text.secondary }]}>{selectedBook} {selectedChapter}</Text>
              <TouchableOpacity onPress={goToNextChapter} disabled={!hasNextChapter || loading} style={styles.navButton}>
                <Text style={[styles.navButtonText, { color: hasNextChapter ? theme.colors.primary.main : theme.colors.disabled }]}>Next ›</Text>
              </TouchableOpacity>
            </View>
            
            {loading ? (
                <ActivityIndicator size="large" style={styles.activityIndicator} />
            ) : error ? (
                <Text style={[styles.feedback, { color: theme.colors.error }]}>{error}</Text>
            ) : chapterText && (
                <ScrollView style={styles.textContainer} key={chapterText.reference}>
                    <Text style={[styles.bibleText, { color: theme.colors.text.primary }]}>
                        {chapterText.verses.map(v => `[${v.verse}] ${v.text.trim()}`).join(' ')}
                    </Text>
                </ScrollView>
            )}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
  },
  chapterItemContainer: {
    width: '20%',
    padding: 5,
  },
  chapterItem: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navButton: {
    paddingHorizontal: 10,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reference: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityIndicator: {
    marginTop: 50,
  },
  feedback: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  textContainer: {
    marginTop: 16,
    paddingHorizontal: 6,
  },
  bibleText: {
    fontSize: 18,
    lineHeight: 28,
  }
});

export default BibleScreen;