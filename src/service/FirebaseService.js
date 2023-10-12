import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { DeviceEventEmitter, Platform } from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import NavigationService from './NavigationService';



const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      try {
        if (Platform.OS == 'ios') {
          const apn = await messaging().getAPNSToken()
        }
      
        const x = await messaging().getToken();
       
        if (x) {
          await AsyncStorage.setItem('fcmToken', x);
        }
        return x;
      } catch (error) {
        console.log(error, 'error in fcmToken');
      }
    }
    return fcmToken;   
}

const requestUserPermission = async () =>{
    const authStatus = await messaging().requestPermission();

    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  if (enabled) {
    await getFcmToken();
  }

}

 const createNotificationListener = async () => {
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('Notification caused app to open from background state bla bla:', remoteMessage);
  });

  let timeOut = null;
  messaging().onMessage(async remoteMessage => {
    if (timeOut == null) {
      try {
        timeOut = setTimeout(() => {
          timeOut = null;
          saveNotificationData(remoteMessage);
          localDisplayNotification(remoteMessage);
        }, 4000);
      } catch (error) {console
        .log('error===>>>>>>>', error);
      }
    } else {
      timeOut = null;
      clearTimeout(timeOut);
    }
  });

  const saveNotificationData = async (remoteMessage) => {
    if (remoteMessage?.data?.type === '3') {
      await AsyncStorage.setItem('messageCount', 'true');
      dispatch(messageTabCount({messageTabCount: 1}));
    } else {
      dispatch(notificationTabCount({notificationTabCount: 1}));
      await AsyncStorage.setItem('notificationCount', 'true');
    }
  };

  // Call When user click notification when app is in background
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('remote message', remoteMessage);
      }
    });

  /**
   * When user click on notification when user is in forground
   */
  notifee.onForegroundEvent(({type, detail}) => {
    console.log('type', type);
    console.log('detail', detail);
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        onPressForeground(type, detail);
        break;
      case 2:
        DeviceEventEmitter.emit('sendMessage', detail);
    }
  });

  const onPressForeground = (type, detail) => {
    setTimeout(() => {
      NavigationService.navigate(navigationString.NOTIFICATION);
    }, 2000);
  };
};

messaging().onTokenRefresh((fcmToken) => {
  console.log('New token refresh: ', fcmToken);
});

const localDisplayNotification = async (remoteMessage) => {
  DeviceEventEmitter.emit('remotePush', remoteMessage);
}



export { requestUserPermission, createNotificationListener }