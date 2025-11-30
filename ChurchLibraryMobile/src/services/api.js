import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Function to construct the base URL
const getBaseURL = () => {
	const MANUAL_IP = '10.178.246.123'; //IP address

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

const api = axios.create({
	baseURL: uri,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  async (config) => {
    const { getUserToken } = require('./storageService');
    const token = await getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
