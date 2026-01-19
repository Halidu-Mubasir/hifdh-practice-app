import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, ArabicText } from '../../src/components';
import { useSessionStore } from '../../src/stores/useSessionStore';
import { CATEGORY_DEFINITIONS } from '../../src/constants';

export default function ConfigureSessionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;

  const category = CATEGORY_DEFINITIONS.find((c) => c.id === categoryId);
  const { setNumberOfTrials, startSession } = useSessionStore();

  const [selectedCount, setSelectedCount] = useState(5);
  const [isStarting, setIsStarting] = useState(false);

  const trialCounts = [3, 5, 7, 10];

  const handleStartSession = async () => {
    if (!category) return;

    setIsStarting(true);
    try {
      setNumberOfTrials(selectedCount);
      await startSession();
      // Navigation will happen automatically after session starts
      router.push('/(app)/trial');
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (!category) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#ef4444' }}>Category not found</Text>
          <Button onPress={() => router.back()} variant="outline" style={{ marginTop: 16 }}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#374151' : '#e5e7eb',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, color: '#10b981', fontWeight: '600' }}>
            ← Back to Categories
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: isDark ? '#f3f4f6' : '#1f2937',
          }}
        >
          Configure Session
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Category Info */}
        <Card variant="elevated" padding={20} style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#10b981',
              marginBottom: 8,
            }}
          >
            SELECTED CATEGORY
          </Text>
          <ArabicText size={24} bold style={{ marginBottom: 8 }}>
            {category.arabicName}
          </ArabicText>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: isDark ? '#f3f4f6' : '#1f2937',
              marginBottom: 8,
            }}
          >
            {category.englishName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            {category.description}
          </Text>
        </Card>

        {/* Number of Trials */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#f3f4f6' : '#1f2937',
              marginBottom: 16,
            }}
          >
            How many trials?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            {trialCounts.map((count) => (
              <TouchableOpacity
                key={count}
                onPress={() => setSelectedCount(count)}
                style={{
                  flex: 1,
                  minWidth: 70,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedCount === count ? '#10b981' : (isDark ? '#374151' : '#e5e7eb'),
                  backgroundColor: selectedCount === count 
                    ? (isDark ? '#064e3b' : '#d1fae5')
                    : (isDark ? '#374151' : '#ffffff'),
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: selectedCount === count ? '#10b981' : (isDark ? '#e5e7eb' : '#1f2937'),
                  }}
                >
                  {count}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: selectedCount === count ? '#10b981' : (isDark ? '#9ca3af' : '#6b7280'),
                    marginTop: 4,
                  }}
                >
                  trials
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <Button
          onPress={handleStartSession}
          loading={isStarting}
          fullWidth
          size="lg"
        >
          Start Practice Session
        </Button>

        {/* Info */}
        <Card variant="outlined" padding={16} style={{ marginTop: 24 }}>
          <Text
            style={{
              fontSize: 14,
              color: isDark ? '#9ca3af' : '#6b7280',
              lineHeight: 20,
            }}
          >
            💡 You'll be shown {selectedCount} random verses from {category.englishName}.
            Try to recite from the starting verse to the ending verse.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
