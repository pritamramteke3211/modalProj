import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  authUser: {
    firstName: '',
    accessToken: '',
    guest: false,
  },
};

export const authSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    updateAuthUserData: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateAuthUserData} = authSlice.actions;
export default authSlice.reducer;
