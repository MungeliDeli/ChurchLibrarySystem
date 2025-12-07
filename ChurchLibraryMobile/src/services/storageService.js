import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// AsyncStorage helpers
export async function getItem(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getJson(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export async function setJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

export async function removeJson(key) {
  return removeItem(key);
}

// SecureStore helpers (for secrets/tokens)
export async function secureGet(key) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    return null;
  }
}

export async function secureSet(key, value) {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

export async function secureRemove(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    return false;
  }
}

const USER_TOKEN_KEY = 'userToken';

export async function getUserToken() {
  return secureGet(USER_TOKEN_KEY);
}

export async function setUserToken(token) {
  return secureSet(USER_TOKEN_KEY, token);
}

export async function removeUserToken() {
  return secureRemove(USER_TOKEN_KEY);
}
