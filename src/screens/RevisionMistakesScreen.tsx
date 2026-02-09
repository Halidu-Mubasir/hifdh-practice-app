import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type Mistake = {
    id: string;
    surah: string;
    ayah: number;
    highlightedWord: string;
    verseBefore: string;
    verseAfter: string;
    audioUrl?: string;
};

const MISTAKES: Mistake[] = [
    {
        id: '1',
        surah: 'Surah Al-Baqarah',
        ayah: 155,
        highlightedWord: 'وَنَقْصٍ',
        verseBefore: 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ',
        verseAfter: 'مِنَ الْأَمْوَالِ',
    },
    {
        id: '2',
        surah: 'Surah An-Naba',
        ayah: 8,
        highlightedWord: 'أَزْوَاجًا',
        verseBefore: 'وَخَلَقْنَاكُمْ',
        verseAfter: '',
    },
    {
        id: '3',
        surah: 'Surah Al-Ikhlas',
        ayah: 4,
        highlightedWord: 'كُفُوًا',
        verseBefore: 'وَلَمْ يَكُنْ لَهُ',
        verseAfter: 'أَحَدٌ',
    },
];

export default function RevisionMistakesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color={isDark ? "white" : "#0f172a"} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
                        Revision & Mistakes
                    </Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.historyButton}>
                            <MaterialIcons name="history" size={24} color="#13ec92" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Stats Summary Section */}
                    <View style={styles.statsContainer}>
                        <View style={[styles.statCard, isDark ? styles.statCardDark : styles.statCardLight]}>
                            <Text style={styles.statLabel}>Remaining Errors</Text>
                            <View style={styles.statValueRow}>
                                <Text style={[styles.statValue, isDark ? styles.textWhite : styles.textDark]}>14</Text>
                                <Text style={styles.statChangeRed}>-3 today</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, isDark ? styles.statCardDark : styles.statCardLight]}>
                            <Text style={styles.statLabel}>Mastered Today</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statValueGreen}>8</Text>
                                <Text style={styles.statChangeGreen}>+12%</Text>
                            </View>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={[styles.searchInputContainer, isDark ? styles.searchInputContainerDark : styles.searchInputContainerLight]}>
                            <MaterialIcons name="search" size={20} color={isDark ? "rgba(16, 185, 129, 0.5)" : "#94a3b8"} />
                            <TextInput
                                style={[styles.searchInput, isDark ? styles.inputDark : styles.inputLight]}
                                placeholder="Search Surah or Verse..."
                                placeholderTextColor={isDark ? "rgba(16, 185, 129, 0.3)" : "#94a3b8"}
                            />
                        </View>
                    </View>

                    {/* Filters */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView} contentContainerStyle={styles.filtersContent}>
                        <TouchableOpacity style={styles.filterChipActive}>
                            <Text style={styles.filterChipTextActive}>All Errors</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterChip, isDark ? styles.filterChipDark : styles.filterChipLight]}>
                            <Text style={styles.filterChipText}>Juz' Amma</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterChip, isDark ? styles.filterChipDark : styles.filterChipLight]}>
                            <Text style={styles.filterChipText}>Meccan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.filterChip, isDark ? styles.filterChipDark : styles.filterChipLight]}>
                            <Text style={styles.filterChipText}>Critical</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Recent Mistakes Header */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, isDark ? styles.textWhite : styles.textDark]}>Recent Mistakes</Text>
                        <TouchableOpacity>
                            <Text style={styles.reviewAllText}>Review All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mistake Cards List */}
                    <View style={styles.mistakesList}>
                        {MISTAKES.map((mistake, index) => (
                            <View
                                key={mistake.id}
                                style={[
                                    styles.mistakeCard,
                                    isDark ? styles.mistakeCardDark : styles.mistakeCardLight,
                                    index === 1 && { opacity: 0.9 },
                                    index === 2 && { opacity: 0.8 },
                                ]}
                            >
                                <View style={styles.mistakeCardHeader}>
                                    <View>
                                        <Text style={styles.surahName}>{mistake.surah}</Text>
                                        <Text style={styles.ayahNumber}>Ayah {mistake.ayah}</Text>
                                    </View>
                                    <View style={styles.mistakeIndex}>
                                        <Text style={styles.mistakeIndexText}>{mistake.id}</Text>
                                    </View>
                                </View>

                                <View style={styles.arabicTextContainer}>
                                    <Text style={[styles.arabicText, isDark ? styles.textEmerald50 : styles.textSlate800]}>
                                        {mistake.verseBefore} <Text style={styles.highlightedWord}> {mistake.highlightedWord} </Text> {mistake.verseAfter}
                                    </Text>
                                </View>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity style={[styles.actionButton, styles.listenButton, isDark ? styles.listenButtonDark : styles.listenButtonLight]}>
                                        <MaterialIcons name="play-circle-outline" size={20} color={isDark ? "#13ec92" : "#047857"} />
                                        <Text style={[styles.actionButtonText, isDark ? styles.textPrimary : styles.textEmerald700]}>Listen</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, styles.retestButton]}>
                                        <MaterialIcons name="refresh" size={20} color="#10221a" />
                                        <Text style={styles.retestButtonText}>Re-test</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={[styles.bottomNav, isDark ? styles.bottomNavDark : styles.bottomNavLight]}>
                    <TouchableOpacity style={styles.navItem}>
                        <MaterialIcons name="menu-book" size={24} color={isDark ? "rgba(16, 185, 129, 0.5)" : "#94a3b8"} />
                        <Text style={styles.navLabel}>Learn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <MaterialIcons name="assignment-late" size={24} color="#13ec92" />
                        <Text style={styles.navLabelActive}>Revision</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <MaterialIcons name="quiz" size={24} color={isDark ? "rgba(16, 185, 129, 0.5)" : "#94a3b8"} />
                        <Text style={styles.navLabel}>Test</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)/settings')}>
                        <MaterialIcons name="person" size={24} color={isDark ? "rgba(16, 185, 129, 0.5)" : "#94a3b8"} />
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
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        flex: 1,
    },
    headerRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    historyButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        padding: 16,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
    },
    statCardLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    statCardDark: {
        backgroundColor: 'rgba(6, 78, 59, 0.2)',
        borderColor: 'rgba(6, 95, 70, 0.3)',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(16, 185, 129, 0.7)',
        marginBottom: 8,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    statValue: {
        fontSize: 30,
        fontWeight: '700',
    },
    statValueGreen: {
        fontSize: 30,
        fontWeight: '700',
        color: '#13ec92',
    },
    statChangeRed: {
        fontSize: 12,
        fontWeight: '500',
        color: '#ff5c5c',
    },
    statChangeGreen: {
        fontSize: 12,
        fontWeight: '500',
        color: '#13ec92',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchInputContainerLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    searchInputContainerDark: {
        backgroundColor: '#1a2e26',
        borderColor: 'rgba(6, 95, 70, 0.3)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    inputLight: {
        color: '#0f172a',
    },
    inputDark: {
        color: 'white',
    },
    filtersScrollView: {
        maxHeight: 60,
    },
    filtersContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    filterChip: {
        paddingHorizontal: 20,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipLight: {
        backgroundColor: '#e2e8f0',
    },
    filterChipDark: {
        backgroundColor: 'rgba(6, 78, 59, 0.4)',
        borderColor: 'rgba(6, 95, 70, 0.3)',
    },
    filterChipActive: {
        paddingHorizontal: 20,
        height: 36,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13ec92',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    filterChipTextActive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10221a',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    reviewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#13ec92',
    },
    mistakesList: {
        padding: 16,
        gap: 16,
        paddingBottom: 96,
    },
    mistakeCard: {
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    mistakeCardLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    mistakeCardDark: {
        backgroundColor: '#1a2e26',
        borderColor: 'rgba(6, 95, 70, 0.3)',
    },
    mistakeCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    surahName: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        color: '#d4af37',
        letterSpacing: 0.5,
    },
    ayahNumber: {
        fontSize: 14,
        color: 'rgba(16, 185, 129, 0.6)',
    },
    mistakeIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(19, 236, 146, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 146, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mistakeIndexText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#13ec92',
    },
    arabicTextContainer: {
        paddingVertical: 16,
        alignItems: 'flex-end',
    },
    arabicText: {
        fontSize: 24,
        lineHeight: 40,
        textAlign: 'right',
    },
    textSlate800: {
        color: '#1e293b',
    },
    textEmerald50: {
        color: '#ecfdf5',
    },
    highlightedWord: {
        backgroundColor: 'rgba(255, 92, 92, 0.2)',
        color: '#ff5c5c',
        borderBottomWidth: 2,
        borderBottomColor: '#ff5c5c',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    listenButton: {
        borderWidth: 1,
    },
    listenButtonLight: {
        backgroundColor: '#d1fae5',
        borderColor: '#a7f3d0',
    },
    listenButtonDark: {
        backgroundColor: 'rgba(6, 78, 59, 0.4)',
        borderColor: 'rgba(19, 236, 146, 0.2)',
    },
    retestButton: {
        backgroundColor: '#13ec92',
        shadowColor: '#13ec92',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    textPrimary: {
        color: '#13ec92',
    },
    textEmerald700: {
        color: '#047857',
    },
    retestButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10221a',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 12,
        paddingBottom: 32,
        borderTopWidth: 1,
    },
    bottomNavLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopColor: '#e2e8f0',
    },
    bottomNavDark: {
        backgroundColor: 'rgba(16, 34, 26, 0.9)',
        borderTopColor: 'rgba(6, 95, 70, 0.5)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: 'rgba(16, 185, 129, 0.5)',
    },
    navLabelActive: {
        fontSize: 10,
        fontWeight: '700',
        color: '#13ec92',
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#0f172a',
    },
});
