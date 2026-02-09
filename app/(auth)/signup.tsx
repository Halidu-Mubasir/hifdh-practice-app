import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  StyleSheet,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.pattern} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Islamic Arch */}
        <View style={styles.headerContainer}>
          <View style={[styles.archCard, isDark ? styles.archCardDark : styles.archCardLight]}>
            <View style={styles.archDecoration}>
              <MaterialIcons name="mosque" size={180} color="rgba(19, 236, 146, 0.1)" />
            </View>
            <View style={styles.logoContainer}>
              <MaterialIcons name="menu-book" size={48} color="#13ec92" />
            </View>
            <Text style={styles.logoText}>Hifdh Test</Text>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={[styles.headline, isDark ? styles.textWhite : styles.textDark]}>
            Create Your Account
          </Text>
          <Text style={styles.subheadline}>
            Start your memorization journey today.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Full Name
            </Text>
            <TextInput
              style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
              placeholder="Enter your name"
              placeholderTextColor="#618979"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Email Address
            </Text>
            <TextInput
              style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
              placeholder="Enter your email"
              placeholderTextColor="#618979"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, isDark ? styles.textWhite : styles.textDark]}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, isDark ? styles.inputDark : styles.inputLight]}
                placeholder="Enter your password"
                placeholderTextColor="#618979"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={[styles.visibilityButton, isDark ? styles.visibilityButtonDark : styles.visibilityButtonLight]}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#618979"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => console.log('Create account')}
          >
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <TouchableOpacity style={[styles.socialButton, isDark ? styles.socialButtonDark : styles.socialButtonLight]}>
            <Image
              source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
              style={styles.googleIcon}
            />
            <Text style={[styles.socialButtonText, isDark ? styles.textWhite : styles.textDark]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, isDark ? styles.socialButtonDark : styles.socialButtonLight]}>
            <MaterialIcons name="apple" size={24} color={isDark ? "white" : "#111815"} />
            <Text style={[styles.socialButtonText, isDark ? styles.textWhite : styles.textDark]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#fdfbf7',
  },
  containerDark: {
    backgroundColor: '#10221a',
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    maxWidth: 480,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  archCard: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderWidth: 2,
    borderBottomWidth: 0,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  archCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(19, 236, 146, 0.2)',
  },
  archCardDark: {
    backgroundColor: 'rgba(16, 34, 26, 0.5)',
    borderColor: 'rgba(19, 236, 146, 0.2)',
  },
  archDecoration: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(19, 236, 146, 0.1)',
    padding: 16,
    borderRadius: 999,
    marginBottom: 8,
    zIndex: 10,
  },
  logoText: {
    color: '#13ec92',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    zIndex: 10,
  },
  headlineContainer: {
    width: '100%',
    maxWidth: 480,
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheadline: {
    fontSize: 14,
    color: '#618979',
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 480,
    paddingHorizontal: 16,
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: 'white',
    borderColor: '#dbe6e1',
    color: '#111815',
  },
  inputDark: {
    backgroundColor: 'rgba(16, 34, 26, 0.3)',
    borderColor: 'rgba(19, 236, 146, 0.2)',
    color: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 56,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderRightWidth: 0,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  visibilityButton: {
    height: 56,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  visibilityButtonLight: {
    backgroundColor: 'white',
    borderColor: '#dbe6e1',
  },
  visibilityButtonDark: {
    backgroundColor: 'rgba(16, 34, 26, 0.3)',
    borderColor: 'rgba(19, 236, 146, 0.2)',
  },
  createButton: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 56,
    backgroundColor: '#13ec92',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13ec92',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#10221a',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(97, 137, 121, 0.2)',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#618979',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  socialButtonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#dbe6e1',
  },
  socialButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#618979',
  },
  footerLink: {
    fontSize: 14,
    color: '#13ec92',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  textWhite: {
    color: '#ffffff',
  },
  textDark: {
    color: '#111815',
  },
});
