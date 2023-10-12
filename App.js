import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState, useRef} from 'react'
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';
import { createNotificationListener, requestUserPermission } from './src/service/FirebaseService';
import { updateVersion } from './src/redux/actions/home';
import {Provider} from 'react-redux';
import { store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/navigation/Routes';


const App = () => {

  const apiUrl = Config.API_URL
  const [is_net_connect, setis_net_connect] = useState(false)
  const [isModalVisible, setModalVisible] = useState({
    isModalVisible: false,
    isForceUpdate: false,
  });

  const is_nt_conn = useRef(false)

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

  const init = async () => {
    await requestUserPermission();
    await createNotificationListener();
    await checkIsUpdateAvaible();
  };

  useEffect(() => {
    init()

    const unsubscribe = NetInfo.addEventListener((state) => {
     
      if (is_nt_conn.current != state.isConnected) {        
        is_nt_conn.current = state.isConnected
        console.log("is_nt_conn.current",is_nt_conn.current)
        setis_net_connect(state.isConnected)
      }
      
    });
    return () => {
      unsubscribe();
    }
  }, []);  


  return (
    <Provider store={store}>
      <SafeAreaProvider>
          {/* <Text>dsd</Text> */}
          <Routes/>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})