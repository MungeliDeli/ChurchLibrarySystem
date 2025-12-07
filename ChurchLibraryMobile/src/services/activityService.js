import api from './api';

export const logActivity = async (actionType, affectedResource) => {
  try {
    const response = await api.post('/activity/log', {
      actionType,
      affectedResource,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    // It's often okay if this fails silently, as it's not critical to the user's immediate experience.
    console.error('Failed to log activity:', error);
    return { ok: false, message: error.message };
  }
};
