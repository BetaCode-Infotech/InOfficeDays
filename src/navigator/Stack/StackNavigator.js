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
  OTP_VERIFICATION,
  PROFILE,
} from '../../utils/Routes/Routes';
import BottomTabNavigator from '../BottomNavigator/BottomNavigator';
import AddLocation from '../../Screens/Location/AddLocation';
import AddGroup from '../../Screens/Group/AddGroup';
const Stack = createNativeStackNavigator();
const StackNavigator = props => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={DASHBOARD}
          component={BottomTabNavigator}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  AUTH_DATA: state.authData.authDataList,
});

export default connect(mapStateToProps)(StackNavigator);
