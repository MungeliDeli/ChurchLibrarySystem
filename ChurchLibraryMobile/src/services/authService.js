import api from './api';
import * as storage from './storageService';

async function register({ name, email, password }) {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.message || 'Registration failed' };
  }
}

async function login({ email, password }) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;

    if (token) {
      await storage.setUserToken(token);
      await storage.setJson('user', user);
      return { ok: true, data: { user } };
    }

    return { ok: false, message: 'Login failed: No token received' };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Login failed' };
  }
}

async function logout() {
    await storage.removeUserToken();
    await storage.removeItem('user');
}

async function getUser() {
    return await storage.getJson('user');
}

async function googleSignIn() {
  try {
    // This part will require more complex setup with Google Sign-In library.
    // For now, it remains a placeholder.
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true, data: { user: { provider: 'google' } } };
  } catch (e) {
    return { ok: false, message: 'Google sign-in failed' };
  }
}

export { register, login, logout, getUser, googleSignIn };