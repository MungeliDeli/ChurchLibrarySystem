import api from './api';
import { getUserToken } from './storageService';

export const saveReadingProgress = async (itemId, progress) => {
  try {
    // Check if user is authenticated
    const token = await getUserToken();
    if (!token) {
      console.log('[Progress] Skipping progress save - user not authenticated');
      return { ok: true, skipped: true };
    }

    const response = await api.post('/progress', {
      itemId,
      progress,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    // Don't log error for 401/403
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('[Progress] Skipping progress save - authentication required');
      return { ok: false, skipped: true };
    }
    console.error('Failed to save reading progress:', error);
    return { ok: false, message: error.message };
  }
};
