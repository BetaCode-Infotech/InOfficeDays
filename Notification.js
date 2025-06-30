import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  StyleSheet,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function Notification() {
  useEffect(() => {
    createChannels();
    requestPermissions();
  }, []);
  

  const requestPermissions = () => {
    const grant = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (grant === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission Granted');
    } else {
      console.log('Permission Denied');
    }
  };
  const [name, setName] = useState('Rahul');

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'channel-1',
      channelName: 'Test Channel',
    });
  };

  const handleNotificationA = () => {
    PushNotification.localNotification({
      channelId: 'channel-1',
      title: 'You clicked on Button A',
      message: 'Hello ' + name + ' Your order is ready',
      color: 'red',
      vibrate: true,
      vibration: [0, 200, 100, 300], // Standardized pattern
    });
    Vibration.vibrate([0, 200, 100, 300]);
  };

  const handleNotificationB = () => {
    PushNotification.localNotification({
      channelId: 'channel-1',
      title: 'You clicked on Button A',
      message: 'Hello ' + name + ' Your order is ready',
      bigText: 'Thanks ' + name + ' for Ordering food from Button B store ',
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        multiline
        placeholder="e.g John Martin"
        onChangeText={val => setName(val)}
      />
      <Button
        title="Button A"
        onPress={() => {
          handleNotificationA();
        }}
      />
      <Button
        title="Button B"
        onPress={() => {
          handleNotificationB();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
});
