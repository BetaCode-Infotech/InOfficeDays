import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

// import {
//   ALL_EVENTS,
//   DASHBOARD,
//   DASHBOARD_BOTTOM,
//   EVENT_DETAILS,
//   ONBOARDING,
//   OTP_VERIFICATION,
//   PROFILE_EDIT,
//   PROFILE_VIEW,
//   SIGNIN,
// } from '../../utils/Routes/Routes';

// import OnBoarding from '../../Screens/OnBoarding/OnBoarding';
// import SignIn from '../../Screens/SignIn/SignIn';

// import Dashboard from '../../Screens/Dashboard/Dashboard';
import {DASHBOARD, OTP_VERIFICATION, PROFILE} from '../../utils/Routes/Routes';
// import OTPVerification from '../../Screens/OTPVerification/OTPVerification';
import ProfileScreen from '../../Screens/Dashboard/Dashboard';

// import ProfileEdit from '../../Screens/Profile/ProfileEdit';
// import ProfileView from '../../Screens/Profile/ProfileView';
// import AllEvents from '../../Screens/AllEvents/AllEvents';
// import EventDetails from '../../Screens/EventDetails/EventDetails';
// import OTPVerification from '../../Screens/OTPVerification/OTPVerification';

// import {toBoolean} from '../../../constants/Fns';
import BottomTabNavigator from '../BottomNavigator/BottomNavigator';
// import { DASHBOARD } from '../../utils/Routes/Routes';

const Stack = createNativeStackNavigator();

const StackNavigator = props => {
  // const [initialRoute, setInitialRoute] = useState(null);

  // useEffect(() => {
  //   if (props.AUTH_DATA?.USER_ID) {
  //     if (toBoolean(props.AUTH_DATA?.NEW_USER) === true) {
  //       setInitialRoute(PROFILE_EDIT);
  //     } else {
  //       setInitialRoute(DASHBOARD);
  //     }
  //   } else {
  //     setInitialRoute(ONBOARDING);
  //   }
  // }, [props.AUTH_DATA]);

  // if (!initialRoute) return null; // or show splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator
      // initialRouteName={initialRoute}
      >
        {/* <Stack.Screen
          name={DASHBOARD}
          component={Dashboard}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={OTP_VERIFICATION}
          component={OTPVerification}
          options={{headerShown: false}}
        /> */}

        {/* <Stack.Screen
          name={PROFILE}
          component={ProfileScreen}
          options={{headerShown: false}}
        /> */}

        <Stack.Screen
          name={DASHBOARD}
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name={PROFILE_EDIT}
          component={ProfileEdit}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name={PROFILE_VIEW}
          component={ProfileView}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name={ALL_EVENTS}
          component={AllEvents}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name={EVENT_DETAILS}
          component={EventDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ONBOARDING}
          component={OnBoarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SIGNIN}
          component={SignIn}
          options={{headerShown: false}}
        />
       */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(StackNavigator);
