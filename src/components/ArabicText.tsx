import React from 'react';
import { Text, TextStyle, useColorScheme } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';

interface ArabicTextProps {
  children: React.ReactNode;
  size?: number;
  style?: TextStyle;
  color?: string;
  bold?: boolean;
}

export const ArabicText: React.FC<ArabicTextProps> = ({
  children,
  size,
  style,
  color,
  bold = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const arabicTextSize = useSettingsStore((state) => state.arabicTextSize);

  const fontSize = size || arabicTextSize;
  const textColor = color || (isDark ? '#f3f4f6' : '#1f2937');

  return (
    <Text
      style={[
        {
          fontFamily: 'NotoNaskhArabic',
          fontSize,
          color: textColor,
          textAlign: 'right',
          writingDirection: 'rtl',
          lineHeight: fontSize * 1.8,
          fontWeight: bold ? '700' : '400',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
