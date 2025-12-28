import api from './api';
import { getUserToken } from './storageService';

export const logActivity = async (actionType, affectedResource) => {
  try {
    // Check if user is authenticated
    const token = await getUserToken();
    if (!token) {
      console.log('[Activity] Skipping activity log - user not authenticated');
      return { ok: true, skipped: true }; // Don't treat as error for guests
    }

    const response = await api.post('/activity/log', {
      actionType,
      affectedResource,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    // Don't log error for 401/403 - these are expected for guests
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('[Activity] Skipping activity log - authentication required');
      return { ok: false, skipped: true };
    }
    console.error('Failed to log activity:', error);
    return { ok: false, message: error.message };
  }
};
