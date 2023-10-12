import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { getItem, getUserData } from '../utils/dataHandler';
import { updateLocation } from '../redux/reducer/LocationUpdateSlice/locationUpdateSlice';
import { messageTabCount } from '../redux/reducer/DotSlice/dotSlice';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { _navigator, isReadyRef } from '../service/NavigationService';
import MainScreen from './MainScreen';
import GuestScreen from './GuestScreen';
import AuthScreen from './AuthScreen';
import { MenuProvider } from 'react-native-popup-menu';


const Stack = createStackNavigator();

const Routes = () => {

    const userData = useSelector(state => state.authUser.authUser)

    const splashAndBoarding = useSelector(state => state.logout.splashAndBoarding);
  
    console.log('userData', userData);
  
    const dispatch = useDispatch();
  
    React.useEffect(() => {
        (async () => {
          try {
            const user = await getUserData();
            const locationUpdated = await getItem('LocationUpdated');
            const messageCount = await getItem('messageCount');
            if (user) {
              dispatch(updateAuthUserData(user));
              dispatch(updateLocation(!!locationUpdated));
            }
            if (messageCount) {
              dispatch(messageTabCount({messageTabCount: true}));
            }
            SplashScreen.hide();
          } catch (error) {}
        })();
      }, [dispatch]);
    

  return (
    <NavigationContainer
    onReady={()=> {
      isReadyRef.current = true
    }}
    ref={_navigator}
    >
  <MenuProvider>
    <Stack.Navigator
    screenOptions={{
      animationEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
      cardOverlayEnabled: true,
      presentation: 'modal',
    }}
    >
      <>
      {GuestScreen(Stack)}
      </>
     {/* {userData?.firstName && userData?.accessToken ? 
     <>
     {MainScreen(Stack)}</> : 
     userData?.guest ?
      <>{GuestScreen(Stack)}</>
       : 
      <>{AuthScreen(Stack, splashAndBoarding)}</>
      }  */}
      </Stack.Navigator>
      </MenuProvider>
    </NavigationContainer>
  )
}

export default Routes

const styles = StyleSheet.create({})