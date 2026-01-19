import React from 'react';
import { View, Text, useColorScheme } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
  height = 8,
  color = '#10b981',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <View style={{ width: '100%' }}>
      {showLabel && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#e5e7eb' : '#374151',
            }}
          >
            Trial {current} of {total}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: isDark ? '#374151' : '#e5e7eb',
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
          }}
        />
      </View>
    </View>
  );
};
