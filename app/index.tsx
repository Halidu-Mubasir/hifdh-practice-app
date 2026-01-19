import { View, Text, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/stores/useAuthStore';

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Wait for auth initialization to complete
    if (!isLoading) {
      // Redirect based on auth status
      // Note: Users can still use the app as guests
      // So we redirect to app by default, they can sign in from there
      router.replace('/(app)');
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? '#f3f4f6' : '#1f2937' }}>
        Hifdh App
      </Text>
      <Text style={{ fontSize: 16, color: isDark ? '#9ca3af' : '#6b7280', marginTop: 8 }}>
        Loading...
      </Text>
    </View>
  );
}
