import React from 'react';
import { View, ActivityIndicator, Text, useColorScheme } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  color = '#10b981',
  fullScreen = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const content = (
    <>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text
          style={{
            marginTop: 12,
            fontSize: 14,
            color: isDark ? '#d1d5db' : '#6b7280',
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
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
        }}
      >
        {content}
      </View>
    );
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {content}
    </View>
  );
};
