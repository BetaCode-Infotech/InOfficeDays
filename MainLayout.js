import {View, Text, PermissionsAndroid, Alert} from 'react-native';
import React, {useEffect} from 'react';
import StackNavigator from './src/navigator/Stack/StackNavigator';
import {RenderDataOnLoad} from './src/utils/RenderDataOnLoad';
import {backgroundTask} from './BackgroundJobs';
// import RenderDataOnLoad from './src/utils/RenderDataOnLoad';
import {
  startLocationService,
  stopLocationService,
  requestLocationPermission,
} from './src/utils/NativeLocationService';
const MainLayout = () => {
  useEffect(() => {
    // requestPermissions();
    console.log("main layout");
    requestLocationPermission().then(granted => {
      console.log("sjcjsdhjhj", granted);
      if (granted) {
        console.log('All permissions granted');
        startLocationService();
        backgroundTask();
      }
    }).catch(err => {
      console.error('Error requesting permissions:', err);
     
    }
    );
  }, []);
  
  

  const requestLocationPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Step 1: Request fine and coarse location first
        const fineCoarseGranted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fineGranted =
          fineCoarseGranted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!fineGranted) {
          console.warn('Fine location permission denied');
          Alert.alert(
            'Location Required',
            'Please allow location permission to use the app.',
            [
              {
                text: 'Try Again',
                onPress: () => requestLocationPermissions(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
          return false;
        }

        // Step 2: Request background location separately (after fine location is granted)
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Background location permission granted.');
          return true;
        } else {
          console.warn('❌ Background location permission denied.');
          Alert.alert(
            'Background Location Required',
            'We need background location to run services when the app is in background.',
            [
              {
                text: 'Grant Permission',
                onPress: () => requestLocationPermissions(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
          return false;
        }
      } catch (err) {
        console.error('🚨 Permission error:', err);
        return false;
      }
    } else {
      console.log('🟢 iOS platform – handled in Info.plist.');
      return true;
    }
  };

  const requestPermissions = async () => {
    try {
      const grant = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (grant === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted....');
      } else if (grant === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Permission Denied');
        // Ask again with explanation
        Alert.alert(
          'Permission Required',
          'We need notification permission to keep you updated.',
          [
            {
              text: 'Try Again',
              onPress: () => requestPermissions(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      } else if (grant === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Permission set to never ask again');
        Alert.alert(
          'Permission Required',
          'Please enable notification permission from settings.',
          [{text: 'OK'}],
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <RenderDataOnLoad />
      <StackNavigator />
    </>
  );
};

export default MainLayout;
