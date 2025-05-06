/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import BackgroundFetch from 'react-native-background-fetch';
import { backgroundHeadlessTask } from './BackgroundJobs';
// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//   },
// });
// BackgroundFetch.registerHeadlessTask(backgroundHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
