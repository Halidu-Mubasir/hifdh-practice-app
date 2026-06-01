import * as FileSystem from 'expo-file-system/legacy';
import type { CategoryInfo, TrialRecord } from '../types';

/**
 * Export session results to CSV file
 * @param category The practice category
 * @param records Array of trial records
 * @returns URI of the created CSV file
 */
export async function exportSessionToCSV(
  category: CategoryInfo | null,
  records: Array<TrialRecord | null>
): Promise<string> {
  if (!category) {
    throw new Error('No category selected');
  }

  // Create CSV header
  const headers = [
    'Trial Number',
    'Start Surah',
    'Start Surah (Arabic)',
    'Start Verse',
    'End Surah',
    'End Surah (Arabic)',
    'End Verse',
    'Score',
    'Notes',
    'Arabic Start Snippet',
    'Arabic End Snippet',
  ];

  // Create CSV rows
  const rows = records.map((record, index) => record ? [
    index + 1,
    record.trial.surahEnglishName,
    record.trial.surahName,
    record.trial.startAyah,
    record.trial.endSurahEnglishName,
    record.trial.endSurahName,
    record.trial.endAyah,
    record.score || '',
    record.notes ? `"${record.notes.replace(/"/g, '""')}"` : '',
    record.trial.arabicSnippet ? `"${record.trial.arabicSnippet.replace(/"/g, '""')}"` : '',
    record.trial.arabicEndSnippet ? `"${record.trial.arabicEndSnippet.replace(/"/g, '""')}"` : '',
  ] : []);

  // Combine into CSV content
  const csvContent = [
    `Hifdh Practice Session - ${category.title}`,
    `Date: ${new Date().toLocaleString()}`,
    `Total Trials: ${records.length}`,
    `Average Score: ${
      records.length > 0
        ? (records.reduce((sum, r) => sum + (r?.score || 0), 0) / records.length).toFixed(2)
        : '0.00'
    }`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `hifdh-session-${category.id}-${timestamp}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${filename}`;

  // Write file
  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}

/**
 * Format trial record for display or export
 */
export function formatTrialRecord(record: TrialRecord, trialNumber: number): string {
  const lines = [
    `Trial ${trialNumber}`,
    `Start: ${record.trial.surahEnglishName} (${record.trial.surahName}) - Verse ${record.trial.startAyah}`,
    `End: ${record.trial.endSurahEnglishName} (${record.trial.endSurahName}) - Verse ${record.trial.endAyah}`,
    `Score: ${record.score || 'Not rated'}/5`,
  ];

  if (record.notes) {
    lines.push(`Notes: ${record.notes}`);
  }

  if (record.trial.arabicSnippet) {
    lines.push(`Arabic Start: ${record.trial.arabicSnippet}`);
  }

  if (record.trial.arabicEndSnippet) {
    lines.push(`Arabic End: ${record.trial.arabicEndSnippet}`);
  }

  return lines.join('\n');
}
