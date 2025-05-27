import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  ACCOUNT_DETAILS,
  ALL_EVENTS,
  DASHBOARD,
  DASHBOARD_BOTTOM,
  HOME,
  ORDERS,
  PORTFOLIO,
  PROFILE_VIEW,
  SETTINGS,
  VIEW_GROUP,
  VIEW_LOCATION,
  WATCH_LIST,
} from '../../utils/Routes/Routes';

import Dashboard from '../../Screens/Dashboard/Dashboard';
import {COLORS} from '../../../constants/theme';
import Icons from '../../../constants/Icons';
import ImageIcon from '../../../components/ImageIcon/ImageIcon';
import home from '../../../assets/icons/home.png';
import user from '../../../assets/icons/user.png';
import ViewGroups from '../../Screens/Group/ViewGroups';
import ViewLocations from '../../Screens/Location/ViewLocations';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={DASHBOARD_BOTTOM}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          return (
            <ImageIcon
              icon={Icons.dashboard}
              iconStyle={{
                height: 25,
                width: 25,
              }}
            />
          );
        },
        tabBarActiveTintColor: COLORS.activeBlue,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name={DASHBOARD_BOTTOM}
        component={Dashboard}
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            <ImageIcon
              icon={Icons.home}
              iconStyle={{
                height: 20,
                width: 20,
                tintColor: focused ? '#21a3f1' : COLORS.gray50,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={VIEW_GROUP}
        component={ViewGroups}
        options={{
          title: 'Groups',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            // <Image
            //   source={user}
            //   style={[
            //     styles.profile,

            //   ]}
            // />
            <ImageIcon
              icon={Icons.group}
              iconStyle={{
                height: 25,
                width: 25,
                tintColor: focused ? '#21a3f1' : COLORS.gray50,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={VIEW_LOCATION}
        component={ViewLocations}
        options={{
          title: 'Locations',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            <ImageIcon
              icon={Icons.locationGroup}
              iconStyle={{
                height: 25,
                width: 25,
                tintColor: focused ? '#21a3f1' : COLORS.gray50,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: 20,
    height: 20,
  },
  home: {
    width: 20,
    height: 20,
  },
  location: {
    width: 20,
    height: 20,
  },
});

export default BottomTabNavigator;
