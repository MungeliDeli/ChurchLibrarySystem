import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Function to construct the base URL
const getBaseURL = () => {
  // Manual IP address provided by the user
  const MANUAL_IP = '10.66.231.39'; // User's provided IP address

  // If running in development on a physical device, it will use your computer's IP address.
  // If running in an emulator, it will use the correct localhost address.
  if (Platform.OS === 'android') {
    // For Android emulator, 10.0.2.2 is the host machine's localhost.
    // For physical Android device, use the manual IP.
    return `http://${__DEV__ && Constants.manifest && Constants.manifest.debuggerHost ? Constants.manifest.debuggerHost.split(':').shift() : MANUAL_IP}:3001/api`;
  } else {
    // For iOS simulator, it's usually localhost.
    // For physical iOS device, use the manual IP.
    return `http://${__DEV__ && Constants.manifest && Constants.manifest.debuggerHost ? Constants.manifest.debuggerHost.split(':').shift() : MANUAL_IP}:3001/api`;
  }
};

const uri = getBaseURL();

const api = axios.create({
  baseURL: uri,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
