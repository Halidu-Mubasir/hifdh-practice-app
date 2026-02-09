import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSessionStore } from '../stores/useSessionStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { PRESET_RANGES, presetRangeToCategoryInfo, RECITERS } from '../constants';
import { PresetRangeId } from '../types';

export default function TestConfigScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ levelId?: string; levelName?: string }>();

  // Stores
  const { setCategory, setNumberOfTrials, startSession, isGeneratingTrial } = useSessionStore();
  const {
    showEndVerseSnippet,
    setShowEndVerseSnippet,
    preferredReciter,
    setPreferredReciter
  } = useSettingsStore();

  // Local state
  const [selectedPresetId, setSelectedPresetId] = useState<PresetRangeId>('LAST_2_JUZ');
  const [selectedReciter, setSelectedReciter] = useState(preferredReciter || 'mishary');
  const [numQuestions, setNumQuestions] = useState(10);
  const [showEndingVerse, setShowEndingVerse] = useState(showEndVerseSnippet);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Hafidh'>('Beginner');
  const [isStarting, setIsStarting] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Get the selected preset
  const selectedPreset = PRESET_RANGES.find(p => p.id === selectedPresetId) || PRESET_RANGES[4]; // Default to Last 2 Juz

  // Sync with settings store
  useEffect(() => {
    setShowEndingVerse(showEndVerseSnippet);
  }, [showEndVerseSnippet]);

  useEffect(() => {
    if (preferredReciter) {
      setSelectedReciter(preferredReciter);
    }
  }, [preferredReciter]);

  const handleToggleShowEndingVerse = async (value: boolean) => {
    setShowEndingVerse(value);
    await setShowEndVerseSnippet(value);
  };

  const handleReciterSelect = async (reciterId: string) => {
    setSelectedReciter(reciterId);
    await setPreferredReciter(reciterId);
  };

  const handleStartTest = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      // Convert preset to category info
      const category = presetRangeToCategoryInfo(selectedPreset);

      // Set the category and number of trials in the session store
      setCategory(category);
      setNumberOfTrials(numQuestions);

      // Start the session (this will generate the first trial)
      await startSession();

      // Navigate to the trial screen
      router.push('/(app)/trial');
    } catch (error) {
      console.error('Failed to start test:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const getSelectedReciterName = () => {
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    return reciter?.name || 'Mishary Rashid';
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="#d4af37" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark ? styles.headerTitleDark : styles.headerTitleLight]}>
              Test Configuration
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Select Range Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="menu-book" size={20} color="#d4af37" />
              <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>Select Range</Text>
            </View>

            <View style={styles.sectionContent}>
              {/* Preset Range Dropdown */}
              <TouchableOpacity
                style={[styles.dropdown, isDark ? styles.dropdownDark : styles.dropdownLight]}
                onPress={() => setShowPresetPicker(true)}
              >
                <View style={styles.dropdownContent}>
                  <Text style={[styles.dropdownText, isDark ? styles.textWhite : styles.textDark]}>
                    {selectedPreset.label}
                  </Text>
                  <Text style={[styles.dropdownDescription, isDark ? styles.textSlate400 : styles.textSlate500]}>
                    {selectedPreset.description}
                  </Text>
                </View>
                <MaterialIcons name="expand-more" size={24} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reciter Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="record-voice-over" size={20} color="#d4af37" />
              <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>Reciter Selection</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recitersScroll}>
              {RECITERS.map((reciter) => {
                const isSelected = selectedReciter === reciter.id;
                return (
                  <TouchableOpacity
                    key={reciter.id}
                    onPress={() => handleReciterSelect(reciter.id)}
                    style={[styles.reciterItem, !isSelected && styles.reciterItemUnselected]}
                  >
                    <View style={[
                      styles.reciterAvatar,
                      isSelected ? styles.reciterAvatarSelected : (isDark ? styles.reciterAvatarDark : styles.reciterAvatarLight)
                    ]}>
                      {isSelected && <View style={styles.reciterAvatarOverlay} />}
                      <MaterialIcons name="person" size={30} color={isSelected ? "#d4af37" : (isDark ? "white" : "gray")} />
                    </View>
                    <Text style={[styles.reciterName, isDark ? styles.textWhite : styles.textDark]}>
                      {reciter.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Number of Questions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="format-list-numbered" size={20} color="#d4af37" />
              <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>Number of Questions</Text>
            </View>
            <View style={[styles.questionCountContainer, isDark ? styles.questionCountContainerDark : styles.questionCountContainerLight]}>
              {[5, 10, 20].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setNumQuestions(num)}
                  style={[
                    styles.questionCountButton,
                    numQuestions === num && styles.questionCountButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.questionCountText,
                    numQuestions === num ? styles.questionCountTextSelected : (isDark ? styles.textSlate300 : styles.textSlate600)
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Show Ending Verse */}
          <View style={[styles.toggleCard, isDark ? styles.toggleCardDark : styles.toggleCardLight]}>
            <View style={styles.toggleLeft}>
              <View style={styles.toggleIcon}>
                <MaterialIcons name="visibility" size={20} color="#d4af37" />
              </View>
              <View>
                <Text style={[styles.toggleTitle, isDark ? styles.textWhite : styles.textDark]}>Show Ending Verse</Text>
                <Text style={[styles.toggleSubtitle, isDark ? styles.textSlate400 : styles.textSlate500]}>Display target verse number</Text>
              </View>
            </View>
            <Switch
              value={showEndingVerse}
              onValueChange={handleToggleShowEndingVerse}
              trackColor={{ false: '#e2e8f0', true: '#10b981' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#e2e8f0"
            />
          </View>

          {/* Select Difficulty */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="flash-on" size={20} color="#d4af37" />
              <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>Select Difficulty</Text>
            </View>
            <View style={styles.difficultyContainer}>
              {/* Beginner */}
              <TouchableOpacity
                onPress={() => setDifficulty('Beginner')}
                style={[
                  styles.difficultyCard,
                  difficulty === 'Beginner' ? styles.difficultyCardSelected : (isDark ? styles.difficultyCardDark : styles.difficultyCardLight)
                ]}
              >
                <View style={[
                  styles.difficultyIcon,
                  difficulty === 'Beginner' ? styles.difficultyIconSelected : (isDark ? styles.difficultyIconDark : styles.difficultyIconLight)
                ]}>
                  <MaterialIcons name="sentiment-satisfied" size={24} color={difficulty === 'Beginner' ? 'white' : (isDark ? 'white' : 'gray')} />
                </View>
                <View style={styles.difficultyInfo}>
                  <Text style={[styles.difficultyTitle, isDark ? styles.textWhite : styles.textDark]}>Beginner</Text>
                  <Text style={[styles.difficultyDescription, isDark ? styles.textSlate400 : styles.textSlate500]}>Shows more context and hints</Text>
                </View>
                {difficulty === 'Beginner' && (
                  <MaterialIcons name="check-circle" size={24} color="#10b981" />
                )}
              </TouchableOpacity>

              {/* Hafidh */}
              <TouchableOpacity
                onPress={() => setDifficulty('Hafidh')}
                style={[
                  styles.difficultyCard,
                  difficulty === 'Hafidh' ? styles.difficultyCardSelected : (isDark ? styles.difficultyCardDark : styles.difficultyCardLight)
                ]}
              >
                <View style={[
                  styles.difficultyIcon,
                  difficulty === 'Hafidh' ? styles.difficultyIconSelected : (isDark ? styles.difficultyIconDark : styles.difficultyIconLight)
                ]}>
                  <MaterialIcons name="psychology" size={24} color={difficulty === 'Hafidh' ? 'white' : (isDark ? 'white' : 'gray')} />
                </View>
                <View style={styles.difficultyInfo}>
                  <Text style={[styles.difficultyTitle, isDark ? styles.textWhite : styles.textDark]}>Hafidh</Text>
                  <Text style={[styles.difficultyDescription, isDark ? styles.textSlate400 : styles.textSlate500]}>Only starting verse, no hints</Text>
                </View>
                {difficulty === 'Hafidh' ? (
                  <MaterialIcons name="check-circle" size={24} color="#10b981" />
                ) : (
                  <View style={[styles.radioUnselected, isDark && styles.radioUnselectedDark]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Quote Card */}
          <View style={styles.quoteCardContainer}>
            <LinearGradient
              colors={['#065f46', '#064e3b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quoteCard}
            >
              <View style={styles.quoteContent}>
                <MaterialIcons name="auto-stories" size={24} color="#d4af37" style={{ marginBottom: 4 }} />
                <Text style={styles.quoteText}>
                  "The best of you is he who learns the Quran and teaches it."
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, isDark ? styles.footerDark : styles.footerLight]}>
        <View style={styles.footerContent}>
          <TouchableOpacity
            onPress={handleStartTest}
            style={[styles.startButton, isStarting && styles.startButtonDisabled]}
            activeOpacity={0.9}
            disabled={isStarting}
          >
            <LinearGradient
              colors={isStarting ? ['#6b7280', '#4b5563'] : ['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              {isStarting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="mosque" size={20} color="#d4af37" />
                  <Text style={styles.startButtonText}>Start Test Session</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="rgba(255,255,255,0.5)" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.footerHint}>
            {numQuestions} Questions • {selectedPreset.label} • {getSelectedReciterName()}
          </Text>
        </View>
      </View>

      {/* Preset Picker Modal */}
      <Modal
        visible={showPresetPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPresetPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPresetPicker(false)}
        >
          <View style={[styles.modalContent, isDark ? styles.modalContentDark : styles.modalContentLight]}>
            <Text style={[styles.modalTitle, isDark ? styles.textWhite : styles.textDark]}>
              Select Memorization Range
            </Text>
            {PRESET_RANGES.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetOption,
                  selectedPresetId === preset.id && styles.presetOptionSelected,
                  isDark ? styles.presetOptionDark : styles.presetOptionLight,
                ]}
                onPress={() => {
                  setSelectedPresetId(preset.id);
                  setShowPresetPicker(false);
                }}
              >
                <View style={styles.presetOptionContent}>
                  <Text style={[
                    styles.presetOptionLabel,
                    selectedPresetId === preset.id ? styles.presetOptionLabelSelected : (isDark ? styles.textWhite : styles.textDark)
                  ]}>
                    {preset.label}
                  </Text>
                  <Text style={[styles.presetOptionDescription, isDark ? styles.textSlate400 : styles.textSlate500]}>
                    {preset.description}
                  </Text>
                </View>
                {selectedPresetId === preset.id && (
                  <MaterialIcons name="check-circle" size={24} color="#10b981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#06231a',
  },
  scrollView: {
    flex: 1,
    marginBottom: 140,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  headerLight: {
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  headerDark: {
    backgroundColor: 'rgba(6, 35, 26, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    maxWidth: 448,
    marginHorizontal: 'auto',
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    flex: 1,
    paddingRight: 40,
  },
  headerTitleLight: {
    color: '#10b981',
  },
  headerTitleDark: {
    color: '#6ee7b7',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 448,
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionContent: {
    gap: 16,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownLight: {
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
  },
  dropdownDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  dropdownContent: {
    flex: 1,
    gap: 4,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownDescription: {
    fontSize: 12,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipTextSelected: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  chipUnselected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    opacity: 0.6,
    marginRight: 8,
  },
  chipUnselectedDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipTextUnselected: {
    fontSize: 14,
    fontWeight: '500',
  },
  recitersScroll: {
    flexDirection: 'row',
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  reciterItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    width: 96,
    marginRight: 12,
  },
  reciterItemUnselected: {
    opacity: 0.6,
  },
  reciterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  reciterAvatarLight: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reciterAvatarDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reciterAvatarSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  reciterAvatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  reciterName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  questionCountContainer: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  questionCountContainerLight: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  questionCountContainerDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  questionCountButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  questionCountButtonSelected: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  questionCountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  questionCountTextSelected: {
    color: 'white',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  toggleCardLight: {
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
  },
  toggleCardDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleSubtitle: {
    fontSize: 11,
  },
  difficultyContainer: {
    gap: 12,
  },
  difficultyCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  difficultyCardLight: {
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
  },
  difficultyCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyCardSelected: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  difficultyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyIconLight: {
    backgroundColor: '#f1f5f9',
  },
  difficultyIconDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  difficultyIconSelected: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  difficultyDescription: {
    fontSize: 11,
    opacity: 0.7,
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  radioUnselectedDark: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quoteCardContainer: {
    paddingTop: 16,
    paddingBottom: 96,
  },
  quoteCard: {
    borderRadius: 24,
    height: 112,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  quoteContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d1fae5',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    zIndex: 50,
  },
  footerLight: {
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
  footerDark: {
    backgroundColor: 'rgba(6, 35, 26, 0.95)',
  },
  footerContent: {
    maxWidth: 448,
    marginHorizontal: 'auto',
    width: '100%',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    opacity: 0.7,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footerHint: {
    color: 'rgba(212, 175, 55, 0.6)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },
  textWhite: {
    color: '#ffffff',
  },
  textDark: {
    color: '#0f172a',
  },
  textSlate300: {
    color: '#cbd5e1',
  },
  textSlate400: {
    color: '#94a3b8',
  },
  textSlate500: {
    color: '#64748b',
  },
  textSlate600: {
    color: '#475569',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  modalContentLight: {
    backgroundColor: 'white',
  },
  modalContentDark: {
    backgroundColor: '#0f2920',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  presetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetOptionLight: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  presetOptionDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  presetOptionSelected: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  presetOptionContent: {
    flex: 1,
    gap: 4,
  },
  presetOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  presetOptionLabelSelected: {
    color: '#10b981',
  },
  presetOptionDescription: {
    fontSize: 12,
  },
});
