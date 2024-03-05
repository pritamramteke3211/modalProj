import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const getCurrentLocation = () =>
  new Promise(async (resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        reject(error.message);
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });

export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
      return;
    }
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return resolve('granted');
        }
        return reject('Location Permission denied');
      })
      .catch(error => {
        console.log('Ask Location permission error: ', error);
        return reject(error);
      });
  });
