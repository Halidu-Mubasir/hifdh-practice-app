import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  ProgressBar,
  TrialDisplay,
  AudioControls,
  StarRating,
  LoadingSpinner,
  ErrorMessage,
  Card,
} from '../../src/components';
import { RefreshIcon } from '../../src/components/icons';
import { useSessionStore } from '../../src/stores/useSessionStore';

export default function TrialScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    selectedCategory,
    currentAttempt,
    numberOfTrials,
    currentTrial,
    isGeneratingTrial,
    trialError,
    currentScore,
    currentNotes,
    isSessionComplete,
    generateCurrentTrial,
    regenerateTrial,
    setScore,
    setNotes,
    nextTrial,
    resetSession,
  } = useSessionStore();

  // Generate trial on mount
  useEffect(() => {
    if (!currentTrial && !isGeneratingTrial && !trialError) {
      generateCurrentTrial();
    }
  }, []);

  // Navigate to summary when session is complete
  useEffect(() => {
    if (isSessionComplete) {
      router.replace('/(app)/summary');
    }
  }, [isSessionComplete]);

  const handleNextTrial = async () => {
    await nextTrial();
  };

  const handleRegenerateTrial = async () => {
    await regenerateTrial();
  };

  const handleBackToCategories = () => {
    resetSession();
    router.replace('/(app)');
  };

  if (!selectedCategory) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
        <ErrorMessage
          fullScreen
          title="No Category Selected"
          message="Please go back and select a category to start practicing."
          onRetry={handleBackToCategories}
        />
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#f3f4f6' : '#1f2937',
            }}
          >
            {selectedCategory.englishName}
          </Text>
          <TouchableOpacity onPress={handleBackToCategories}>
            <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: '600' }}>
              Exit
            </Text>
          </TouchableOpacity>
        </View>
        <ProgressBar current={currentAttempt} total={numberOfTrials} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {isGeneratingTrial && (
          <LoadingSpinner fullScreen message="Generating trial..." />
        )}

        {trialError && (
          <ErrorMessage
            title="Trial Generation Error"
            message={trialError}
            onRetry={generateCurrentTrial}
          />
        )}

        {currentTrial && !isGeneratingTrial && (
          <>
            {/* Trial Display */}
            <TrialDisplay trial={currentTrial} />

            {/* Audio Controls */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  marginBottom: 12,
                }}
              >
                Listen to Starting Verse
              </Text>
              <AudioControls globalAyahNumber={currentTrial.startGlobalAyahNumber} />
            </View>

            {/* Rating */}
            <View style={{ marginTop: 32 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  marginBottom: 8,
                }}
              >
                How did you do?
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: 16,
                }}
              >
                Rate your recitation from 1 to 5 stars
              </Text>
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <StarRating
                  value={currentScore}
                  onChange={setScore}
                  max={5}
                  size={48}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  marginBottom: 12,
                }}
              >
                Notes (Optional)
              </Text>
              <TextInput
                value={currentNotes}
                onChangeText={setNotes}
                placeholder="Add any notes about your recitation..."
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#4b5563' : '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* Actions */}
            <View style={{ marginTop: 32, gap: 12 }}>
              {/* Regenerate Button */}
              <Button
                onPress={handleRegenerateTrial}
                variant="outline"
                fullWidth
                icon={<RefreshIcon size={20} color="#10b981" />}
              >
                Generate Different Trial
              </Button>

              {/* Next Trial Button */}
              <Button
                onPress={handleNextTrial}
                fullWidth
                size="lg"
              >
                {currentAttempt < numberOfTrials ? 'Next Trial' : 'Complete Session'}
              </Button>
            </View>

            {/* Info Card */}
            <Card variant="outlined" padding={16} style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? '#9ca3af' : '#6b7280',
                  lineHeight: 18,
                }}
              >
                💡 Tip: Listen to the audio, then try to recite from the starting verse to the ending verse.
                Rate yourself honestly to track your progress!
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
