import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
  BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import {
  getDownloadedBooks,
  removeDownloadedBook,
  removeMultipleBooks,
  getTotalStorageUsed,
  deleteAllDownloads
} from '../../services/downloadService';

export default function DownloadsScreen({ navigation }) {
  const { theme } = useTheme();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalStorage, setTotalStorage] = useState(0);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'format'
  const [filterFormat, setFilterFormat] = useState('all'); // 'all', 'pdf', 'epub'

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Fetch downloads when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDownloads();
      // Handle hardware back button to exit selection mode
      const onBackPress = () => {
        if (isSelectionMode) {
          exitSelectionMode();
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [isSelectionMode])
  );

  // When selection mode is active, hide the tab bar (optional, but good UX)
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isSelectionMode ? { display: 'none' } : undefined,
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleSelectionMode}
          style={{ paddingRight: 16 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {isSelectionMode ? 'Cancel' : 'Select'}
          </Text>
        </TouchableOpacity>
      ),
      title: isSelectionMode ? `${selectedItems.size} Selected` : 'Downloads'
    });
  }, [navigation, isSelectionMode, selectedItems]);

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      exitSelectionMode();
    } else {
      setIsSelectionMode(true);
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  };

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const downloadedBooks = await getDownloadedBooks();
      const booksArray = Object.values(downloadedBooks);
      setDownloads(booksArray);

      // Get total storage
      const storage = await getTotalStorageUsed();
      setTotalStorage(storage);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDownloads();
    setRefreshing(false);
  };

  const handleRead = (book) => {
    if (isSelectionMode) {
      toggleItemSelection(book.itemId);
      return;
    }
    navigation.navigate('Library', {
      screen: 'BookReader',
      params: {
        downloadUrl: book.localUri,
        itemId: book.itemId,
        format: book.format
      }
    });
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredDownloads.length) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all visible items
      const newSelected = new Set(filteredDownloads.map(b => b.itemId));
      setSelectedItems(newSelected);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;

    Alert.alert(
      'Delete Selected',
      `Delete ${selectedItems.size} book${selectedItems.size !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMultipleBooks(Array.from(selectedItems));
              await fetchDownloads();
              exitSelectionMode();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete books');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const handleDelete = (book) => {
    Alert.alert(
      'Delete Download',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeDownloadedBook(book.itemId);
              await fetchDownloads();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
              console.error('Delete error:', error);
            }
          }
        }
      ]
    );
  };

  // Keep existing logic for handleDeleteAll just in case, though Select All + Delete replaces it
  const handleDeleteAll = () => {
    if (downloads.length === 0) return;

    Alert.alert(
      'Delete All Downloads',
      `Are you sure you want to delete all ${downloads.length} downloaded books? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllDownloads();
              await fetchDownloads();
              Alert.alert('Success', 'All downloads deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete downloads');
              console.error('Delete all error:', error);
            }
          }
        }
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filtered and sorted downloads
  const filteredDownloads = useMemo(() => {
    let result = [...downloads];

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply format filter
    if (filterFormat !== 'all') {
      result = result.filter(book => book.format === filterFormat);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(b.downloadedAt) - new Date(a.downloadedAt);
      if (sortBy === 'format') return a.format.localeCompare(b.format);
      return 0;
    });

    return result;
  }, [downloads, searchQuery, filterFormat, sortBy]);

  const renderStorageHeader = () => (
    <View style={[styles.storageHeader, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.storageInfo}>
        <View style={styles.storageItem}>
          <Feather name="download" size={20} color={theme.colors.primary.main} />
          <Text style={[styles.storageValue, { color: theme.colors.text.primary }]}>
            {downloads.length}
          </Text>
          <Text style={[styles.storageLabel, { color: theme.colors.text.secondary }]}>
            Books
          </Text>
        </View>

        <View style={styles.storageDivider} />

        <View style={styles.storageItem}>
          <Feather name="hard-drive" size={20} color={theme.colors.primary.main} />
          <Text style={[styles.storageValue, { color: theme.colors.text.primary }]}>
            {formatFileSize(totalStorage)}
          </Text>
          <Text style={[styles.storageLabel, { color: theme.colors.text.secondary }]}>
            Storage
          </Text>
        </View>
      </View>

      {/* Only show "Delete All" if NOT in selection mode */}
      {!isSelectionMode && downloads.length > 0 && (
        <TouchableOpacity
          style={[styles.deleteAllButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDeleteAll}
        >
          <Feather name="trash-2" size={16} color="white" />
          <Text style={styles.deleteAllText}>Delete All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.secondary }]}>
      <Feather name="search" size={20} color={theme.colors.text.tertiary} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text.primary }]}
        placeholder="Search downloads..."
        placeholderTextColor={theme.colors.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Feather name="x" size={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilterControls = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        <Text style={[styles.filterLabel, { color: theme.colors.text.secondary }]}>Sort:</Text>
        {['date', 'title', 'format'].map(sort => (
          <TouchableOpacity
            key={sort}
            style={[
              styles.filterChip,
              sortBy === sort && { backgroundColor: theme.colors.primary.main },
              { borderColor: theme.colors.primary.main }
            ]}
            onPress={() => setSortBy(sort)}
          >
            <Text style={[
              styles.filterChipText,
              { color: sortBy === sort ? 'white' : theme.colors.primary.main, textTransform: 'capitalize' }
            ]}>
              {sort}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.filterDivider} />

        <Text style={[styles.filterLabel, { color: theme.colors.text.secondary }]}>Filter:</Text>
        {['all', 'pdf', 'epub'].map(fmt => (
          <TouchableOpacity
            key={fmt}
            style={[
              styles.filterChip,
              filterFormat === fmt && { backgroundColor: theme.colors.primary.main },
              { borderColor: theme.colors.primary.main }
            ]}
            onPress={() => setFilterFormat(fmt)}
          >
            <Text style={[
              styles.filterChipText,
              { color: filterFormat === fmt ? 'white' : theme.colors.primary.main, textTransform: 'uppercase' }
            ]}>
              {fmt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBookItem = ({ item }) => {
    const isSelected = selectedItems.has(item.itemId);

    return (
      <TouchableOpacity
        style={[
          styles.bookCard,
          { backgroundColor: theme.colors.background.secondary },
          isSelectionMode && isSelected && { borderColor: theme.colors.primary.main, borderWidth: 2 }
        ]}
        onPress={() => isSelectionMode ? toggleItemSelection(item.itemId) : handleRead(item)}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleItemSelection(item.itemId);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.bookContent}>
          {/* Checkbox for selection mode */}
          {isSelectionMode && (
            <View style={styles.selectionIndicator}>
              <MaterialIcons
                name={isSelected ? "check-circle" : "radio-button-unchecked"}
                size={24}
                color={isSelected ? theme.colors.primary.main : theme.colors.text.tertiary}
              />
            </View>
          )}

          {item.coverImageUrl ? (
            <Image source={{ uri: item.coverImageUrl }} style={styles.bookCover} />
          ) : (
            <View style={[styles.bookCover, styles.placeholderCover, { backgroundColor: theme.colors.background.tertiary }]}>
              <Feather name="book" size={32} color={theme.colors.text.tertiary} />
            </View>
          )}

          <View style={styles.bookInfo}>
            <Text style={[styles.bookTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.bookMeta}>
              <Text style={[styles.bookMetaText, { color: theme.colors.text.secondary }]}>
                {item.format?.toUpperCase() || 'EPUB'}
              </Text>
              <Text style={[styles.bookMetaText, { color: theme.colors.text.secondary }]}>•</Text>
              <Text style={[styles.bookMetaText, { color: theme.colors.text.secondary }]}>
                {formatFileSize(item.fileSize)}
              </Text>
            </View>
            <Text style={[styles.bookDate, { color: theme.colors.text.tertiary }]}>
              {formatDate(item.downloadedAt)}
            </Text>
          </View>
        </View>

        {/* Hide action buttons in selection mode to simplify UI */}
        {!isSelectionMode && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.readButton, { backgroundColor: theme.colors.primary.main }]}
              onPress={() => handleRead(item)}
            >
              <Feather name="book-open" size={18} color="white" />
              <Text style={styles.buttonText}>Read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: theme.colors.error }]}
              onPress={() => handleDelete(item)}
            >
              <Feather name="trash-2" size={18} color="white" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectionBar = () => {
    if (!isSelectionMode) return null;

    return (
      <View style={[styles.selectionBar, { backgroundColor: theme.colors.background.paper }]}>
        <TouchableOpacity style={styles.selectionButton} onPress={handleSelectAll}>
          <MaterialIcons
            name={selectedItems.size === filteredDownloads.length && filteredDownloads.length > 0 ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={theme.colors.primary.main}
          />
          <Text style={[styles.selectionButtonText, { color: theme.colors.text.primary }]}>
            {selectedItems.size === filteredDownloads.length && filteredDownloads.length > 0 ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.deleteSelectedButton,
            { backgroundColor: selectedItems.size > 0 ? theme.colors.error : theme.colors.components.disabled }
          ]}
          onPress={handleDeleteSelected}
          disabled={selectedItems.size === 0}
        >
          <Feather name="trash-2" size={20} color="white" />
          <Text style={styles.deleteSelectedText}>
            Delete ({selectedItems.size})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };


  const renderEmptyState = () => {
    const hasActiveFilters = searchQuery.trim() || filterFormat !== 'all';
    if (hasActiveFilters && filteredDownloads.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="search" size={64} color={theme.colors.text.tertiary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No Results Found</Text>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>Try adjusting your search or filters</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Feather name="download" size={64} color={theme.colors.text.tertiary} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No Downloads Yet</Text>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>Books you download will appear here for offline reading</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading downloads...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {downloads.length > 0 && (
        <>
          {renderStorageHeader()}
          {renderSearchBar()}
          {renderFilterControls()}
        </>
      )}

      <FlatList
        data={filteredDownloads}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.itemId.toString()}
        contentContainerStyle={[
          filteredDownloads.length === 0 && downloads.length === 0
            ? styles.emptyListContainer
            : styles.listContainer,
          isSelectionMode && { paddingBottom: 80 } // add padding for selection bar
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
      />
      {renderSelectionBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16 },
  storageHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  storageInfo: { flexDirection: 'row', alignItems: 'center' },
  storageItem: { alignItems: 'center', paddingHorizontal: 12 },
  storageValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  storageLabel: { fontSize: 12, marginTop: 2 },
  storageDivider: { width: 1, height: 40, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
  deleteAllButton: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 6, gap: 6,
  },
  deleteAllText: { color: 'white', fontSize: 14, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 16, padding: 0 },
  filterContainer: { paddingHorizontal: 16, marginBottom: 8 },
  filterScroll: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginRight: 4 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 16, borderWidth: 1, gap: 4,
  },
  filterChipText: { fontSize: 14, fontWeight: '500' },
  filterDivider: { width: 1, height: 24, backgroundColor: '#e0e0e0', marginHorizontal: 8 },
  listContainer: { padding: 16 },
  emptyListContainer: { flex: 1 },
  bookCard: {
    borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  bookContent: { flexDirection: 'row', marginBottom: 12 },
  bookCover: { width: 80, height: 120, borderRadius: 8, marginRight: 12, backgroundColor: '#e0e0e0' },
  placeholderCover: { justifyContent: 'center', alignItems: 'center' },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  bookMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  bookMetaText: { fontSize: 14 },
  bookDate: { fontSize: 12, fontStyle: 'italic' },
  buttonContainer: { flexDirection: 'row', gap: 12 },
  button: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, gap: 6,
  },
  readButton: {},
  deleteButton: {},
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },

  // Selection Mode Styles
  selectionIndicator: {
    justifyContent: 'center',
    paddingRight: 10,
  },
  selectionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  deleteSelectedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
