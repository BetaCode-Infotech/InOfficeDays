import {NativeModules, PermissionsAndroid, Platform} from 'react-native';

const {LocationServiceModule} = NativeModules;

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const fineGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    const backgroundGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    const fgsLocationGranted = await PermissionsAndroid.request(
      'android.permission.FOREGROUND_SERVICE_LOCATION',
    );
    return (
      fineGranted === PermissionsAndroid.RESULTS.GRANTED &&
      backgroundGranted === PermissionsAndroid.RESULTS.GRANTED &&
      fgsLocationGranted === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const startLocationService = () => {
  LocationServiceModule.startService();
};

export const stopLocationService = () => {
  LocationServiceModule.stopService();
};
