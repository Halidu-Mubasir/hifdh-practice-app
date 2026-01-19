import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppInitialization } from '../src/hooks/useAppInitialization';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'NotoNaskhArabic': require('../assets/fonts/NotoNaskhArabic-Regular.ttf'),
  });

  // Initialize app services and stores
  const { isInitialized, isInitializing, error: initError } = useAppInitialization();

  useEffect(() => {
    // Hide splash screen when both fonts are loaded and app is initialized
    if (fontsLoaded && isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized]);

  // Show nothing while fonts are loading
  if (!fontsLoaded) {
    return null;
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 10 }}>
          Initialization Error
        </Text>
        <Text style={{ fontSize: 14, color: colorScheme === 'dark' ? '#e5e7eb' : '#4b5563', textAlign: 'center' }}>
          {initError}
        </Text>
        <Text style={{ fontSize: 12, color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280', marginTop: 20, textAlign: 'center' }}>
          Please restart the app. If the problem persists, try reinstalling.
        </Text>
      </View>
    );
  }

  // Show loading screen while initializing
  if (isInitializing || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 16, fontSize: 16, color: colorScheme === 'dark' ? '#e5e7eb' : '#4b5563' }}>
          Initializing Hifdh App...
        </Text>
      </View>
    );
  }

  // App is fully initialized, render main navigation
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
