import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ToastAndroid, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

const ReaderControls = ({ 
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
};

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
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Format-specific state
  const [epubFontSize, setEpubFontSize] = useState(100);
  const [pdfScale, setPdfScale] = useState(1.5);
  
  const readerRef = useRef(null);

  // Detect file format from route params or downloadUrl
  const fileFormat = format || (downloadUrl?.includes('.pdf') ? 'pdf' : 'epub');

  useEffect(() => {
    if (downloadUrl) {
      setIsLoading(true);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', downloadUrl, true);
      xhr.responseType = 'blob';

      xhr.onload = function(e) {
        if (this.status == 200) {
          const blob = this.response;
          const reader = new FileReader();
          reader.onload = function() {
            const base64String = reader.result.split(',')[1];
            setBookData(base64String);
            setIsLoading(false);
          };
          reader.readAsDataURL(blob);
        } else {
          setIsLoading(false);
          ToastAndroid.show('Failed to load book', ToastAndroid.SHORT);
        }
      };
      xhr.onerror = function() {
        setIsLoading(false);
        ToastAndroid.show('Failed to load book', ToastAndroid.SHORT);
      };
      xhr.send();
    }
  }, [downloadUrl]);

  // --- Log Reading Activity ---
  useEffect(() => {
    if (itemId) {
      logActivity('Read', itemId).catch(err => console.error("Failed to log activity:", err));
    }
  }, [itemId]);

  // --- Progress Saving ---
  const saveProgress = useCallback(debounce(async (p) => {
    if (itemId && p > 0) {
      await saveReadingProgress(itemId, p);
    }
  }, 10000), [itemId]);

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

  const handleSelection = (selection) => {
    if (selection && selection.text.trim().length > 0) {
      setClickedAnnotationCfi(null);
      setCurrentSelection(selection);
      setShowControls(false);
    } else {
      setCurrentSelection(null);
    }
  };

  const handleHighlightClick = ({ cfiRange }) => {
    const clickedAnnotation = annotations.find(a => a.textLocation === cfiRange);
    if (clickedAnnotation) {
      setCurrentSelection(null);
      setClickedAnnotationCfi(cfiRange);
      setShowControls(false);
    } else {
      setClickedAnnotationCfi(null);
      setCurrentSelection(null);
      if (isFullScreen) {
        setShowControls(prev => !prev);
      }
    }
  };

  const handleLocationChange = (location) => {
    if (location && location.end && typeof location.end.percentage === 'number') {
      setProgress(location.end.percentage);
      saveProgress(location.end.percentage);
    }
  };

  const handleSaveAnnotation = async (note = '', isNote = false) => {
    if (currentSelection && fileFormat === 'epub') {
      const { text, cfiRange } = currentSelection;
      const isAlreadyHighlighted = annotations.some(a => a.textLocation === cfiRange);
      if (isAlreadyHighlighted) {
        ToastAndroid.show('Text is already highlighted.', ToastAndroid.SHORT);
        return;
      }

      const noteToSave = note || text;
      const highlightColor = '#FFFF00';

      try {
        const newAnnotation = await createAnnotation(itemId, cfiRange, highlightColor, noteToSave, isNote);
        if (newAnnotation) {
          ToastAndroid.show('Annotation saved', ToastAndroid.SHORT);
          if (readerRef.current) {
            readerRef.current.highlight(cfiRange, highlightColor);
          }
          setCurrentSelection(null);
          setNoteModalVisible(false);
          fetchAnnotations();
        }
      } catch (error) {
        ToastAndroid.show("Failed to save annotation", ToastAndroid.SHORT);
      }
    } else if (fileFormat === 'pdf') {
      // For PDF, just save the note without CFI range
      ToastAndroid.show('PDF annotations coming soon', ToastAndroid.SHORT);
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
          ToastAndroid.show('Highlight removed', ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show("Failed to remove highlight", ToastAndroid.SHORT);
        console.error(error);
      }
    }
  };

  const handleIncreaseFontSize = () => {
    if (fileFormat === 'epub') {
      setEpubFontSize(prev => {
        const newSize = Math.min(prev + 10, 200);
        ToastAndroid.show(`Font size: ${newSize}%`, ToastAndroid.SHORT);
        return newSize;
      });
    } else if (fileFormat === 'pdf') {
      setPdfScale(prev => {
        const newScale = Math.min(prev + 0.2, 3.0);
        if (readerRef.current) {
          readerRef.current.setScale(newScale);
        }
        ToastAndroid.show(`Zoom: ${Math.round(newScale * 100)}%`, ToastAndroid.SHORT);
        return newScale;
      });
    }
  };

  const handleDecreaseFontSize = () => {
    if (fileFormat === 'epub') {
      setEpubFontSize(prev => {
        const newSize = Math.max(prev - 10, 50);
        ToastAndroid.show(`Font size: ${newSize}%`, ToastAndroid.SHORT);
        return newSize;
      });
    } else if (fileFormat === 'pdf') {
      setPdfScale(prev => {
        const newScale = Math.max(prev - 0.2, 0.5);
        if (readerRef.current) {
          readerRef.current.setScale(newScale);
        }
        ToastAndroid.show(`Zoom: ${Math.round(newScale * 100)}%`, ToastAndroid.SHORT);
        return newScale;
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={{ color: theme.colors.text.primary, marginTop: 10 }}>
          Loading {fileFormat.toUpperCase()}...
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
            ref={readerRef}
            bookData={bookData}
            initialLocation={initialLocation}
            onSelection={handleSelection}
            onLocationChange={handleLocationChange}
            onReady={() => setIsReaderReady(true)}
            onTap={() => {
              if (currentSelection || clickedAnnotationCfi) {
                setCurrentSelection(null);
                setClickedAnnotationCfi(null);
                setShowControls(true);
                return;
              }
              if (isFullScreen) {
                setShowControls(prev => !prev);
              }
            }}
            onHighlightClick={handleHighlightClick}
            fontSize={epubFontSize}
          />
        ) : (
          <PdfReader
            ref={readerRef}
            pdfData={bookData}
            onSelection={handleSelection}
            onLocationChange={handleLocationChange}
            onReady={() => setIsReaderReady(true)}
            onTap={() => {
              if (currentSelection) {
                setCurrentSelection(null);
                setShowControls(true);
                return;
              }
              if (isFullScreen) {
                setShowControls(prev => !prev);
              }
            }}
            scale={pdfScale}
          />
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