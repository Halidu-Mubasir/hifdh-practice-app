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
import { MaterialIcons } from '@expo/vector-icons';

type SettingItem = {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
};

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const accountSettings: SettingItem[] = [
        { icon: 'person-outline', label: 'Edit Profile' },
        { icon: 'lock', label: 'Change Password' },
    ];

    const appPreferences: SettingItem[] = [
        { icon: 'palette', label: 'Theme Selection', value: 'Dark Mode' },
        { icon: 'notifications-active', label: 'Notification Settings', onPress: () => router.push('/(app)/notifications') },
        { icon: 'language', label: 'Language', value: 'English' },
    ];

    const audioSettings: SettingItem[] = [
        { icon: 'record-voice-over', label: 'Default Reciter', value: 'Mishary Rashid' },
        { icon: 'high-quality', label: 'Audio Quality', value: 'Standard' },
    ];

    const supportSettings: SettingItem[] = [
        { icon: 'help-center', label: 'Help Center' },
        { icon: 'info', label: 'About Us' },
    ];

    const renderSettingItem = (item: SettingItem) => (
        <TouchableOpacity
            key={item.label}
            style={[styles.settingItem, isDark ? styles.settingItemDark : styles.settingItemLight]}
            activeOpacity={0.7}
            onPress={item.onPress}
        >
            <View style={styles.settingLeft}>
                <MaterialIcons name={item.icon as any} size={24} color="#10b981" />
                <Text style={[styles.settingLabel, isDark ? styles.textWhite : styles.textDark]}>
                    {item.label}
                </Text>
            </View>
            <View style={styles.settingRight}>
                {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                )}
                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={isDark ? 'rgba(16, 185, 129, 0.5)' : '#cbd5e1'}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#d4af37" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isDark ? styles.headerTitleDark : styles.headerTitleLight]}>
                        Settings
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarBorder}>
                                <View style={[styles.avatar, isDark ? styles.avatarDark : styles.avatarLight]}>
                                    <MaterialIcons name="person" size={50} color="#10b981" />
                                </View>
                            </View>
                            <TouchableOpacity style={styles.editAvatarButton}>
                                <MaterialIcons name="edit" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>Ahmed Abdullah</Text>
                            <Text style={styles.profileLevel}>Hafidh Level • 12 Juz Memorized</Text>
                        </View>
                    </View>

                    {/* Account Settings */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>ACCOUNT</Text>
                        <View style={[styles.settingsGroup, isDark ? styles.settingsGroupDark : styles.settingsGroupLight]}>
                            {accountSettings.map(renderSettingItem)}
                        </View>
                    </View>

                    {/* App Preferences */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>APP PREFERENCES</Text>
                        <View style={[styles.settingsGroup, isDark ? styles.settingsGroupDark : styles.settingsGroupLight]}>
                            {appPreferences.map(renderSettingItem)}
                        </View>
                    </View>

                    {/* Audio Settings */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>AUDIO SETTINGS</Text>
                        <View style={[styles.settingsGroup, isDark ? styles.settingsGroupDark : styles.settingsGroupLight]}>
                            {audioSettings.map(renderSettingItem)}
                        </View>
                    </View>

                    {/* Support */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>SUPPORT</Text>
                        <View style={[styles.settingsGroup, isDark ? styles.settingsGroupDark : styles.settingsGroupLight]}>
                            {supportSettings.map(renderSettingItem)}
                        </View>
                    </View>

                    {/* Sign Out */}
                    <View style={styles.signOutSection}>
                        <TouchableOpacity
                            style={[styles.signOutButton, isDark ? styles.signOutButtonDark : styles.signOutButtonLight]}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="logout" size={24} color="#ef4444" />
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </TouchableOpacity>
                        <Text style={[styles.versionText, isDark && styles.versionTextDark]}>
                            VERSION 2.4.0 (2024)
                        </Text>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={[styles.bottomNav, isDark ? styles.bottomNavDark : styles.bottomNavLight]}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)')}>
                        <MaterialIcons name="home" size={24} color="rgba(0, 0, 0, 0.5)" />
                        <Text style={[styles.navLabel, isDark && styles.navLabelDark]}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(app)/configure')}>
                        <MaterialIcons name="quiz" size={24} color="rgba(0, 0, 0, 0.5)" />
                        <Text style={[styles.navLabel, isDark && styles.navLabelDark]}>Tests</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem}>
                        <MaterialIcons name="settings" size={24} color="#10b981" />
                        <Text style={[styles.navLabel, styles.navLabelActive]}>Settings</Text>
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
        backgroundColor: '#fcfaf2',
    },
    containerDark: {
        backgroundColor: '#06231a',
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
        borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    },
    headerLight: {
        backgroundColor: 'rgba(252, 250, 242, 0.9)',
    },
    headerDark: {
        backgroundColor: 'rgba(6, 35, 26, 0.95)',
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
    },
    headerTitleLight: {
        color: '#10b981',
    },
    headerTitleDark: {
        color: '#6ee7b7',
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarBorder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: '#d4af37',
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarLight: {
        backgroundColor: '#d1fae5',
    },
    avatarDark: {
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        backgroundColor: '#d4af37',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#06231a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    profileInfo: {
        alignItems: 'center',
        gap: 4,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
    },
    profileLevel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#d4af37',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        color: '#94a3b8',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    sectionTitleDark: {
        color: 'rgba(16, 185, 129, 0.6)',
    },
    settingsGroup: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    settingsGroupLight: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
    },
    settingsGroupDark: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.5)',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    settingItemLight: {
        backgroundColor: 'white',
        borderBottomColor: '#f1f5f9',
    },
    settingItemDark: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderBottomColor: 'rgba(16, 185, 129, 0.3)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    settingValue: {
        fontSize: 12,
        color: '#94a3b8',
    },
    signOutSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 24,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    signOutButtonLight: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderColor: '#fecaca',
    },
    signOutButtonDark: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ef4444',
    },
    versionText: {
        fontSize: 10,
        color: '#94a3b8',
        textAlign: 'center',
        letterSpacing: 1.5,
    },
    versionTextDark: {
        color: 'rgba(16, 185, 129, 0.5)',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.2)',
    },
    bottomNavLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    bottomNavDark: {
        backgroundColor: 'rgba(6, 35, 26, 0.95)',
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
        padding: 8,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(0, 0, 0, 0.5)',
    },
    navLabelDark: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
    navLabelActive: {
        color: '#10b981',
    },
    textWhite: {
        color: '#ffffff',
    },
    textDark: {
        color: '#0f172a',
    },
});
