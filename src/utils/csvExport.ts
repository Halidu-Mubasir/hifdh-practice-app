import * as FileSystem from 'expo-file-system/legacy';
import { documentDirectory } from 'expo-file-system';
import type { Category, TrialRecord } from '../types';

/**
 * Export session results to CSV file
 * @param category The practice category
 * @param records Array of trial records
 * @returns URI of the created CSV file
 */
export async function exportSessionToCSV(
  category: Category | null,
  records: TrialRecord[]
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
  const rows = records.map((record) => [
    record.trialNumber,
    record.surahEnglishName,
    record.surahName,
    record.startAyah,
    record.endSurahEnglishName,
    record.endSurahName,
    record.endAyah,
    record.score || '',
    record.notes ? `"${record.notes.replace(/"/g, '""')}"` : '', // Escape quotes in notes
    record.arabicSnippet ? `"${record.arabicSnippet.replace(/"/g, '""')}"` : '',
    record.arabicEndSnippet ? `"${record.arabicEndSnippet.replace(/"/g, '""')}"` : '',
  ]);

  // Combine into CSV content
  const csvContent = [
    `Hifdh Practice Session - ${category.englishName}`,
    `Date: ${new Date().toLocaleString()}`,
    `Total Trials: ${records.length}`,
    `Average Score: ${
      records.length > 0
        ? (records.reduce((sum, r) => sum + (r.score || 0), 0) / records.length).toFixed(2)
        : '0.00'
    }`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `hifdh-session-${category.id}-${timestamp}.csv`;
  const fileUri = `${documentDirectory}${filename}`;

  // Write file
  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}

/**
 * Format trial record for display or export
 */
export function formatTrialRecord(record: TrialRecord): string {
  const lines = [
    `Trial ${record.trialNumber}`,
    `Start: ${record.surahEnglishName} (${record.surahName}) - Verse ${record.startAyah}`,
    `End: ${record.endSurahEnglishName} (${record.endSurahName}) - Verse ${record.endAyah}`,
    `Score: ${record.score || 'Not rated'}/5`,
  ];

  if (record.notes) {
    lines.push(`Notes: ${record.notes}`);
  }

  if (record.arabicSnippet) {
    lines.push(`Arabic Start: ${record.arabicSnippet}`);
  }

  if (record.arabicEndSnippet) {
    lines.push(`Arabic End: ${record.arabicEndSnippet}`);
  }

  return lines.join('\n');
}
