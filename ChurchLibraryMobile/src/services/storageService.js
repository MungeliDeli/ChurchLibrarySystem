import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// AsyncStorage helpers
export async function getItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`[Storage] Error getting item ${key}:`, error);
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[Storage] Error setting item ${key}:`, error);
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing item ${key}:`, error);
    return false;
  }
}

export async function getJson(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[Storage] Error getting JSON ${key}:`, error);
    return null;
  }
}

export async function setJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Error setting JSON ${key}:`, error);
    return false;
  }
}

export async function removeJson(key) {
  return removeItem(key);
}

// SecureStore helpers (for secrets/tokens)
export async function secureGet(key) {
  try {
    const value = await SecureStore.getItemAsync(key);
    console.log(`[SecureStore] Retrieved ${key}:`, value ? `${value.substring(0, 20)}...` : 'null');
    return value;
  } catch (error) {
    console.error(`[SecureStore] Error getting ${key}:`, error);
    return null;
  }
}

export async function secureSet(key, value) {
  try {
    if (!value || typeof value !== 'string') {
      console.error(`[SecureStore] Invalid value for ${key}:`, typeof value);
      return false;
    }
    await SecureStore.setItemAsync(key, value);
    console.log(`[SecureStore] Successfully saved ${key}`);
    
    // Verify it was saved
    const verification = await SecureStore.getItemAsync(key);
    if (verification === value) {
      console.log(`[SecureStore] Verified ${key} was saved correctly`);
      return true;
    } else {
      console.error(`[SecureStore] Verification failed for ${key}`);
      return false;
    }
  } catch (error) {
    console.error(`[SecureStore] Error setting ${key}:`, error);
    return false;
  }
}

export async function secureRemove(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`[SecureStore] Successfully removed ${key}`);
    return true;
  } catch (error) {
    console.error(`[SecureStore] Error removing ${key}:`, error);
    return false;
  }
}

const USER_TOKEN_KEY = 'userToken';

export async function getUserToken() {
  try {
    const token = await secureGet(USER_TOKEN_KEY);
    if (!token) {
      console.warn('[Auth] No token found in secure storage');
    }
    return token;
  } catch (error) {
    console.error('[Auth] Error retrieving token:', error);
    return null;
  }
}

export async function setUserToken(token) {
  try {
    if (!token) {
      console.error('[Auth] Attempted to save null/undefined token');
      return false;
    }
    
    // Ensure token is a string
    const tokenString = String(token).trim();
    
    if (tokenString.length === 0) {
      console.error('[Auth] Attempted to save empty token');
      return false;
    }
    
    console.log(`[Auth] Saving token (length: ${tokenString.length})`);
    const result = await secureSet(USER_TOKEN_KEY, tokenString);
    
    if (result) {
      console.log('[Auth] Token saved successfully');
    } else {
      console.error('[Auth] Token save failed');
    }
    
    return result;
  } catch (error) {
    console.error('[Auth] Error saving token:', error);
    return false;
  }
}

export async function removeUserToken() {
  try {
    console.log('[Auth] Removing token from secure storage');
    return await secureRemove(USER_TOKEN_KEY);
  } catch (error) {
    console.error('[Auth] Error removing token:', error);
    return false;
  }
}

// Debug function to check all storage
export async function debugStorage() {
  console.log('=== STORAGE DEBUG ===');
  
  const token = await getUserToken();
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 30) + '...');
    console.log('Token length:', token.length);
  }
  
  const user = await getJson('user');
  console.log('User exists:', !!user);
  if (user) {
    console.log('User data:', JSON.stringify(user, null, 2));
  }
  
  console.log('=== END STORAGE DEBUG ===');
}