import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { db } from '../services/database';

const { width } = Dimensions.get('window');

type Timeframe = 'Day' | 'Week' | 'Month' | 'Year';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StatisticsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('Week');
    const [sessionCount, setSessionCount] = useState(0);
    const [averageScore, setAverageScore] = useState<number | null>(null);
    const [activityData, setActivityData] = useState(
        DAY_LABELS.map(day => ({ day, height: 10, opacity: 0.1 }))
    );

    const timeframes: Timeframe[] = ['Day', 'Week', 'Month', 'Year'];

    useEffect(() => {
        db.getSessionCount().then(setSessionCount).catch(() => {});
        db.getAverageScore().then(setAverageScore).catch(() => {});
        db.getSessionHistory(50).then((sessions) => {
            // Build a 7-day activity map
            const now = Date.now();
            const dayCounts = new Array(7).fill(0);
            sessions.forEach((s) => {
                const daysAgo = Math.floor((now - s.startedAt) / (1000 * 60 * 60 * 24));
                if (daysAgo >= 0 && daysAgo < 7) {
                    // Map to Mon=0…Sun=6 relative to today
                    const todayDow = (new Date().getDay() + 6) % 7; // 0=Mon
                    const targetDow = (todayDow - daysAgo + 7) % 7;
                    dayCounts[targetDow]++;
                }
            });
            const maxCount = Math.max(...dayCounts, 1);
            setActivityData(DAY_LABELS.map((day, i) => ({
                day,
                height: Math.max(10, Math.round((dayCounts[i] / maxCount) * 90)),
                opacity: Math.max(0.1, dayCounts[i] / maxCount),
            })));
        }).catch(() => {});
    }, []);

    // Calculate circle progress
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const accuracyPct = sessionCount > 0 && averageScore !== null ? (averageScore / 5) : 0;
    const progress = accuracyPct;
    const strokeDashoffset = circumference * (1 - progress);
    const accuracyDisplay = sessionCount > 0 && averageScore !== null
        ? `${Math.round(accuracyPct * 100)}%`
        : '—';

    const weakAreas: { name: string; accuracy: number; badge: string; badgeColor: string; progress: number; lastTested: string }[] = [];

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.headerButton}
                    >
                        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hifdh Statistics</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <MaterialIcons name="share" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Segmented Control */}
                    <View style={styles.segmentedControlContainer}>
                        <View style={styles.segmentedControl}>
                            {timeframes.map((timeframe) => (
                                <TouchableOpacity
                                    key={timeframe}
                                    onPress={() => setSelectedTimeframe(timeframe)}
                                    style={[
                                        styles.segment,
                                        selectedTimeframe === timeframe && styles.segmentSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.segmentText,
                                        selectedTimeframe === timeframe && styles.segmentTextSelected
                                    ]}>
                                        {timeframe}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Overall Accuracy Card */}
                    <View style={styles.accuracyCardContainer}>
                        <View style={styles.accuracyCard}>
                            {/* Decorative Icon */}
                            <View style={styles.decorativeIcon}>
                                <MaterialIcons name="verified-user" size={60} color="#d4af37" />
                            </View>

                            {/* Circular Progress */}
                            <View style={styles.circularProgressContainer}>
                                <Svg width={192} height={192} style={styles.circularSvg}>
                                    <Circle
                                        cx={96}
                                        cy={96}
                                        r={radius}
                                        stroke="rgba(255, 255, 255, 0.05)"
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
                                    <Text style={styles.accuracyPercentage}>{accuracyDisplay}</Text>
                                    <Text style={styles.accuracyLabel}>ACCURACY</Text>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{sessionCount}</Text>
                                    <Text style={styles.statLabel}>Sessions</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, styles.statValueSecondary]}>
                                        {sessionCount > 0 && averageScore !== null ? averageScore.toFixed(1) : '—'}
                                    </Text>
                                    <Text style={styles.statLabel}>Avg Score /5</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Stats Grid */}
                    <View style={styles.quickStatsGrid}>
                        <View style={styles.quickStatCard}>
                            <View style={styles.quickStatHeader}>
                                <MaterialIcons name="local-fire-department" size={14} color="rgba(19, 236, 146, 0.8)" />
                                <Text style={styles.quickStatTitle}>STREAK</Text>
                            </View>
                            <View style={styles.quickStatValueContainer}>
                                <Text style={styles.quickStatValue}>{sessionCount}</Text>
                                <Text style={styles.quickStatUnit}>Sessions</Text>
                            </View>
                        </View>

                        <View style={styles.quickStatCard}>
                            <View style={styles.quickStatHeader}>
                                <MaterialIcons name="emoji-events" size={14} color="#d4af37" />
                                <Text style={[styles.quickStatTitle, styles.quickStatTitleGold]}>AVG SCORE</Text>
                            </View>
                            <View style={styles.quickStatValueContainer}>
                                <Text style={styles.quickStatValue}>
                                    {sessionCount > 0 && averageScore !== null ? averageScore.toFixed(1) : '—'}
                                </Text>
                                <Text style={styles.quickStatUnit}>of 5</Text>
                            </View>
                        </View>
                    </View>

                    {/* Activity Chart */}
                    <View style={styles.activitySection}>
                        <View style={styles.activityHeader}>
                            <Text style={styles.sectionTitle}>Activity</Text>
                            <Text style={styles.activitySubtitle}>Last 7 Days</Text>
                        </View>

                        <View style={styles.activityCard}>
                            <View style={styles.chartContainer}>
                                {activityData.map((item, index) => (
                                    <View key={index} style={styles.barContainer}>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: `${item.height}%`,
                                                    backgroundColor: index === 6 ? 'rgba(212, 175, 55, 0.5)' : `rgba(19, 236, 146, ${item.opacity})`,
                                                }
                                            ]}
                                        />
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.activityInsight}>
                                <MaterialIcons name="bolt" size={18} color="#13ec92" />
                                <Text style={styles.activityInsightText}>
                                    Your highest activity was on <Text style={styles.activityInsightBold}>Thursday</Text> with 45 tests.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Focus Needed */}
                    <View style={styles.focusSection}>
                        <View style={styles.focusHeader}>
                            <Text style={styles.sectionTitle}>Focus Needed</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllButton}>SEE ALL</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weakAreasList}>
                            {weakAreas.map((area, index) => (
                                <View key={index} style={[styles.weakAreaCard, index === 2 && styles.weakAreaCardFaded]}>
                                    <View style={styles.weakAreaContent}>
                                        <View style={styles.weakAreaHeader}>
                                            <Text style={styles.weakAreaName}>{area.name}</Text>
                                            <View style={[styles.badge, { backgroundColor: `${area.badgeColor}33` }]}>
                                                <Text style={[styles.badgeText, { color: area.badgeColor }]}>{area.badge}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.progressBarBg}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    { width: `${area.progress * 100}%`, backgroundColor: area.badgeColor }
                                                ]}
                                            />
                                        </View>

                                        <Text style={styles.weakAreaMeta}>
                                            {area.accuracy}% Accuracy • Last tested {area.lastTested}
                                        </Text>
                                    </View>

                                    <TouchableOpacity style={styles.playButton}>
                                        <MaterialIcons name="play-arrow" size={24} color="#10221a" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={[styles.bottomNav, isDark ? styles.bottomNavDark : styles.bottomNavLight]}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)')}>
                        <MaterialIcons name="menu-book" size={24} color="rgba(255, 255, 255, 0.4)" />
                        <Text style={styles.navLabel}>Mushaf</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)/configure')}>
                        <MaterialIcons name="quiz" size={24} color="rgba(255, 255, 255, 0.4)" />
                        <Text style={styles.navLabel}>Test</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem}>
                        <MaterialIcons name="analytics" size={24} color="#13ec92" />
                        <Text style={[styles.navLabel, styles.navLabelActive]}>Stats</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)/settings')}>
                        <MaterialIcons name="person" size={24} color="rgba(255, 255, 255, 0.4)" />
                        <Text style={styles.navLabel}>Profile</Text>
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerLight: {
        backgroundColor: 'rgba(246, 248, 247, 0.8)',
    },
    headerDark: {
        backgroundColor: 'rgba(16, 34, 26, 0.8)',
    },
    headerButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    segmentedControlContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    segmentedControl: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    segmentSelected: {
        backgroundColor: '#13ec92',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    segmentTextSelected: {
        color: '#10221a',
    },
    accuracyCardContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    accuracyCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
    },
    decorativeIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        opacity: 0.2,
    },
    circularProgressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularSvg: {
        transform: [{ rotate: '-90deg' }],
    },
    circularProgressText: {
        position: 'absolute',
        alignItems: 'center',
    },
    accuracyPercentage: {
        fontSize: 48,
        fontWeight: '700',
        color: 'white',
        letterSpacing: -2,
    },
    accuracyLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 2,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        marginTop: 32,
        width: '100%',
        gap: 32,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#13ec92',
    },
    statValueSecondary: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        fontWeight: '500',
        marginTop: 4,
    },
    quickStatsGrid: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    quickStatCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 16,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    quickStatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickStatTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: 'rgba(19, 236, 146, 0.8)',
    },
    quickStatTitleGold: {
        color: '#d4af37',
    },
    quickStatValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    quickStatValue: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
    },
    quickStatUnit: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    activitySection: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    activitySubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    activityCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 96,
        gap: 8,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
        height: '100%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: 4,
    },
    barLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '500',
    },
    activityInsight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    activityInsightText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        flex: 1,
    },
    activityInsightBold: {
        color: 'white',
        fontWeight: '700',
    },
    focusSection: {
        paddingHorizontal: 16,
        paddingBottom: 48,
    },
    focusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllButton: {
        fontSize: 12,
        fontWeight: '700',
        color: '#13ec92',
        letterSpacing: 1.5,
    },
    weakAreasList: {
        gap: 12,
    },
    weakAreaCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    weakAreaCardFaded: {
        opacity: 0.8,
    },
    weakAreaContent: {
        flex: 1,
    },
    weakAreaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    weakAreaName: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 999,
    },
    weakAreaMeta: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 4,
    },
    playButton: {
        width: 40,
        height: 40,
        backgroundColor: '#13ec92',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    bottomNavLight: {
        backgroundColor: 'rgba(246, 248, 247, 0.9)',
    },
    bottomNavDark: {
        backgroundColor: 'rgba(16, 34, 26, 0.9)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.4)',
    },
    navLabelActive: {
        color: '#13ec92',
    },
});
