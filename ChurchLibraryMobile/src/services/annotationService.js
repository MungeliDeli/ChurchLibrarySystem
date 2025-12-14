import api from './api';
import { getUserToken } from './storageService';

export const getUserAnnotations = async () => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.log('[Annotations] User not authenticated - returning empty array');
      return [];
    }

    const response = await api.get('/annotations');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('[Annotations] User not authenticated - returning empty array');
      return [];
    }
    console.error('Failed to fetch user annotations:', error);
    throw error;
  }
};

export const createAnnotation = async (itemId, textLocation, highlightColor, note, isNote = false) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.log('[Annotations] Cannot create annotation - user not authenticated');
      throw new Error('Please log in to save annotations');
    }

    const response = await api.post('/annotations', { 
      itemId, 
      textLocation, 
      highlightColor, 
      note, 
      isNote 
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Please log in to save annotations');
    }
    console.error('Failed to create annotation:', error);
    throw error;
  }
};

export const getAnnotationsByItem = async (itemId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      console.log('[Annotations] User not authenticated - returning empty array');
      return [];
    }

    const response = await api.get(`/annotations/${itemId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('[Annotations] User not authenticated - returning empty array');
      return [];
    }
    console.error('Failed to fetch annotations for item:', error);
    throw error;
  }
};

export const deleteAnnotation = async (annotationId) => {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error('Please log in to delete annotations');
    }

    const response = await api.delete(`/annotations/${annotationId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Please log in to delete annotations');
    }
    console.error('Failed to delete annotation:', error);
    throw error;
  }
};

export const updateAnnotation = async (annotationId, note, isNote) => {
  try {
    const token = await getUserToken();
    if (!token) {
      throw new Error('Please log in to update annotations');
    }

    const response = await api.put(`/annotations/${annotationId}`, { note, isNote });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Please log in to update annotations');
    }
    console.error('Failed to update annotation:', error);
    throw error;
  }
};