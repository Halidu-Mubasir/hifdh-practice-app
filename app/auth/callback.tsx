import { useEffect } from 'react';
import { View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

export default function AuthCallback() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the auth code from URL params
      const code = params.code as string;

      if (code) {
        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Exchange code error:', error);
          router.replace('/(auth)/login');
          return;
        }

        if (data?.session) {
          console.log('OAuth session created successfully');
          router.replace('/(app)');
        } else {
          router.replace('/(auth)/login');
        }
      } else {
        console.error('No auth code in callback');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Callback error:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
      }}
    >
      <ActivityIndicator size="large" color="#10b981" />
      <Text
        style={{
          marginTop: 16,
          fontSize: 16,
          color: isDark ? '#9ca3af' : '#6b7280',
        }}
      >
        Completing sign in...
      </Text>
    </View>
  );
}
