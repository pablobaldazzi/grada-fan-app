import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from './config';

const TOKEN_KEY = 'grada_access_token';

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
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // SecureStore unavailable (e.g. web) – continue without token
  }
  return req;
});

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
