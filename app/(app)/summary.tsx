import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  StarRating,
  LoadingSpinner,
  ArabicText,
} from '../../src/components';
import { CheckCircleIcon, ExportIcon, RefreshIcon } from '../../src/components/icons';
import { useSessionStore } from '../../src/stores/useSessionStore';
import { exportSessionToCSV } from '../../src/utils/csvExport';
import * as Sharing from 'expo-sharing';

export default function SummaryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isExporting, setIsExporting] = useState(false);

  const {
    selectedCategory,
    sessionRecords,
    numberOfTrials,
    resetSession,
    startSession,
  } = useSessionStore();

  // Calculate average score
  const totalScore = sessionRecords.reduce((sum, record) => sum + (record.score || 0), 0);
  const averageScore = sessionRecords.length > 0 ? totalScore / sessionRecords.length : 0;

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const csvUri = await exportSessionToCSV(selectedCategory, sessionRecords);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(csvUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Session Results',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Success', 'CSV file saved to device storage');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export CSV file');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestart = async () => {
    if (!selectedCategory) return;
    await startSession();
    router.replace('/(app)/trial');
  };

  const handleBackToCategories = () => {
    resetSession();
    router.replace('/(app)');
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <CheckCircleIcon size={32} color="#10b981" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              Session Complete!
            </Text>
            {selectedCategory && (
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginTop: 4,
                }}
              >
                {selectedCategory.englishName}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Summary Card */}
        <Card style={{ marginBottom: 24 }}>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#9ca3af' : '#6b7280',
                marginBottom: 12,
              }}
            >
              Average Score
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                }}
              >
                {averageScore.toFixed(1)}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: isDark ? '#9ca3af' : '#6b7280',
                }}
              >
                / 5.0
              </Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <StarRating value={Math.round(averageScore)} max={5} size={32} onChange={() => {}} />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? '#9ca3af' : '#6b7280',
                marginTop: 12,
              }}
            >
              Completed {sessionRecords.length} of {numberOfTrials} trials
            </Text>
          </View>
        </Card>

        {/* Trial Results */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#f3f4f6' : '#1f2937',
            marginBottom: 16,
          }}
        >
          Trial Results
        </Text>

        {sessionRecords.map((record, index) => (
          <Card key={index} style={{ marginBottom: 16 }}>
            {/* Trial Number */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                }}
              >
                Trial {record.trialNumber}
              </Text>
              <StarRating value={record.score || 0} max={5} size={20} onChange={() => {}} />
            </View>

            {/* Start Verse */}
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: 4,
                }}
              >
                START
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? '#f3f4f6' : '#1f2937',
                }}
              >
                {record.surahEnglishName} ({record.surahName}) - Verse {record.startAyah}
              </Text>
              {record.arabicSnippet && (
                <ArabicText
                  text={record.arabicSnippet}
                  style={{
                    fontSize: 16,
                    marginTop: 8,
                    color: isDark ? '#d1d5db' : '#4b5563',
                  }}
                />
              )}
            </View>

            {/* End Verse */}
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  marginBottom: 4,
                }}
              >
                END
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? '#f3f4f6' : '#1f2937',
                }}
              >
                {record.endSurahEnglishName} ({record.endSurahName}) - Verse {record.endAyah}
              </Text>
              {record.arabicEndSnippet && (
                <ArabicText
                  text={record.arabicEndSnippet}
                  style={{
                    fontSize: 16,
                    marginTop: 8,
                    color: isDark ? '#d1d5db' : '#4b5563',
                  }}
                />
              )}
            </View>

            {/* Notes */}
            {record.notes && (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: isDark ? '#374151' : '#e5e7eb',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: 4,
                  }}
                >
                  NOTES
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? '#d1d5db' : '#4b5563',
                    lineHeight: 20,
                  }}
                >
                  {record.notes}
                </Text>
              </View>
            )}
          </Card>
        ))}

        {/* Actions */}
        <View style={{ marginTop: 24, gap: 12 }}>
          {/* Export CSV */}
          <Button
            onPress={handleExportCSV}
            variant="outline"
            fullWidth
            disabled={isExporting}
            icon={<ExportIcon size={20} color={isDark ? '#10b981' : '#059669'} />}
          >
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </Button>

          {/* Restart Session */}
          <Button
            onPress={handleRestart}
            variant="outline"
            fullWidth
            icon={<RefreshIcon size={20} color={isDark ? '#3b82f6' : '#2563eb'} />}
          >
            Practice Again ({selectedCategory?.englishName})
          </Button>

          {/* Back to Categories */}
          <Button onPress={handleBackToCategories} fullWidth size="lg">
            Back to Categories
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
