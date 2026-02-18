import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import {
  getSchedules,
  createSchedule,
  updateProgress,
  deleteSchedule
} from '../../services/readingScheduleService';
import { getAllBooks } from '../../services/libraryService';
import { bibleBooks } from '../../utils/bibleBooks';
import { bibleChapterCount } from '../../utils/bibleChapterCount';

// --- Helper Components ---

const ProgressBar = ({ progress, color }) => (
  <View style={{ height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
    <View style={{ width: `${progress}%`, height: '100%', backgroundColor: color }} />
  </View>
);

const ScheduleCard = ({ schedule, onPress, theme }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: theme.colors.surface.main }]}
    onPress={() => onPress(schedule)}
  >
    <View style={styles.cardHeader}>
      <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>{schedule.title}</Text>
      <Text style={[styles.cardType, { color: theme.colors.primary.main }]}>{schedule.scheduleType}</Text>
    </View>
    <Text style={[styles.cardSubtitle, { color: theme.colors.text.secondary }]}>
      {schedule.scheduleType === 'Bible' ? 'Bible Reading Plan' : schedule.LibraryItem?.title || 'Book Reading'}
    </Text>

    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={{ color: theme.colors.text.secondary }}>Progress</Text>
        <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold' }}>{schedule.progressPercentage}%</Text>
      </View>
      <ProgressBar progress={schedule.progressPercentage} color={theme.colors.primary.main} />
      <Text style={[styles.nextReading, { color: theme.colors.text.secondary }]}>
        Next: {schedule.nextReading ? schedule.nextReading.description : 'Completed!'}
      </Text>
    </View>
  </TouchableOpacity>
);

// --- Main Screen Component ---

export default function ReadingScheduleScreen() {
  const { theme } = useTheme();

  // State
  const [view, setView] = useState('list'); // 'list', 'create', 'detail'
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [libraryBooks, setLibraryBooks] = useState([]);

  // Create Form State
  const [formData, setFormData] = useState({
    title: '',
    scheduleType: 'Bible', // 'Bible' or 'Book'
    bibleBooks: [], // Array of selected books
    bookId: null,
    chaptersPerReading: '1',
    readingsPerWeek: '7',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Load Schedules
  const fetchSchedules = async () => {
    setLoading(true);
    const result = await getSchedules();
    if (result.ok) {
      // Calculate next reading locally if not provided by backend list
      // Backend 'getSchedules' currently returns basic info. 
      // We might need to fetch details or just use the basic progress.
      // For list view, basic is fine. logic in `renderItem` can handle some display.
      setSchedules(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Use Effect to load books when entering create mode
  useEffect(() => {
    if (view === 'create' && libraryBooks.length === 0) {
      const fetchBooks = async () => {
        const result = await getAllBooks();
        if (result.ok) {
          setLibraryBooks(result.data);
        }
      };
      fetchBooks();
    }
  }, [view]);

  // Actions
  const handleCreate = async () => {
    if (!formData.title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const payload = {
      title: formData.title,
      scheduleType: formData.scheduleType,
      chaptersPerReading: parseInt(formData.chaptersPerReading),
      readingsPerWeek: parseInt(formData.readingsPerWeek),
      startDate: formData.startDate
    };

    if (formData.scheduleType === 'Bible') {
      if (formData.bibleBooks.length === 0) {
        Alert.alert('Error', 'Please select at least one Bible book');
        return;
      }
      // Map simplified book selection to full structure required by backend
      payload.bibleBooks = formData.bibleBooks.map(book => ({
        book: book,
        startChapter: 1,
        endChapter: bibleChapterCount[book]
      }));
    } else {
      if (!formData.bookId) {
        Alert.alert('Error', 'Please select a book');
        return;
      }
      payload.itemId = formData.bookId;
      // Simple default: Read whole book. Backend expects specific range.
      // We'll need to know chapters count. 
      // Simplified: User inputs total chapters manually for now OR we guess/default.
      // Let's ask user for chapter range or total chapters.
      // For MVP: Input total chapters in form
      payload.bookChapters = {
        startChapter: 1,
        endChapter: parseInt(formData.totalChapters || 20) // Default or input
      };
    }

    setLoading(true);
    const result = await createSchedule(payload);
    setLoading(false);

    if (result.ok) {
      setView('list');
      fetchSchedules();
      // Reset form
      setFormData({
        title: '',
        scheduleType: 'Bible',
        bibleBooks: [],
        bookId: null,
        chaptersPerReading: '1',
        readingsPerWeek: '7',
        startDate: new Date().toISOString().split('T')[0]
      });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure you want to delete this schedule?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            setLoading(true);
            await deleteSchedule(id);
            setLoading(false);
            setView('list');
            fetchSchedules();
          }
        }
      ]
    );
  };

  const handleUpdateProgress = async (chapters) => {
    setLoading(true);
    const result = await updateProgress(selectedSchedule.scheduleId, chapters);
    setLoading(false);

    if (result.ok) {
      // Refresh detail view
      // We can just update local state or re-fetch
      // Let's re-fetch the specific schedule to get updated next calculation
      // But wait, getScheduleById logic is needed.
      // For now, let's just go back to list and refresh
      fetchSchedules();
      setView('list');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  // --- Render Functions ---

  const renderCreateView = () => {
    // Group Bible books for selection
    const toggleBook = (book) => {
      setFormData(prev => {
        if (prev.bibleBooks.includes(book)) {
          return { ...prev, bibleBooks: prev.bibleBooks.filter(b => b !== book) };
        } else {
          return { ...prev, bibleBooks: [...prev.bibleBooks, book] };
        }
      });
    };

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.header, { color: theme.colors.text.primary }]}>Create New Schedule</Text>

        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Schedule Title</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
          value={formData.title}
          onChangeText={t => setFormData({ ...formData, title: t })}
          placeholder="e.g., Morning Devotion"
          placeholderTextColor={theme.colors.text.secondary}
        />

        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Type</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.scheduleType === 'Bible' && { backgroundColor: theme.colors.primary.main }
            ]}
            onPress={() => setFormData({ ...formData, scheduleType: 'Bible' })}
          >
            <Text style={{ color: formData.scheduleType === 'Bible' ? '#fff' : theme.colors.text.primary }}>Bible</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.scheduleType === 'Book' && { backgroundColor: theme.colors.primary.main }
            ]}
            onPress={() => setFormData({ ...formData, scheduleType: 'Book' })}
          >
            <Text style={{ color: formData.scheduleType === 'Book' ? '#fff' : theme.colors.text.primary }}>Book</Text>
          </TouchableOpacity>
        </View>

        {formData.scheduleType === 'Bible' ? (
          <View>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Select Books</Text>
            <View style={styles.bookGrid}>
              {[...bibleBooks.oldTestament, ...bibleBooks.newTestament].map(book => (
                <TouchableOpacity
                  key={book}
                  style={[
                    styles.bookChip,
                    formData.bibleBooks.includes(book) && { backgroundColor: theme.colors.primary.main }
                  ]}
                  onPress={() => toggleBook(book)}
                >
                  <Text style={{
                    fontSize: 12,
                    color: formData.bibleBooks.includes(book) ? '#fff' : theme.colors.text.primary
                  }}>{book}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Select Book from Library</Text>
            <ScrollView style={{ maxHeight: 200, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8 }}>
              {libraryBooks.map(item => (
                <TouchableOpacity
                  key={item.itemId}
                  style={{ padding: 10, backgroundColor: formData.bookId === item.itemId ? theme.colors.primary.light : 'transparent' }}
                  onPress={() => setFormData({ ...formData, bookId: item.itemId })}
                >
                  <Text style={{ color: theme.colors.text.primary }}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.label, { color: theme.colors.text.secondary, marginTop: 10 }]}>Total Chapters</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.totalChapters}
              onChangeText={t => setFormData({ ...formData, totalChapters: t })}
              keyboardType="numeric"
              placeholder="20"
            />
          </View>
        )}

        <Text style={[styles.label, { color: theme.colors.text.secondary, marginTop: 16 }]}>Pace</Text>
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>Chapters / Reading</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.chaptersPerReading}
              onChangeText={t => setFormData({ ...formData, chaptersPerReading: t })}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>Readings / Week</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
              value={formData.readingsPerWeek}
              onChangeText={t => setFormData({ ...formData, readingsPerWeek: t })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => setView('list')} style={styles.secondaryButton}>
            <Text style={{ color: theme.colors.text.primary }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreate} style={[styles.primaryButton, { backgroundColor: theme.colors.primary.main }]}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderDetailView = () => {
    if (!selectedSchedule) return null;

    // We can assume selectedSchedule has all data including 'nextReading' 
    // IF we fetched it using getScheduleById.
    // Since we used fetchSchedules (list), we might be missing 'nextReading'.
    // BUT we calculated progressPercentage in list controller.
    // Ideally we should fetch fresh detail on view.
    // For simplicity, let's reuse list item, but calculate reading locally if missing
    // OR create a quick component logic

    // Quick Fix: use backend logic logic in frontend for now or Assume
    // Actually, better to just show "Mark X Chapters as Read"
    const nextChaptersCount = selectedSchedule.chaptersPerReading;

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity onPress={() => setView('list')} style={{ marginBottom: 16 }}>
          <Text style={{ color: theme.colors.primary.main, fontSize: 16 }}>{'< Back to List'}</Text>
        </TouchableOpacity>

        <Text style={[styles.header, { color: theme.colors.text.primary }]}>{selectedSchedule.title}</Text>

        <View style={[styles.detailCard, { backgroundColor: theme.colors.surface.main }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Next Reading Goal</Text>
          <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
            Read {nextChaptersCount} {nextChaptersCount > 1 ? 'Chapters' : 'Chapter'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.markButton, { backgroundColor: theme.colors.primary.main }]}
            onPress={() => handleUpdateProgress(nextChaptersCount)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Mark as Read</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailCard, { backgroundColor: theme.colors.surface.main }]}>
          <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Overall Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={{ color: theme.colors.text.secondary }}>{selectedSchedule.currentChapter} / {selectedSchedule.totalChapters} Chapters</Text>
              <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold' }}>{selectedSchedule.progressPercentage}%</Text>
            </View>
            <ProgressBar progress={selectedSchedule.progressPercentage} color={theme.colors.primary.main} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={() => handleDelete(selectedSchedule.scheduleId)}
        >
          <Text style={{ color: theme.colors.error, alignSelf: 'center' }}>Delete Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // List View
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {view === 'list' && (
        <>
          <View style={styles.listHeader}>
            <Text style={[styles.header, { color: theme.colors.text.primary }]}>My Reading Schedules</Text>
            <TouchableOpacity onPress={() => setView('create')}>
              <Text style={{ color: theme.colors.primary.main, fontSize: 32 }}>+</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
          ) : (
            <FlatList
              data={schedules}
              keyExtractor={item => item.scheduleId}
              renderItem={({ item }) => (
                <ScheduleCard
                  schedule={item}
                  theme={theme}
                  onPress={(s) => {
                    setSelectedSchedule(s);
                    setView('detail');
                  }}
                />
              )}
              ListEmptyComponent={
                <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginTop: 40 }}>
                  No reading schedules yet. Tap + to create one.
                </Text>
              }
            />
          )}
        </>
      )}

      {view === 'create' && renderCreateView()}
      {view === 'detail' && renderDetailView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nextReading: {
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  bookChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    flex: 2,
    marginLeft: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  detailCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 16,
  },
  detailLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  markButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    padding: 16,
    marginTop: 20,
  }
});
