import React from 'react';
import {Text, TouchableOpacity, Image, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import styles from './ProfileStyles';
import profile from '../../../assets/icons/profile.png';
import location from '../../../assets/icons/gps.png';
import people from '../../../assets/icons/people.png';
import LinearGradient from 'react-native-linear-gradient';
// import BottomTabNavigator from '../../navigator/BottomNavigator/BottomNavigator'

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.profileIconWrapper}>
        <Image source={profile} style={styles.profileIcon} />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AddGroup')}>
          <LinearGradient colors={['#8e2de2', '#4a00e0']} style={styles.button}>
            <Image source={people} style={styles.icon} />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.buttonText}>Step 1: Add Group</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddLocation')}>
          <LinearGradient colors={['#8e2de2', '#4a00e0']} style={styles.button}>
            <Image source={location} style={styles.icon} />
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.buttonText}>Step 2: Add Location</Text>
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
  profileIconWrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 15,
    marginVertical: 15,
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
  icon:{
    width:55,
    height:55,
    tintColor: '#ffffff'
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
