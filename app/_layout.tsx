import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PushNotificationHandler } from "@/components/PushNotificationHandler";
import { loadStoredDemoMode } from "@/lib/demo-mode";
import { queryClient } from "@/lib/query-client";
import { CartProvider } from "@/lib/cart-context";
import { ClubProvider } from "@/lib/contexts/ClubContext";
import { tokenCache } from "@/lib/clerk-token-cache";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY?.trim()) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.\n' +
    'Get a key from https://dashboard.clerk.com → API Keys.',
  );
}

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <>
      <PushNotificationHandler />
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackTitle: "Back",
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Complete profile (blocks navigation until done) */}
        <Stack.Screen name="complete-profile" options={{ headerShown: false, gestureEnabled: false }} />

        {/* Regular pushed screens */}
        <Stack.Screen name="profile" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: "card" }} />
        <Stack.Screen name="notification-preferences" options={{ headerShown: false, presentation: "card" }} />

        {/* Modals */}
        <Stack.Screen name="match-tickets" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="product-detail" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="benefit-detail" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="experience-detail" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="cart" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="member-card-full" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [demoModeReady, setDemoModeReady] = useState(false);

  useEffect(() => {
    loadStoredDemoMode().then(() => setDemoModeReady(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && demoModeReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, demoModeReady]);

  if (!fontsLoaded || !demoModeReady) return null;

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
        <ClerkLoaded>
          <QueryClientProvider client={queryClient}>
            <ClubProvider>
              <CartProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <KeyboardProvider>
                    <StatusBar style="light" />
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </CartProvider>
            </ClubProvider>
          </QueryClientProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
