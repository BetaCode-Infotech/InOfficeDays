import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  ADD_GROUP,
  ADD_LOCATION,
  DASHBOARD,
  GROUP,
  LOCATION,
  ONBOARDING,
  OTP_VERIFICATION,
  PROFILE,
  PROFILE_EDIT,
  SIGNIN,
  TRACKING_HISTORY,
} from '../../utils/Routes/Routes';
import BottomTabNavigator from '../BottomNavigator/BottomNavigator';
import AddLocation from '../../Screens/Location/AddLocation';
import AddGroup from '../../Screens/Group/AddGroup';
import SingIn from '../../Screens/SignIn/SignIn';
import OTPVerification from '../../Screens/OTPVerification/OTPVerification';
import Profile from '../../Screens/Profile/Profile';
import OnBoarding from '../../Screens/OnBoarding/OnBoarding';
import ProfileEdit from '../../Screens/Profile/ProfileEdit';
import TrackingHistory from '../../Screens/TrackingHistory/TrackingHistory';
import {
  requestLocationPermission,
  startLocationService,
} from '../../utils/NativeLocationService';
import {
  requestNotificationPermissions,
  startListeningForLocation,
} from '../../../BackgroundJobs';
const Stack = createNativeStackNavigator();
const StackNavigator = props => {
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    if (props.AUTH_DATA?._id) {
      if (props.AUTH_DATA?.NEW_USER === true) {
        setInitialRoute(PROFILE_EDIT);
      } else {
        setInitialRoute(DASHBOARD);
      }
    } else {
      setInitialRoute(ONBOARDING);
    }
  }, [props.AUTH_DATA]);
  useEffect(() => {
    const initializeApp = async () => {
      console.log('App Layout mounted');

      createNotificationChannels();

      // Request location permission first
      const locationGranted = await requestLocationPermission();
      console.log('Location Permission:', locationGranted);

      if (locationGranted) {
        startLocationService();
        startListeningForLocation(); // Optional: wrap in await if needed
      }

      // Then request notification permission
      await requestNotificationPermissions();
    };

    initializeApp();

    return () => {
      // cleanup on unmount
      startListeningForLocation()?.unsubscribe?.(); // optional cleanup if supported
    };
  }, []);

  if (!initialRoute) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name={ONBOARDING}
          component={OnBoarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SIGNIN}
          component={SingIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={OTP_VERIFICATION}
          component={OTPVerification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={DASHBOARD}
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={PROFILE}
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={PROFILE_EDIT}
          component={ProfileEdit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ADD_GROUP}
          component={AddGroup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ADD_LOCATION}
          component={AddLocation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={TRACKING_HISTORY}
          component={TrackingHistory}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(StackNavigator);
