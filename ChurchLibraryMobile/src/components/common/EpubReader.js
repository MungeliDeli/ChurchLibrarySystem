import React, { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EPUB Reader</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
    #viewer {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    .hl {
        fill-opacity: 0.3;
        mix-blend-mode: multiply;
    }
  </style>
</head>
<body>
  <div id="viewer"></div>

  <script>
    const viewer = document.getElementById("viewer");
    let rendition;
    let book;

    const log = (message) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "log", data: message }));
    };

    log("WebView script loaded for paginated view with vertical scroll.");

    document.addEventListener("message", function(event) {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.bookData) {
          log("Book data received.");
          book = ePub(messageData.bookData, { encoding: "base64" });
          log("ePub initialized.");

          rendition = book.renderTo(viewer, {
            width: "100%",
            height: "100%",
          });
          log("Rendition created for paginated view.");

          // Hook to make content scrollable
          rendition.hooks.content.register(function(contents) {
            contents.window.document.body.style.overflowY = 'auto';
            contents.window.document.body.style.height = '100%';
          });
          
          rendition.on("displayed", () => {
            log("Rendition displayed.");
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "ready" }));
          });

          if (messageData.initialLocation) {
            rendition.display(messageData.initialLocation);
          } else {
            rendition.display();
          }
          log("rendition.display() called.");
          
          rendition.on('relocated', (location) => {
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: "locationChange", data: location }));
          });

          rendition.on('selected', (cfiRange, contents) => {
            const selection = {
              text: contents.window.getSelection().toString(),
              cfiRange: cfiRange
            };
            log("Text selected: " + selection.text);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "selection", data: selection }));
          });
          
          rendition.on('annotations.click', (cfiRange, data, contents) => {
             log("Annotation clicked: " + cfiRange);
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: "highlight-clicked", data: { cfiRange } }));
          });

          // --- Swipe and Tap detection for paginated view ---
          let touchStartX = 0;
          let touchStartY = 0;
          const swipeThreshold = 50;

          rendition.on('touchstart', (event) => {
              touchStartX = event.changedTouches[0].screenX;
              touchStartY = event.changedTouches[0].screenY;
          });

          rendition.on('touchend', (event) => {
              const touchEndX = event.changedTouches[0].screenX;
              const touchEndY = event.changedTouches[0].screenY;
              const swipeDistanceX = touchEndX - touchStartX;
              const swipeDistanceY = Math.abs(touchEndY - touchStartY);

              if (Math.abs(swipeDistanceX) > swipeThreshold && swipeDistanceY < swipeThreshold) {
                  if (swipeDistanceX < 0) {
                      rendition.next();
                  } else {
                      rendition.prev();
                  }
              } else if (Math.abs(swipeDistanceX) < 10 && swipeDistanceY < 10) {
                  const selection = event.view.window.getSelection();
                  if (selection.toString().length === 0) {
                      log("Tap detected.");
                      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "tapped" }));
                  }
              }
          });


        } else if (messageData.type === 'highlight') {
          rendition.annotations.highlight(messageData.cfiRange, {}, () => {}, 'hl', { 'fill': messageData.color });
        } else if (messageData.type === 'remove-highlight') {
            rendition.annotations.remove(messageData.cfiRange, 'highlight');
        } else if (messageData.type === 'goTo') {
          log("Received goTo message with cfi: " + messageData.cfi);
          rendition.display(messageData.cfi);
        } else if (messageData.type === 'setFontSize') {
            log("Received setFontSize message with size: " + messageData.size);
            rendition.themes.fontSize(messageData.size);
        }
      } catch (e) {
        log("ERROR: " + e.message + " | stack: " + e.stack);
      }
    });
  </script>
</body>
</html>
`;

const EpubReader = React.forwardRef(({ 
    bookData, 
    onSelection, 
    onLocationChange, 
    onReady, 
    onTap, 
    initialLocation,
    onHighlightClick,
    fontSize // Added fontSize prop
}, ref) => {
  const webViewRef = useRef(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  React.useImperativeHandle(ref, () => ({
    highlight: (cfiRange, color = '#FFFF00') => {
        if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({ type: 'highlight', cfiRange, color }));
        }
    },
    removeHighlight: (cfiRange) => {
        if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({ type: 'remove-highlight', cfiRange }));
        }
    },
    goTo: (cfi) => {
      if (webViewRef.current) {
        console.log('EpubReader: Sending goTo message with cfi:', cfi);
        webViewRef.current.postMessage(JSON.stringify({ type: 'goTo', cfi }));
      }
    }
  }));

  useEffect(() => {
    if (webViewRef.current && bookData && isWebViewReady) {
      const message = { bookData, initialLocation };
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  }, [bookData, isWebViewReady, initialLocation]);

  useEffect(() => {
    if (webViewRef.current && isWebViewReady && fontSize) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'setFontSize', size: `${fontSize}%` }));
    }
  }, [fontSize, isWebViewReady]);

  const handleMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    switch (message.type) {
      case 'log':
        // console.log(`[WebView Log] ${message.data}`);
        break;
      case 'selection':
        onSelection && onSelection(message.data);
        break;
      case 'tapped':
        onTap && onTap();
        break;
      case 'highlight-clicked':
        onHighlightClick && onHighlightClick(message.data);
        break;
      case 'ready':
        onReady && onReady();
        break;
      case 'locationChange':
        onLocationChange && onLocationChange(message.data);
        break;
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ html }}
      style={{ flex: 1 }}
      originWhitelist={['*']}
      onMessage={handleMessage}
      onLoadEnd={() => setIsWebViewReady(true)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      // Allow gestures to be handled by the WebView content
      gestureHandlerProps={{ 
        onHandlerStateChange: (event) => {
          // You might need to handle gesture conflicts here if any arise
        },
        onGestureEvent: (event) => {
          // Handle gestures if needed, but for scrolling, this is often enough
        }
      }}
    />
  );
});

export default EpubReader;
