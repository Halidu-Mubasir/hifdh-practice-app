import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/useAuthStore';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuthStore();

  const userName = user?.email?.split('@')[0] || 'Guest';

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <ScrollView style={styles.scrollView}>
        {/* Top App Bar */}
        <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
              Hifdh Practice
            </Text>
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, isDark ? styles.avatarDark : styles.avatarLight]}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeIcon}>⭐</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.greeting, isDark ? styles.textWhite : styles.textDark]}>
                Assalamu Alaikum, {userName}
              </Text>
              <View style={styles.profileBadges}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Level: Intermediate</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakIcon}>🔥</Text>
                  <Text style={styles.streakText}>15 days</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Verses Verified</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>142</Text>
              <Text style={styles.statChange}>+12 today</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statChange}>Top 5%</Text>
            </View>
          </View>
        </View>

        {/* Progress Summary Card */}
        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Your Journey
          </Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressHeaderOverlay} />
              <View style={styles.progressHeaderContent}>
                <Text style={styles.progressHeaderLabel}>OVERALL PROGRESS</Text>
                <Text style={styles.progressHeaderValue}>
                  65% <Text style={styles.progressHeaderUnit}>Complete</Text>
                </Text>
              </View>
            </View>
            <View style={styles.progressBody}>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
              <View style={styles.progressFooter}>
                <View>
                  <Text style={styles.progressFooterLabel}>Last studied</Text>
                  <Text style={styles.progressFooterValue}>Juz 30: An-Naba</Text>
                </View>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => router.push('/(app)/configure')}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Level Selection Grid */}
        <View style={styles.levelsSection}>
          <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>
            Select Practice Level
          </Text>
          <View style={styles.levelsGrid}>
            {/* Level 1: Mastered */}
            <View style={styles.levelCard}>
              <View style={styles.levelCheckmark}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
              <View style={styles.levelIconContainer}>
                <Text style={styles.levelIcon}>📖</Text>
              </View>
              <View>
                <Text style={styles.levelTitle}>Last 10 Surahs</Text>
                <Text style={styles.levelSubtitle}>100% Mastered</Text>
              </View>
              <View style={styles.levelProgressBg}>
                <View style={[styles.levelProgressFill, styles.levelProgressComplete]} />
              </View>
            </View>

            {/* Level 2: Active */}
            <TouchableOpacity
              style={[styles.levelCard, styles.levelCardActive]}
              onPress={() => router.push('/(app)/configure')}
            >
              <View style={styles.levelIconContainer}>
                <Text style={styles.levelIcon}>📚</Text>
              </View>
              <View>
                <Text style={styles.levelTitle}>Juz 30</Text>
                <Text style={styles.levelSubtitle}>85% Complete</Text>
              </View>
              <View style={styles.levelProgressBg}>
                <View style={[styles.levelProgressFill, { width: '85%' }]} />
              </View>
            </TouchableOpacity>

            {/* Level 3: Learning */}
            <TouchableOpacity
              style={styles.levelCard}
              onPress={() => router.push('/(app)/configure')}
            >
              <View style={styles.levelIconContainer}>
                <Text style={styles.levelIcon}>📑</Text>
              </View>
              <View>
                <Text style={styles.levelTitle}>Juz 1-5</Text>
                <Text style={styles.levelSubtitle}>20% Complete</Text>
              </View>
              <View style={styles.levelProgressBg}>
                <View style={[styles.levelProgressFill, { width: '20%' }]} />
              </View>
            </TouchableOpacity>

            {/* Level 4: Locked */}
            <View style={[styles.levelCard, styles.levelCardLocked]}>
              <View style={styles.levelLockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
              <View style={[styles.levelIconContainer, styles.levelIconContainerLocked]}>
                <Text style={styles.levelIconLocked}>📕</Text>
              </View>
              <View>
                <Text style={styles.levelTitleLocked}>Juz 1-15</Text>
                <Text style={styles.levelSubtitleLocked}>Locked</Text>
              </View>
              <View style={styles.levelProgressBg}>
                <View style={[styles.levelProgressFillLocked, { width: 0 }]} />
              </View>
            </View>

            {/* Level 5: Locked Full Quran */}
            <View style={[styles.levelCardWide, styles.levelCardLocked]}>
              <View style={styles.levelLockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
              <View style={[styles.levelIconContainerLarge, styles.levelIconContainerLocked]}>
                <Text style={styles.levelIconLarge}>📕</Text>
              </View>
              <View style={styles.levelInfoWide}>
                <Text style={styles.levelTitleLocked}>Full Quran</Text>
                <Text style={styles.levelSubtitleLocked}>Complete Juz 1-15 to unlock</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, isDark ? styles.bottomNavDark : styles.bottomNavLight]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            console.log('Stats button pressed!');
            router.push('/(app)/statistics');
          }}
        >
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Stats</Text>
        </TouchableOpacity>

        <View style={styles.navCenterContainer}>
          <TouchableOpacity style={styles.navCenterButton} activeOpacity={0.7}>
            <Text style={styles.navCenterIcon}>🎤</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Rank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            console.log('Settings button pressed!');
            router.push('/(app)/settings');
          }}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#1f2937',
  },
  scrollView: {
    flex: 1,
    marginBottom: 100,
  },
  header: {
    paddingTop: 8,
  },
  headerLight: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
  },
  headerDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#283932',
  },
  menuIcon: {
    fontSize: 24,
    color: '#13ec92',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#13ec92',
  },
  profileSection: {
    padding: 16,
    marginTop: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#13ec92',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLight: {
    backgroundColor: '#f8fafc',
  },
  avatarDark: {
    backgroundColor: '#283932',
  },
  avatarIcon: {
    fontSize: 32,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#eab308',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  avatarBadgeIcon: {
    fontSize: 12,
    color: 'white',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profileBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  levelBadge: {
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelBadgeText: {
    color: '#13ec92',
    fontSize: 14,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakIcon: {
    fontSize: 14,
    color: '#fb923c',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fb923c',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    gap: 4,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#283932',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  statChange: {
    color: '#13ec92',
    fontSize: 12,
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingLeft: 4,
  },
  progressCard: {
    borderRadius: 12,
    backgroundColor: '#1c2722',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressHeader: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(19, 236, 146, 0.2)',
    justifyContent: 'flex-end',
    padding: 16,
    position: 'relative',
  },
  progressHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
  },
  progressHeaderContent: {
    zIndex: 10,
  },
  progressHeaderLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  progressHeaderValue: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
  },
  progressHeaderUnit: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressBody: {
    gap: 12,
    padding: 16,
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
    height: 6,
  },
  progressBarFill: {
    backgroundColor: '#13ec92',
    height: 6,
    borderRadius: 999,
    width: '65%',
  },
  progressFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressFooterLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  progressFooterValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 24,
    backgroundColor: '#13ec92',
  },
  continueButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
  },
  levelsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  levelCard: {
    width: '47%',
    backgroundColor: '#1c2722',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  levelCardActive: {
    borderWidth: 2,
    borderColor: 'rgba(19, 236, 146, 0.3)',
  },
  levelCardLocked: {
    backgroundColor: 'rgba(28, 39, 34, 0.6)',
    opacity: 0.5,
  },
  levelCardWide: {
    width: '100%',
    backgroundColor: 'rgba(28, 39, 34, 0.6)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  levelCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkmarkIcon: {
    color: '#eab308',
    fontSize: 16,
  },
  levelIconContainer: {
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelIconContainerLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  levelIconContainerLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelIcon: {
    fontSize: 20,
    color: '#13ec92',
  },
  levelIconLocked: {
    fontSize: 20,
    color: '#64748b',
  },
  levelIconLarge: {
    fontSize: 24,
    color: '#64748b',
  },
  levelTitle: {
    fontWeight: '700',
    color: 'white',
    lineHeight: 20,
  },
  levelTitleLocked: {
    fontWeight: '700',
    color: '#94a3b8',
    lineHeight: 20,
  },
  levelSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  levelSubtitleLocked: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  levelProgressBg: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 999,
    height: 4,
    marginTop: 4,
  },
  levelProgressFill: {
    backgroundColor: '#13ec92',
    height: 4,
    borderRadius: 999,
  },
  levelProgressComplete: {
    backgroundColor: '#eab308',
    width: '100%',
  },
  levelProgressFillLocked: {
    backgroundColor: '#475569',
    height: 4,
    borderRadius: 999,
  },
  levelLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    zIndex: 10,
  },
  lockIcon: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  levelInfoWide: {
    flex: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 9999,
    elevation: 10,
  },
  bottomNavLight: {
    backgroundColor: '#f8fafc',
  },
  bottomNavDark: {
    backgroundColor: '#1f2937',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.2)', // DEBUG: Red tint to see if visible
  },
  navIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  navIconActive: {
    fontSize: 20,
    color: '#13ec92',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '500',
    color: '#13ec92',
  },
  navCenterContainer: {
    position: 'relative',
    marginTop: -48,
  },
  navCenterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#13ec92',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#1f2937',
  },
  navCenterIcon: {
    fontSize: 24,
    color: '#1f2937',
  },
  textWhite: {
    color: '#ffffff',
  },
  textDark: {
    color: '#0f172a',
  },
});
