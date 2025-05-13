import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import styles from './ProfileStyles';
import profile from '../../../assets/icons/profile.png';
import location from '../../../assets/icons/gps.png';
import people from '../../../assets/icons/people.png';
import LinearGradient from 'react-native-linear-gradient';
import ellipse from '../../../assets/icons/ellipse.png';
import {GROUP, LOCATION} from '../../utils/Routes/Routes';
// import BottomTabNavigator from '../../navigator/BottomNavigator/BottomNavigator'

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.profileIconWrapper}>
        <Image source={ellipse} style={styles.ellipse} />
        <Image source={profile} style={styles.profileIcon} />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(GROUP)}>
          <LinearGradient colors={['#4567F3', '#AA95FA']} style={styles.button}>
            <View style={styles.buttonInner}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Add Group</Text>
                <View style={styles.iconWrapper}>
                  <Image source={people} style={styles.icon} />
                </View>
              </View>
            </View>

            <Text style={styles.buttonText1}>Add Group to get started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate(LOCATION)}>
          <LinearGradient colors={['#4567F3', '#AA95FA']} style={styles.button}>
            <View style={styles.buttonInner}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Add Location</Text>
                <View style={styles.iconWrapper}>
                  <Image source={location} style={styles.icon} />
                </View>
              </View>
            </View>

            <Text style={styles.buttonText1}>Capture your location</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
      {/* <BottomTabNavigator /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  profileIconWrapper: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  ellipse: {
    width: 49,
    height: 49,
  },
  profileIcon: {
    position: 'absolute',
    width: 49,
    height: 49,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  button: {
    borderRadius: 15,
    marginVertical: 15,
    width: 350,
    height: 200,
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
  },
  buttonText1: {
    color: 'white',
    fontSize: 20,
    paddingBottom: 20,
  },
  iconWrapper: {
    backgroundColor: '#ffffff20',
    borderRadius: 15,
    padding: 8,
    borderWidth: 0.4,
    borderColor: 'white',
    elevation: 6,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
