import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  ActivityIndicator, Alert, TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { downloadBook, isBookDownloaded, getLocalBookUri } from '../../services/downloadService';

function BookDetailsScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { book } = route.params;
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    checkDownloadStatus();
  }, []);

  const checkDownloadStatus = async () => {
    const downloaded = await isBookDownloaded(book.itemId);
    setIsDownloaded(downloaded);
  };

  const handleRead = async () => {
    let downloadUrlToUse = book.downloadUrl;

    // If downloaded offline, use local URI
    if (isDownloaded) {
      const localUri = await getLocalBookUri(book.itemId);
      if (localUri) {
        downloadUrlToUse = localUri;
      }
    }

    if (!downloadUrlToUse) {
      Alert.alert('Not Available', 'This book does not have a readable file attached.');
      return;
    }

    // Determine format from book.format or file extension
    let format = 'epub'; // default
    if (book.format) {
      format = book.format.toLowerCase();
    } else {
      if (downloadUrlToUse.includes('.pdf')) format = 'pdf';
      else if (downloadUrlToUse.includes('.epub')) format = 'epub';
    }

    navigation.navigate('BookReader', {
      downloadUrl: downloadUrlToUse,
      itemId: book.itemId,
      format,
    });
  };

  const handleDownload = async () => {
    if (!book.downloadUrl) {
      Alert.alert('Not Available', 'This book does not have a downloadable file.');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadBook(book, (progress) => {
        setDownloadProgress(progress);
      });
      setIsDownloaded(true);
      Alert.alert('Success', 'Book downloaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to download book. Please try again.');
      console.error(error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const primaryColor = theme?.colors?.primary?.main ?? '#4a90e2';
  const secondaryColor = theme?.colors?.secondary?.main ?? '#7b68ee';
  const successColor = theme?.colors?.success ?? '#27ae60';
  const bgColor = theme?.colors?.background?.primary ?? '#ffffff';
  const textPrimary = theme?.colors?.text?.primary ?? '#111111';
  const textSecondary = theme?.colors?.text?.secondary ?? '#666666';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Book cover */}
        {book.coverImageUrl ? (
          <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: primaryColor + '22' }]}>
            <MaterialIcons name="menu-book" size={64} color={primaryColor} />
          </View>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: textPrimary }]}>{book.title}</Text>

        {/* Author(s) */}
        <Text style={[styles.author, { color: textSecondary }]}>
          by {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
        </Text>

        {/* Format badge */}
        {book.format && (
          <View style={[styles.formatBadge, { backgroundColor: primaryColor + '18' }]}>
            <MaterialIcons
              name={book.format.toLowerCase() === 'pdf' ? 'picture-as-pdf' : 'book'}
              size={14}
              color={primaryColor}
            />
            <Text style={[styles.formatText, { color: primaryColor }]}>
              {book.format.toUpperCase()}
            </Text>
          </View>
        )}

        {/* Description */}
        {book.description ? (
          <Text style={[styles.description, { color: textPrimary }]}>{book.description}</Text>
        ) : null}

        {/* Action buttons */}
        {book.downloadUrl ? (
          <View style={styles.buttonGroup}>
            {/* Read button */}
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, { backgroundColor: isDownloaded ? successColor : primaryColor }]}
              onPress={handleRead}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={isDownloaded ? 'offline-pin' : 'auto-stories'}
                size={20}
                color="#fff"
              />
              <Text style={styles.btnText}>
                {isDownloaded ? 'Read Offline' : 'Read Online'}
              </Text>
            </TouchableOpacity>

            {/* Download / progress */}
            {!isDownloaded && !isDownloading && (
              <TouchableOpacity
                style={[styles.btn, styles.btnSecondary, { backgroundColor: secondaryColor }]}
                onPress={handleDownload}
                activeOpacity={0.8}
              >
                <MaterialIcons name="download" size={20} color="#fff" />
                <Text style={styles.btnText}>Download</Text>
              </TouchableOpacity>
            )}

            {isDownloading && (
              <View style={[styles.btn, styles.btnDisabled]}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.btnText}>
                  Downloading… {Math.round(downloadProgress * 100)}%
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* No file attached — show a clear message so we know why buttons are absent */
          <View style={[styles.noFileBox, { borderColor: textSecondary + '44' }]}>
            <MaterialIcons name="info-outline" size={18} color={textSecondary} />
            <Text style={[styles.noFileText, { color: textSecondary }]}>
              No file attached to this book yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  bookCover: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  coverPlaceholder: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 28,
  },
  author: {
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  formatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  formatText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.85,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  btnPrimary: {},
  btnSecondary: {},
  btnDisabled: {
    backgroundColor: '#aaa',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  noFileText: {
    fontSize: 13,
  },
});

export default React.memo(BookDetailsScreen);