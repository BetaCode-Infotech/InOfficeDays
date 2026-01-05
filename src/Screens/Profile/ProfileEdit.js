import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import IconButton from '../../../components/IconButton/IconButton';
import {Dropdown} from 'react-native-element-dropdown';
import Header from '../../../components/Header/Header';
import axios from 'axios';
import Axios from '../../utils/Axios';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/Fns';
import {useNavigation} from '@react-navigation/native';
import {DASHBOARD} from '../../utils/Routes/Routes';

const ProfileEdit = props => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');

  const [emailId, setEmailId] = useState('');
  const [gender, setGender] = useState('');
  const [company, setCompany] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (props.AUTH_DATA) {
      setName(props.AUTH_DATA?.USER_NAME || '');
      setEmailId(props.AUTH_DATA?.USER_EMAIL || '');
      setGender(props.AUTH_DATA?.GENDER || '');
      setCompany(props.AUTH_DATA?.COMPANY_NAME || '');
    }
  }, [props.AUTH_DATA]);

  const genderOptions = [
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'},
  ];
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = async () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!emailId.trim()) {
      newErrors.emailId = 'Email ID is required';
    } else if (!emailRegex.test(emailId.trim())) {
      newErrors.emailId = 'Enter a valid Email ID';
    }
    if (!gender.trim()) newErrors.gender = 'Gender is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await axios
        .post(Axios.axiosUrl + Axios.userUpdate, {
          USER_NAME: name,
          GENDER: gender,
          COMPANY_NAME: company,
          _id: props.AUTH_DATA?._id,
        })
        .then(response => {
          const newUser = props.AUTH_DATA.NEW_USER;
          Toast.show({
            type: 'success',
            text1: `Profile Updated`,
          });
          dispatch({
            type: 'AUTH_DATA_GET',
            payload: {...props.AUTH_DATA, ...response.data},
          });
          if (newUser) {
            navigation.navigate(DASHBOARD);
          }
        })
        .catch(err => {});
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f7f7f9'}}>
      <Header
        showBack={!props.AUTH_DATA?.NEW_USER}
        showHome={!props.AUTH_DATA?.NEW_USER}
        title="Profile"
      />
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          },
        ]}>
        <Toast position="top" topOffset={0} config={toastConfig} />
      </View>

      <ScrollView style={styles.container}>
        {/* {props.AUTH_DATA?.NEW_USER == false && (
          <IconButton
            icon={Icons.back}
            containerStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
            }}
            iconStyle={{tintColor: '#fff'}}
            onPress={() => navigation.navigate(PROFILE_VIEW)}
          />
        )} */}

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          placeholder="Full Name"
          onChangeText={text => {
            setName(text);
            setErrors(prev => ({...prev, name: undefined}));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Email ID</Text>
        <TextInput
          style={[styles.input, {backgroundColor: '#eeee'}]}
          value={emailId}
          editable={false}
          onChangeText={text => {
            setEmailId(text);
            setErrors(prev => ({...prev, emailId: undefined}));
          }}
          placeholder="Email ID"
        />
        {errors.emailId && (
          <Text style={styles.errorText}>{errors.emailId}</Text>
        )}

        {/* <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Mobile Number"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>} */}

        <Text style={styles.label}>Gender *</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          data={genderOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Gender"
          value={gender}
          onChange={item => {
            setGender(item.value);
            setErrors(prev => ({...prev, gender: undefined}));
          }}
        />
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        <Text style={styles.label}>Company Name *</Text>
        <TextInput
          style={styles.input}
          value={company}
          placeholder="Company Name"
          onChangeText={text => {
            setCompany(text);
            setErrors(prev => ({...prev, company: undefined}));
          }}
        />
        {errors.company && (
          <Text style={styles.errorText}>{errors.company}</Text>
        )}
        <View style={styles.bottomButtonContainer}>
          <Animated.View
            style={[
              styles.bottomButtonContainer,
              {transform: [{scale: scaleValue}]},
            ]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleSave}
              style={styles.bottomButton}>
              <Text style={styles.bottomButtonText}>Save</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(ProfileEdit);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f9',
    padding: 16,
  },
  label: {
    color: '#4a4a4a',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
    height: 50,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 6,
  },
  bottomButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    backgroundColor: '#5409DA',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 50,
    shadowColor: '#5409DA',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  placeholderStyle: {
    color: '#aaa',
  },
});
