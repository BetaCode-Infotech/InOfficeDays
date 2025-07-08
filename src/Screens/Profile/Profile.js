import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ImageBackground,
  Alert,
  StatusBar,
} from 'react-native';
import Icons from '../../../constants/Icons';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {DASHBOARD, ONBOARDING, PROFILE_EDIT} from '../../utils/Routes/Routes';
import IconButton from '../../../components/IconButton/IconButton';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import {connect, useDispatch} from 'react-redux';
import Axios from '../../utils/Axios';
import {COLORS} from '../../../constants/theme';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Profile = props => {
  const insets = useSafeAreaInsets();

  const handleLink = url => Linking.openURL(url);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({});
  console.log('Adnasdasdas', userDetails);

  useEffect(() => {
    setUserDetails({
      ...props.AUTH_DATA,
    });
  }, [props.AUTH_DATA]);

  const formatJoinDate = dateString => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `Joined ${month} ${year}`;
  };

  const logoutCurrentSession = async () => {
    await axios
      .post(Axios.axiosUrl + Axios.userLogout, {
        SESSION_ID: props.AUTH_DATA?.SESSION_ID,
      })
      .then(response => {})
      .catch(err => {
        console.log('err', err);
      });
    dispatch({type: 'AUTH_LOGOUT'}); // Use new logout action type
    dispatch({type: 'ALL_TRACKING_LIST', payload: []}); // Use new logout action type
    dispatch({type: 'ALL_LOCATION_LIST', payload: []}); // Use new logout action type
    dispatch({type: 'ALL_GROUP_LIST', payload: []}); // Use new logout action type
    dispatch({type: 'BACKGROUND_ACTIVITY', payload: []}); // Use new logout action type
    navigation.reset({
      index: 0,
      routes: [{name: ONBOARDING}], // Reset navigation stack to Onboarding
    });
  };
  const state = useNavigationState(state => state);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: state.type == 'stack' ? insets.bottom : 0,
        backgroundColor: '#fff',
      }}>
      <ScrollView style={[styles.container]}>
        <ImageBackground
          source={require('../../../assets/image/profile-view-bg.jpg')}
          resizeMode="cover">
          {state.type == 'stack' && (
            <IconButton
              icon={Icons.home}
              containerStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                width: 40,
                height: 40,

                borderRadius: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
              }}
              iconStyle={{tintColor: '#fff', width: 25, height: 25}}
              onPress={() => navigation.navigate(DASHBOARD)}
            />
          )}

          <View style={[styles.banner]}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  userDetails.PROFILE_IMAGE
                    ? {uri: `${Axios.axiosUrl}/${userDetails.PROFILE_IMAGE}`}
                    : Icons.profile
                }
                style={styles.avatar}
              />
            </View>
          </View>
        </ImageBackground>

        {/* Profile */}
        <View style={styles.profile}>
          <Text style={styles.name}>{userDetails?.NAME} </Text>
          <Text style={styles.name}>{userDetails?.USER_EMAIL} </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(PROFILE_EDIT)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
        </View>

        <TouchableOpacity
          style={[
            styles.buttonLogout,
            {backgroundColor: '#fdecea', marginVertical: 10},
          ]}
          onPress={() => {
            Alert.alert(
              'Confirm Logout',
              'Are you sure you want to logout?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => logoutCurrentSession(),
                },
              ],
              {cancelable: true},
            );
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.buttonTextLogout, {color: '#d32f2f'}]}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
  banner: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -40,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  profile: {
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  username: {color: 'gray', fontSize: 14},
  name: {fontSize: 22, fontWeight: 'bold', marginTop: 5},
  location: {color: '#6e6e6e', marginTop: 2},
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 15,
    gap: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '500',
  },
  buttonLogout: {
    marginTop: 20,
    backgroundColor: COLORS.black,
    paddingVertical: 14,
    marginHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextLogout: {
    fontWeight: 'bold',
    color: '#fff',
  },
  bio: {
    // textAlign: 'center',
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 14,
    marginVertical: 10,
  },
  infoSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  tagsContainer: {
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
    // marginBottom: 30,
  },
  tag: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  tagText: {
    fontSize: 14,
  },
});

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(Profile);
