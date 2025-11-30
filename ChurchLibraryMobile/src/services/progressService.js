import api from './api';

export const saveReadingProgress = async (itemId, progress) => {
  try {
    const response = await api.post('/progress', {
      itemId,
      progress,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Failed to save reading progress:', error);
    return { ok: false, message: error.message };
  }
};
