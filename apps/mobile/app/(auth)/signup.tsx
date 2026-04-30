import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleSocialSignup = (provider: string) => {
    // For now, show phone verification after social signup
    setShowPhoneVerification(true);
  };

  const handlePhoneLogin = () => {
    setShowPhoneVerification(true);
  };

  const handleSendCode = () => {
    // TODO: Implement actual phone verification
    setShowPhoneVerification(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background orbs */}
      <View style={styles.bgEffects}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

      <View style={styles.content}>
        {/* Top section — logo + title, vertically centered in available space */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Gather<Text style={styles.titleAccent}>Up</Text></Text>
        </View>

        {/* Bottom section — buttons pinned to bottom */}
        <View style={styles.bottomSection}>
          {/* Social Login Buttons — white pill style */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignup('apple')}
              activeOpacity={0.85}
            >
              <View style={styles.socialIconContainer}>
                <FontAwesome5 name="apple" size={20} color="#111" />
              </View>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
              <View style={styles.socialIconSpacer} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignup('google')}
              activeOpacity={0.85}
            >
              <View style={styles.socialIconContainer}>
                <Image
                  source={require('../../assets/google-logo.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
              <View style={styles.socialIconSpacer} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignup('facebook')}
              activeOpacity={0.85}
            >
              <View style={styles.socialIconContainer}>
                <FontAwesome5 name="facebook" size={20} color="#1877F2" />
              </View>
              <Text style={styles.socialButtonText}>
                Continue with Facebook
              </Text>
              <View style={styles.socialIconSpacer} />
            </TouchableOpacity>
          </View>

          {/* Phone login link */}
          <TouchableOpacity
            style={styles.phoneLink}
            onPress={handlePhoneLogin}
          >
            <Text style={styles.phoneLinkIcon}>📞</Text>
            <Text style={styles.phoneLinkText}>
              Log in with Phone (existing only)
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By pressing Continue, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Use</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>

      {/* Phone Verification Modal */}
      <Modal
        visible={showPhoneVerification}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <SafeAreaView style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPhoneVerification(false)}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Finish Signup</Text>
              <View style={styles.closeButton} />
            </View>

            {/* Verification Content */}
            <View style={styles.verificationContent}>
              <Text style={styles.verificationTitle}>
                Verify your phone number
              </Text>
              <Text style={styles.verificationSubtitle}>
                To keep our community secure and trustworthy, we verify every
                new account.
              </Text>

              {/* Phone Input */}
              <View style={styles.phoneInputContainer}>
                <TouchableOpacity style={styles.countryCodeButton}>
                  <Text style={styles.flagEmoji}>🇺🇸</Text>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                <View style={styles.phoneInputDivider} />
                <View style={styles.phoneInputWrapper}>
                  <Text style={styles.phoneLabel}>
                    Phone Number<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#6b7280"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Send Code Button */}
            <View style={styles.sendCodeContainer}>
              <TouchableOpacity
                style={styles.sendCodeButton}
                onPress={handleSendCode}
              >
                <Text style={styles.sendCodeText}>Send Code</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(0, 212, 170, 0.12)',
    top: -60,
    left: -80,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(224, 64, 160, 0.10)',
    top: 60,
    right: -60,
  },
  orb3: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(64, 128, 255, 0.08)',
    bottom: 140,
    left: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  titleAccent: {
    color: '#FF00FF',
  },
  bottomSection: {
    paddingBottom: 30,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 50,
  },
  socialIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconSpacer: {
    width: 20,
  },
  socialButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
  phoneLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    marginBottom: 50
  },
  phoneLinkIcon: {
    fontSize: 16,
  },
  phoneLinkText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },
  termsLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'underline',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#fff',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  verificationContent: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  verificationTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  verificationSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
    marginBottom: 32,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 20,
  },
  countryCodeText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownIcon: {
    color: '#6b7280',
    fontSize: 10,
  },
  phoneInputDivider: {
    width: 1,
    backgroundColor: '#3a3a3a',
  },
  phoneInputWrapper: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  required: {
    color: '#ef4444',
  },
  phoneInput: {
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  sendCodeContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  sendCodeButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 16,
  },
  sendCodeText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
