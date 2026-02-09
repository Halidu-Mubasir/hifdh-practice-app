import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    useColorScheme,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function TestSessionScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Background Pattern */}
            <View style={styles.backgroundPattern}>
                <ImageBackground
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU273T2RGHH-KB7oxbtKN1bpvLU0IR-PWbHsnrLeKe2JJLN3ncd0FEWtOhwCWXFeW9ZLY3Sc6wbbJJjp1P8-J40JY8b8qtJUV9-TA8TxPNp4wvwey2qDZw50JyLiodrBGSsu1i9Hy5zLLECOQ1Al8qITTaKq8kkH-J1bzG-WINQ-15xorn86_OgjG-KK-ROjlKZq9qYpnD8eI6O2-Zf2l8N76jeyG6qNfwjHovlG9H-px1E3cFe_i5w-oa1m7xIBcWQbcJ81eXiH0X' }}
                    style={{ width, height }}
                    resizeMode="repeat"
                />
            </View>

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.headerButton, isDark ? styles.headerButtonDark : styles.headerButtonLight]}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="close" size={20} color={isDark ? "#94a3b8" : "#64748b"} />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>ACTIVE SESSION</Text>
                        <Text style={[styles.headerSubtitle, isDark ? styles.textWhite : styles.textDark]}>
                            Surah Al-Baqarah
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.finishButton, isDark ? styles.headerButtonDark : styles.headerButtonLight]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/(app)/test-summary')}
                    >
                        <Text style={styles.finishButtonText}>FINISH</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Card */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressCard, isDark ? styles.progressCardDark : styles.progressCardLight]}>
                        <View style={styles.progressHeader}>
                            <Text style={[styles.progressLabel, isDark ? styles.textSlate400 : styles.textSlate500]}>
                                TEST PROGRESS
                            </Text>
                            <View style={styles.progressBadge}>
                                <Text style={styles.progressBadgeText}>3 of 10</Text>
                            </View>
                        </View>
                        <View style={[styles.progressBarBg, isDark ? styles.progressBarBgDark : styles.progressBarBgLight]}>
                            <LinearGradient
                                colors={['rgba(19, 236, 146, 0.8)', '#13ec92']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.progressBarFill}
                            />
                        </View>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={[styles.mainCard, isDark ? styles.mainCardDark : styles.mainCardLight]}>

                        {/* Verse Section */}
                        <View style={styles.verseSection}>
                            <Text style={[styles.verseLabel, isDark ? styles.textSlate500 : styles.textSlate400]}>
                                STARTING VERSE
                            </Text>

                            <View style={styles.verseContainer}>
                                <View style={styles.quoteIcon}>
                                    <MaterialIcons name="format-quote" size={60} color="#D4AF37" />
                                </View>

                                <Text style={[styles.arabicText, isDark ? styles.textWhite : styles.textDark]}>
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </Text>
                            </View>
                        </View>

                        {/* Instruction Box */}
                        <View style={[styles.instructionBox, isDark ? styles.instructionBoxDark : styles.instructionBoxLight]}>
                            <Text style={styles.instructionLabel}>INSTRUCTION</Text>
                            <Text style={[styles.instructionText, isDark ? styles.textSlate100 : styles.textSlate800]}>
                                Recite until <Text style={styles.goldText}>Verse 15</Text>
                            </Text>
                        </View>

                        {/* Play Audio Button */}
                        <TouchableOpacity style={[styles.playButton, isDark ? styles.playButtonDark : styles.playButtonLight]} activeOpacity={0.8}>
                            <MaterialIcons name="volume-up" size={20} color="#13ec92" />
                            <Text style={styles.playButtonText}>Play Audio</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerButtons}>
                        <TouchableOpacity style={[styles.footerButton, isDark ? styles.footerButtonDark : styles.footerButtonLight]} activeOpacity={0.8}>
                            <View style={[styles.footerButtonIcon, isDark ? styles.footerButtonIconDark : styles.footerButtonIconLight]}>
                                <MaterialIcons name="refresh" size={24} color={isDark ? "#cbd5e1" : "#475569"} />
                            </View>
                            <Text style={[styles.footerButtonText, isDark ? styles.textSlate400 : styles.textSlate600]}>REGENERATE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => console.log('Next Verse')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.nextButtonIcon}>
                                <MaterialIcons name="arrow-forward-ios" size={20} color="#0a1a14" style={{ marginLeft: 2 }} />
                            </View>
                            <Text style={styles.nextButtonText}>NEXT VERSE</Text>
                        </TouchableOpacity>
                    </View>

                    {/* End Session Button */}
                    <TouchableOpacity style={styles.endSessionButton} activeOpacity={0.7}>
                        <Text style={[styles.endSessionText, isDark ? styles.textSlate500 : styles.textSlate400]}>
                            END SESSION EARLY
                        </Text>
                    </TouchableOpacity>

                    {/* Swipe Indicator */}
                    <View style={styles.swipeIndicatorContainer}>
                        <View style={[styles.swipeIndicator, isDark ? styles.swipeIndicatorDark : styles.swipeIndicatorLight]} />
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    containerLight: {
        backgroundColor: '#f8faf9',
    },
    containerDark: {
        backgroundColor: '#0a1a14',
    },
    backgroundPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.2,
        zIndex: 0,
    },
    safeArea: {
        flex: 1,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
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
    finishButton: {
        height: 40,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
    },
    finishButtonText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: '#64748b',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
        color: 'rgba(212, 175, 55, 0.8)',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        paddingHorizontal: 24,
        marginTop: 16,
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
        letterSpacing: 1.2,
    },
    progressBadge: {
        backgroundColor: 'rgba(19, 236, 146, 0.1)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    progressBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#13ec92',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarBgLight: {
        backgroundColor: '#e2e8f0',
    },
    progressBarBgDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    progressBarFill: {
        width: '30%',
        height: '100%',
        borderRadius: 999,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    mainCard: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 40,
        padding: 32,
        alignItems: 'center',
        gap: 40,
        borderWidth: 1,
    },
    mainCardLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(226, 232, 240, 0.6)',
    },
    mainCardDark: {
        backgroundColor: 'rgba(18, 43, 33, 0.6)',
        borderColor: 'rgba(19, 236, 146, 0.2)',
    },
    verseSection: {
        width: '100%',
        alignItems: 'center',
        gap: 8,
    },
    verseLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 3,
    },
    verseContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    quoteIcon: {
        position: 'absolute',
        top: -16,
        left: -16,
        opacity: 0.1,
    },
    arabicText: {
        fontSize: 36,
        lineHeight: 64,
        textAlign: 'center',
        paddingHorizontal: 16,
        fontFamily: 'NotoNaskhArabic',
    },
    instructionBox: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        gap: 4,
    },
    instructionBoxLight: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    instructionBoxDark: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    instructionLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: 'rgba(212, 175, 55, 0.8)',
    },
    instructionText: {
        fontSize: 18,
        fontWeight: '700',
    },
    goldText: {
        color: '#D4AF37',
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 1,
    },
    playButtonLight: {
        backgroundColor: 'rgba(19, 236, 146, 0.1)',
        borderColor: 'rgba(19, 236, 146, 0.2)',
    },
    playButtonDark: {
        backgroundColor: 'rgba(19, 236, 146, 0.2)',
        borderColor: 'rgba(19, 236, 146, 0.2)',
    },
    playButtonText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
        color: '#13ec92',
    },
    footer: {
        paddingHorizontal: 32,
        paddingBottom: 0,
        gap: 24,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    footerButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 20,
        borderRadius: 32,
        borderWidth: 1,
    },
    footerButtonLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: '#e2e8f0',
    },
    footerButtonDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerButtonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButtonIconLight: {
        backgroundColor: '#f1f5f9',
    },
    footerButtonIconDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    footerButtonText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    nextButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 20,
        borderRadius: 32,
        backgroundColor: '#13ec92',
        shadowColor: '#13ec92',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    nextButtonIcon: {
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
        letterSpacing: 1.5,
        color: '#0a1a14',
    },
    endSessionButton: {
        width: '100%',
        paddingVertical: 16,
    },
    endSessionText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
    },
    swipeIndicatorContainer: {
        alignItems: 'center',
        height: 24,
        justifyContent: 'flex-end',
        paddingBottom: 8,
    },
    swipeIndicator: {
        width: 128,
        height: 4,
        borderRadius: 999,
    },
    swipeIndicatorLight: {
        backgroundColor: '#cbd5e1',
    },
    swipeIndicatorDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
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
