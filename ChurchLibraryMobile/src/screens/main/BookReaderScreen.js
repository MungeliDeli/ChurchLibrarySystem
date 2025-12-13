import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ToastAndroid, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EpubReader from '../../components/common/EpubReader';
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

const ReaderControls = ({ onToggleFullScreen, onIncreaseFontSize, onDecreaseFontSize, isFullScreen }) => {
    const { theme } = useTheme();
  
    return (
      <View style={[styles.controlsContainer, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity onPress={onDecreaseFontSize} style={styles.controlButton}>
          <MaterialIcons name="format-size" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncreaseFontSize} style={styles.controlButton}>
          <MaterialIcons name="format-size" size={30} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleFullScreen} style={styles.controlButton}>
          <MaterialIcons name={isFullScreen ? "fullscreen-exit" : "fullscreen"} size={30} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>
    );
};

function BookReaderScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { downloadUrl, itemId, initialLocation } = route.params;
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [clickedAnnotationCfi, setClickedAnnotationCfi] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isReaderReady, setIsReaderReady] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const epubReaderRef = useRef(null);

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
        }
      };
      xhr.onerror = function() {
          setIsLoading(false);
      };
      xhr.send();
    }
  }, [downloadUrl]);

  // --- Progress Saving ---
  const saveProgress = useCallback(debounce(async (p) => {
    if (itemId && p > 0) {
      await saveReadingProgress(itemId, p);
    }
  }, 10000), [itemId]);

  useEffect(() => {
    if (itemId) {
      logActivity('Read', itemId).catch(err => console.error("Failed to log activity:", err));
    }
    return () => {
      if (itemId && progress > 0) {
        saveReadingProgress(itemId, progress);
      }
    };
  }, [itemId, progress]);

  // --- Annotations ---
  useEffect(() => {
    if(itemId) fetchAnnotations();
  }, [itemId]);

  useEffect(() => {
    if (isReaderReady && annotations.length > 0) {
      annotations.forEach(annotation => {
        if (annotation.textLocation && epubReaderRef.current) {
            epubReaderRef.current.highlight(annotation.textLocation, annotation.highlightColor);
        }
      });
    }
  }, [isReaderReady, annotations]);

  useEffect(() => {
    if (isReaderReady && initialLocation && epubReaderRef.current) {
      epubReaderRef.current.goTo(initialLocation);
    }
  }, [isReaderReady, initialLocation]);
  
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
    if (currentSelection) {
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
          if (epubReaderRef.current) {
            epubReaderRef.current.highlight(cfiRange, highlightColor);
          }
          setCurrentSelection(null);
          setNoteModalVisible(false);
          fetchAnnotations();
        }
      } catch (error) {
        ToastAndroid.show("Failed to save annotation", ToastAndroid.SHORT);
      }
    }
  };

  const handleRemoveHighlight = async () => {
    if (clickedAnnotationCfi) {
        try {
            const annotationToRemove = annotations.find(a => a.textLocation === clickedAnnotationCfi);
            if (annotationToRemove) {
                await deleteAnnotation(annotationToRemove.annotationId);
                if (epubReaderRef.current) {
                    epubReaderRef.current.removeHighlight(clickedAnnotationCfi);
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


  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={{ color: theme.colors.text.primary, marginTop: 10 }}>Loading Book...</Text>
      </View>
    );
  }

  const renderActionMenu = () => {
    if (clickedAnnotationCfi) {
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
                    <TouchableOpacity onPress={() => handleSaveAnnotation()} style={styles.actionButton}>
                        <MaterialIcons name="border-color" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setNoteModalVisible(true)} style={styles.actionButton}>
                        <MaterialIcons name="note-add" size={24} color="white" />
                    </TouchableOpacity>
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
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {((!isFullScreen || (isFullScreen && showControls)) && !currentSelection && !clickedAnnotationCfi) && (
        <ReaderControls
          onToggleFullScreen={toggleFullScreen}
          onIncreaseFontSize={() => setFontSize(prev => Math.min(prev + 10, 200))}
          onDecreaseFontSize={() => setFontSize(prev => Math.max(prev - 10, 50))}
          isFullScreen={isFullScreen}
        />
      )}
      <View style={styles.readerContainer}>
          <EpubReader
            ref={epubReaderRef}
            bookData={bookData}
            initialLocation={initialLocation}
            onSelection={handleSelection}
            onLocationChange={handleLocationChange}
            onReady={() => setIsReaderReady(true)}
            onTap={() => {
                if(currentSelection || clickedAnnotationCfi) {
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
            fontSize={fontSize}
          />
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  controlButton: {
    padding: 10,
  },
  readerContainer: {
      flex: 1,
  }
});

export default BookReaderScreen;
