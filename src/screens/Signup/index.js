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
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { AppImages } from '../../assets/index'

const { width, height } = Dimensions.get('window')

const Signup = ({ navigation }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.userState)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const handleSignup = () => {
        // TODO: dispatch(registerUser({ fullName, email, password, confirmPassword }))
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Brand Logo Section */}
                    <View style={styles.brandSection}>
                        <View style={styles.logoWrapper}>
                            <Image source={AppImages.logo} style={styles.logo} />
                            <View style={styles.logoRing} />
                            <View style={[styles.logoRing, styles.logoRing2]} />
                        </View>

                        <Text style={styles.wordmark}>AstolaMart</Text>
                        <Text style={styles.tagline}>Create your account</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Full Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    focusedField === 'fullName' && styles.inputWrapperFocused,
                                ]}
                            >
                                <Icon name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    onFocus={() => setFocusedField('fullName')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    focusedField === 'email' && styles.inputWrapperFocused,
                                ]}
                            >
                                <Icon name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    focusedField === 'password' && styles.inputWrapperFocused,
                                ]}
                            >
                                <Icon name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Icon
                                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'confirmPassword' && styles.inputWrapperFocused,
                ]}
              >
                <Icon name="checkmark-circle-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View> */}

                        {/* Terms and Conditions */}
                        <TouchableOpacity
                            style={styles.termsContainer}
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                                {agreeToTerms && (
                                    <Icon name="checkmark" size={14} color="#FFFFFF" />
                                )}
                            </View>
                            <Text style={styles.termsText}>
                                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Signup Button */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleSignup}
                            disabled={loading}
                            style={styles.ctaContainer}
                        >
                            <LinearGradient
                                colors={['#da1884', '#e84a9e']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.cta}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.ctaText}>Create Account</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        {/* <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View> */}

                        {/* Social Buttons */}
                        {/* <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="logo-google" size={22} color="#EA4335" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Icon name="logo-apple" size={22} color="#000000" />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View> */}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default Signup

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: width * 0.08,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 32,
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
            android: 'serif'
        }),
    },
    tagline: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        letterSpacing: 0.3,
    },
    form: {
        width: '100%'
    },
    inputContainer: {
        marginBottom: 16,
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
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
    },
    inputWrapperFocused: {
        borderColor: '#da1884',
        backgroundColor: '#FFFFFF',
        shadowColor: '#da1884',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12
    },
    input: {
        flex: 1,
        color: '#111827',
        fontSize: 15,
        paddingVertical: 8,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: '#da1884',
        borderColor: '#da1884',
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    termsLink: {
        color: '#da1884',
        fontWeight: '600',
    },
    ctaContainer: {
        width: '100%',
        shadowColor: '#da1884',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
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
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB'
    },
    dividerText: {
        color: '#9CA3AF',
        fontSize: 12,
        marginHorizontal: 16,
        fontWeight: '500',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    socialText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 36,
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14
    },
    footerLink: {
        color: '#da1884',
        fontSize: 14,
        fontWeight: '700'
    },
})