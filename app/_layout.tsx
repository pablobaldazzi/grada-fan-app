import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { loadStoredDemoMode } from "@/lib/demo-mode";
import { queryClient } from "@/lib/query-client";
import { CartProvider } from "@/lib/cart-context";
import { ClubProvider } from "@/lib/contexts/ClubContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitle: "Back",
        // Make push/pop transitions feel consistent and smooth
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

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
      <QueryClientProvider client={queryClient}>
        <ClubProvider>
          <AuthProvider>
            <CartProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <StatusBar style="light" />
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </CartProvider>
          </AuthProvider>
        </ClubProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
