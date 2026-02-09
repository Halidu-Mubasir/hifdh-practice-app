import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    useColorScheme,
    StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

type PrayerTime = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [dailyRevision, setDailyRevision] = useState(true);
    const [newTestAvailability, setNewTestAvailability] = useState(true);
    const [weeklyProgress, setWeeklyProgress] = useState(false);
    const [prayerTimesSync, setPrayerTimesSync] = useState(true);
    const [selectedPrayers, setSelectedPrayers] = useState<PrayerTime[]>(['Fajr', 'Maghrib']);

    const togglePrayer = (prayer: PrayerTime) => {
        if (selectedPrayers.includes(prayer)) {
            setSelectedPrayers(selectedPrayers.filter(p => p !== prayer));
        } else {
            setSelectedPrayers([...selectedPrayers, prayer]);
        }
    };

    const prayers: PrayerTime[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#13ec92" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isDark ? styles.textWhite : styles.textDark]}>
                        Notification Preferences
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* General Reminders Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>GENERAL REMINDERS</Text>

                        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
                            {/* Daily Revision Reminder */}
                            <View style={[styles.settingRow, styles.settingRowBorder]}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="auto-stories" size={20} color="#13ec92" />
                                    </View>
                                    <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                                        Daily Revision Reminder
                                    </Text>
                                </View>
                                <Switch
                                    value={dailyRevision}
                                    onValueChange={setDailyRevision}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#13ec92' }}
                                    thumbColor={'#ffffff'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.1)"
                                />
                            </View>

                            {/* Revision Time */}
                            <View style={[styles.settingRow, styles.settingRowBorder]}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="schedule" size={20} color="#13ec92" />
                                    </View>
                                    <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                                        Revision Time
                                    </Text>
                                </View>
                                <View style={styles.timeDisplay}>
                                    <Text style={styles.timeText}>05:30 AM</Text>
                                </View>
                            </View>

                            {/* Time Picker */}
                            <View style={styles.timePicker}>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeOptionInactive}>04</Text>
                                    <View style={styles.timeOptionActive}>
                                        <Text style={styles.timeOptionActiveText}>05</Text>
                                    </View>
                                    <Text style={styles.timeOptionInactive}>06</Text>
                                </View>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeOptionInactive}>15</Text>
                                    <View style={styles.timeOptionActive}>
                                        <Text style={styles.timeOptionActiveText}>30</Text>
                                    </View>
                                    <Text style={styles.timeOptionInactive}>45</Text>
                                </View>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeOptionInactive}>PM</Text>
                                    <View style={styles.timeOptionActive}>
                                        <Text style={styles.timeOptionActiveText}>AM</Text>
                                    </View>
                                    <View style={{ height: 40 }} />
                                </View>
                            </View>

                            {/* New Test Availability */}
                            <View style={[styles.settingRow, styles.settingRowBorder, styles.settingRowTopBorder]}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="quiz" size={20} color="#13ec92" />
                                    </View>
                                    <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                                        New Test Availability
                                    </Text>
                                </View>
                                <Switch
                                    value={newTestAvailability}
                                    onValueChange={setNewTestAvailability}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#13ec92' }}
                                    thumbColor={'#ffffff'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.1)"
                                />
                            </View>

                            {/* Weekly Progress */}
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <MaterialIcons name="insights" size={20} color="#13ec92" />
                                    </View>
                                    <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                                        Weekly Progress Summary
                                    </Text>
                                </View>
                                <Switch
                                    value={weeklyProgress}
                                    onValueChange={setWeeklyProgress}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#13ec92' }}
                                    thumbColor={'#ffffff'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.1)"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Prayer Times Sync Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>PRAYER TIMES SYNC</Text>
                            <View style={styles.sunnahBadge}>
                                <Text style={styles.sunnahBadgeText}>SUNNAH PRACTICE</Text>
                            </View>
                        </View>

                        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
                            {/* Prayer Sync Toggle */}
                            <View style={[styles.settingRow, styles.settingRowBorder]}>
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainerGold}>
                                        <MaterialIcons name="mosque" size={20} color="#D4AF37" />
                                    </View>
                                    <View style={styles.settingTextContainer}>
                                        <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                                            Sync with Prayer Times
                                        </Text>
                                        <Text style={styles.settingSubtitle}>Sends reminders after Adhan</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={prayerTimesSync}
                                    onValueChange={setPrayerTimesSync}
                                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#13ec92' }}
                                    thumbColor={'#ffffff'}
                                    ios_backgroundColor="rgba(255, 255, 255, 0.1)"
                                />
                            </View>

                            {/* Prayer Selection */}
                            <View style={styles.prayerSelection}>
                                <Text style={styles.prayerSelectionLabel}>NOTIFY ME AFTER:</Text>
                                <View style={styles.prayerChips}>
                                    {prayers.map((prayer) => {
                                        const isSelected = selectedPrayers.includes(prayer);
                                        return (
                                            <TouchableOpacity
                                                key={prayer}
                                                onPress={() => togglePrayer(prayer)}
                                                style={[
                                                    styles.prayerChip,
                                                    isSelected ? styles.prayerChipSelected : styles.prayerChipUnselected
                                                ]}
                                            >
                                                {isSelected && (
                                                    <MaterialIcons name="check-circle" size={14} color="#10221a" />
                                                )}
                                                <Text style={[
                                                    styles.prayerChipText,
                                                    isSelected ? styles.prayerChipTextSelected : styles.prayerChipTextUnselected
                                                ]}>
                                                    {prayer}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>

                        <Text style={styles.infoText}>
                            * Consistent revision after Fajr and Maghrib is highly recommended by scholars for better retention of the Holy Quran.
                        </Text>
                    </View>

                    {/* Save Button */}
                    <View style={styles.actionSection}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.saveButtonText}>Save Preferences</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}>
                            You can change these settings at any time.
                        </Text>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 40 }} />
                </ScrollView>
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
        letterSpacing: -0.5,
        textAlign: 'center',
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: '#13ec92',
        marginBottom: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sunnahBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },
    sunnahBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#D4AF37',
        letterSpacing: 0.5,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    cardLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardDark: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    settingRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingRowTopBorder: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(19, 236, 146, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainerGold: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingTextContainer: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 2,
    },
    timeDisplay: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#13ec92',
    },
    timePicker: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    timeColumn: {
        flex: 1,
        alignItems: 'center',
    },
    timeOptionInactive: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.4)',
        height: 40,
        lineHeight: 40,
        textAlign: 'center',
    },
    timeOptionActive: {
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(19, 236, 146, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(19, 236, 146, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    timeOptionActiveText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    prayerSelection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    prayerSelectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 12,
    },
    prayerChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    prayerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    prayerChipSelected: {
        backgroundColor: '#13ec92',
    },
    prayerChipUnselected: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    prayerChipText: {
        fontSize: 14,
        fontWeight: '700',
    },
    prayerChipTextSelected: {
        color: '#10221a',
    },
    prayerChipTextUnselected: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '500',
    },
    infoText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        lineHeight: 18,
        fontStyle: 'italic',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    actionSection: {
        marginTop: 40,
        paddingHorizontal: 16,
    },
    saveButton: {
        backgroundColor: '#13ec92',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#13ec92',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#10221a',
        fontSize: 16,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: 16,
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#0f172a',
    },
});
