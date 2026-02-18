import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';

const STORAGE_KEY = 'grada_use_mock_data';

let useMockData = config.useMockData;

export function getUseMockData(): boolean {
  return useMockData;
}

export async function setUseMockData(value: boolean): Promise<void> {
  useMockData = value;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export async function loadStoredDemoMode(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      useMockData = stored === 'true';
    }
  } catch {
    // keep default
  }
}
