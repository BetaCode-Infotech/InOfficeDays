import PushNotification from 'react-native-push-notification';

const configurePushNotification = () => {
  PushNotification.configure({
    onNotification: function (notification) {},
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'ALKLKAMLKM', // Unique ID
      name: 'Default Channel',
      importance: 4, // High importance
    },
    created => console.log(`Channel created: ${created}`),
  );
};

const showLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'default-channel',
    title: title,
    message: message,
  });
};

export {configurePushNotification, showLocalNotification};
