import api from './api';

export const getUserAnnotations = async () => {
  try {
    const response = await api.get('/annotations');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user annotations:', error);
    throw error;
  }
};

export const createAnnotation = async (itemId, textLocation, highlightColor, note, isNote = false) => {
  try {
    const response = await api.post('/annotations', { itemId, textLocation, highlightColor, note, isNote });
    return response.data;
  } catch (error) {
    console.error('Failed to create annotation:', error);
    throw error;
  }
};

export const getAnnotationsByItem = async (itemId) => {
  try {
    const response = await api.get(`/annotations/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch annotations for item:', error);
    throw error;
  }
};

export const deleteAnnotation = async (annotationId) => {
    try {
      const response = await api.delete(`/annotations/${annotationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete annotation:', error);
      throw error;
    }
};

export const updateAnnotation = async (annotationId, note, isNote) => {
    try {
        const response = await api.put(`/annotations/${annotationId}`, { note, isNote });
        return response.data;
    } catch (error) {
        console.error('Failed to update annotation:', error);
        throw error;
    }
};
