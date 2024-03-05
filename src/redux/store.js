import {configureStore} from '@reduxjs/toolkit';
import authSlice from './reducer/AuthSlice/authSlice';
import logoutSlice from './reducer/LogoutSlice/logoutSlice';
import audioSlice from './reducer/AudioSlice/audioSlice';
import audioVideoList from './reducer/AudioVideoList/audioVideoList';
// import homeRefreshSlice from './reducer/HomeRefresh/homeRefreshSlice';
import locationUpdateSlice from './reducer/LocationUpdateSlice/locationUpdateSlice';
// import reportSlice from './reducer/ReportSlice/reportSlice';
// import markAsSoldSlice from './reducer/MarkAsSold/markAsSoldSlice';
import mobileNumberSlice from './reducer/MobileNumberSlice/mobileNumberSlice';
import dotSlice from './reducer/DotSlice/dotSlice';
import editPostSlice from './reducer/ReportSlice/editPostSlice';

export const store = configureStore({
  reducer: {
    authUser: authSlice,
    logout: logoutSlice,
    audio: audioSlice,
    audioVideoList: audioVideoList,
    // homeRefresh: homeRefreshSlice,
    locationUpdate: locationUpdateSlice,
    // reportSheet: reportSlice,
    // markAsSold: markAsSoldSlice,
    mobileNumber: mobileNumberSlice,
    dotSlice: dotSlice,
    editPostSlice: editPostSlice,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
