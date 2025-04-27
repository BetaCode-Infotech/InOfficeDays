// src/utils/backgroundTask.js

import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import {Vibration} from 'react-native';

export const backgroundTask = async () => {
  // First, create notification channel
  createChannels();

  let status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 1, // Fetch interval in minutes
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      forceAlarmManager: true,
    },
    async taskId => {
      console.log('[BackgroundFetch] Received taskId: ', taskId);

      // Send a notification when any task is received
      handleNotification(`Task received: ${taskId}`);

      BackgroundFetch.finish(taskId);
    },
    async taskId => {
      console.log('[BackgroundFetch] TIMEOUT taskId:', taskId);
      BackgroundFetch.finish(taskId);
    },
  );

  // Optional: Schedule a custom task
  BackgroundFetch.scheduleTask({
    taskId: 'com.foo.customtask',
    forceAlarmManager: true,
    delay: 500, // milliseconds
  });
};

const createChannels = () => {
  PushNotification.createChannel(
    {
      channelId: 'test-channel', // ID
      channelName: 'Test Channel', // Name
      importance: 4, // Max importance
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback
  );
};

const handleNotification = message => {
  PushNotification.localNotification({
    channelId: 'test-channel',
    title: 'Background Task Triggered!',
    message: message,
    color: 'red',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
  });

  Vibration.vibrate([0, 200, 100, 300]);
};
export const backgroundHeadlessTask = async event => {
  console.log('[BackgroundFetch HeadlessTask] start: ', event.taskId);

  createChannels();
  handleNotification(`Headless Task received: ${event.taskId}`);

  BackgroundFetch.finish(event.taskId);
};
