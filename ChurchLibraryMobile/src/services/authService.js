import api from './api';
import * as storage from './storageService';

async function register({ name, email, password }) {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return { ok: true, data: response.data };
  } catch (e) {
    return { ok: false, message: e.response?.data?.message || e.message || 'Registration failed' };
  }
}

async function login({ email, password }) {
  try {
    console.log('Attempting login for:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response received:', response.data);
    
    const { token, user } = response.data;

    if (token) {
      // Ensure token is a string
      const tokenToSave = typeof token === 'string' ? token : String(token);
      console.log('Saving token to secure storage');
      
      const tokenSaved = await storage.setUserToken(tokenToSave);
      const userSaved = await storage.setJson('user', user);
      
      console.log('Token saved:', tokenSaved);
      console.log('User saved:', userSaved);
      
      // Verify token was saved
      const savedToken = await storage.getUserToken();
      console.log('Verified saved token exists:', !!savedToken);
      
      return { ok: true, data: { user, token: tokenToSave } };
    }

    return { ok: false, message: 'Login failed: No token received' };
  } catch (e) {
    console.error('Login error:', e.response?.data || e.message);
    return { ok: false, message: e.response?.data?.message || e.message || 'Login failed' };
  }
}

async function logout() {
    console.log('Logging out - clearing token and user data');
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

// New function to check if user is authenticated
async function isAuthenticated() {
  const token = await storage.getUserToken();
  const user = await storage.getJson('user');
  return !!(token && user);
}

// New function to refresh auth state
async function refreshAuthState() {
  const token = await storage.getUserToken();
  const user = await storage.getJson('user');
  console.log('Auth state - Token exists:', !!token, 'User exists:', !!user);
  return { token, user };
}

export { register, login, logout, getUser, googleSignIn, isAuthenticated, refreshAuthState };