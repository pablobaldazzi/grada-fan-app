import axios from 'axios';
import { config } from './config';

/**
 * Central axios instance. All API calls go through here.
 * Timeout is generous (45s) for cold starts / slow networks.
 */
export const http = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 45_000,
  headers: { 'Content-Type': 'application/json' },
});

let _getToken: (() => Promise<string | null>) | null = null;
let _clubId: string | null = null;

/**
 * Call this once from the ClerkProvider-wrapped layer to supply the
 * Clerk getToken function and current clubId to the axios interceptor.
 */
export function setHttpAuth(getToken: () => Promise<string | null>, clubId: string | null) {
  _getToken = getToken;
  _clubId = clubId;
}

http.interceptors.request.use(async (req) => {
  try {
    if (_getToken) {
      const token = await _getToken();
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (_clubId) {
      req.headers['x-club-id'] = _clubId;
    }
  } catch {
    // Storage unavailable – continue without token
  }
  return req;
});

// Legacy exports kept for backward compatibility during migration
export async function getStoredToken(): Promise<string | null> {
  if (_getToken) return _getToken();
  return null;
}

export async function storeToken(_token: string): Promise<void> {
  // No-op: Clerk manages tokens
}

export async function clearToken(): Promise<void> {
  // No-op: Clerk manages tokens
}
