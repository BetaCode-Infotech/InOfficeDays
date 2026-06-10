import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Vibration,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

import {COLORS} from '../../../constants/theme';
import Loader from '../../../components/Loader/Loader';
import Icons from '../../../constants/Icons';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import AnimatedIconButton from '../../../components/IconButton/AnimatedIconButton';
import Axios from '../../utils/Axios';

import {OTP_VERIFICATION} from '../../utils/Routes/Routes';
import {toastConfig} from '../../../constants/Fns';
import WebView from 'react-native-webview';

const SingIn = () => {
  const PRIVACY_POLICY_URL = 'https://betacodeinfotech.com/privacy-policy';
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [visible, setVisible] = useState(false);
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const DURATION = 100;
  const PATTERN = [2 * DURATION, DURATION];

  useEffect(() => {
    DeviceInfo.getIpAddress();
  }, []);

  const showToastWarn = () => {
    Toast.show({
      type: 'error',
      text1: 'Email required',
      text2: 'Please enter your email address',
    });
    Vibration.vibrate(PATTERN);
  };

  const sendEmailOTP = async () => {
    if (!userName) {
      showToastWarn();
      return;
    }

    setVisible(true);
    try {
      const response = await axios.post(Axios.axiosUrl + Axios.loginOTPSend, {
        USER_EMAIL: userName,
        IS_VERIFIED: false,
      });

      setVisible(false);
      if (response.data.OTP_SEND) {
        navigation.navigate(OTP_VERIFICATION, {EMAIL: userName});
      }
    } catch (error) {
      setVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Loader visible={visible} Label="Hold on..." />

          {/* Header */}
          <ImageBackground
            source={require('../../../assets/image/login-image-2.jpg')}
            style={[styles.header, {height: height * 0.45}]}>
            <Toast position="top" topOffset={0} config={toastConfig} />

            <View style={styles.overlay}></View>
            <View style={styles.centerBox}>
              <Text style={styles.appTitle}>In Office</Text>
              <Text style={styles.tagLine}>
                Return to office, Gym tracked smartly
              </Text>
            </View>
          </ImageBackground>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.subtitle}>
              Sign in to continue tracking your activity
            </Text>
            <Text style={styles.label}>Email Address</Text>

            <View style={styles.inputContainer}>
              <ImageIcon
                icon={Icons.email}
                iconStyle={styles.icon}
                containerStyle={styles.iconContainer}
              />

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={COLORS.gray50}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={userName}
                onChangeText={email => setUserName(email.trim().toLowerCase())}
              />
            </View>

            {/* <TouchableOpacity
              activeOpacity={0.9}
              style={styles.button}
              onPress={sendEmailOTP}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity> */}
            {/* Privacy Policy Checkbox */}
            <View style={styles.policyRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptPolicy(!acceptPolicy)}
                accessibilityRole="checkbox"
                accessibilityState={{checked: acceptPolicy}}>
                {acceptPolicy ? <View style={styles.checkboxChecked} /> : null}
              </TouchableOpacity>
              <Text style={styles.policyText}>
                I accept the{' '}
                <Text
                  style={styles.policyLink}
                  onPress={() => setShowPolicyModal(true)}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.button, !acceptPolicy && {opacity: 0.8}]}
              onPress={sendEmailOTP}
              disabled={!acceptPolicy}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            {/* Privacy Policy Modal */}
            <Modal
              visible={showPolicyModal}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setShowPolicyModal(false)}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    padding: 15,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                  }}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    Privacy Policy
                  </Text>
                  <TouchableOpacity onPress={() => setShowPolicyModal(false)}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>✕</Text>
                  </TouchableOpacity>
                </View>

                <WebView
                  source={{uri: PRIVACY_POLICY_URL}}
                  startInLoadingState={true}
                />

                <Pressable
                  style={{
                    padding: 15,
                    backgroundColor: '#000',
                    alignItems: 'center',
                  }}
                  onPress={() => setShowPolicyModal(false)}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Close</Text>
                </Pressable>
              </View>
            </Modal>

            <Text style={styles.footerText}>
              We’ll send you a one-time password to verify
            </Text>
            <Image
              source={require('../../../assets/image/betacode-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SingIn;

const styles = StyleSheet.create({
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: COLORS.gray40,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.black,
    borderRadius: 3,
  },
  policyText: {
    fontSize: 13,
    color: COLORS.gray70,
    flexShrink: 1,
  },
  policyLink: {
    color: COLORS.black,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.black,
  },
  modalLink: {
    color: COLORS.primary || COLORS.black,
    textDecorationLine: 'underline',
    marginBottom: 12,
    fontSize: 14,
  },
  modalWebViewBox: {
    backgroundColor: COLORS.gray10,
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    width: '100%',
  },
  modalWebViewText: {
    fontSize: 13,
    color: COLORS.gray70,
    marginBottom: 4,
  },
  modalWebViewUrl: {
    fontSize: 13,
    color: COLORS.primary || COLORS.black,
    textDecorationLine: 'underline',
  },
  modalCloseBtn: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: COLORS.black,
    borderRadius: 8,
  },
  modalCloseText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    justifyContent: 'flex-end',
  },

  overlay: {
    padding: 50,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray50,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray70,
    marginBottom: 6,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -70,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },

  label: {
    fontSize: 14,
    color: COLORS.gray70,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray20,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 56,
  },

  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.gray60,
  },

  iconContainer: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },

  button: {
    marginTop: 24,
    height: 54,
    backgroundColor: COLORS.black,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },

  footerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.gray60,
  },

  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  centerBox: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 22,
    elevation: 10,
  },

  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2D2D2D',
    letterSpacing: 1,
  },

  tagLine: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.gray50,
    fontWeight: '500',
  },
  logo: {
    width: '100%',
    height: 40,
    marginTop: 12,
    objectFit: 'contain',
  },
});
