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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    #viewer {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
    .hl {
      background-color: rgba(255, 255, 0, 0.3);
      cursor: pointer;
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

    log("WebView script loaded for continuous scrolling view.");

    document.addEventListener("message", function(event) {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.bookData) {
          log("Book data received.");
          book = ePub(messageData.bookData, { encoding: "base64" });
          log("ePub initialized.");

          // Use flow: 'scrolled' for continuous vertical scrolling
          rendition = book.renderTo(viewer, {
            width: "100%",
            height: "100%",
            flow: "scrolled",
            manager: "continuous",
            snap: false
          });
          log("Rendition created for scrolled view.");

          // Make content scrollable
          rendition.hooks.content.register(function(contents) {
            const body = contents.window.document.body;
            const html = contents.window.document.documentElement;
            
            // Enable scrolling
            body.style.overflowY = 'visible';
            body.style.height = 'auto';
            body.style.minHeight = '100%';
            html.style.overflowY = 'visible';
            html.style.height = 'auto';
            
            // Add padding for better readability
            body.style.paddingLeft = '16px';
            body.style.paddingRight = '16px';
            body.style.paddingTop = '16px';
            body.style.paddingBottom = '16px';
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
          
          rendition.on('click', (event) => {
            const selection = event.view.window.getSelection();
            if (selection.toString().length === 0) {
              log("Tap detected.");
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: "tapped" }));
            }
          });

          // Handle annotation clicks
          rendition.on('markClicked', (cfiRange, data, contents) => {
            log("Annotation clicked: " + cfiRange);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "highlight-clicked", data: { cfiRange } }));
          });

        } else if (messageData.type === 'highlight') {
          rendition.annotations.add('highlight', messageData.cfiRange, {}, () => {}, 'hl', { 'fill': messageData.color });
        } else if (messageData.type === 'remove-highlight') {
          rendition.annotations.remove(messageData.cfiRange, 'highlight');
        } else if (messageData.type === 'goTo') {
          log("Received goTo message with cfi: " + messageData.cfi);
          rendition.display(messageData.cfi);
        } else if (messageData.type === 'setFontSize') {
          log("Received setFontSize message with size: " + messageData.size);
          // Convert percentage to proper format (e.g., "16px" or just the percentage)
          const fontSize = messageData.size;
          rendition.themes.fontSize(fontSize + '%');
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
    fontSize
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
      // Send just the number, the WebView will add the '%'
      webViewRef.current.postMessage(JSON.stringify({ type: 'setFontSize', size: fontSize }));
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
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
      bounces={true}
      nestedScrollEnabled={true}
    />
  );
});

export default EpubReader;