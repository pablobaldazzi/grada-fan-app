import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { config } from './config';

const TOKEN_KEY = 'grada_access_token';

// SecureStore doesn't work on web, use AsyncStorage as fallback
const isWeb = Platform.OS === 'web';

/**
 * Central axios instance. All API calls go through here.
 * Timeout is generous (45s) for cold starts / slow networks.
 */
export const http = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 45_000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(async (req) => {
  try {
    const token = await getStoredToken();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Storage unavailable – continue without token
  }
  return req;
});

export async function getStoredToken(): Promise<string | null> {
  try {
    if (isWeb) {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  try {
    if (isWeb) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage errors
  }
}

export async function clearToken(): Promise<void> {
  try {
    if (isWeb) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
