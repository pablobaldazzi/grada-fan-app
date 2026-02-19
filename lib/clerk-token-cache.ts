import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { TokenCache } from '@clerk/clerk-expo';

const isWeb = Platform.OS === 'web';

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      if (isWeb) {
        return typeof localStorage !== 'undefined'
          ? localStorage.getItem(key)
          : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (isWeb) {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch {
      // ignore
    }
  },
  async clearToken(key: string) {
    try {
      if (isWeb) {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch {
      // ignore
    }
  },
};
