import api from './api';

async function getAllBooks() {
  try {
    const response = await api.get('/books');
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to fetch books' };
  }
}

export { getAllBooks };
