// src/utils/backgroundTask.js

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform, Vibration} from 'react-native';
import {useSelector} from 'react-redux';
import {store} from './src/Redux/Store';
import axios from 'axios';
import Axios from './src/utils/Axios';

export const backgroundTask = async () => {
  createChannels();

  let status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // 15 min is Android's actual reliable min interval
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      forceAlarmManager: true,
    },
    async taskId => {
      console.log('[BackgroundFetch] Received taskId: ', taskId);
      await handleNotification(`Task received: ${taskId}`);
      BackgroundFetch.finish(taskId);
    },
    async taskId => {
      console.log('[BackgroundFetch] TIMEOUT taskId:', taskId);
      BackgroundFetch.finish(taskId);
    },
  );

  BackgroundFetch.scheduleTask({
    taskId: 'com.foo.customtask',
    forceAlarmManager: true,
    delay: 1000,
  });
};

const createChannels = () => {
  PushNotification.createChannel(
    {
      channelId: 'channel-1', // ID
      channelName: 'Test Channel', // Name
      importance: 4, // Max importance
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback
  );
};

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const fineGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const coarseGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    let backgroundGranted = PermissionsAndroid.RESULTS.GRANTED;

    if (Platform.Version >= 30) {
      backgroundGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
    }

    return (
      fineGranted === PermissionsAndroid.RESULTS.GRANTED &&
      coarseGranted === PermissionsAndroid.RESULTS.GRANTED &&
      backgroundGranted === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

const getCurrentLatLong = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        resolve({latitude, longitude});
      },
      error => {
        console.error('Location error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Filters locations where current position is inside the radius
 */
const findMatchingLocations = (currentLocation, locationData) => {
  const {latitude, longitude} = currentLocation;

  return locationData.filter(loc => {
    const targetLat = loc.LOCATION.latitude;
    const targetLng = loc.LOCATION.longitude;
    const radiusInMeters = parseFloat(loc.RADIUS); // assumed in meters

    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      targetLat,
      targetLng,
    );

    return distance <= radiusInMeters;
  });
};

const handleBackgroundTask = async message => {
  const state = store.getState();
  const locationData = state.locationData.locationList;

  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.log('Location permission denied');
    return;
  }

  const data = await getCurrentLatLong();

  const matches = findMatchingLocations(data, locationData);

  let payload = [];
  if (matches && matches.length > 0) {
    matches.map(val => {
      payload.push({
        GROUP_ID: val.GROUP_ID,
        LOCATION_ID: val._id,
      });
    });

    await axios
      .post(Axios.axiosUrl + Axios.incrementAchievement, payload)
      .then(response => {
        console.log('asdasdasdas', response.data);
        sendNotification(
          'Background Location Update!',
          `${message}\nLat: ${data.latitude}\nLng: ${data.longitude}`,
          'red',
        );
      })
      .catch(err => {
        console.log('asdasdasdas', err);
      });
    console.log('Matching Locations:', matches);
    console.log('locationData', locationData, data);

    // Push notification with lat/long
  }
};

const sendNotification = async (title, message, color) => {
  PushNotification.localNotification({
    channelId: 'channel-1',
    title: title,
    message: message,
    color: color,
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
  });

  // Vibration.vibrate([0, 200, 100, 300]);
};

export const backgroundHeadlessTask = async event => {
  console.log('[BackgroundFetch HeadlessTask] start: ', event.taskId);

  createChannels();
  handleBackgroundTask(`Headless Task received: ${event.taskId}`);

  BackgroundFetch.finish(event.taskId);
};
