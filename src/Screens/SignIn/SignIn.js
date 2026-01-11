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

const SingIn = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [visible, setVisible] = useState(false);

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

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.button}
              onPress={sendEmailOTP}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

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
    width: "100%",
    height: 40,
    marginTop: 12,
    objectFit: 'contain',
  },
});
