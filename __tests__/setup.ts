// jest setup for node-based tests

// RNTL matchers (optional; safe even if deprecated)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/jest-native/extend-expect');
} catch {
  // ignore
}

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Prevent Jest from trying to execute react-native's ESM/Flow entrypoints in node test env.
jest.mock('react-native', () => {
  // Minimal React Native mock for node-based rendering with react-test-renderer.
  const React = require('react');

  const makeHost = (name: string) =>
    function HostComponent(props: any) {
      const { children, ...rest } = props ?? {};
      return React.createElement(name, rest, children);
    };

  const Platform = {
    OS: 'web',
    select: (spec: Record<string, any>) => spec.web ?? spec.default,
  };

  const StyleSheet = {
    create: (styles: any) => styles,
    flatten: (style: any) => style,
    absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  };

  return {
    Platform,
    StyleSheet,
    View: makeHost('View'),
    Text: makeHost('Text'),
    ScrollView: makeHost('ScrollView'),
    Pressable: makeHost('Pressable'),
    Image: makeHost('Image'),
    TextInput: makeHost('TextInput'),
    KeyboardAvoidingView: makeHost('KeyboardAvoidingView'),
    Switch: makeHost('Switch'),
    RefreshControl: makeHost('RefreshControl'),
    ActivityIndicator: makeHost('ActivityIndicator'),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  MaterialCommunityIcons: () => null,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children ?? null,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(async () => undefined),
  clear: jest.fn(async () => undefined),
}));

// expo-router navigation mocks for UI flow tests
jest.mock('expo-router', () => {
  return {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    },
    Redirect: ({ href }: any) => null,
  };
});

// Haptics shouldn't run in tests
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => undefined),
  selectionAsync: jest.fn(async () => undefined),
  notificationAsync: jest.fn(async () => undefined),
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium' },
  NotificationFeedbackType: { Success: 'Success' },
}));
