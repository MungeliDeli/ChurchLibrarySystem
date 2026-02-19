// Using legacy import to avoid deprecation error for createDownloadResumable
// See: https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DOWNLOADS_STORAGE_KEY = 'downloaded_books';

// Helper to get all downloaded books metadata
export const getDownloadedBooks = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(DOWNLOADS_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
        console.error("Error reading downloaded books:", e);
        return {};
    }
};

// Check if a specific book is downloaded
export const isBookDownloaded = async (itemId) => {
    const downloads = await getDownloadedBooks();
    if (!downloads[itemId]) return false;

    // Verify file still exists
    const fileInfo = await FileSystem.getInfoAsync(downloads[itemId].localUri);
    if (!fileInfo.exists) {
        // Clean up if file is missing
        await removeDownloadedBook(itemId);
        return false;
    }
    return true;
};

// Download a book
export const downloadBook = async (book, onProgress) => {
    try {
        const { itemId, downloadUrl, title, format } = book;
        if (!downloadUrl) throw new Error('No download URL provided');

        // Create a safe filename
        const fileExtension = format === 'pdf' ? '.pdf' : '.epub';
        const filename = `${itemId}${fileExtension}`;
        const fileUri = FileSystem.documentDirectory + filename;

        // Create download resumable
        const downloadResumable = FileSystem.createDownloadResumable(
            downloadUrl,
            fileUri,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                if (onProgress) onProgress(progress);
            }
        );

        const result = await downloadResumable.downloadAsync();

        if (result && result.uri) {
            // Get file size
            const fileInfo = await FileSystem.getInfoAsync(result.uri);
            const fileSize = fileInfo.size || 0;

            // Save metadata
            const downloads = await getDownloadedBooks();
            downloads[itemId] = {
                itemId,
                title,
                localUri: result.uri,
                format,
                coverImageUrl: book.coverImageUrl || null,
                authors: book.authors || [],
                fileSize,
                downloadedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
            return result.uri;
        } else {
            throw new Error('Download failed to produce a URI');
        }

    } catch (e) {
        console.error("Download error:", e);
        throw e;
    }
};

// Remove a downloaded book
export const removeDownloadedBook = async (itemId) => {
    try {
        const downloads = await getDownloadedBooks();
        const book = downloads[itemId];

        if (book && book.localUri) {
            // Delete file
            await FileSystem.deleteAsync(book.localUri, { idempotent: true });
        }

        // Remove from metadata
        delete downloads[itemId];
        await AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
        return true;
    } catch (e) {
        console.error("Error removing book:", e);
        return false;
    }
};

// Remove multiple downloaded books
export const removeMultipleBooks = async (itemIds) => {
    try {
        const downloads = await getDownloadedBooks();

        // Process deletions in parallel
        await Promise.all(itemIds.map(async (itemId) => {
            const book = downloads[itemId];
            if (book && book.localUri) {
                try {
                    await FileSystem.deleteAsync(book.localUri, { idempotent: true });
                } catch (err) {
                    console.error(`Failed to delete file for book ${itemId}:`, err);
                }
            }
            delete downloads[itemId];
        }));

        // Update metadata once
        await AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
        return true;
    } catch (e) {
        console.error("Error removing multiple books:", e);
        return false;
    }
};

export const getLocalBookUri = async (itemId) => {
    const downloads = await getDownloadedBooks();
    return downloads[itemId] ? downloads[itemId].localUri : null;
};

// Get total storage used by all downloads
export const getTotalStorageUsed = async () => {
    try {
        const downloads = await getDownloadedBooks();
        let totalSize = 0;

        for (const book of Object.values(downloads)) {
            totalSize += book.fileSize || 0;
        }

        return totalSize;
    } catch (e) {
        console.error("Error calculating storage:", e);
        return 0;
    }
};

// Delete all downloaded books
export const deleteAllDownloads = async () => {
    try {
        const downloads = await getDownloadedBooks();

        // Delete all files
        for (const book of Object.values(downloads)) {
            if (book.localUri) {
                await FileSystem.deleteAsync(book.localUri, { idempotent: true });
            }
        }

        // Clear metadata
        await AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify({}));
        return true;
    } catch (e) {
        console.error("Error deleting all downloads:", e);
        return false;
    }
};
