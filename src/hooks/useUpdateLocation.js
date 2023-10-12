
import {useEffect} from 'react';
import {getCurrentLocation, locationPermission} from '../utils/location';
import {updateProfile} from '../redux/actions/auth';
import {updateLocation} from '../redux/reducer/LocationUpdateSlice/locationUpdateSlice';
import { setItem } from '../utils/dataHandler';
import { useDispatch } from 'react-redux';

export const useUpdateLocation = () => {

    const dispatch = useDispatch();

    useEffect(() => {
    
    locationPermission()
      .then(async status => {
        if (status === 'granted') {
          const getLocation = await getCurrentLocation();
          updateProfile({
            latitude: getLocation?.coords.latitude,
            longitude: getLocation?.coords.longitude,
          });
          await setItem('LocationUpdated', true);
          dispatch(updateLocation(true));
        }
      })
      .catch(error => {
        console.log('error', error);
      });

  }, [dispatch]);
};
