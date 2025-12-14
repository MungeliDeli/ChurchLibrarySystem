import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getUserToken, removeUserToken, removeItem } from './storageService';

// Function to construct the base URL
const getBaseURL = () => {
	const MANUAL_IP = '10.108.119.123'; //IP address

	// If running in development on a physical device, it will use your computer's IP address.
	// If running in an emulator, it will use the correct localhost address.
	if (Platform.OS === 'android') {
		// For Android emulator, 10.0.2.2 is the host machine's localhost.
		// For physical Android device, use the manual IP.
		return `http://${
			__DEV__ && Constants.manifest && Constants.manifest.debuggerHost
				? Constants.manifest.debuggerHost.split(':').shift()
				: MANUAL_IP
		}:3001/api`;
	} else {
		// For iOS simulator, it's usually localhost.
		// For physical iOS device, use the manual IP.
		return `http://${
			__DEV__ && Constants.manifest && Constants.manifest.debuggerHost
				? Constants.manifest.debuggerHost.split(':').shift()
				: MANUAL_IP
		}:3001/api`;
	}
};

const uri = getBaseURL();
console.log('API Base URL:', uri);

const api = axios.create({
	baseURL: uri,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 second timeout
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} - Token: ${token.substring(0, 20)}...`);
      } else {
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} - No token`);
      }
    } catch (error) {
      console.error('[API Request] Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[API Request] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(
      `[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - Status: ${error.response?.status}`,
      error.response?.data?.message || error.message
    );

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[API Error] 401 Unauthorized - Clearing auth data');
      // Clear invalid token
      await removeUserToken();
      await removeItem('user');
      
      // You might want to dispatch a logout action here if using Redux
      // store.dispatch(logout());
      
      // Optionally redirect to login screen
      // NavigationService.navigate('Auth');
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API Error] 403 Forbidden - Access denied');
      const token = await getUserToken();
      console.log('[API Error] Current token exists:', !!token);
      if (token) {
        console.log('[API Error] Token preview:', token.substring(0, 20) + '...');
      }
    }

    return Promise.reject(error);
  }
);

export default api;