import React from 'react';
import { TextInput, View, Text, useColorScheme, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  ...textInputProps
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8,
            color: isDark ? '#e5e7eb' : '#374151',
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#ef4444' : isDark ? '#4b5563' : '#d1d5db',
          borderRadius: 8,
          backgroundColor: isDark ? '#374151' : '#ffffff',
          paddingHorizontal: 12,
        }}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              fontSize: 16,
              color: isDark ? '#f3f4f6' : '#1f2937',
            },
            style,
          ]}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          {...textInputProps}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{error}</Text>
      )}
      {helperText && !error && (
        <Text
          style={{
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginTop: 4,
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};
