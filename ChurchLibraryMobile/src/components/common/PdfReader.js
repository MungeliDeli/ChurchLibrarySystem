import React, { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <title>PDF Reader</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
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
      background-color: #525659;
    }
    #container {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
    }
    .page-container {
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      background: white;
      position: relative;
    }
    canvas {
      display: block;
      max-width: 100%;
      height: auto;
    }
    .text-layer {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      opacity: 0.2;
      line-height: 1.0;
    }
    .text-layer > span {
      color: transparent;
      position: absolute;
      white-space: pre;
      cursor: text;
      transform-origin: 0% 0%;
    }
    .text-layer .highlight {
      background-color: rgba(255, 255, 0, 0.4);
      border-radius: 2px;
    }
    .text-layer ::selection {
      background: rgba(0, 100, 255, 0.3);
    }
    #loading {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 18px;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div id="loading">Loading PDF...</div>
  <div id="container"></div>

  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    let pdfDoc = null;
    let scale = 1.5; // Default scale
    let currentPage = 1;
    let highlightedRanges = [];
    let isRendering = false; // Prevent multiple simultaneous renders
    
    const container = document.getElementById('container');
    const loading = document.getElementById('loading');

    const log = (message) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "log", data: message }));
    };

    log("PDF Reader script loaded");

    function renderPage(pageNum) {
      return pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: scale });
        
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container';
        pageContainer.setAttribute('data-page-number', pageNum);
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        pageContainer.appendChild(canvas);
        
        const textLayer = document.createElement('div');
        textLayer.className = 'text-layer';
        textLayer.style.width = viewport.width + 'px';
        textLayer.style.height = viewport.height + 'px';
        pageContainer.appendChild(textLayer);
        
        container.appendChild(pageContainer);

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        
        return renderTask.promise.then(() => {
          return page.getTextContent();
        }).then(textContent => {
          // Render text layer for selection
          textContent.items.forEach(item => {
            const tx = pdfjsLib.Util.transform(
              pdfjsLib.Util.transform(viewport.transform, item.transform),
              [1, 0, 0, -1, 0, 0]
            );
            
            const span = document.createElement('span');
            span.textContent = item.str;
            span.style.left = tx[4] + 'px';
            span.style.top = tx[5] + 'px';
            span.style.fontSize = Math.abs(tx[3]) + 'px';
            span.style.fontFamily = item.fontName;
            
            textLayer.appendChild(span);
          });
          
          return pageNum;
        });
      });
    }

    function renderAllPages() {
      if (isRendering) {
        log("Already rendering, skipping...");
        return Promise.resolve();
      }
      
      isRendering = true;
      container.innerHTML = '';
      const numPages = pdfDoc.numPages;
      
      let promise = Promise.resolve();
      for (let i = 1; i <= numPages; i++) {
        promise = promise.then(() => renderPage(i));
      }
      
      return promise.then(() => {
        loading.style.display = 'none';
        isRendering = false;
        log("All pages rendered");
        // Give a small delay to ensure everything is settled
        setTimeout(() => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "ready" }));
        }, 100);
      }).catch(error => {
        isRendering = false;
        log("Error rendering pages: " + error.message);
        loading.textContent = "Error rendering pages";
      });
    }

    function setScale(newScale) {
      if (newScale === scale) {
        log("Scale unchanged, skipping re-render");
        return;
      }
      log("Changing scale from " + scale + " to " + newScale);
      scale = newScale;
      renderAllPages();
    }

    // Handle text selection
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText.length > 0) {
        log("Text selected: " + selectedText);
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: "selection", 
          data: { text: selectedText }
        }));
      }
    });

    // Handle touch end for mobile
    document.addEventListener('touchend', () => {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
          log("Text selected: " + selectedText);
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: "selection", 
            data: { text: selectedText }
          }));
        }
      }, 100);
    });

    // Handle tap detection
    let tapTimeout;
    document.addEventListener('touchstart', () => {
      tapTimeout = setTimeout(() => {
        const selection = window.getSelection();
        if (selection.toString().length === 0) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "tapped" }));
        }
      }, 200);
    });

    document.addEventListener('touchmove', () => {
      clearTimeout(tapTimeout);
    });

    // Handle scroll for progress tracking
    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = (container.scrollTop / (container.scrollHeight - container.clientHeight)) || 0;
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: "locationChange", 
          data: { end: { percentage: scrollPercentage } }
        }));
      }, 500);
    });

    // Message handler
    document.addEventListener("message", function(event) {
      try {
        const messageData = JSON.parse(event.data);
        
        if (messageData.pdfData) {
          log("PDF data received");
          const pdfData = atob(messageData.pdfData);
          const pdfArray = new Uint8Array(pdfData.length);
          for (let i = 0; i < pdfData.length; i++) {
            pdfArray[i] = pdfData.charCodeAt(i);
          }
          
          // Set initial scale if provided
          if (messageData.scale) {
            scale = messageData.scale;
          }
          
          const loadingTask = pdfjsLib.getDocument({ data: pdfArray });
          loadingTask.promise.then(pdf => {
            log("PDF loaded successfully. Pages: " + pdf.numPages);
            pdfDoc = pdf;
            return renderAllPages();
          }).then(() => {
            log("Rendering complete");
          }).catch(error => {
            log("Error loading PDF: " + error.message);
            loading.textContent = "Error loading PDF: " + error.message;
            // Send error as ready so loading overlay is removed
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: "ready",
              error: error.message 
            }));
          });
          
        } else if (messageData.type === 'setScale') {
          log("Received setScale message with scale: " + messageData.scale);
          setScale(messageData.scale);
          
        } else if (messageData.type === 'goToPage') {
          const pageNum = messageData.page;
          const pageElement = document.querySelector(\`[data-page-number="\${pageNum}"]\`);
          if (pageElement) {
            pageElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } catch (e) {
        log("ERROR: " + e.message);
      }
    });

    log("PDF Reader ready for data");
  </script>
</body>
</html>
`;

const PdfReader = React.forwardRef(({ 
    pdfData, 
    onSelection, 
    onLocationChange, 
    onReady, 
    onTap,
    scale = 1.5
}, ref) => {
  const webViewRef = useRef(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const readyTimeoutRef = useRef(null);
  const previousScaleRef = useRef(scale); // Track previous scale

  React.useImperativeHandle(ref, () => ({
    goToPage: (pageNumber) => {
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type: 'goToPage', page: pageNumber }));
      }
    },
    setScale: (newScale) => {
      if (webViewRef.current && newScale !== previousScaleRef.current) {
        console.log('Setting scale from', previousScaleRef.current, 'to', newScale);
        webViewRef.current.postMessage(JSON.stringify({ type: 'setScale', scale: newScale }));
        previousScaleRef.current = newScale;
      }
    }
  }));

  useEffect(() => {
    if (webViewRef.current && pdfData && isWebViewReady) {
      const message = { pdfData, scale };
      webViewRef.current.postMessage(JSON.stringify(message));
      previousScaleRef.current = scale; // Initialize the ref
      
      // Fallback: If ready event doesn't fire within 10 seconds, assume it's ready
      readyTimeoutRef.current = setTimeout(() => {
        console.log('[PdfReader] Timeout - forcing ready state');
        onReady && onReady();
      }, 10000);
    }
  }, [pdfData, isWebViewReady]);

  useEffect(() => {
    return () => {
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
      }
    };
  }, []);

  // Remove the problematic useEffect that sends scale on every render
  // Scale changes are now handled through the imperative ref method only

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('[PdfReader] Received message:', message.type); // Debug log
      switch (message.type) {
        case 'log':
          console.log(`[PDF WebView Log] ${message.data}`);
          break;
        case 'selection':
          onSelection && onSelection(message.data);
          break;
        case 'tapped':
          onTap && onTap();
          break;
        case 'ready':
          console.log('[PdfReader] PDF is ready'); // Debug log
          // Clear the timeout since we got the ready message
          if (readyTimeoutRef.current) {
            clearTimeout(readyTimeoutRef.current);
            readyTimeoutRef.current = null;
          }
          onReady && onReady();
          break;
        case 'locationChange':
          onLocationChange && onLocationChange(message.data);
          break;
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ html }}
      style={{ flex: 1, backgroundColor: '#525659' }}
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

export default PdfReader;