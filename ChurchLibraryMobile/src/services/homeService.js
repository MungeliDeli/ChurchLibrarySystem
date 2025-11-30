import api from './api'; // Assuming a central api configuration that handles base URL and headers

export const getNewArrivals = async () => {
  try {
    const response = await api.get('/home/new-arrivals');
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, message: error.message, data: [] };
  }
};

export const getTrending = async () => {
  try {
    const response = await api.get('/home/trending');
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, message: error.message, data: [] };
  }
};

export const getFeatured = async () => {
  try {
    const response = await api.get('/home/featured');
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, message: error.message, data: [] };
  }
};

export const getContinueReading = async () => {
  try {
    // This endpoint requires authentication. 'api.get' should automatically include the auth token.
    const response = await api.get('/home/continue-reading');
    return { ok: true, data: response.data };
  } catch (error) {
    // It's common for this to fail with a 404 if there's no reading history,
    // so we can treat that as a non-error case.
    if (error.response && error.response.status === 404) {
      return { ok: true, data: [] };
    }
    return { ok: false, message: error.message, data: [] };
  }
};
