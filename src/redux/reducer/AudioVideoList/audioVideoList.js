import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  photos: [],
  video: '',
};

export const audioVideoList = createSlice({
  name: 'postFeed',
  initialState,
  reducers: {
    capturePhotos: (state, action) => {
      state.photos = [...action.payload];
    },
    recordedVideo: (state, action) => {
      state.video = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {capturePhotos, recordedVideo} = audioVideoList.actions;
export default audioVideoList.reducer;
