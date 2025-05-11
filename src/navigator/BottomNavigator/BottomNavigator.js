import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import React from 'react';
import {StyleSheet,Image} from 'react-native';
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
  WATCH_LIST,
} from '../../utils/Routes/Routes';
// import ImageIcon from '../../../components/ImageIcon/ImageIcon';

import Dashboard from '../../Screens/Dashboard/Dashboard';
import {COLORS} from '../../../constants/theme';
import Icons from '../../../constants/Icons';
import ImageIcon from '../../../components/IconButton/IconButton';
// import CustomBottomTabBar from './CustomBottomNavigation';
// import AllEvents from '../../Screens/AllEvents/AllEvents';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
// import ProfileView from '../../Screens/Profile/ProfileView';
import LocationScreen from '../../Screens/LocationScreen/LocationScreen';
import ProfileScreen from '../../Screens/Dashboard/Dashboard';
// import calendar from '../../../assets/icons/calendar.png';
import home from '../../../assets/icons/home.png';
import location from '../../../assets/icons/gps.png';
import user from '../../../assets/icons/user.png';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={DASHBOARD_BOTTOM}
      // tabBar={props => <CustomBottomNavigation {...props} />}
      //   tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          return (
            <ImageIcon
              icon={Icons.dashboard}
              iconStyle={{
                height: 25,
                width: 25,
                // tintColor: '#21a3f1',
              }}
            />
            // <HomeOutlined />
            // <Icon name="rocket" size={30} color="#900" />
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
            // <ImageIcon
            //   icon={Icons.dashboard}
            //   iconStyle={{
            //     height: 20,
            //     width: 20,
            //     // tintColor: focused ? '#21a3f1' : COLORS.gray60,
            //   }}
            // />
            <Image
              source={home}
              style={styles.home}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name={ALL_EVENTS}
        component={AllEvents}
        options={{
          title: 'Events',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            // <ImageIcon
            //   icon={Icons.settings_blue}
            //   iconStyle={{
            //     height: 25,
            //     width: 25,
            //     // tintColor: focused ? '#21a3f1' : COLORS.gray60,
            //   }}
            // />
            <Image
              source={calendar}
              size={25}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      /> */}


      
      {/* <Tab.Screen
        name={PROFILE_VIEW}
        component={ProfileView}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            // <ImageIcon
            //   icon={Icons.settings_blue}
            //   iconStyle={{
            //     height: 25,
            //     width: 25,
            //     // tintColor: focused ? '#21a3f1' : COLORS.gray60,
            //   }}
            // />
            <Icon
              name="user"
              size={25}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      /> */}



      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={location}
              style={styles.location}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      />

      <Tab.Screen
        name={PROFILE_VIEW}
        component={ProfileScreen} // This is my screen
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused, size, color}) => (
            <Image
              source={user}
              style={styles.profile}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      />

      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  profile:{
    width: 20,
    height: 20,
  },
  home:{
    width: 20,
    height: 20,
  },
  location:{
    width: 20,
    height: 20,
  }
})

export default BottomTabNavigator;
