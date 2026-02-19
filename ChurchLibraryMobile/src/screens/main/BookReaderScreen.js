import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserToken } from '../../services/storageService';
import EpubReader from '../../components/common/EpubReader';
import PdfReader from '../../components/common/PdfReader';
import NoteModal from '../../components/common/NoteModal';
import useTheme from '../../hooks/useTheme';
import useFullScreen from '../../hooks/useFullScreen';
import { createAnnotation, getAnnotationsByItem, deleteAnnotation } from '../../services/annotationService';
import { logActivity } from '../../services/activityService';
import { saveReadingProgress } from '../../services/progressService';

// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const ReaderControls = React.memo(({
  onToggleFullScreen,
  onIncreaseFontSize,
  onDecreaseFontSize,
  isFullScreen,
  currentFontSize,
  format
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.controlsContainer, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.fontSizeGroup}>
        <TouchableOpacity onPress={onDecreaseFontSize} style={styles.controlButton}>
          <MaterialIcons name="text-decrease" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.fontSizeText, { color: theme.colors.text.primary }]}>
          {format === 'pdf' ? `${Math.round(currentFontSize * 100)}%` : `${currentFontSize}%`}
        </Text>
        <TouchableOpacity onPress={onIncreaseFontSize} style={styles.controlButton}>
          <MaterialIcons name="text-increase" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onToggleFullScreen} style={styles.controlButton}>
        <MaterialIcons name={isFullScreen ? "fullscreen-exit" : "fullscreen"} size={30} color={theme.colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
});

function BookReaderScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { downloadUrl, itemId, initialLocation, format } = route.params;
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [clickedAnnotationCfi, setClickedAnnotationCfi] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isReaderReady, setIsReaderReady] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Format-specific state
  const [epubFontSize, setEpubFontSize] = useState(100);
  const [pdfScale, setPdfScale] = useState(1.5);

  const readerRef = useRef(null);
  const annotationsRef = useRef(annotations);
  const isFullScreenRef = useRef(isFullScreen);
  const currentSelectionRef = useRef(currentSelection);
  const clickedAnnotationCfiRef = useRef(clickedAnnotationCfi);

  // Keep refs in sync
  useEffect(() => {
    annotationsRef.current = annotations;
  }, [annotations]);

  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen]);

  useEffect(() => {
    currentSelectionRef.current = currentSelection;
  }, [currentSelection]);

  useEffect(() => {
    clickedAnnotationCfiRef.current = clickedAnnotationCfi;
  }, [clickedAnnotationCfi]);

  // Detect file format from route params or downloadUrl
  const fileFormat = format || (downloadUrl?.includes('.pdf') ? 'pdf' : 'epub');

  useEffect(() => {
    if (downloadUrl) {
      const loadBook = async () => {
        setIsLoading(true);
        setDownloadProgress(0);

        try {
          if (downloadUrl.startsWith('file://')) {
            // Load from local storage (already downloaded)
            // Both epub and pdf are read as base64; EpubReader uses base64 directly,
            // and PdfReader (WebView) receives the file path for pdf from getLocalBookUri.
            console.log('[BookReader] Loading from local storage:', downloadUrl);
            if (fileFormat === 'epub') {
              const base64 = await FileSystem.readAsStringAsync(downloadUrl, { encoding: FileSystem.EncodingType.Base64 });
              setBookData(base64);
            } else {
              // PDF
              if (Platform.OS === 'android') {
                // Android WebView cannot render local PDF files directly.
                // We must read as base64 and pass to our JS-based PdfReader (PDF.js).
                console.log('[BookReader] Reading PDF as base64 for Android...');
                const base64 = await FileSystem.readAsStringAsync(downloadUrl, { encoding: FileSystem.EncodingType.Base64 });
                setBookData(base64);
              } else {
                // iOS: pass the file URI directly so WebView can load it natively
                setBookData(downloadUrl);
              }
            }
            setIsLoading(false);
          } else {
            // Download from remote URL to local cache first
            console.log(`[BookReader] Downloading ${fileFormat.toUpperCase()} from remote URL:`, downloadUrl);

            // NOTE: Do NOT send Authorization header for S3 presigned URLs
            // Presigned URLs already contain authentication in the URL query parameters
            // AWS S3 rejects requests with both Authorization header AND presigned URL auth

            // Create a unique filename with correct extension
            const ext = fileFormat === 'epub' ? 'epub' : 'pdf';
            const filename = `book_${Date.now()}.${ext}`;
            const localPath = `${FileSystem.cacheDirectory}${filename}`;

            console.log('[BookReader] Downloading to:', localPath);

            // Create download with progress tracking
            const downloadResumable = FileSystem.createDownloadResumable(
              downloadUrl,
              localPath,
              {}, // Empty headers - presigned URL handles auth
              (downloadProgress) => {
                if (downloadProgress.totalBytesExpectedToWrite > 0) {
                  const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                  const percentage = Math.round(progress * 100);
                  setDownloadProgress(percentage);
                  console.log(`[BookReader] Download progress: ${percentage}% (${downloadProgress.totalBytesWritten}/${downloadProgress.totalBytesExpectedToWrite} bytes)`);
                } else {
                  console.log(`[BookReader] Download in progress: ${downloadProgress.totalBytesWritten} bytes (total unknown)`);
                }
              }
            );

            // Start the download
            const result = await downloadResumable.downloadAsync();

            if (result && result.uri) {
              console.log('[BookReader] Download complete. File saved at:', result.uri);
              console.log('[BookReader] HTTP Status:', result.status);

              // Check file info
              const fileInfo = await FileSystem.getInfoAsync(result.uri);
              console.log('[BookReader] File size:', fileInfo.size, 'bytes');

              // Validate file size - books should be at least a few KB
              if (fileInfo.size < 1000) {
                console.error('[BookReader] Downloaded file is too small:', fileInfo.size, 'bytes');
                const content = await FileSystem.readAsStringAsync(result.uri);
                console.error('[BookReader] Downloaded content preview:', content.substring(0, 500));

                setIsLoading(false);
                Alert.alert(
                  'Download Failed',
                  `Downloaded file is too small (${fileInfo.size} bytes). The server may have returned an error.`,
                  [{ text: 'OK' }]
                );

                await FileSystem.deleteAsync(result.uri, { idempotent: true });
                return;
              }

              if (fileFormat === 'epub') {
                // ePub: read as base64 so epub.js (running inside WebView) can parse it
                console.log('[BookReader] Reading ePub as base64...');
                const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                console.log('[BookReader] ePub base64 length:', base64.length);
                setBookData(base64);
                // Clean up temp file after reading into memory
                await FileSystem.deleteAsync(result.uri, { idempotent: true });
              } else {
                // PDF
                if (Platform.OS === 'android') {
                  // Read as base64 for PdfReader
                  console.log('[BookReader] Reading PDF as base64 for Android...');
                  const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                  setBookData(base64);
                  // Clean up temp file
                  await FileSystem.deleteAsync(result.uri, { idempotent: true });
                } else {
                  // iOS: pass file URI directly to WebView
                  console.log('[BookReader] PDF ready to display from:', result.uri);
                  setBookData(result.uri);
                  // DON'T clean up - keep the file so WebView can load it
                }
              }

              setIsLoading(false);
            } else {
              console.error('[BookReader] Download failed - no result');
              setIsLoading(false);
              Alert.alert(
                'Download Failed',
                `Failed to download ${fileFormat.toUpperCase()}`,
                [{ text: 'OK' }]
              );
            }
          }
        } catch (e) {
          console.error('[BookReader] Error loading book:', e);
          setIsLoading(false);
          Alert.alert(
            'Error',
            `Error loading book: ${e.message || 'Unknown error'}`,
            [{ text: 'OK' }]
          );
        }
      };

      loadBook();
    }
  }, [downloadUrl, fileFormat]);

  // --- Log Reading Activity ---
  useEffect(() => {
    if (itemId) {
      logActivity('Read', itemId).catch(err => console.error("Failed to log activity:", err));
    }
  }, [itemId]);

  // --- Progress Saving ---
  const saveProgressDebounced = useRef(
    debounce(async (p, id) => {
      if (id && p > 0) {
        await saveReadingProgress(id, p);
      }
    }, 10000)
  ).current;

  // Save final progress on unmount
  useEffect(() => {
    return () => {
      if (itemId && progress > 0) {
        saveReadingProgress(itemId, progress);
      }
    };
  }, [itemId, progress]);

  // --- Annotations (EPUB only for now) ---
  useEffect(() => {
    if (itemId && fileFormat === 'epub') fetchAnnotations();
  }, [itemId, fileFormat]);

  useEffect(() => {
    if (isReaderReady && annotations.length > 0 && fileFormat === 'epub') {
      annotations.forEach(annotation => {
        if (annotation.textLocation && readerRef.current) {
          readerRef.current.highlight(annotation.textLocation, annotation.highlightColor);
        }
      });
    }
  }, [isReaderReady, annotations, fileFormat]);

  useEffect(() => {
    if (isReaderReady && initialLocation && readerRef.current && fileFormat === 'epub') {
      readerRef.current.goTo(initialLocation);
    }
  }, [isReaderReady, initialLocation, fileFormat]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: !isFullScreen,
      tabBarVisible: !isFullScreen,
    });
    if (!isFullScreen) {
      setShowControls(true);
    }
  }, [isFullScreen, navigation]);

  const fetchAnnotations = async () => {
    try {
      const data = await getAnnotationsByItem(itemId);
      setAnnotations(data);
    } catch (error) {
      console.error("Failed to fetch annotations", error);
    }
  };

  // Create stable callbacks that don't change on every render
  const handleSelection = useCallback((selection) => {
    if (selection && selection.text.trim().length > 0) {
      setClickedAnnotationCfi(null);
      setCurrentSelection(selection);
      setShowControls(false);
    } else {
      setCurrentSelection(null);
    }
  }, []); // Empty deps - function never changes

  const handleHighlightClick = useCallback(({ cfiRange }) => {
    const clickedAnnotation = annotationsRef.current.find(a => a.textLocation === cfiRange);
    if (clickedAnnotation) {
      setCurrentSelection(null);
      setClickedAnnotationCfi(cfiRange);
      setShowControls(false);
    } else {
      setClickedAnnotationCfi(null);
      setCurrentSelection(null);
      if (isFullScreenRef.current) {
        setShowControls(prev => !prev);
      }
    }
  }, []); // Empty deps - uses refs

  const handleLocationChange = useCallback((location) => {
    if (location && location.end && typeof location.end.percentage === 'number') {
      setProgress(location.end.percentage);
      saveProgressDebounced(location.end.percentage, itemId);
    }
  }, [itemId, saveProgressDebounced]);

  const handleTap = useCallback(() => {
    if (currentSelectionRef.current || clickedAnnotationCfiRef.current) {
      setCurrentSelection(null);
      setClickedAnnotationCfi(null);
      setShowControls(true);
      return;
    }
    if (isFullScreenRef.current) {
      setShowControls(prev => !prev);
    }
  }, []); // Empty deps - uses refs

  const handleReaderReady = useCallback(() => {
    setIsReaderReady(true);
  }, []);

  const handleSaveAnnotation = async (note = '', isNote = false) => {
    if (currentSelection && fileFormat === 'epub') {
      const { text, cfiRange } = currentSelection;
      const isAlreadyHighlighted = annotations.some(a => a.textLocation === cfiRange);
      if (isAlreadyHighlighted) {
        if (Platform.OS === 'android') {
          const { ToastAndroid } = require('react-native');
          ToastAndroid.show('Text is already highlighted.', ToastAndroid.SHORT);
        }
        return;
      }

      const noteToSave = note || text;
      const highlightColor = '#FFFF00';

      try {
        const newAnnotation = await createAnnotation(itemId, cfiRange, highlightColor, noteToSave, isNote);
        if (newAnnotation) {
          if (Platform.OS === 'android') {
            const { ToastAndroid } = require('react-native');
            ToastAndroid.show('Annotation saved', ToastAndroid.SHORT);
          }
          if (readerRef.current) {
            readerRef.current.highlight(cfiRange, highlightColor);
          }
          setCurrentSelection(null);
          setNoteModalVisible(false);
          fetchAnnotations();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to save annotation', [{ text: 'OK' }]);
      }
    } else if (fileFormat === 'pdf') {
      if (Platform.OS === 'android') {
        const { ToastAndroid } = require('react-native');
        ToastAndroid.show('PDF annotations coming soon', ToastAndroid.SHORT);
      }
    }
  };

  const handleRemoveHighlight = async () => {
    if (clickedAnnotationCfi && fileFormat === 'epub') {
      try {
        const annotationToRemove = annotations.find(a => a.textLocation === clickedAnnotationCfi);
        if (annotationToRemove) {
          await deleteAnnotation(annotationToRemove.annotationId);
          if (readerRef.current) {
            readerRef.current.removeHighlight(clickedAnnotationCfi);
          }
          setClickedAnnotationCfi(null);
          fetchAnnotations();
          if (Platform.OS === 'android') {
            const { ToastAndroid } = require('react-native');
            ToastAndroid.show('Highlight removed', ToastAndroid.SHORT);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to remove highlight', [{ text: 'OK' }]);
        console.error(error);
      }
    }
  };

  const handleIncreaseFontSize = useCallback(() => {
    if (fileFormat === 'epub') {
      setEpubFontSize(prev => {
        const newSize = Math.min(prev + 10, 200);
        if (Platform.OS === 'android') {
          const { ToastAndroid } = require('react-native');
          ToastAndroid.show(`Font size: ${newSize}%`, ToastAndroid.SHORT);
        }
        return newSize;
      });
    } else if (fileFormat === 'pdf') {
      setPdfScale(prev => {
        const newScale = Math.min(prev + 0.2, 3.0);
        if (readerRef.current) {
          readerRef.current.setScale(newScale);
        }
        if (Platform.OS === 'android') {
          const { ToastAndroid } = require('react-native');
          ToastAndroid.show(`Zoom: ${Math.round(newScale * 100)}%`, ToastAndroid.SHORT);
        }
        return newScale;
      });
    }
  }, [fileFormat]);

  const handleDecreaseFontSize = useCallback(() => {
    if (fileFormat === 'epub') {
      setEpubFontSize(prev => {
        const newSize = Math.max(prev - 10, 50);
        if (Platform.OS === 'android') {
          const { ToastAndroid } = require('react-native');
          ToastAndroid.show(`Font size: ${newSize}%`, ToastAndroid.SHORT);
        }
        return newSize;
      });
    } else if (fileFormat === 'pdf') {
      setPdfScale(prev => {
        const newScale = Math.max(prev - 0.2, 0.5);
        if (readerRef.current) {
          readerRef.current.setScale(newScale);
        }
        if (Platform.OS === 'android') {
          const { ToastAndroid } = require('react-native');
          ToastAndroid.show(`Zoom: ${Math.round(newScale * 100)}%`, ToastAndroid.SHORT);
        }
        return newScale;
      });
    }
  }, [fileFormat]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={{ color: theme.colors.text.primary, marginTop: 10 }}>
          {downloadProgress > 0 && downloadProgress < 100
            ? `Downloading ${fileFormat.toUpperCase()}... ${downloadProgress}%`
            : `Loading ${fileFormat.toUpperCase()}...`
          }
        </Text>
      </View>
    );
  }

  const renderActionMenu = () => {
    if (clickedAnnotationCfi && fileFormat === 'epub') {
      return (
        <View style={styles.actionMenu}>
          <TouchableOpacity onPress={handleRemoveHighlight} style={styles.actionButton}>
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    if (currentSelection) {
      return (
        <>
          <View style={styles.actionMenu}>
            {fileFormat === 'epub' && (
              <>
                <TouchableOpacity onPress={() => handleSaveAnnotation()} style={styles.actionButton}>
                  <MaterialIcons name="border-color" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setNoteModalVisible(true)} style={styles.actionButton}>
                  <MaterialIcons name="note-add" size={24} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
          <NoteModal
            isVisible={isNoteModalVisible}
            onClose={() => setNoteModalVisible(false)}
            selectedText={currentSelection.text}
            onSave={(noteText) => handleSaveAnnotation(noteText, true)}
          />
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {((!isFullScreen || (isFullScreen && showControls)) && !currentSelection && !clickedAnnotationCfi) && (
        <ReaderControls
          onToggleFullScreen={toggleFullScreen}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
          isFullScreen={isFullScreen}
          currentFontSize={fileFormat === 'epub' ? epubFontSize : pdfScale}
          format={fileFormat}
        />
      )}
      <View style={styles.readerContainer}>
        {fileFormat === 'epub' ? (
          <EpubReader
            key="epub-reader"
            ref={readerRef}
            bookData={bookData}
            initialLocation={initialLocation}
            onSelection={handleSelection}
            onLocationChange={handleLocationChange}
            onReady={handleReaderReady}
            onTap={handleTap}
            onHighlightClick={handleHighlightClick}
            fontSize={epubFontSize}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {Platform.OS === 'android' ? (
              <PdfReader
                key="pdf-reader-android"
                ref={readerRef}
                pdfData={bookData}
                onReady={handleReaderReady}
                scale={pdfScale}
              />
            ) : (
              <WebView
                key="pdf-reader-ios"
                source={{ uri: bookData }}
                style={{ flex: 1, backgroundColor: '#525659' }}
                originWhitelist={['*']}
                onLoadEnd={() => {
                  console.log('[BookReader] PDF WebView loaded');
                  handleReaderReady();
                }}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error('[BookReader] WebView error:', nativeEvent);
                  Alert.alert('PDF Error', 'Failed to load PDF in viewer', [{ text: 'OK' }]);
                }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#007AFF" />
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>
      {!isReaderReady && (
        <View style={[styles.center, styles.loadingOverlay]}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={{ color: theme.colors.primary.main, marginTop: 10 }}>Rendering...</Text>
        </View>
      )}
      {renderActionMenu()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  actionMenu: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    zIndex: 20,
  },
  actionButton: {
    padding: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  fontSizeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  controlButton: {
    padding: 10,
  },
  readerContainer: {
    flex: 1,
  }
});

export default BookReaderScreen;