import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button, ArabicText, GoogleIcon } from '../../src/components';
import { useAuthStore } from '../../src/stores/useAuthStore';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../src/lib/supabase';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, isLoading, error: authError, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
      // Navigation will be handled by auth state change
      router.replace('/(app)');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();

      // For mobile, don't pass redirectTo - let Supabase handle it
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        Alert.alert('Sign In Error', error.message);
        return;
      }

      if (data?.url) {
        // Open OAuth URL in system browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          undefined // Let the browser handle the redirect
        );

        if (result.type === 'success' && result.url) {
          // Extract the URL params and let Supabase handle the session
          // Supabase will automatically detect and process the auth callback
          console.log('OAuth success, redirecting to app...');

          // Small delay to let Supabase process the session
          setTimeout(() => {
            router.replace('/(app)');
          }, 500);
        } else if (result.type === 'cancel') {
          Alert.alert('Cancelled', 'Sign in was cancelled');
        }
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
            <ArabicText size={36} bold>
              حفظ
            </ArabicText>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: isDark ? '#f3f4f6' : '#1f2937',
                marginTop: 8,
              }}
            >
              Hifdh App
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: isDark ? '#9ca3af' : '#6b7280',
                marginTop: 8,
              }}
            >
              Sign in to your account
            </Text>
          </View>

          {/* Error Message */}
          {authError && (
            <View
              style={{
                backgroundColor: '#fef2f2',
                borderLeftWidth: 4,
                borderLeftColor: '#ef4444',
                padding: 12,
                marginBottom: 20,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 14, color: '#ef4444' }}>{authError}</Text>
            </View>
          )}

          {/* Form */}
          <View>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={{ alignSelf: 'flex-end', marginTop: -8, marginBottom: 20 }}
            >
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button onPress={handleLogin} loading={isLoading} fullWidth size="lg">
              Sign In
            </Button>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: isDark ? '#374151' : '#e5e7eb',
                }}
              />
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 14,
                  color: isDark ? '#9ca3af' : '#6b7280',
                }}
              >
                OR
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: isDark ? '#374151' : '#e5e7eb',
                }}
              />
            </View>

            {/* Google Sign In */}
            <Button
              onPress={handleGoogleSignIn}
              variant="outline"
              fullWidth
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <GoogleIcon size={20} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: isDark ? '#f3f4f6' : '#1f2937',
                  }}
                >
                  Continue with Google
                </Text>
              </View>
            </Button>
          </View>

          {/* Sign Up Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ fontSize: 14, color: isDark ? '#9ca3af' : '#6b7280' }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600' }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Guest Mode */}
          <View style={{ marginTop: 32 }}>
            <Button
              onPress={() => router.replace('/(app)')}
              variant="outline"
              fullWidth
            >
              Continue as Guest
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
