import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
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

    // If downloaded, use local URI
    if (isDownloaded) {
      const localUri = await getLocalBookUri(book.itemId);
      if (localUri) {
        downloadUrlToUse = localUri;
      }
    }

    if (downloadUrlToUse) {
      // Determine format from book.format or file extension
      let format = 'epub'; // default
      if (book.format) {
        format = book.format.toLowerCase();
      } else if (downloadUrlToUse) {
        if (downloadUrlToUse.includes('.pdf')) {
          format = 'pdf';
        } else if (downloadUrlToUse.includes('.epub')) {
          format = 'epub';
        }
      }

      navigation.navigate('BookReader', {
        downloadUrl: downloadUrlToUse,
        itemId: book.itemId,
        format: format
      });
    }
  };

  const handleDownload = async () => {
    if (!book.downloadUrl) return;

    setIsDownloading(true);
    try {
      await downloadBook(book, (progress) => {
        setDownloadProgress(progress);
      });
      setIsDownloaded(true);
      Alert.alert("Success", "Book downloaded successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to download book.");
      console.error(error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {book.coverImageUrl && (
          <Image source={{ uri: book.coverImageUrl }} style={styles.bookCover} />
        )}
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{book.title}</Text>
        <Text style={[styles.author, { color: theme.colors.text.secondary }]}>
          by {book.authors.join(', ')}
        </Text>
        {book.format && (
          <Text style={[styles.format, { color: theme.colors.text.tertiary }]}>
            Format: {book.format.toUpperCase()}
          </Text>
        )}
        <Text style={[styles.description, { color: theme.colors.text.primary }]}>
          {book.description}
        </Text>
        {book.downloadUrl && (
          <View style={styles.buttonContainer}>
            <Button title={isDownloaded ? "Read Offline" : "Read Online"} onPress={handleRead} color={isDownloaded ? theme.colors.success : theme.colors.primary.main} />

            {!isDownloaded && !isDownloading && (
              <View style={styles.spacer} />
            )}

            {!isDownloaded && !isDownloading && (
              <Button title="Download" onPress={handleDownload} color={theme.colors.secondary.main} />
            )}

            {isDownloading && (
              <View style={styles.downloadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary.main} />
                <Text style={{ color: theme.colors.text.primary }}>{Math.round(downloadProgress * 100)}%</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    alignItems: 'center',
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  format: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  spacer: {
    width: 20,
  },
  downloadingContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
});

export default React.memo(BookDetailsScreen);