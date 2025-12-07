import api from './api';

async function getAllBooks() {
  try {
    const response = await api.get('/books');
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to fetch books' };
  }
}

async function addToReadingList(itemId) {
  try {
    const response = await api.post('/reading-list', { itemId });
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to add to reading list' };
  }
}

async function addToDownloads(itemId) {
  try {
    const response = await api.post('/downloads', { itemId });
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to add to downloads' };
  }
}

async function createAnnotation(itemId, textLocation, highlightColor, note) {
  try {
    const response = await api.post('/annotations', { itemId, textLocation, highlightColor, note });
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to create annotation' };
  }
}

async function getAnnotationsByItem(itemId) {
  try {
    const response = await api.get(`/annotations/${itemId}`);
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to fetch annotations' };
  }
}

async function deleteAnnotation(annotationId) {
  try {
    const response = await api.delete(`/annotations/${annotationId}`);
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to delete annotation' };
  }
}

export { getAllBooks, addToReadingList, addToDownloads, createAnnotation, getAnnotationsByItem, deleteAnnotation };
