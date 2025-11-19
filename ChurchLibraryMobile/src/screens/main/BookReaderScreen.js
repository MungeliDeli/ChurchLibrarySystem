import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ToastAndroid, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import useTheme from '../../hooks/useTheme';
import { addToReadingList, addToDownloads } from '../../services/libraryService';
import { createAnnotation, getAnnotationsByItem, deleteAnnotation } from '../../services/libraryService';

function BookReaderScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { downloadUrl, itemId } = route.params;
  const [zoom, setZoom] = useState(100);
  const [selectedText, setSelectedText] = useState('');
  const [annotations, setAnnotations] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    fetchAnnotations();
  }, []);

  const fetchAnnotations = async () => {
    const result = await getAnnotationsByItem(itemId);
    if (result.ok) {
      setAnnotations(result.data);
      if (webViewRef.current) {
        const highlightScript = result.data.map(anno => `
          var content = document.body.innerHTML;
          var highlightedContent = content.replace('${anno.textLocation}', '<mark style="background-color: ${anno.highlightColor};">${anno.textLocation}</mark>');
          document.body.innerHTML = highlightedContent;
        `).join('');
        webViewRef.current.injectJavaScript(highlightScript);
      }
    }
  };

  const injectedJavaScript = `
    let startY;
    document.addEventListener('touchstart', function (e) {
      startY = e.touches[0].pageY;
    });
    document.addEventListener('touchend', function (e) {
      let endY = e.changedTouches[0].pageY;
      if (Math.abs(startY - endY) < 10) {
        window.ReactNativeWebView.postMessage('click');
      }
    });
    window.addEventListener('selectionchange', function() {
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        window.ReactNativeWebView.postMessage(selection.toString());
      }
    });
  `;

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'click') {
      setShowControls(prev => !prev);
    } else {
      setSelectedText(event.nativeEvent.data);
    }
  };

  const handleHighlight = async () => {
    if (selectedText) {
      const result = await createAnnotation(itemId, selectedText, '#FFFF00', '');
      if (result.ok) {
        ToastAndroid.show('Highlight added', ToastAndroid.SHORT);
        setSelectedText('');
        fetchAnnotations();
      } else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    }
  };

  const handleDeleteAnnotation = async (annotationId) => {
    const result = await deleteAnnotation(annotationId);
    if (result.ok) {
      ToastAndroid.show('Annotation deleted', ToastAndroid.SHORT);
      fetchAnnotations();
    } else {
      ToastAndroid.show(result.message, ToastAndroid.SHORT);
    }
  };

  const handleAddToReadingList = async () => {
    const result = await addToReadingList(itemId);
    if (result.ok) {
      ToastAndroid.show('Added to reading list', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(result.message, ToastAndroid.SHORT);
    }
  };

  const handleDownload = async () => {
    const result = await addToDownloads(itemId);
    if (result.ok) {
      ToastAndroid.show('Added to downloads', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(result.message, ToastAndroid.SHORT);
    }
  };

  if (!downloadUrl) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={{ color: theme.colors.text.primary }}>Error: Book URL not found.</Text>
      </View>
    );
  }

  const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(downloadUrl)}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: pdfViewerUrl }}
        style={styles.webview}
        startInLoadingState={true}
        textZoom={zoom}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        androidLayerType="software"
        renderLoading={() => (
          <View style={[styles.center, styles.loadingOverlay]}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
      {selectedText ? (
        <View style={styles.highlightMenu}>
          <TouchableOpacity onPress={handleHighlight} style={styles.highlightButton}>
            <Text style={styles.highlightButtonText}>Highlight</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleAddToReadingList} style={styles.button}>
            <Text style={styles.buttonText}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} style={styles.button}>
            <Text style={styles.buttonText}>⬇️</Text>
          </TouchableOpacity>
          <View style={styles.zoomControls}>
            <TouchableOpacity onPress={() => setZoom(prev => prev + 10)} style={styles.zoomButton}>
              <Text style={styles.zoomButtonText}>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setZoom(prev => Math.max(50, prev - 10))} style={styles.zoomButton}>
              <Text style={styles.zoomButtonText}>➖</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showControls && (
        <View style={styles.annotationsContainer}>
          <Text style={styles.annotationsTitle}>Annotations</Text>
          <FlatList
            data={annotations}
            keyExtractor={(item) => item.annotationId.toString()}
            renderItem={({ item }) => (
              <View style={styles.annotationItem}>
                <Text style={{color: 'white'}}>{item.textLocation}</Text>
                <TouchableOpacity onPress={() => handleDeleteAnnotation(item.annotationId)}>
                  <Text style={styles.deleteButton}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
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
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    borderRadius: 25,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  zoomControls: {
    flexDirection: 'row',
  },
  zoomButton: {
    padding: 10,
    marginLeft: 10,
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  highlightMenu: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 5,
    padding: 10,
  },
  highlightButton: {
    padding: 5,
  },
  highlightButtonText: {
    color: 'white',
    fontSize: 16,
  },
  annotationsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  annotationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  annotationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteButton: {
    color: 'red',
    fontSize: 20,
  },
});

export default BookReaderScreen;
