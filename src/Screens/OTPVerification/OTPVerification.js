import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  Vibration,
} from 'react-native';
import CustomButton from '../../../components/CustomButton/CustomButton';
import {Dimensions} from 'react-native';
import {COLORS} from '../../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {DASHBOARD, PROFILE_EDIT} from '../../utils/Routes/Routes';
import axios from 'axios';
import Axios from '../../utils/Axios';
import Toast from 'react-native-toast-message';
import {toastConfig, toBoolean} from '../../../constants/Fns';
import Loader from '../../../components/Loader/Loader';
import {useDispatch} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {NativeModules} from 'react-native';
const {UserPrefsModule} = NativeModules;

const {width, height} = Dimensions.get('window');
const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];

const OTPVerification = props => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const EMAIL = props.route?.params ?? null;
  const [visible, setVisible] = useState(false);

  const [otp, setOtp] = useState(829455);
  const otpRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      otpRef.current.focusField(0);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const isValidOtp = String(otp).length === 6;

    if (isValidOtp) {
      setVisible(true);
      await axios
        .post(Axios.axiosUrl + Axios.loginOTPVerify, {
          USER_EMAIL: EMAIL.EMAIL,
          OTP: otp,
        })
        .then(response => {
          if (response.data.LOGIN == true) {
            setVisible(false);
            dispatch({
              type: 'AUTH_DATA_GET',
              payload: {...response.data},
            });
            UserPrefsModule.saveUserId(String(response.data._id));
            if (response.data.NEW_USER == true) {
              navigation.navigate(PROFILE_EDIT, {
                NEW_USER: true,
                EMAIL: EMAIL,
              });
            } else if (response.data.NEW_USER == false) {
              navigation.navigate(DASHBOARD);
            }
          } else {
            setVisible(false);
            Toast.show({
              type: 'error',
              text1: `Wrong OTP`,
              text2: 'Please enter the correct OTP',
            });
            Vibration.vibrate(PATTERN);
          }
        })
        .catch(err => {
          setVisible(false);
        });
    } else {
      Toast.show({
        type: 'error',
        text1: `Something went wrong`,
        text2: 'Please try again after some time',
      });
      Vibration.vibrate(PATTERN);
    }
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <Loader visible={visible} Label="Hold on.." />
      <View style={styles.container}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Toast position="top" topOffset={0} config={toastConfig} />
        </View>
        <Text style={styles.title}>Enter OTP</Text>

        <View style={styles.otpContainer}>
          <OTPInputView
            ref={otpRef}
            style={{width: '90%', height: 150, color: COLORS.black}}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              setOtp(code);
            }}
          />
        </View>

        <CustomButton
          label="Submit"
          color={COLORS.black}
          containerStyle={{
            width: width - 50,
            padding: 20,
            marginTop: 30,
          }}
          onPress={handleSubmit}
        />
      </View>
    </ImageBackground>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    // gap: 5,
  },
  otpInput: {
    width: width / 10,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#000',
    fontSize: 22,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
