import React from 'react';
import { View, ViewStyle, useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 16,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      padding,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyles,
          backgroundColor: isDark ? '#374151' : '#ffffff',
        };
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: isDark ? '#374151' : '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDark ? '#4b5563' : '#e5e7eb',
        };
      default:
        return baseStyles;
    }
  };

  return <View style={[getVariantStyles(), style]}>{children}</View>;
};
