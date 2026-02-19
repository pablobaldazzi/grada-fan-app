jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Prevent Jest from trying to execute react-native's ESM/Flow entrypoints in node test env.
jest.mock('react-native', () => {
  const Platform = {
    OS: 'web',
    // Mimic RN Platform.select API
    select: (spec: Record<string, any>) => spec.web ?? spec.default,
  };

  return { Platform };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
  clear: jest.fn(async () => undefined),
}));
