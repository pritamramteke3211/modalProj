import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  splashAndBoarding: true,
};

export const logoutSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    userLogout: (state, action) => {
      state.splashAndBoarding = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {userLogout} = logoutSlice.actions;
export default logoutSlice.reducer;
