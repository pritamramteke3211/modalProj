
import React from 'react';
import navigationString from '../config/navigationString';
import * as screens from '../ui/index';
import GuestTabRoutes from './GuestTabRoutes';

const showHeader = {headerShown: false};
export default function (Stack) {
  return (
    <>
      <Stack.Screen name={navigationString.TAB_ROUTES_GUEST} component={GuestTabRoutes} options={showHeader} />
      
      {/* <Stack.Screen name={navigationString.LOGIN_GUEST} component={screens.Login} options={showHeader} /> */}
      {/* <Stack.Screen name={navigationString.VERIFY_OTP} component={screens.OtpVerification} options={showHeader} /> */}
      {/* <Stack.Screen name={navigationString.REGISTER} component={screens.CreateProfile} options={showHeader} /> */}
    
    </>
  );
}
