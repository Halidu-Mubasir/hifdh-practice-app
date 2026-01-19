import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button, ArabicText } from '../../src/components';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword, isLoading, error: authError, clearError } = useAuthStore();

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    clearError();
    setSuccess(false);

    if (!validateEmail()) {
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Reset password failed:', error);
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
              Reset Password
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#9ca3af' : '#6b7280',
                marginTop: 8,
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Success Message */}
          {success && (
            <View
              style={{
                backgroundColor: '#f0fdf4',
                borderLeftWidth: 4,
                borderLeftColor: '#10b981',
                padding: 12,
                marginBottom: 20,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600' }}>
                Reset link sent!
              </Text>
              <Text style={{ fontSize: 12, color: '#059669', marginTop: 4 }}>
                Please check your email for the password reset link.
              </Text>
            </View>
          )}

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
              error={emailError}
            />

            <Button
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              size="lg"
            >
              Send Reset Link
            </Button>
          </View>

          {/* Back to Sign In */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600' }}>
                ← Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
