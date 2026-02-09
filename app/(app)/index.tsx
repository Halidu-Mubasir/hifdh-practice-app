import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side + 16px gap

export default function DashboardScreen() {
  const { user, signOut } = useAuthStore();
  const userName = user?.email?.split('@')[0] || 'Ahmad';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top App Bar */}
          <View style={styles.appBar}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>≡</Text>
            </TouchableOpacity>
            <Text style={styles.appTitle}>Hifdh Practice</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <MaterialIcons name="login" size={24} color="#13ec92" />
            </TouchableOpacity>
          </View>

          {/* Profile Header */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCmMFlf3KDbLYHq4W7VX-YmipBXU7hz7RSb1UWDWmsScmeSWr5PKprkfPtoxE2aPHspFGoVPBTlw02AJLIVKxa5ipvI--QR-OOIUebsqcQ2nfYiKXBA2qx5Cr3QmLHS6Vyow-OlAWZe9xZMCt52KKDZP7Sqwmn_5UV86iDhgi_T12ZySNu78CW221y4H8TiFlKrgQQPEOVPt7mAVhyLGTFkPNPCZIGLnNUm2tLhWbgKEEEUb7zJLOC3g1UNkf4yNtwW2I8u7yVo7NR' }}
                style={styles.avatar}
              />
              <View style={styles.starBadge}>
                <Text style={styles.starIcon}>★</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Assalamu Alaikum, {userName}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Level: Intermediate</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.fireIcon}>🔥</Text>
                  <Text style={styles.streakText}>15 days</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>VERSES VERIFIED</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>142</Text>
                <Text style={styles.statChange}>+12 today</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>98%</Text>
                <Text style={styles.statChange}>Top 5%</Text>
              </View>
            </View>
          </View>

          {/* Your Journey Card */}
          <View style={styles.journeySection}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.journeyCard}>
              <ImageBackground
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgcYuFA64ueG3LTBvDz76-c3UU-bJ75fcjkzUglybJRrbHfLBuNACv1Uv5iS2RIta-S3qVb3L5h5scL52b2gxsPJG5QSNrdTnt3lJr5-5wdUFrBkTdyNvb4JQteqi3S9rxxhOP4TbP2dNxIpWfpSUHQxQ6isvlWPuRMB6SyMQOLF2V0vCV55MsiHKCyG5p0PdekHJWuPxvwu6X9Y5498BpBFtorjK-nfyOnWgRV4tS-ZBgjyC73NLt5BH7Iktjd_PN9tX_KYuFIUCC' }}
                style={styles.journeyImageBg}
                imageStyle={styles.journeyImage}
              >
                <LinearGradient
                  colors={['rgba(16,34,26,0.95)', 'rgba(16,34,26,0.4)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.journeyGradient}
                >
                  <Text style={styles.progressLabel}>OVERALL PROGRESS</Text>
                  <View style={styles.progressValueRow}>
                    <Text style={styles.progressValue}>65%</Text>
                    <Text style={styles.progressSuffix}> Complete</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
              <View style={styles.journeyFooter}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: '65%' }]} />
                </View>
                <View style={styles.journeyActions}>
                  <View>
                    <Text style={styles.lastStudiedLabel}>Last studied</Text>
                    <Text style={styles.lastStudiedValue}>Juz 30: An-Naba</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.push({
                      pathname: '/(app)/configure',
                      params: { levelId: 'juz-30', levelName: 'Juz 30' }
                    })}
                  >
                    <Text style={styles.continueButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Level Selection Grid */}
          <View style={styles.levelSection}>
            <Text style={styles.sectionTitle}>Select Practice Level</Text>
            <View style={styles.levelGrid}>
              {/* Level 1: Mastered */}
              <TouchableOpacity
                style={[styles.levelCard, styles.levelCardMastered]}
                onPress={() => router.push({
                  pathname: '/(app)/configure',
                  params: { levelId: 'last-10-surahs', levelName: 'Last 10 Surahs' }
                })}
              >
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
                <View style={styles.levelIconContainer}>
                  <Text style={styles.levelIcon}>📖</Text>
                </View>
                <Text style={styles.levelTitle}>Last 10 Surahs</Text>
                <Text style={styles.levelSubtitle}>100% Mastered</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.levelProgress, styles.levelProgressMastered, { width: '100%' }]} />
                </View>
              </TouchableOpacity>

              {/* Level 2: Active */}
              <TouchableOpacity
                style={[styles.levelCard, styles.levelCardActive]}
                onPress={() => router.push({
                  pathname: '/(app)/configure',
                  params: { levelId: 'juz-30', levelName: 'Juz 30' }
                })}
              >
                <View style={styles.levelIconContainer}>
                  <Text style={styles.levelIcon}>📚</Text>
                </View>
                <Text style={styles.levelTitle}>Juz 30</Text>
                <Text style={styles.levelSubtitle}>85% Complete</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.levelProgress, { width: '85%' }]} />
                </View>
              </TouchableOpacity>

              {/* Level 3: Learning */}
              <TouchableOpacity
                style={styles.levelCard}
                onPress={() => router.push({
                  pathname: '/(app)/configure',
                  params: { levelId: 'juz-1-5', levelName: 'Juz 1-5' }
                })}
              >
                <View style={styles.levelIconContainer}>
                  <Text style={styles.levelIcon}>📑</Text>
                </View>
                <Text style={styles.levelTitle}>Juz 1-5</Text>
                <Text style={styles.levelSubtitle}>20% Complete</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.levelProgress, { width: '20%' }]} />
                </View>
              </TouchableOpacity>

              {/* Level 4: Locked */}
              <View style={[styles.levelCard, styles.levelCardLocked]}>
                <View style={styles.lockedOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <View style={[styles.levelIconContainer, styles.levelIconLocked]}>
                  <Text style={styles.levelIcon}>📕</Text>
                </View>
                <Text style={styles.levelTitleLocked}>Juz 1-15</Text>
                <Text style={styles.levelSubtitleLocked}>Locked</Text>
                <View style={styles.levelProgressBar}>
                  <View style={[styles.levelProgress, styles.levelProgressLocked, { width: '0%' }]} />
                </View>
              </View>

              {/* Level 5: Full Quran Locked */}
              <View style={[styles.fullQuranCard, styles.levelCardLocked]}>
                <View style={styles.lockedOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <View style={[styles.levelIconContainerLarge, styles.levelIconLocked]}>
                  <Text style={styles.levelIconLarge}>📕</Text>
                </View>
                <View style={styles.fullQuranInfo}>
                  <Text style={styles.levelTitleLocked}>Full Quran</Text>
                  <Text style={styles.levelSubtitleLocked}>Complete Juz 1-15 to unlock</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom spacing for nav bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            console.log('Stats pressed!');
            router.push('/(app)/statistics');
          }}
        >
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Stats</Text>
        </TouchableOpacity>
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push({
              pathname: '/(app)/configure',
              params: { levelId: 'juz-30', levelName: 'Juz 30' }
            })}
          >
            {/* Custom Mic Icon matching the design */}
            <View style={styles.micIconContainer}>
              <View style={styles.micHead} />
              <View style={styles.micNeck} />
              <View style={styles.micBase}>
                <View style={styles.micBaseCurve} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(app)/rank')}
        >
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Rank</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            console.log('Settings pressed!');
            router.push('/(app)/settings');
          }}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10221a',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#283932',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    color: '#13ec92',
    fontSize: 24,
    fontWeight: '300',
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  signInButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    borderRadius: 12,
  },
  searchIcon: {
    color: '#13ec92',
    fontSize: 24,
  },

  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#13ec92',
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eab308',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10221a',
  },
  starIcon: {
    color: '#ffffff',
    fontSize: 12,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(19, 236, 146, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    color: '#13ec92',
    fontSize: 13,
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fireIcon: {
    fontSize: 14,
  },
  streakText: {
    color: '#fb923c',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#283932',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  statChange: {
    color: '#13ec92',
    fontSize: 12,
    fontWeight: '500',
  },

  // Journey Section
  journeySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  journeyCard: {
    backgroundColor: '#1c2722',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  journeyImageBg: {
    height: 140,
  },
  journeyImage: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  journeyGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  progressValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
  },
  progressSuffix: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '400',
  },
  journeyFooter: {
    padding: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#13ec92',
    borderRadius: 3,
  },
  journeyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastStudiedLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  lastStudiedValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: '#13ec92',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#10221a',
    fontSize: 14,
    fontWeight: '700',
  },

  // Level Grid
  levelSection: {
    marginBottom: 24,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  levelCard: {
    width: cardWidth,
    backgroundColor: '#1c2722',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  levelCardMastered: {
    position: 'relative',
  },
  levelCardActive: {
    borderWidth: 2,
    borderColor: 'rgba(19, 236, 146, 0.3)',
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eab308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  levelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 236, 146, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  levelIconLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  levelIcon: {
    fontSize: 22,
  },
  levelTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelTitleLocked: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 12,
  },
  levelSubtitleLocked: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 12,
  },
  levelProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
  },
  levelProgress: {
    height: 4,
    backgroundColor: '#13ec92',
    borderRadius: 2,
  },
  levelProgressMastered: {
    backgroundColor: '#eab308',
  },
  levelProgressLocked: {
    backgroundColor: '#475569',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 34, 26, 0.5)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  lockIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  fullQuranCard: {
    width: '100%',
    backgroundColor: '#1c2722',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIconContainerLarge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelIconLarge: {
    fontSize: 26,
  },
  fullQuranInfo: {
    flex: 1,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(16, 34, 26, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 22,
    marginBottom: 4,
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
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#13ec92',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#10221a',
    shadowColor: '#13ec92',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 26,
  },

  // Custom Mic Icon styles
  micIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micHead: {
    width: 14,
    height: 20,
    backgroundColor: '#10221a',
    borderRadius: 7,
    marginBottom: -3,
  },
  micNeck: {
    width: 3,
    height: 5,
    backgroundColor: '#10221a',
  },
  micBase: {
    alignItems: 'center',
  },
  micBaseCurve: {
    width: 20,
    height: 10,
    borderWidth: 2,
    borderColor: '#10221a',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
