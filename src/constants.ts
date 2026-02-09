import { CategoryInfo, MemorizationCategory, PresetRange, PresetRangeId } from './types';
import { surahData } from './services/quranData';
import { juzBoundaries } from './services/juzData';

// Helper to safely get Surah total verses, defaulting to a high number if not found (should not happen with complete data)
const getSurahTotalVerses = (id: number): number => {
  const surah = surahData.find(s => s.id === id);
  return surah ? surah.totalVerses : 286; // Default to Al-Baqarah's verses if error
};

// Legacy category definitions (for backward compatibility)
export const CATEGORY_DEFINITIONS: CategoryInfo[] = [
  {
    id: MemorizationCategory.LAST_5_JUZ, // Juz 26-30
    title: 'Last 5 Juz',
    description: 'Juz 26-30 (Approx. Surah Al-Ahqaf to An-Nas)',
    range: {
      startSurahId: 46,
      startAyah: 1,
      endSurahId: 114,
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 26,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.LAST_10_JUZ, // Juz 21-30
    title: 'Last 10 Juz',
    description: 'Juz 21-30 (Approx. Surah Al-Ankabut Ayah 46 to An-Nas)',
    range: {
      startSurahId: 29,
      startAyah: 46,
      endSurahId: 114,
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 21,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.HALF_QURAN, // Juz 16-30
    title: 'Half Quran (Last 15 Juz)',
    description: 'Juz 16-30 (Approx. Surah Al-Kahf Ayah 75 to An-Nas)',
    range: {
      startSurahId: 18,
      startAyah: 75,
      endSurahId: 114,
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 16,
    endJuz: 30,
  },
  {
    id: MemorizationCategory.FULL_QURAN, // Juz 1-30
    title: 'Full Quran',
    description: 'Juz 1-30 (Surah Al-Fatiha to An-Nas)',
    range: {
      startSurahId: 1,
      startAyah: 1,
      endSurahId: 114,
      endAyah: getSurahTotalVerses(114),
    },
    startJuz: 1,
    endJuz: 30,
  },
];

// Preset ranges for the new UI - 5 fixed options
export const PRESET_RANGES: PresetRange[] = [
  {
    id: 'FULL_QURAN',
    label: 'Full Quran',
    description: 'Juz 1-30 (All Surahs)',
    startJuz: 1,
    endJuz: 30,
  },
  {
    id: 'HALF_QURAN',
    label: 'Half Quran',
    description: 'Juz 16-30 (Al-Kahf to An-Nas)',
    startJuz: 16,
    endJuz: 30,
  },
  {
    id: 'LAST_10_JUZ',
    label: 'Last 10 Juz',
    description: 'Juz 21-30 (Al-Ankabut to An-Nas)',
    startJuz: 21,
    endJuz: 30,
  },
  {
    id: 'LAST_5_JUZ',
    label: 'Last 5 Juz',
    description: 'Juz 26-30 (Al-Ahqaf to An-Nas)',
    startJuz: 26,
    endJuz: 30,
  },
  {
    id: 'LAST_2_JUZ',
    label: 'Last 2 Juz',
    description: 'Juz 29-30 (Al-Mulk to An-Nas)',
    startJuz: 29,
    endJuz: 30,
  },
];

// Get preset range by ID
export const getPresetRangeById = (id: PresetRangeId): PresetRange | undefined => {
  return PRESET_RANGES.find(p => p.id === id);
};

// Convert preset range to CategoryInfo for compatibility with existing trial generation
export const presetRangeToCategoryInfo = (preset: PresetRange): CategoryInfo => {
  const startJuz = juzBoundaries.find(j => j.juz === preset.startJuz);
  const endJuz = juzBoundaries.find(j => j.juz === preset.endJuz);

  if (!startJuz || !endJuz) {
    throw new Error(`Invalid Juz range: ${preset.startJuz}-${preset.endJuz}`);
  }

  return {
    id: preset.id as unknown as MemorizationCategory,
    title: preset.label,
    description: preset.description,
    range: {
      startSurahId: startJuz.startSurahId,
      startAyah: startJuz.startAyah,
      endSurahId: endJuz.endSurahId,
      endAyah: endJuz.endAyah,
    },
    startJuz: preset.startJuz,
    endJuz: preset.endJuz,
  };
};

// Per-Juz category definitions for new UI
export const getJuzCategory = (juzNumber: number): CategoryInfo => {
  const juz = juzBoundaries.find(j => j.juz === juzNumber);
  if (!juz) {
    throw new Error(`Invalid Juz number: ${juzNumber}`);
  }

  return {
    id: `JUZ_${juzNumber}` as MemorizationCategory,
    title: `Juz ${juzNumber}`,
    description: getJuzDescription(juzNumber),
    range: {
      startSurahId: juz.startSurahId,
      startAyah: juz.startAyah,
      endSurahId: juz.endSurahId,
      endAyah: juz.endAyah,
    },
    startJuz: juzNumber,
    endJuz: juzNumber,
  };
};

// Get Juz description with common names
const getJuzDescription = (juzNumber: number): string => {
  const juzNames: Record<number, string> = {
    1: 'Alif Lam Mim',
    28: 'Qad Sami\' Allah',
    29: 'Tabarak',
    30: 'Amma',
  };
  const name = juzNames[juzNumber] || '';
  return name ? `${name}` : `Juz ${juzNumber}`;
};

// Get surahs within a Juz
export const getSurahsInJuz = (juzNumber: number): typeof surahData => {
  const juz = juzBoundaries.find(j => j.juz === juzNumber);
  if (!juz) return [];

  return surahData.filter(surah => {
    // Surah is in this Juz if it starts in this Juz or spans into it
    if (surah.id < juz.startSurahId) return false;
    if (surah.id > juz.endSurahId) return false;
    return true;
  });
};

// Reciter definitions for audio API
export interface ReciterInfo {
  id: string;
  name: string;
  arabicName: string;
  apiIdentifier: string; // Used in the Islamic Network API
}

export const RECITERS: ReciterInfo[] = [
  {
    id: 'mishary',
    name: 'Mishary Rashid',
    arabicName: 'مشاري راشد العفاسي',
    apiIdentifier: 'ar.alafasy',
  },
  {
    id: 'basit',
    name: 'Abdul Basit',
    arabicName: 'عبد الباسط عبد الصمد',
    apiIdentifier: 'ar.abdulbasitmurattal',
  },
  {
    id: 'minshawi',
    name: 'Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    apiIdentifier: 'ar.minshawi',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    apiIdentifier: 'ar.husary',
  },
  {
    id: 'sudais',
    name: 'Abdurrahman As-Sudais',
    arabicName: 'عبدالرحمن السديس',
    apiIdentifier: 'ar.abdurrahmaansudais',
  },
];

// Get reciter by ID
export const getReciterById = (id: string): ReciterInfo | undefined => {
  return RECITERS.find(r => r.id === id);
};

// Get API identifier for reciter
export const getReciterApiIdentifier = (id: string): string => {
  const reciter = getReciterById(id);
  return reciter?.apiIdentifier || 'ar.minshawi';
};

export const MIN_TRIAL_VERSE_COUNT = 10; // Each trial should cover at least this many verses.
export const MAX_TRIAL_VERSE_COUNT = 25; // Each trial should cover at most this many verses.
