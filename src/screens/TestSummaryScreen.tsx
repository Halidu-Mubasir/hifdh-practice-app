import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

export default function TestSummaryScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Calculate circle progress (85% = 306 degrees)
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const progress = 0.85; // 85%
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push('/(app)')}
                        style={styles.closeButton}
                    >
                        <MaterialIcons name="close" size={24} color={isDark ? "white" : "#0f172a"} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
                        Test Summary
                    </Text>
                    <View style={{ width: 48 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Hero Header */}
                    <View style={styles.heroContainer}>
                        <ImageBackground
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEQNMW2izpaNVGklGvZJHkzwF-Bx-1GEN1pFQTOlcMsMAbqdnxJvN4IgtztW4Hl24g-LEZbYs9Gy-7VWr6g1zSiN8Gk-7sQXbV3900WlAulvosNIbV8ImZfSGPZfH_2vjaLF2L_O2Ntb0RRfKLoF7bcgVPQhVxZqsMIeX1d4kuqWaJCPuNIi0pIyzsM-_IP0G5cAsiWSciQWXLVer48Q7S68dUF37NLvXDnQPgG1kSlxkGkny1UkXy2LL8MVLp-f2RHJIyqb0LqG5X' }}
                            style={styles.heroBackground}
                            imageStyle={styles.heroBackgroundImage}
                        >
                            <LinearGradient
                                colors={['rgba(16, 34, 26, 0.4)', 'rgba(16, 34, 26, 0.9)']}
                                style={styles.heroGradient}
                            >
                                <Text style={styles.heroLabel}>SESSION COMPLETE</Text>
                                <Text style={styles.heroTitle}>Masha'Allah! Test Completed!</Text>
                                <Text style={styles.heroSubtitle}>You are getting closer to your Hifdh goals.</Text>
                            </LinearGradient>
                        </ImageBackground>
                    </View>

                    {/* Score Visualization */}
                    <View style={styles.scoreSection}>
                        <View style={[styles.scoreCard, isDark ? styles.scoreCardDark : styles.scoreCardLight]}>
                            <View style={styles.decorativeIcon}>
                                <MaterialIcons name="mosque" size={80} color="#D4AF37" />
                            </View>

                            <View style={styles.circularProgressContainer}>
                                <Svg width={192} height={192} style={styles.circularSvg}>
                                    <Circle
                                        cx={96}
                                        cy={96}
                                        r={radius}
                                        stroke="rgba(19, 236, 146, 0.2)"
                                        strokeWidth={12}
                                        fill="transparent"
                                    />
                                    <Circle
                                        cx={96}
                                        cy={96}
                                        r={radius}
                                        stroke="#13ec92"
                                        strokeWidth={12}
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        rotation="-90"
                                        origin="96, 96"
                                    />
                                </Svg>
                                <View style={styles.circularProgressText}>
                                    <Text style={[styles.scorePercentage, isDark ? styles.textWhite : styles.textDark]}>85%</Text>
                                    <Text style={styles.scoreLabel}>ACCURACY</Text>
                                </View>
                            </View>

                            <Text style={styles.targetText}>
                                Target Completion: <Text style={styles.targetValue}>100%</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, isDark ? styles.statCardDark : styles.statCardLight]}>
                            <MaterialIcons name="menu-book" size={20} color="#13ec92" />
                            <Text style={styles.statLabel}>QUESTIONS</Text>
                            <Text style={[styles.statValue, isDark ? styles.textWhite : styles.textDark]}>20</Text>
                        </View>

                        <View style={[styles.statCard, isDark ? styles.statCardDark : styles.statCardLight]}>
                            <MaterialIcons name="refresh" size={20} color="#D4AF37" />
                            <Text style={styles.statLabel}>REGEN</Text>
                            <Text style={[styles.statValue, isDark ? styles.textWhite : styles.textDark]}>3</Text>
                        </View>

                        <View style={[styles.statCard, isDark ? styles.statCardDark : styles.statCardLight]}>
                            <MaterialIcons name="schedule" size={20} color="#13ec92" />
                            <Text style={styles.statLabel}>TIME</Text>
                            <Text style={[styles.statValue, isDark ? styles.textWhite : styles.textDark]}>12:45</Text>
                        </View>
                    </View>

                    {/* Performance Breakdown */}
                    <View style={styles.breakdownSection}>
                        <View style={[styles.breakdownCard, isDark ? styles.breakdownCardDark : styles.breakdownCardLight]}>
                            <View style={styles.breakdownHeader}>
                                <MaterialIcons name="analytics" size={14} color={isDark ? "white" : "#0f172a"} />
                                <Text style={[styles.breakdownTitle, isDark ? styles.textWhite : styles.textDark]}>
                                    Performance Breakdown
                                </Text>
                            </View>

                            <View style={styles.breakdownContent}>
                                {/* Memorization Strength */}
                                <View style={styles.breakdownItem}>
                                    <View style={styles.breakdownItemHeader}>
                                        <Text style={styles.breakdownItemLabel}>Memorization Strength</Text>
                                        <Text style={styles.breakdownItemValueGreen}>Strong</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, styles.progressBarGreen, { width: '85%' }]} />
                                    </View>
                                </View>

                                {/* Pronunciation */}
                                <View style={styles.breakdownItem}>
                                    <View style={styles.breakdownItemHeader}>
                                        <Text style={styles.breakdownItemLabel}>Pronunciation (Tajweed)</Text>
                                        <Text style={styles.breakdownItemValueGold}>Good</Text>
                                    </View>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, styles.progressBarGold, { width: '70%' }]} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom Action Buttons */}
                <View style={[styles.footer, isDark ? styles.footerDark : styles.footerLight]}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() => router.push('/(app)/revision-mistakes')}
                    >
                        <MaterialIcons name="auto-stories" size={20} color="#10221a" />
                        <Text style={styles.reviewButtonText}>Review Mistakes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.homeButton, isDark ? styles.homeButtonDark : styles.homeButtonLight]}
                        onPress={() => router.push('/(app)')}
                    >
                        <MaterialIcons name="home" size={20} color="#13ec92" />
                        <Text style={styles.homeButtonText}>Back to Home</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#f6f8f7',
    },
    containerDark: {
        backgroundColor: '#10221a',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    closeButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.5,
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    heroContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    heroBackground: {
        minHeight: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 146, 0.2)',
    },
    heroBackgroundImage: {
        borderRadius: 12,
    },
    heroGradient: {
        flex: 1,
        padding: 24,
        justifyContent: 'flex-end',
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 2,
        color: '#13ec92',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 4,
    },
    scoreSection: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    scoreCard: {
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    scoreCardLight: {
        backgroundColor: 'rgba(19, 236, 146, 0.05)',
        borderColor: 'rgba(19, 236, 146, 0.1)',
    },
    scoreCardDark: {
        backgroundColor: 'rgba(19, 236, 146, 0.05)',
        borderColor: 'rgba(19, 236, 146, 0.1)',
    },
    decorativeIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        opacity: 0.1,
    },
    circularProgressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    circularSvg: {
        transform: [{ rotate: '-90deg' }],
    },
    circularProgressText: {
        position: 'absolute',
        alignItems: 'center',
    },
    scorePercentage: {
        fontSize: 48,
        fontWeight: '700',
        letterSpacing: -2,
    },
    scoreLabel: {
        fontSize: 12,
        color: 'rgba(19, 236, 146, 0.7)',
        letterSpacing: 1,
        marginTop: 4,
    },
    targetText: {
        fontSize: 14,
        color: '#64748b',
    },
    targetValue: {
        color: '#13ec92',
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
    },
    statCard: {
        flex: 1,
        gap: 8,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statCardLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    statCardDark: {
        backgroundColor: '#1a3328',
        borderColor: 'rgba(19, 236, 146, 0.1)',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#94a3b8',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    breakdownSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    breakdownCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
    },
    breakdownCardLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    breakdownCardDark: {
        backgroundColor: '#162a21',
        borderColor: 'rgba(19, 236, 146, 0.05)',
    },
    breakdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    breakdownTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    breakdownContent: {
        gap: 16,
    },
    breakdownItem: {
        gap: 6,
    },
    breakdownItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownItemLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    breakdownItemValueGreen: {
        fontSize: 12,
        fontWeight: '500',
        color: '#13ec92',
        textTransform: 'uppercase',
    },
    breakdownItemValueGold: {
        fontSize: 12,
        fontWeight: '500',
        color: '#D4AF37',
        textTransform: 'uppercase',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 8,
        borderRadius: 999,
    },
    progressBarGreen: {
        backgroundColor: '#13ec92',
    },
    progressBarGold: {
        backgroundColor: '#D4AF37',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 12,
        borderTopWidth: 1,
    },
    footerLight: {
        backgroundColor: 'white',
        borderTopColor: '#e2e8f0',
    },
    footerDark: {
        backgroundColor: '#10221a',
        borderTopColor: 'rgba(19, 236, 146, 0.1)',
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#13ec92',
        paddingVertical: 16,
        borderRadius: 999,
    },
    reviewButtonText: {
        color: '#10221a',
        fontSize: 16,
        fontWeight: '700',
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 999,
        borderWidth: 2,
    },
    homeButtonLight: {
        backgroundColor: 'transparent',
        borderColor: '#e2e8f0',
    },
    homeButtonDark: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(19, 236, 146, 0.3)',
    },
    homeButtonText: {
        color: '#13ec92',
        fontSize: 16,
        fontWeight: '700',
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#0f172a',
    },
});
