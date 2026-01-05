import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Button,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
//   import Geolocation from 'react-native-geolocation-service';
//   import BackgroundJobs, {backgroundTask} from './BackgroundJobs';
//   import Notification from './Notification';
import Notification from '../../../Notification';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    // Step 1:  Configure BackgroundFetch as usual.
    backgroundTask();
  }, []);

  // const backgroundTask = async () => {
  //   let status = await BackgroundFetch.configure(
  //     {
  //       minimumFetchInterval: 1,
  //     },
  //     async taskId => {
  //       // <-- Event callback
  //       // This is the fetch-event callback.
  //       console.log('[BackgroundFetch] taskId: ', taskId);

  //       // Use a switch statement to route task-handling.
  //       switch (taskId) {
  //         case 'com.foo.customtask':
  //           print('Received custom task');
  //           break;
  //         default:
  //           print('Default fetch task');
  //       }
  //       // Finish, providing received taskId.
  //       BackgroundFetch.finish(taskId);
  //     },
  //     async taskId => {
  //       // <-- Task timeout callback
  //       // This task has exceeded its allowed running-time.
  //       // You must stop what you're doing and immediately .finish(taskId)
  //       BackgroundFetch.finish(taskId);
  //     },
  //   );

  //   // Step 2:  Schedule a custom "oneshot" task "com.foo.customtask" to execute 5000ms from now.
  //   BackgroundFetch.scheduleTask({
  //     taskId: 'com.foo.customtask',
  //     forceAlarmManager: true,
  //     delay: 500, // <-- milliseconds
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Notification />
      {/* <BackgroundJobs /> */}
      <View style={styles.infoContainer}>
        {location ? (
          <Text>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
        <Button title="Get Location" onPress={getLocation} />
      </View>

      {/* Render Map Only If Location is Available */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01, // Closer zoom
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="My Location"
            description="Current location"
          />
        </MapView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  infoContainer: {padding: 16},
  map: {width: '100%', height: '80%'},
});

export default LocationScreen;
