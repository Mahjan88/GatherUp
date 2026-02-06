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
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleSocialSignup = (provider: string) => {
    // For now, show phone verification after social signup
    setShowPhoneVerification(true);
  };

  const handleEmailSignup = () => {
    // Navigate to email signup flow or show phone verification
    setShowPhoneVerification(true);
  };

  const handleSendCode = () => {
    // TODO: Implement actual phone verification
    setShowPhoneVerification(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Sign up for GatherUp</Text>

        {/* Social Login Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialSignup('google')}
          >
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialSignup('facebook')}
          >
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIconText}>f</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialSignup('apple')}
          >
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIconText}></Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleEmailSignup}
          >
            <View style={styles.socialIconContainer}>
              <Text style={styles.socialIconText}>✉</Text>
            </View>
            <Text style={styles.socialButtonText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.alreadyText}>Already have an account?</Text>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
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
              <Text style={styles.verificationTitle}>Verify your phone number</Text>
              <Text style={styles.verificationSubtitle}>
                To keep our community secure and trustworthy, we verify every new account.
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
                  <Text style={styles.phoneLabel}>Phone Number<Text style={styles.required}>*</Text></Text>
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
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  socialIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: {
    fontSize: 20,
    color: '#fff',
  },
  socialButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 32,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  alreadyText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  termsText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
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
    borderRadius: 30,
    paddingVertical: 16,
  },
  sendCodeText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
