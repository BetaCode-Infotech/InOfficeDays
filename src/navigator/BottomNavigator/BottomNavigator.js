import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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
import CustomBottomTabBar from './CustomBottomNavigation';
import AllEvents from '../../Screens/AllEvents/AllEvents';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ProfileView from '../../Screens/Profile/ProfileView';

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
            <Icon
              name="home"
              size={25}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      />
      <Tab.Screen
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
            <Icon
              name="calendar"
              size={25}
              color={focused ? '#21a3f1' : COLORS.gray50}
            />
          ),
        }}
      />
      <Tab.Screen
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
      />

      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
