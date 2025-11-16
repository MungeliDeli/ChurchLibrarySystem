import api from './api';

async function getAllCategories() {
  try {
    const response = await api.get('/categories');
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Failed to fetch categories' };
  }
}

export { getAllCategories };
