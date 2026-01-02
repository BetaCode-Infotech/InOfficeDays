// src/utils/backgroundTask.js

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid, Platform, Vibration} from 'react-native';
import {useSelector} from 'react-redux';
import {store} from './src/Redux/Store';
import axios from 'axios';
import Axios from './src/utils/Axios';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {
  deleteOldBackgroundActivities,
  setBackgroundActivity,
} from './src/Redux/Action/getAllGroupData';
import {bufferRadius} from './constants/Fns';
const {LocationServiceModule} = NativeModules;
const locationEventEmitter = new NativeEventEmitter(LocationServiceModule);

export const backgroundTask = async () => {
  createNotificationChannels();

  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 1, // 30 min is Android's actual reliable min interval
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      forceAlarmManager: true,
    },
    async taskId => {
      await handleBackgroundTask(`Task received: ${taskId}`);
      BackgroundFetch.finish(taskId);
    },
    async taskId => {
      BackgroundFetch.finish(taskId);
    },
  );

  BackgroundFetch.scheduleTask({
    taskId: 'com.foo.customtask',
    forceAlarmManager: true,
    delay: 1000,
  });
};

export const createNotificationChannels = () => {
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
        resolve({latitude, longitude});
      },
      error => {
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

    const radiusInMeters = parseFloat(loc.RADIUS) + bufferRadius; // assumed in meters

    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      targetLat,
      targetLng,
    );
    return distance <= radiusInMeters;
  });
};
function formatDateToDDMMYYYY(isoDate) {
  const date = new Date(isoDate);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  // Format the date as DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

const handleBackgroundTask = async location => {
  const state = store.getState();
  console.log('sadljasdlasdasdas', state);

  let locationData = state.locationData.locationList;
  let backgroundActivityData =
    state.backgroundActivityData.backgroundActivityList;

  if (
    backgroundActivityData.some(
      val =>
        val.LAST_DELETED_AT instanceof Date &&
        val.LAST_DELETED_AT.getDate() < new Date().getDate(),
    ) ||
    !backgroundActivityData.some(item => 'LAST_DELETED_AT' in item)
  ) {
    store.dispatch(deleteOldBackgroundActivities());
    backgroundActivityData =
      state.backgroundActivityData.backgroundActivityList;
  }
  const today = new Date();
  const filteredLocationData = locationData.filter(location => {
    return !backgroundActivityData.some(
      activity =>
        activity.GROUP_ID === location.GROUP_ID &&
        // activity.LOCATION_ID === location._id &&
        formatDateToDDMMYYYY(activity.DATE) === formatDateToDDMMYYYY(today),
    );
  });

  const hasPermission = await requestLocationPermission();
  console.log('adjnasdnasdsa', hasPermission);
  
  if (!hasPermission) {
    return;
  }

  let data;
  if (location) {
    data = location;
  } else {
    data = await getCurrentLatLong();
  }
  const matches = findMatchingLocations(data, filteredLocationData);
  console.log('dasaskdasdsaasd', matches, data, filteredLocationData);

  let payload = [];

  if (matches && matches.length > 0) {
    matches.map(val => {
      payload.push({
        GROUP_ID: val.GROUP_ID,
        LOCATION_ID: val._id,
        DATE: new Date(),
        DATA_PUSHED_TO_SERVER: false,
      });
    });

    pushDataToServer(payload);
    // Push notification with lat/long
  }
};
const pushDataToServer = async payload => {
  await axios
    .post(Axios.axiosUrl + Axios.incrementAchievement, payload)
    .then(response => {
      store.dispatch(setBackgroundActivity(payload));

      if (response.data.some(val => val.incremented == true)) {
        const NotificationData = response.data.filter(
          val => val.incremented == true,
        );
        NotificationData.forEach(val => {
          sendNotification(
            val.notificationData.NOTIFICATION_TITLE,
            val.notificationData.NOTIFICATION_DESCRIPTION,
            'red',
          );
        });

        // store.dispatch(setBackgroundActivity(payload));
      }
    })
    .catch(err => {
      console.log('asdasdasdas1', err);
    });
};

const sendNotification = async (title, message, color) => {
  PushNotification.localNotification({
    channelId: 'channel-1',
    title: title,
    message: message,
    color: color,
    vibrate: true,
    vibration: [0, 200, 100, 300], // Standardized pattern
  });
  Vibration.vibrate([0, 200, 100, 300]);
};

export const backgroundHeadlessTask = async event => {
  createNotificationChannels();
  handleBackgroundTask(); // Placeholder for actual message

  BackgroundFetch.finish(event.taskId);
};
const isBetweenMidnightAndOneAM = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 0 && hours < 1;
};

export const startListeningForLocation = () => {
  // if (isBetweenMidnightAndOneAM()) {
  //   store.dispatch(deleteOldBackgroundActivities());
  // }

  const subscription = locationEventEmitter.addListener(
    'locationUpdate',
    location => {
      console.log('jknkjnnjnjknjk', location);

      handleBackgroundTask(location);
    },
  );

  return () => {
    subscription.remove();
  };
};

export const requestNotificationPermissions = async () => {
  try {
    const grant = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (grant === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
      // Ask the user if they'd like to grant it again
      Alert.alert(
        'Permission Needed',
        'This app needs notification permission to keep you updated. Would you like to enable it?',
        [
          {
            text: 'Ask Again',
            onPress: () => requestNotificationPermissions(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    }
  } catch (err) {
    console.warn(err);
  }
};
