import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { registerDeviceToken, unregisterDeviceToken } from './api';

/**
 * Request permission and get the Expo push token.
 * Returns the token string or null if unavailable (e.g. simulator, permission denied).
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    // In Expo Go (SDK 53+), expo-notifications has limitations and may throw.
    if (!Device.isDevice) return null;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId ?? undefined,
    });
    return tokenData.data;
  } catch {
    return null;
  }
}

/**
 * Register the push token with the backend. Call after login.
 * Returns the token if registered, null otherwise.
 */
export async function registerPush(): Promise<string | null> {
  const token = await getExpoPushToken();
  if (!token) return null;
  const platform = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
  try {
    await registerDeviceToken({ token, platform });
  } catch {
    // Silently fail – user can still use app without push
  }
  return token;
}

/**
 * Unregister push token on logout. No-op if token is null.
 * Call this before clearing auth state.
 */
export async function unregisterPush(pushToken: string | null): Promise<void> {
  if (!pushToken) return;
  try {
    await unregisterDeviceToken({ token: pushToken });
  } catch {
    // ignore
  }
}
