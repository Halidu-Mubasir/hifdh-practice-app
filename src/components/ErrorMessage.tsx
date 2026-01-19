import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onRetry,
  fullScreen = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const content = (
    <>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#fef2f2',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 32, color: '#ef4444' }}>⚠️</Text>
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#ef4444',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: isDark ? '#d1d5db' : '#6b7280',
          textAlign: 'center',
          marginBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <Button onPress={onRetry} variant="primary" size="md">
          Try Again
        </Button>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          padding: 20,
        }}
      >
        {content}
      </View>
    );
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {content}
    </View>
  );
};
