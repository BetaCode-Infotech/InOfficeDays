import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  Vibration,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {COLORS} from '../../../constants/theme';
import Loader from '../../../components/Loader/Loader';
import Icons from '../../../constants/Icons';

import AnimatedIconButton from '../../../components/IconButton/AnimatedIconButton';
import Axios from '../../utils/Axios';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import Images from '../../../constants/Images';
import {DASHBOARD, OTP_VERIFICATION} from '../../utils/Routes/Routes';
import {useNavigation} from '@react-navigation/native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {toastConfig} from '../../../constants/Fns';

const SingIn = props => {
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [visible, setVisible] = useState(false);
  const [IpAddress, setIPAddress] = useState('');
  const [role, setRole] = useState('AGENT');
  const DURATION = 100;
  const PATTERN = [2 * DURATION, 1 * DURATION];
  useEffect(() => {
    getDeviceIpAddress();

    let brand = DeviceInfo.getBrand();
    DeviceInfo.getDevice().then(device => {
      setDeviceName(brand + ' ' + device);
    });
  }, []);

  const getDeviceIpAddress = () => {
    DeviceInfo.getIpAddress().then(ip => {
      setIPAddress(ip);
    });
  };

  const showToastWarn = label => {
    Toast.show({
      type: 'error',
      text1: `Please fill Email ID`,
    });
    Vibration.vibrate(PATTERN);
  };

  const sendEmailOTP = async () => {
    if (userName != '') {
      setVisible(true);

      await axios
        .post(Axios.axiosUrl + Axios.loginOTPSend, {
          USER_EMAIL: userName,
          IS_VERIFIED: false,
        })
        .then(response => {
          setVisible(false);
          if (response.data.OTP_SEND == true) {
            navigation.navigate(OTP_VERIFICATION, {
              EMAIL: userName,
            });
          }
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: `Something went wrong`,
            text2: 'Please try again after some time',
          });
          Vibration.vibrate(PATTERN);
          setVisible(false);
          console.log(err);
        });
    } else {
      showToastWarn();
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      Alert.alert('Signed In', `Hello ${userInfo.user.name}`);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signing in...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available');
      } else {
        Alert.alert('Some error occurred');
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <StatusBar
          animated={true}
          backgroundColor="#6b2af3"
          barStyle="dark-content"
        /> */}
        <Loader visible={visible} Label="Hold on.." />
        <ImageBackground
          source={require('../../../assets/image/login-image-2.jpg')}
          style={{
            height: height / 1.7,
          }}>
          <View style={[styles.topContainer, {flexDirection: 'row'}]}>
            <Toast position="top" topOffset={0} config={toastConfig} />
          </View>
        </ImageBackground>
        <KeyboardAvoidingView enabled={true}>
          <View style={styles.bottomView}>
            <View
              style={{
                // marginTop: 40,
                marginHorizontal: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: 55}} />
            </View>

            <View
              style={{
                marginTop: 40,
                paddingHorizontal: 25,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.inputBox,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <ImageIcon
                  icon={Icons.email}
                  iconStyle={{
                    width: 25,
                    height: 25,
                  }}
                  containerStyle={{
                    backgroundColor: COLORS.white,
                    marginLeft: 10,
                  }}
                />
                <TextInput
                  placeholder="Enter Email ID"
                  placeholderTextColor={COLORS.black}
                  style={{
                    fontSize: 17,
                    padding: 10,
                    color: COLORS.black,
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={userName}
                  onChangeText={email => {
                    setUserName(email.toLowerCase());
                  }}
                />
              </View>
              <AnimatedIconButton
                icon={Icons.next}
                iconStyle={{
                  height: 55,
                  width: 55,
                  tintColor: '#fff',
                  backgroundColor: '#6b2af3',
                  borderRadius: 10,
                }}
                onPress={() => {
                  sendEmailOTP();
                  // navigation.navigate(DASHBOARD);
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              {/* <Button title="Sign in with Google" onPress={signIn} /> */}
              {/* <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={() => {
                  // initiate sign in
                }}
                // disabled={isInProgress}
              /> */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopViewText: {
    color: COLORS.red,
    fontSize: 35,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomView: {
    // flex: 1.5,
    backgroundColor: COLORS.white,
    bottom: 100,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
  },
  LoginBtn: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 60,

    backgroundColor: '#4632A1',
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    borderRadius: 40,
  },
  inputBox: {
    borderWidth: 1,
    width: Dimensions.get('window').width / 1.5,
    height: 60,
    borderColor: COLORS.gray20,
    fontSize: 17,
    borderRadius: 20,
  },
});
export default SingIn;
