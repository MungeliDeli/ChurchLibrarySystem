import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import useTheme from '../../hooks/useTheme';

function BookReaderScreen({ route }) {
  const { theme } = useTheme();
  const { downloadUrl } = route.params;

  if (!downloadUrl) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={{ color: theme.colors.text.primary }}>Error: Book URL not found.</Text>
      </View>
    );
  }

  // For displaying PDF in WebView, we need to ensure the URL is correctly formatted
  // and sometimes, especially on iOS, it might need to be embedded in Google Docs viewer
  // or similar, but for direct PDF links, WebView often handles it.
  // A common trick for direct PDF viewing in WebView is to append #toolbar=0&navpanes=0
  // but this is browser-specific and might not work on all platforms/WebViews.
  // The most reliable way is often to use Google Docs Viewer for PDFs.
  const pdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(downloadUrl)}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <WebView
        source={{ uri: pdfViewerUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.center, styles.loadingOverlay]}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          // You might want to display an error message to the user here
        }}
      />
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
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent white overlay
  },
});

export default BookReaderScreen;
