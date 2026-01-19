import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Trial } from '../types';
import { ArabicText } from './ArabicText';
import { Card } from './Card';
import { useSettingsStore } from '../stores/useSettingsStore';

interface TrialDisplayProps {
  trial: Trial;
}

export const TrialDisplay: React.FC<TrialDisplayProps> = ({ trial }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const showEndVerseSnippet = useSettingsStore((state) => state.showEndVerseSnippet);

  return (
    <Card variant="elevated" padding={20}>
      {/* Start Verse Information */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#10b981',
            marginBottom: 8,
          }}
        >
          Start Verse
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#1f2937',
            marginBottom: 4,
          }}
        >
          {trial.surahName} ({trial.surahEnglishName})
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: isDark ? '#d1d5db' : '#6b7280',
            marginBottom: 12,
          }}
        >
          Verse {trial.startAyah}
        </Text>
        <ArabicText>{trial.arabicSnippet}</ArabicText>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
          marginVertical: 20,
        }}
      />

      {/* End Verse Information */}
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#f59e0b',
            marginBottom: 8,
          }}
        >
          End Verse
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#1f2937',
            marginBottom: 4,
          }}
        >
          {trial.endSurahName} ({trial.endSurahEnglishName})
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: isDark ? '#d1d5db' : '#6b7280',
            marginBottom: 12,
          }}
        >
          Verse {trial.endAyah}
        </Text>
        {showEndVerseSnippet && trial.arabicEndSnippet && (
          <ArabicText>{trial.arabicEndSnippet}</ArabicText>
        )}
      </View>
    </Card>
  );
};
