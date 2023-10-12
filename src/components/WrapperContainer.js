import {  Platform, View, DeviceEventEmitter } from 'react-native'
import React,{useEffect} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import Loader from './Loader';
import { sendMessage } from '../redux/actions/home';

const WrapperContainer = ({
  children,
  isLoading = false,
  statusBarColor = colors.white,
  bodyColor = colors.white,
  barStyle = 'dark-content',
  removeBottomInset = false,
  translucent = false,
  removeBottomInsetActual = false,
}) => {

    const insets = useSafeAreaInsets();

    const displayNotification = async (remoteMessage) => {
       if (remoteMessage?.data?.type === '2' || remoteMessage?.data?.type === '1') {
        console.log('lineslineslineslineslines', remoteMessage);
        const x = await notifee.getDisplayedNotifications();
        const filter = x.find(item => item.id === remoteMessage?.data?.postId?.toString());
        let hasData = [];
        if (filter) {
          hasData = filter?.notification?.android?.style?.lines ?? [];
        }
        const channelId = await notifee.createChannel({
          id: remoteMessage?.data?.postId?.toString(),
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          badge: true,
          bypassDnd: true,
        });
  
        if (Platform.OS === 'ios') {
          await notifee.setNotificationCategories([
            {
              id: 'lines',
              summaryFormat: 'You have %u+ unread messages from %@.',
            },
          ]);
        }
  
        await notifee?.displayNotification({
          id: remoteMessage?.data?.postId?.toString(),
          body: remoteMessage?.data?.message,
          data: remoteMessage?.data,
          android: {
            channelId,
            color: colors.themeColor,
            category: AndroidCategory.SOCIAL,
            groupId: 'personal',
            style: {
              type: AndroidStyle.INBOX,
              lines: [remoteMessage?.data?.message, ...hasData],
              group: true,
            },
          },
          ios: {
            summaryArgument: 'lines',
            critical: true,
          },
        });
      } else if (remoteMessage?.data?.type === '4') {
        const x = await notifee.getDisplayedNotifications();
        const filter = x.find(item => item.id === remoteMessage?.data?.postId?.toString());
        let hasData = [];
        if (filter) {
          hasData = filter?.notification?.android?.style?.lines ?? [];
        }
        const channelId = await notifee.createChannel({
          id: remoteMessage?.data?.postId?.toString(),
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          badge: true,
          bypassDnd: true,
        });
        await notifee?.displayNotification({
          id: remoteMessage?.data?.postId?.toString(),
          title: remoteMessage?.data?.title,
          body: remoteMessage?.data?.message,
          data: remoteMessage?.data,
          android: {
            pressAction: {
              launchActivity: 'default',
              id: 'default',
            },
            channelId,
            color: colors.themeColor,
            category: AndroidCategory.SOCIAL,
            groupId: 'personal',
            style: {
              type: AndroidStyle.INBOX,
              lines: [remoteMessage?.data?.message, ...hasData],
              group: true,
            },
          },
        });
      }
    };

    const sendMessageApi = async (sendMessageData) => {
      const formData = new FormData();
      formData.append('message', sendMessageData?.input);
      const data = sendMessageData.notification?.data;
      if (data?.roomId) {
        formData.append('room', data?.roomId);
      }
      if (data?.postId) {
        formData.append('receiverId', data?.receiverId);
        formData.append('postId', data?.postId);
      }
      await sendMessage(formData);
    };

    useEffect(() => {
      const notificationListener =  DeviceEventEmitter.addListener('remotePush', remoteMessage => {
        setTimeout(() => {
          displayNotification(remoteMessage);
        }, 2000);
      });
      return () => {
        notificationListener.remove();
      };
    }, []);


    useEffect(() => {
      const sendMessageListener =  DeviceEventEmitter.addListener('sendMessage', (remoteMessage) => {
        setTimeout(() => {
          sendMessageApi(remoteMessage);
        }, 2000);
      });
      return () => {
        sendMessageListener.remove();
      };
    });
  




  return (
    <View
    style={{
        flex: 1,
        backgroundColor: statusBarColor,
        paddingTop: removeBottomInset ? 0 : insets.top,
        paddingBottom: Platform.OS === 'ios' ? 0 : removeBottomInset ? 0 : insets.bottom,
    }}
    >
        <FocusAwareStatusBar
        translucent={translucent}
        backgroundColor={statusBarColor}
        barStyle={barStyle}
        />
        <View
        style={{
            backgroundColor:bodyColor,
            flex: 1
        }}
        >
            {children}
        </View>
      <Loader isLoading={isLoading} />
    </View>
  )
}

export default WrapperContainer
