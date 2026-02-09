import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useSessionStore } from '../../src/stores/useSessionStore';
import { useAudioStore } from '../../src/stores/useAudioStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';

export default function ActiveVerseTestScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    currentAttempt,
    numberOfTrials,
    currentTrial,
    isGeneratingTrial,
    trialError,
    generateCurrentTrial,
    regenerateTrial,
    nextTrial,
    resetSession,
    isSessionComplete,
  } = useSessionStore();

  const { loadAndPlay, isPlaying, status: audioStatus } = useAudioStore();
  const { showEndVerseSnippet } = useSettingsStore();

  // Generate trial on mount if needed
  useEffect(() => {
    if (!currentTrial && !isGeneratingTrial && !trialError) {
      generateCurrentTrial();
    }
  }, []);

  // Navigate to summary when session is complete
  useEffect(() => {
    if (isSessionComplete) {
      router.replace('/(app)/test-summary');
    }
  }, [isSessionComplete]);

  const handleClose = () => {
    resetSession();
    router.back();
  };

  const handleFinish = () => {
    router.replace('/(app)/test-summary');
  };

  const handlePlayAudio = async () => {
    if (currentTrial?.startGlobalAyahNumber) {
      await loadAndPlay(currentTrial.startGlobalAyahNumber);
    }
  };

  const handleRegenerate = async () => {
    await regenerateTrial();
  };

  const handleNextVerse = async () => {
    await nextTrial();
  };

  const handleEndSessionEarly = () => {
    router.replace('/(app)/test-summary');
  };

  const progress = numberOfTrials > 0 ? (currentAttempt / numberOfTrials) * 100 : 0;
  const surahName = currentTrial?.surahEnglishName || 'Loading...';
  const arabicSnippet = currentTrial?.arabicSnippet || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
  const endVerse = currentTrial?.endAyah;
  const endSurahName = currentTrial?.endSurahEnglishName;
  const startAyah = currentTrial?.startAyah;
  const startSurahName = currentTrial?.surahEnglishName;

  if (isGeneratingTrial) {
    return (
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13ec92" />
          <Text style={[styles.loadingText, isDark ? styles.textWhite : styles.textDark]}>
            Generating trial...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* Background pattern overlay */}
      <View style={styles.geometricPattern} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, isDark ? styles.headerButtonDark : styles.headerButtonLight]}
            onPress={handleClose}
          >
            <MaterialIcons name="close" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Active Session</Text>
            <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
              Surah {surahName}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.finishButton, isDark ? styles.finishButtonDark : styles.finishButtonLight]}
            onPress={handleFinish}
          >
            <Text style={[styles.finishButtonText, isDark ? styles.textSlate400 : styles.textSlate600]}>
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Progress Card */}
      <View style={styles.progressSection}>
        <View style={[styles.progressCard, isDark ? styles.progressCardDark : styles.progressCardLight]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, isDark ? styles.textSlate400 : styles.textSlate500]}>
              Test Progress
            </Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{currentAttempt} of {numberOfTrials}</Text>
            </View>
          </View>
          <View style={[styles.progressBarBg, isDark ? styles.progressBarBgDark : styles.progressBarBgLight]}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={[styles.verseCard, isDark ? styles.verseCardDark : styles.verseCardLight]}>
          {/* Starting Verse Label */}
          <Text style={styles.verseLabel}>Starting Verse</Text>

          {/* Quote Icon & Arabic Text */}
          <View style={styles.verseContainer}>
            <View style={styles.quoteIconContainer}>
              <MaterialIcons name="format-quote" size={48} color="#d4af37" style={{ opacity: 0.15 }} />
            </View>
            <Text style={[styles.arabicText, isDark ? styles.textWhite : styles.textDark]}>{arabicSnippet}</Text>
          </View>

          {/* Instruction Box */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionLabel}>
              {showEndVerseSnippet ? 'Recite Until' : 'Starting From'}
            </Text>
            <Text style={[styles.instructionText, isDark ? styles.textSlate100 : styles.textSlate800]}>
              {showEndVerseSnippet ? (
                <>
                  <Text style={styles.instructionHighlight}>{endSurahName}</Text>
                  {' - Verse '}
                  <Text style={styles.instructionHighlight}>{endVerse}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.instructionHighlight}>{startSurahName}</Text>
                  {' - Verse '}
                  <Text style={styles.instructionHighlight}>{startAyah}</Text>
                </>
              )}
            </Text>
          </View>

          {/* Play Audio Button */}
          <TouchableOpacity
            style={styles.playAudioButton}
            onPress={handlePlayAudio}
            disabled={audioStatus === 'loading'}
          >
            <MaterialIcons
              name={isPlaying ? 'pause' : 'volume-up'}
              size={20}
              color="#13ec92"
            />
            <Text style={styles.playAudioText}>
              {audioStatus === 'loading' ? 'Loading...' : isPlaying ? 'Pause Audio' : 'Play Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <SafeAreaView edges={['bottom']} style={styles.footerSafeArea}>
        <View style={styles.footer}>
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Regenerate Button */}
            <TouchableOpacity
              style={[styles.actionButton, isDark ? styles.actionButtonDark : styles.actionButtonLight]}
              onPress={handleRegenerate}
            >
              <View style={[styles.actionIconContainer, isDark ? styles.actionIconContainerDark : styles.actionIconContainerLight]}>
                <MaterialIcons name="refresh" size={24} color={isDark ? '#cbd5e1' : '#475569'} />
              </View>
              <Text style={[styles.actionButtonText, isDark ? styles.textSlate400 : styles.textSlate600]}>
                Regenerate
              </Text>
            </TouchableOpacity>

            {/* Next Verse Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={handleNextVerse}
            >
              <View style={styles.nextIconContainer}>
                <MaterialIcons name="arrow-forward-ios" size={24} color="#0a1a14" />
              </View>
              <Text style={styles.nextButtonText}>Next Verse</Text>
            </TouchableOpacity>
          </View>

          {/* End Session Early */}
          <TouchableOpacity style={styles.endSessionButton} onPress={handleEndSessionEarly}>
            <Text style={[styles.endSessionText, isDark ? styles.textSlate500 : styles.textSlate400]}>
              End Session Early
            </Text>
          </TouchableOpacity>

          {/* Home Indicator */}
          <View style={styles.homeIndicator}>
            <View style={[styles.homeIndicatorBar, isDark ? styles.homeIndicatorBarDark : styles.homeIndicatorBarLight]} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f8faf9',
  },
  containerDark: {
    backgroundColor: '#0a1a14',
  },
  geometricPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Header
  headerSafeArea: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(226, 232, 240, 1)',
  },
  headerButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(212, 175, 55, 0.8)',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  finishButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  finishButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(226, 232, 240, 1)',
  },
  finishButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  finishButtonText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: 24,
    marginTop: 16,
    zIndex: 10,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  progressCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  progressCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBadge: {
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#13ec92',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarBgLight: {
    backgroundColor: '#e2e8f0',
  },
  progressBarBgDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#13ec92',
  },

  // Main Content
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    zIndex: 10,
  },
  verseCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 40,
    padding: 32,
    alignItems: 'center',
    gap: 32,
    borderWidth: 1,
  },
  verseCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },
  verseCardDark: {
    backgroundColor: 'rgba(18, 43, 33, 0.6)',
    borderColor: 'rgba(19, 236, 146, 0.2)',
  },
  verseLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#94a3b8',
  },
  verseContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  quoteIconContainer: {
    position: 'absolute',
    top: -16,
    left: -16,
  },
  arabicText: {
    fontFamily: 'System',
    fontSize: 32,
    lineHeight: 56,
    textAlign: 'center',
    writingDirection: 'rtl',
    paddingHorizontal: 16,
  },
  instructionBox: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    gap: 4,
  },
  instructionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(212, 175, 55, 0.8)',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '700',
  },
  instructionHighlight: {
    color: '#d4af37',
  },
  playAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 236, 146, 0.2)',
  },
  playAudioText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#13ec92',
    letterSpacing: 0.5,
  },

  // Footer
  footerSafeArea: {
    zIndex: 10,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 8,
    gap: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    borderRadius: 32,
    borderWidth: 1,
  },
  actionButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(226, 232, 240, 1)',
  },
  actionButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconContainerLight: {
    backgroundColor: '#f1f5f9',
  },
  actionIconContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  nextButton: {
    backgroundColor: '#13ec92',
    borderColor: '#13ec92',
    shadowColor: '#13ec92',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  nextIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#0a1a14',
  },
  endSessionButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  endSessionText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  homeIndicator: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeIndicatorBar: {
    width: 128,
    height: 4,
    borderRadius: 2,
  },
  homeIndicatorBarLight: {
    backgroundColor: '#cbd5e1',
  },
  homeIndicatorBarDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Text Colors
  textWhite: {
    color: '#ffffff',
  },
  textDark: {
    color: '#0f172a',
  },
  textSlate100: {
    color: '#f1f5f9',
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
  textSlate800: {
    color: '#1e293b',
  },
});
