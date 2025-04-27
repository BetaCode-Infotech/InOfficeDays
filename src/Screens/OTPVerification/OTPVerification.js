import React, {useRef, useState} from 'react';
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

const {width, height} = Dimensions.get('window');
const DURATION = 100;
const PATTERN = [2 * DURATION, 1 * DURATION];

const OTPVerification = props => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const EMAIL = props.route?.params ?? null;
  const [visible, setVisible] = useState(false);

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      const newOtp = text.split('').slice(0, 6);
      setOtp(newOtp);
      if (newOtp.length === 6) {
        inputs.current[5]?.blur();
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    // const finalOtp = otp.join('');
    const finalOtp = otp.join('');
    const isValidOtp =
      finalOtp.length === 6 && otp.every(char => /^\d$/.test(char));

    if (isValidOtp) {
      setVisible(true);
      await axios
        .post(Axios.axiosUrl + Axios.verifyOtp, {
          EMAIL: EMAIL,
          OTP: finalOtp,
        })
        .then(response => {
          if (response.data.login == true) {
            setVisible(false);
            dispatch({
              type: 'AUTH_DATA_GET',
              payload: {...response.data},
            });

            if (toBoolean(response.data.NEW_USER) == true) {
              navigation.navigate(PROFILE_EDIT, {
                NEW_USER: true,
                EMAIL: EMAIL,
              });
            } else if (toBoolean(response.data.NEW_USER) == false) {
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

          console.log('error', err);
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
    <ImageBackground
      // source={require('../../../assets/image/profile-view-bg.jpg')}
      style={styles.background}
      resizeMode="cover">
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
          {/* {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={text => handleChange(text, index)}
            />
          ))} */}
          <OTPInputView
            style={{width: '90%', height: 150, color: COLORS.black}}
            pinCount={4}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            // onCodeChanged = {code => { this.setState({code})}}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
        </View>

        <CustomButton
          label="Submit"
          color={COLORS.secondary}
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
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
