import {Button, Linking, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';
import {
  createNotificationListener,
  requestUserPermission,
} from './src/service/FirebaseService';
import {updateVersion} from './src/redux/actions/home';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Routes from './src/navigation/Routes';
import {rspF, rspW} from './src/theme/responsiveSize';
import FlashMessage from 'react-native-flash-message';
import fontFamily from './src/theme/fontFamily';

const App = () => {
  const apiUrl = Config.API_URL;
  const [is_net_connect, setis_net_connect] = useState(false);
  const [isModalVisible, setModalVisible] = useState({
    isModalVisible: false,
    isForceUpdate: false,
  });

  const is_nt_conn = useRef(false);

  const checkIsUpdateAvaible = async () => {
    try {
      const x = await updateVersion(Platform.OS === 'android' ? '1' : '2');

      if (VERSION < x?.version) {
        if (x?.force_update === '1') {
          setModalVisible({
            isModalVisible: true,
            isForceUpdate: true,
          });
        } else {
          setModalVisible({
            isModalVisible: true,
            isForceUpdate: false,
          });
        }
      }
    } catch (error) {}
  };

  const openGoogleMaps = () => {
    // 21.1774071, 79.6456982

    const latitude = 21.1774071; // Replace with your desired latitude
    const longitude = 79.6456982; // Replace with your desired longitude

    // const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const init = async () => {
    await requestUserPermission();
    await createNotificationListener();
    await checkIsUpdateAvaible();
  };

  useEffect(() => {
    init();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (is_nt_conn.current != state.isConnected) {
        is_nt_conn.current = state.isConnected;
        console.log('is_nt_conn.current', is_nt_conn.current);
        setis_net_connect(state.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Routes />
      </SafeAreaProvider>
      <FlashMessage
        titleStyle={{
          marginRight: rspW(5),
          fontFamily: fontFamily.medium,
          fontSize: rspF(2.2),
        }}
        position="top"
        floating
      />
    </Provider>
  );
};

export default App;
