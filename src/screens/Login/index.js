import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Image,
  Alert,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { AppImages } from '../../assets/index'
import { navigate } from '../../services/navigationServices'
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

const { width } = Dimensions.get('window')

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    navigate('Home');
    return
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        Alert.alert('Login Error', 'Please enter your email address.');
        return;
    }

    if (!password) {
        Alert.alert('Login Error', 'Please enter your password.');
        return;
    }

    try {
        setLoading(true);

        const authInstance = getAuth();

        const userCredential = await signInWithEmailAndPassword(
            authInstance,
            trimmedEmail,
            password
        );

        const user = userCredential.user;

        console.log('Firebase Login Successful');
        console.log('UID:', user.uid);
        console.log('Email:', user.email);

        navigate('Home');

    } catch (error) {
        console.log('Firebase Login Error:', error);

        let message = 'Unable to sign in. Please try again.';

        switch (error.code) {
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;

            case 'auth/user-not-found':
                message = 'No account found with this email address.';
                break;

            case 'auth/wrong-password':
                message = 'Incorrect password.';
                break;

            case 'auth/invalid-credential':
                message = 'Invalid email or password.';
                break;

            case 'auth/user-disabled':
                message = 'This account has been disabled.';
                break;

            case 'auth/too-many-requests':
                message =
                    'Too many login attempts. Please try again later.';
                break;

            case 'auth/network-request-failed':
                message =
                    'Network error. Please check your internet connection.';
                break;

            default:
                message = error.message || message;
        }

        Alert.alert('Login Failed', message);

    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 0 : 0
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {/* Logo */}
          <View style={styles.brandSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={AppImages.logo}
                style={styles.logo}
              />

              <View style={styles.logoRing} />

              <View
                style={[
                  styles.logoRing,
                  styles.logoRing2,
                ]}
              />
            </View>

            <Text style={styles.wordmark}>
              AstolaMart
            </Text>

            <Text style={styles.tagline}>
              Your premium shopping destination
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Email Address
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'email' &&
                    styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onFocus={() =>
                    setFocusedField('email')
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'password' &&
                    styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onFocus={() =>
                    setFocusedField('password')
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowPassword(prev => !prev)
                  }
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}
                >
                  <Icon
                    name={
                      showPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotWrapper}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
              style={[
                styles.ctaContainer,
                loading && styles.ctaDisabled,
              ]}
            >
              <LinearGradient
                colors={[
                  '#da1884',
                  '#e84a9e',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                {loading ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                  />
                ) : (
                  <Text style={styles.ctaText}>
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigate('Signup')}
            >
              <Text style={styles.footerLink}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Login

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
  },

  /*
   * IMPORTANT:
   * Don't use justifyContent: 'center' here.
   * It causes the whole screen to jump when
   * KeyboardAvoidingView changes the available height.
   */
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.08,
    paddingTop:
      Platform.OS === 'ios' ? 30 : 40,
    paddingBottom: 32,
  },

  brandSection: {
    alignItems: 'center',
    marginBottom: 42,
  },

  logoWrapper: {
    width: 100,
    height: 100,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: 80,
    width: 80,
    borderRadius: 20,
  },

  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#da1884',
    opacity: 0.15,
  },

  logoRing2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.08,
  },

  wordmark: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
    }),
  },

  tagline: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  form: {
    width: '100%',
  },

  inputContainer: {
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },

  /*
   * Keep the focused style simple.
   * Avoid shadow/elevation changes during focus
   * because they can cause a visual blink on Android.
   */
  inputWrapperFocused: {
    borderColor: '#da1884',
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    height: 52,
    color: '#111827',
    fontSize: 15,
    paddingVertical: 0,
  },

  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },

  forgotText: {
    color: '#da1884',
    fontSize: 13,
    fontWeight: '600',
  },

  ctaContainer: {
    width: '100%',
    borderRadius: 12,

    shadowColor: '#da1884',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  ctaDisabled: {
    opacity: 0.7,
  },

  cta: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  footer: {
    flexDirection: 'row',
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },

  footerLink: {
    color: '#da1884',
    fontSize: 14,
    fontWeight: '700',
  },
})
