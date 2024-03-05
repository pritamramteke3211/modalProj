import {PermissionsAndroid} from 'react-native';

export const getAudioPermission = new Promise(async (resolve, reject) => {
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      resolve(true);
    } else {
      reject(false);
      // console.log('All required permissions not granted');
      // return;
    }
  } catch (err) {
    reject(false);
    console.warn(err);
    // return;
  }
});
