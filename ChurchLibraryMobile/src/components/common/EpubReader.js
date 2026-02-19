import React, { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

// ─── Inline HTML for the ePub reader ────────────────────────────────────────
// • Uses window.addEventListener instead of document.addEventListener so that
//   messages sent by React Native WebView's postMessage are received on iOS.
// • Loads JSZip and epub.js from two CDN mirrors with <script onerror> fallbacks.
// • Shows a visible loading spinner while libraries/book are initialising.
// • Reports errors back to React Native via postMessage so they appear in logs.
// ────────────────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EPUB Reader</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #fff; overflow: hidden; }

    /* Viewer fills the whole page */
    #viewer {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    /* Highlight style applied to epub annotations */
    .hl { background-color: rgba(255, 255, 0, 0.4); cursor: pointer; }

    /* ── Loading overlay ── */
    #status-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      inset: 0;
      background: white;
      z-index: 999;
      font-family: -apple-system, sans-serif;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #4a90e2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 14px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #status-text { color: #555; font-size: 15px; }
    #error-text  { color: #c0392b; font-size: 14px; text-align: center; padding: 0 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div id="viewer"></div>

  <!-- Status overlay shown while libraries / book are loading -->
  <div id="status-overlay">
    <div class="spinner" id="spinner"></div>
    <p id="status-text">Loading reader…</p>
    <p id="error-text" style="display:none;"></p>
  </div>

  <!-- ── Library loading sequence ── -->
  <!-- Primary CDN: cdnjs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
          onerror="loadFallbackJszip()"></script>
  <script>
    function loadFallbackJszip() {
      rn_log('JSZip primary CDN failed, trying fallback…');
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js';
      s.onerror = function() { showError('Failed to load JSZip library. Check your internet connection.'); };
      s.onload  = function() { loadEpubJs(); };
      document.head.appendChild(s);
    }
  </script>

  <!-- Primary epub.js from jsDelivr -->
  <script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"
          onerror="loadFallbackEpubJs()"></script>
  <script>
    function loadFallbackEpubJs() {
      rn_log('epub.js primary CDN failed, trying fallback…');
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/epubjs@0.3.93/dist/epub.min.js';
      s.onerror = function() { showError('Failed to load epub.js library. Check your internet connection.'); };
      s.onload  = function() { rn_log('epub.js loaded from fallback CDN.'); onLibrariesReady(); };
      document.head.appendChild(s);
    }
  </script>

  <script>
    // ── Helpers ──────────────────────────────────────────────────────
    var _overlay    = document.getElementById('status-overlay');
    var _statusText = document.getElementById('status-text');
    var _errorText  = document.getElementById('error-text');
    var _spinner    = document.getElementById('spinner');

    function rn_log(msg) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', data: msg }));
      }
    }

    function rn_send(obj) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(obj));
      }
    }

    function setStatus(msg) {
      _statusText.textContent = msg;
      rn_log(msg);
    }

    function hideOverlay() {
      _overlay.style.display = 'none';
    }

    function showError(msg) {
      _spinner.style.display = 'none';
      _statusText.style.display = 'none';
      _errorText.style.display  = 'block';
      _errorText.textContent = msg;
      rn_send({ type: 'error', data: msg });
    }

    // Global error catcher – ensures any uncaught JS error is surfaced
    window.onerror = function(message, source, lineno, colno, error) {
      var msg = 'JS Error: ' + message + ' (line ' + lineno + ')';
      showError(msg);
      return true; // Prevent default error handling
    };

    // ── State ────────────────────────────────────────────────────────
    var rendition = null;
    var book      = null;
    var currentFontSize = 100;
    var pendingMessage  = null; // Queued message received before libs were ready
    var libsReady = false;

    // ── Called once epub.js finishes loading (either primary or fallback) ──
    function onLibrariesReady() {
      libsReady = true;
      rn_log('All libraries ready.');
      // If a bookData message arrived before libs were ready, process it now
      if (pendingMessage) {
        var msg = pendingMessage;
        pendingMessage = null;
        handleBookDataMessage(msg);
      }
    }

    // Detect when the inline (non-fallback) epub.js finishes loading
    // by checking for ePub global after DOM content loads
    document.addEventListener('DOMContentLoaded', function() {
      // Give scripts a moment to execute, then check
      setTimeout(function() {
        if (typeof ePub !== 'undefined') {
          rn_log('epub.js loaded from primary CDN.');
          onLibrariesReady();
        }
        // If ePub is undefined here the onerror handler on the script tag
        // will have already triggered loadFallbackEpubJs()
      }, 50);
    });

    // ── Message handler (MUST use window, not document, for iOS) ─────
    window.addEventListener('message', function(event) {
      try {
        var messageData = JSON.parse(event.data);

        if (messageData.bookData) {
          if (!libsReady) {
            rn_log('Book data received but libraries not ready yet – queuing.');
            pendingMessage = messageData;
            return;
          }
          handleBookDataMessage(messageData);

        } else if (messageData.type === 'highlight') {
          if (rendition) {
            rendition.annotations.add(
              'highlight', messageData.cfiRange, {},
              function() {}, 'hl', { fill: messageData.color || '#FFFF00', 'fill-opacity': '0.4' }
            );
          }
        } else if (messageData.type === 'remove-highlight') {
          if (rendition) {
            rendition.annotations.remove(messageData.cfiRange, 'highlight');
          }
        } else if (messageData.type === 'goTo') {
          rn_log('goTo: ' + messageData.cfi);
          if (rendition) rendition.display(messageData.cfi);
        } else if (messageData.type === 'setFontSize') {
          var newSize = messageData.size;
          if (newSize !== currentFontSize && rendition) {
            currentFontSize = newSize;
            rendition.themes.fontSize(newSize + '%');
          }
        }
      } catch (e) {
        rn_log('Message parse error: ' + e.message);
      }
    });

    // ── Core: initialise epub.js and render the book ─────────────────
    function handleBookDataMessage(messageData) {
      try {
        setStatus('Parsing ePub…');

        if (typeof ePub === 'undefined') {
          showError('epub.js not loaded. Please check your internet connection and try again.');
          return;
        }

        book = ePub(messageData.bookData, { encoding: 'base64' });
        rn_log('ePub object created.');

        var viewer = document.getElementById('viewer');

        rendition = book.renderTo(viewer, {
          width: '100%',
          height: '100%',
          flow: 'scrolled',
          manager: 'continuous',
          snap: false
        });
        rn_log('Rendition created.');

        // Style each section as it loads
        rendition.hooks.content.register(function(contents) {
          var body = contents.window.document.body;
          var docEl = contents.window.document.documentElement;

          body.style.overflowY   = 'visible';
          body.style.height      = 'auto';
          body.style.minHeight   = '100%';
          body.style.paddingLeft  = '16px';
          body.style.paddingRight = '16px';
          body.style.paddingTop   = '12px';
          body.style.paddingBottom = '12px';
          docEl.style.overflowY  = 'visible';
          docEl.style.height     = 'auto';

          // Apply current font size to embedded content
          if (currentFontSize !== 100) {
            body.style.fontSize = currentFontSize + '%';
          }
        });

        // ── Events ──────────────────────────────────────────────────
        rendition.on('displayed', function() {
          rn_log('Rendition displayed – book ready.');
          hideOverlay();
          rn_send({ type: 'ready' });
        });

        rendition.on('relocated', function(location) {
          rn_send({ type: 'locationChange', data: location });
        });

        rendition.on('selected', function(cfiRange, contents) {
          var text = contents.window.getSelection().toString();
          if (text && text.trim().length > 0) {
            rn_log('Text selected: ' + text.substring(0, 60));
            rn_send({ type: 'selection', data: { text: text, cfiRange: cfiRange } });
          }
        });

        rendition.on('click', function(event) {
          try {
            var sel = event.view ? event.view.window.getSelection() : window.getSelection();
            if (!sel || sel.toString().length === 0) {
              rn_send({ type: 'tapped' });
            }
          } catch (e) {
            rn_send({ type: 'tapped' });
          }
        });

        rendition.on('markClicked', function(cfiRange) {
          rn_log('Annotation clicked: ' + cfiRange);
          rn_send({ type: 'highlight-clicked', data: { cfiRange: cfiRange } });
        });

        // Apply initial font size
        if (messageData.fontSize && messageData.fontSize !== 100) {
          currentFontSize = messageData.fontSize;
          rendition.themes.fontSize(currentFontSize + '%');
        }

        // Display the book
        setStatus('Opening book…');
        if (messageData.initialLocation) {
          rendition.display(messageData.initialLocation);
        } else {
          rendition.display();
        }
        rn_log('rendition.display() called.');

      } catch (e) {
        showError('Failed to open ePub: ' + e.message);
      }
    }
  </script>
</body>
</html>`;

// ─── React Native component ──────────────────────────────────────────────────
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
  const previousFontSizeRef = useRef(fontSize);

  // Expose imperative methods to parent
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
        console.log('[EpubReader] Sending goTo:', cfi);
        webViewRef.current.postMessage(JSON.stringify({ type: 'goTo', cfi }));
      }
    }
  }));

  // Send book data once both the WebView and the book data are ready
  useEffect(() => {
    if (webViewRef.current && bookData && isWebViewReady) {
      console.log('[EpubReader] Sending bookData to WebView (base64 length:', bookData.length, ')');
      const message = { bookData, initialLocation, fontSize };
      webViewRef.current.postMessage(JSON.stringify(message));
      previousFontSizeRef.current = fontSize;
    }
  }, [bookData, isWebViewReady, initialLocation]);

  // Send font size changes separately (after initial load)
  useEffect(() => {
    if (
      webViewRef.current &&
      isWebViewReady &&
      fontSize !== undefined &&
      fontSize !== previousFontSizeRef.current
    ) {
      console.log('[EpubReader] Font size changed:', previousFontSizeRef.current, '→', fontSize);
      webViewRef.current.postMessage(JSON.stringify({ type: 'setFontSize', size: fontSize }));
      previousFontSizeRef.current = fontSize;
    }
  }, [fontSize, isWebViewReady]);

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case 'log':
          console.log('[EpubReader WebView]', message.data);
          break;
        case 'error':
          console.error('[EpubReader WebView ERROR]', message.data);
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
    } catch (e) {
      console.error('[EpubReader] Failed to parse WebView message:', e);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ html }}
      style={{ flex: 1 }}
      originWhitelist={['*']}
      onMessage={handleMessage}
      onLoadEnd={() => {
        console.log('[EpubReader] WebView loaded');
        setIsWebViewReady(true);
      }}
      onError={(e) => console.error('[EpubReader] WebView error:', e.nativeEvent)}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      mixedContentMode="always"
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
      bounces={true}
      nestedScrollEnabled={true}
    />
  );
});

export default EpubReader;