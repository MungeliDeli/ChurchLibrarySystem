import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';

/**
 * Native PDF Reader using react-native-pdf
 * Works reliably on iOS without WebView limitations
 * Note: This library doesn't support annotations natively
 */
const PdfReaderNative = React.forwardRef(({
    pdfData,
    onLoadComplete,
    onPageChanged,
    onError,
    scale = 1.0
}, ref) => {
    const pdfRef = React.useRef(null);

    // Create a data URI from base64
    const source = {
        uri: `data:application/pdf;base64,${pdfData}`,
        cache: true
    };

    React.useImperativeHandle(ref, () => ({
        setPage: (pageNumber) => {
            if (pdfRef.current) {
                pdfRef.current.setPage(pageNumber);
            }
        }
    }));

    const handleLoadComplete = (numberOfPages, filePath) => {
        console.log('[PdfReaderNative] PDF loaded successfully. Pages:', numberOfPages);
        onLoadComplete && onLoadComplete(numberOfPages);
    };

    const handlePageChanged = (page, numberOfPages) => {
        console.log('[PdfReaderNative] Page changed:', page, '/', numberOfPages);
        // Calculate progress percentage
        const percentage = page / numberOfPages;
        onPageChanged && onPageChanged({
            page,
            numberOfPages,
            percentage
        });
    };

    const handleError = (error) => {
        console.error('[PdfReaderNative] Error:', error);
        onError && onError(error);
    };

    return (
        <View style={styles.container}>
            <Pdf
                ref={pdfRef}
                source={source}
                onLoadComplete={handleLoadComplete}
                onPageChanged={handlePageChanged}
                onError={handleError}
                style={styles.pdf}
                trustAllCerts={false}
                enablePaging={true}
                horizontal={false}
                spacing={10}
                scale={scale}
                minScale={0.5}
                maxScale={3.0}
                renderActivityIndicator={() => (
                    <ActivityIndicator size="large" color="#007AFF" />
                )}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#525659',
    },
    pdf: {
        flex: 1,
    },
});

export default PdfReaderNative;
