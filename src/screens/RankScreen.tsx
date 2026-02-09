import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const USERS = [
    {
        id: '1',
        name: 'Sarah K.',
        juz: 30,
        rank: 1,
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', // Hijab icon
    },
    {
        id: '2',
        name: 'Omar F.',
        juz: 28,
        rank: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAQ-bSdqDXD5u3Xk64r15p52lI8GCADdcS1868ACRcxJfDKc4HX2dS4kgqpxVKjCdcJ9Mp7OkslO957ehIz5YUiE82bVvS2dl0QfvzICYHYIVp6roEnuv1cXh0_PFbsxNdMC4FpR5lcEwG-P5mtaDxQ2EEvx8M-A1JuQrXD1LhOjJMPnohGaYKpTrDLaEHomWL_O_Bue9QfUinzQV14hfF5Iks3E-1rW46iA8YaRRYihxH0Pt_EDdG7kQ9CQx61StcORczDVJ5c-TN',
    },
    {
        id: '3',
        name: 'Zaid A.',
        juz: 25,
        rank: 3,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp9YVpowz-g20zXTNBTm8MNbI3g5HPsXlcqCm-UhS2qsJD_MNXPn3CVsVGYkeD73hVF4dAOZc8HQLpFAtQqlDC0VabJVLcJiUhuIQ7xyBP1dJsfQadi4r0D5bHoFdkBOM_AVMzuE8tZycm_voUSX7WreacoeaRO00xD1iQieEwsTag5CksPC8jbXNxulSkW4sb3GWBlsFh37Pw4vepoJaR-PL1pIPU5yAY4WcUUfAp4IMWi7Y--YyptjToC_VUVXa5Ug2E-_eMpPDX',
    },
];

const LEADERBOARD = [
    {
        rank: 4,
        name: 'Hamza Ali',
        juz: 22,
        streak: 12,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcfWyHYAKr3OuleK2JxDNQ0EZ3_IKw2ZjS39yhjRdokfl8jTwW8BSXaQvbb8IBb_Fi1JINFgFOTaYnFocD6nfwqapkF_9-O8EUtKN4RYpwa3l6p0n3isVhG7xLr-ul06LxVp6ekkpatrj9Hbx8QnwKLwHTKRmcw6U7AdSilkKxBftBymCRGJG0NLQBjR62DpW_L4nW898gfnmgyu2ISz9KIevpDfXjvGTCXPQQi5xWzRNqvSIG_6Sa8cDFvJAMmCIMd6iKUxY71I5M',
    },
    {
        rank: 5,
        name: 'Fatima Noor',
        juz: 18,
        streak: 45,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTCmABFWQiGb1r4mPNZ7BveO8zLV6yo9voB8bHdjSG-KfUjsfj0CQFbPF2R_xEkRzqGbqvQVGvxmqv5lNamtbasP5RS9sv8VF_HzLfFo63dfDOos1r1GSPNB4QzWIUmhDQrg3yXkAaTKswvdRgjotkyXgCquhl2R2ycgeD-4E-m_WvcuZls2P5rKTd7fKsEjVDT9ghauYL2M5hOvYjbEQas7ClNvfzVohUwrBbqc2cZZrpLIracvI-PTX4iHCp6Tg8XK_5NqH6TWDn',
    },
    {
        rank: 6,
        name: 'Ibrahim Ahmed',
        juz: 15,
        streak: 8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAxjuN5Lfdw6plUSznajbisJyGxgiW7eGZpHoXe3Xoc_jve3uSiyyjtG3yxSTJ82SDMtuqYONLDbVdZRWl5_c2DKSMLpWVfBdRjkLJAUC6Mkcgqb7ivX5wFHUcKOkRJWMbqGoi1RhYiqS-wzP3urUBzzyp008quf627hBTTKWPRyd2dKLgDvtlPqd-vYqS0101d6WkYASoxaj0bO_t3PJHi7rqC84sh4AIFVYmNsNOotGNjx64jz8rme4188tyiepYDdU1cxrfl9fE',
    },
    {
        rank: 7,
        name: 'Maryam J.',
        juz: 14,
        streak: 21,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANl6e0IT8Y74XuSRQuYBHGwGke0NHbLB0XwjWikS_2Qe_d_VolIPrea2sOeCfvpu-hA5CFod3Kmvx_3YT3CUpP0Q0CZyKRAFIH8ftNDdwR1vZVQK2QGjxfosT51FFKC8sJ12-ni0UyATgG2gHDnH78ipM3HOzo13TQt00PuMORhsjRry56qS_Bkvy7029NRoRogwPybajSi02Ens9d124jbnlLipSPbtltKI0xA2WH0NtZuzkFVM8WPy-Xl6TZKlY557WKoGnKkFvP',
    },
    {
        rank: 8,
        name: 'Abdullah R.',
        juz: 12,
        streak: 5,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF0KlKRCCA84-lcb0Hcm1-9ZvZjEHH-ph-ZQZ4Hug2Jro4ra_yMzgCTxXlrp80orcuiMQL3VUIoCqmrKCnOXV4f-aCtWaJORfjXA-SVkTRpnCxBxjSYundIDiwW0mk5dbIp6cSTyjHM2A6Y146cS8TbA8kl67cmkWNYN4TdufYZ5mLE3jQrCMPGnh2n3sJDKt0Qo0Aomfm4WxMPd_hNn9IVzPqhGBJKdw6e9UamEruI2bxSbs7SaNKbELskuAsylFGIo4f2z1wtZ3q',
    },
];

export default function RankScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('Global');

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="chevron-left" size={32} color={isDark ? "white" : "#0f172a"} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
                        Rankings
                    </Text>
                    <View style={styles.searchButtonContainer}>
                        <TouchableOpacity style={styles.searchButton}>
                            <MaterialIcons name="search" size={24} color={isDark ? "white" : "#0f172a"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentedControlContainer}>
                    <View style={[styles.segmentedControl, isDark ? styles.segmentedControlDark : styles.segmentedControlLight]}>
                        <TouchableOpacity
                            style={[
                                styles.segmentButton,
                                activeTab === 'Global' && (isDark ? styles.segmentActiveDark : styles.segmentActiveLight)
                            ]}
                            onPress={() => setActiveTab('Global')}
                        >
                            <Text style={[
                                styles.segmentText,
                                activeTab === 'Global' ? styles.segmentTextActive : styles.segmentTextInactive
                            ]}>Global</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.segmentButton,
                                activeTab === 'Friends' && (isDark ? styles.segmentActiveDark : styles.segmentActiveLight)
                            ]}
                            onPress={() => setActiveTab('Friends')}
                        >
                            <Text style={[
                                styles.segmentText,
                                activeTab === 'Friends' ? styles.segmentTextActive : styles.segmentTextInactive
                            ]}>Friends</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Podium */}
                    <LinearGradient
                        colors={isDark ? ['rgba(19, 236, 146, 0.1)', 'rgba(10, 26, 20, 0)'] : ['rgba(19, 236, 146, 0.1)', 'rgba(246, 248, 247, 0)']}
                        style={styles.podiumContainer}
                    >
                        <View style={styles.podiumRow}>
                            {/* 2nd Place */}
                            <View style={[styles.podiumPlace, styles.podiumSecond]}>
                                <View style={[styles.avatarContainer, { borderColor: '#cbd5e1' }]}>
                                    <Image source={{ uri: USERS[1].image }} style={styles.podiumAvatar} />
                                    <View style={[styles.rankBadge, { backgroundColor: '#94a3b8' }]}>
                                        <Text style={styles.rankBadgeText}>2nd</Text>
                                    </View>
                                </View>
                                <Text style={[styles.podiumName, isDark ? styles.textWhite : styles.textDark]}>{USERS[1].name}</Text>
                                <Text style={styles.podiumDetails}>{USERS[1].juz} Juz</Text>
                            </View>

                            {/* 1st Place */}
                            <View style={[styles.podiumPlace, styles.podiumFirst]}>
                                <View style={styles.trophyContainer}>
                                    <MaterialIcons name="emoji-events" size={40} color="#FFD700" />
                                </View>
                                <View style={[styles.avatarContainer, styles.avatarFirst]}>
                                    <Image source={{ uri: USERS[0].image }} style={styles.podiumAvatarLarge} />
                                    <View style={[styles.rankBadge, { backgroundColor: '#FFD700' }]}>
                                        <Text style={[styles.rankBadgeText, { color: '#000' }]}>1st</Text>
                                    </View>
                                </View>
                                <Text style={[styles.podiumNameLarge, isDark ? styles.textWhite : styles.textDark]}>{USERS[0].name}</Text>
                                <Text style={styles.podiumDetailsHighlight}>{USERS[0].juz} Juz</Text>
                            </View>

                            {/* 3rd Place */}
                            <View style={[styles.podiumPlace, styles.podiumThird]}>
                                <View style={[styles.avatarContainer, { borderColor: '#cd7f32' }]}>
                                    <Image source={{ uri: USERS[2].image }} style={styles.podiumAvatar} />
                                    <View style={[styles.rankBadge, { backgroundColor: '#cd7f32' }]}>
                                        <Text style={styles.rankBadgeText}>3rd</Text>
                                    </View>
                                </View>
                                <Text style={[styles.podiumName, isDark ? styles.textWhite : styles.textDark]}>{USERS[2].name}</Text>
                                <Text style={styles.podiumDetails}>{USERS[2].juz} Juz</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Leaderboard List */}
                    <View style={styles.listContainer}>
                        <View style={styles.listHeader}>
                            <Text style={[styles.listTitle, isDark ? styles.textWhite : styles.textDark]}>Leaderboard</Text>
                            <Text style={styles.listSubtitle}>ALL TIME</Text>
                        </View>

                        {LEADERBOARD.map((user) => (
                            <View key={user.rank} style={[styles.listItem, isDark ? styles.listItemDark : styles.listItemLight]}>
                                <Text style={styles.rankText}>{user.rank}</Text>
                                <Image source={{ uri: user.image }} style={styles.listAvatar} />
                                <View style={styles.listUserInfo}>
                                    <Text style={[styles.listUserName, isDark ? styles.textWhite : styles.textDark]}>{user.name}</Text>
                                    <Text style={styles.listUserDetail}>{user.juz} Juz Memorized</Text>
                                </View>
                                <View style={styles.streakBadge}>
                                    <MaterialIcons name="local-fire-department" size={14} color="#13ec92" />
                                    <Text style={styles.streakText}>{user.streak}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Bottom Spacing because of floating card */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Floating User Card */}
                <View style={styles.floatingCardContainer}>
                    <LinearGradient
                        colors={isDark ? ['rgba(10, 26, 20, 0)', '#0a1a14'] : ['rgba(246, 248, 247, 0)', '#f6f8f7']}
                        style={styles.floatingGradientWrapper}
                    >
                        <View style={styles.currentUserCard}>
                            <View style={styles.userRankBox}>
                                <Text style={styles.userRankLabel}>RANK</Text>
                                <Text style={styles.userRankValue}>42</Text>
                            </View>
                            <Image
                                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoOTk3eslcUVe8KG2u0JuZG1HlfWV5MGeqUczYxhN_qthmVtRIwfY3doKlpn7ooy0uuBhHiYJCn85KK7zg0hVJVsfzrZBl4mPA2bAOzaFU3odvmk7IjkbBsAmGRHPDXF5qHTK5WvOqV2a8zYEleRTPAzZcNlWfbSlK68ImZIsb7oi5JL_hsp-lRd48p2xUXNL_NgIQXXHB0GxNC5G8XMmXKBiJ11qwtOpnk84BQE0VyeN3nyfIfmRtC3OaolNQFlv1Mn_dS9qwevEJ' }}
                                style={styles.currentUserAvatar}
                            />
                            <View style={styles.currentUserInfo}>
                                <Text style={styles.currentUserName}>Ahmed Khalil (You)</Text>
                                <View style={styles.currentUserStats}>
                                    <View style={styles.juzBadge}>
                                        <Text style={styles.juzBadgeText}>6 JUZ</Text>
                                    </View>
                                    <View style={styles.streakMiniBadge}>
                                        <MaterialIcons name="local-fire-department" size={12} color="#10221a" />
                                        <Text style={styles.streakMiniText}>14 Day Streak</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.trendButton}>
                                <MaterialIcons name="trending-up" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
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
        backgroundColor: '#0a1a14',
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
    headerLight: {
        backgroundColor: 'rgba(246, 248, 247, 0.9)',
    },
    headerDark: {
        backgroundColor: 'rgba(10, 26, 20, 0.9)',
    },
    backButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        flex: 1,
    },
    searchButtonContainer: {
        width: 40,
        alignItems: 'flex-end',
    },
    searchButton: {
        width: 40,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    segmentedControlContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    segmentedControl: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        height: 44,
    },
    segmentedControlLight: {
        backgroundColor: '#e2e8f0',
    },
    segmentedControlDark: {
        backgroundColor: '#1a2e26',
    },
    segmentButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    segmentActiveLight: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    segmentActiveDark: {
        backgroundColor: '#0a1a14',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 1,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
    },
    segmentTextActive: {
        color: '#13ec92',
    },
    segmentTextInactive: {
        color: '#64748b',
    },
    scrollView: {
        flex: 1,
    },
    podiumContainer: {
        paddingTop: 32,
        paddingBottom: 48,
        paddingHorizontal: 16,
    },
    podiumRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    podiumPlace: {
        flex: 1,
        alignItems: 'center',
    },
    podiumFirst: {
        paddingBottom: 16,
    },
    trophyContainer: {
        position: 'absolute',
        top: -40,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        marginBottom: 12,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
    },
    avatarFirst: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    podiumAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    podiumAvatarLarge: {
        width: '100%',
        height: '100%',
        borderRadius: 56,
    },
    rankBadge: {
        position: 'absolute',
        bottom: -8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    rankBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    podiumName: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    podiumNameLarge: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    podiumDetails: {
        fontSize: 11,
        color: '#13ec92',
        fontWeight: '500',
    },
    podiumDetailsHighlight: {
        fontSize: 12,
        color: '#13ec92',
        fontWeight: '700',
    },
    listContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listSubtitle: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 16,
    },
    listItemLight: {
        backgroundColor: 'white',
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    listItemDark: {
        backgroundColor: '#152920',
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    rankText: {
        width: 24,
        textAlign: 'center',
        color: '#94a3b8',
        fontWeight: '700',
        fontSize: 14,
    },
    listAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    listUserInfo: {
        flex: 1,
    },
    listUserName: {
        fontSize: 14,
        fontWeight: '700',
    },
    listUserDetail: {
        fontSize: 12,
        color: '#64748b',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(19, 236, 146, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    streakText: {
        color: '#13ec92',
        fontSize: 12,
        fontWeight: '700',
    },
    floatingCardContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    floatingGradientWrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    currentUserCard: {
        backgroundColor: '#13ec92',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        shadowColor: '#13ec92',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    userRankBox: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(10, 26, 20, 0.2)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userRankLabel: {
        fontSize: 8,
        fontWeight: '700',
        color: '#0a1a14',
        textTransform: 'uppercase',
    },
    userRankValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0a1a14',
        lineHeight: 18,
    },
    currentUserAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    currentUserInfo: {
        flex: 1,
    },
    currentUserName: {
        color: '#0a1a14',
        fontSize: 14,
        fontWeight: '800',
    },
    currentUserStats: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 8,
    },
    juzBadge: {
        backgroundColor: 'rgba(10, 26, 20, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    juzBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0a1a14',
    },
    streakMiniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    streakMiniText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0a1a14',
    },
    trendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0a1a14',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#0f172a',
    },
    podiumSecond: {},
    podiumThird: {},
});
