import { Text, View, Image, Pressable, Platform } from 'react-native'
import React,{useState, useEffect} from 'react'
import WrapperContainer from '../../components/WrapperContainer'
import { useSelector } from 'react-redux'
import BackButton from '../../components/BackButton'
import commonStyles from '../../utils/commonStyles'
import { moderateScaleVertical } from '../../theme/responsiveSize'
import colors from '../../theme/colors'
import strings from '../../config/lang'
import TextInputCustom from '../../components/TextInputCustom'
import FlexSBContainer from '../../components/FlexSBContainer'
import FastImage from 'react-native-fast-image'
import imagePath from '../../config/imagePath'
import MainButton from '../../components/MainButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFcmToken} from '../../service/FirebaseService';
import { validateNumber } from '../../validation/validation'
import { loginUserApi, updateProfile } from '../../redux/actions/auth'
import navigationString from '../../config/navigationString'
import { showError } from '../../utils/showMsg'
import styles from './styles'
import fontFamily from '../../theme/fontFamily'
import appleAuth from '@invertase/react-native-apple-authentication'
import { updateAuthUserData } from '../../redux/reducer/AuthSlice/authSlice'
import useSocialLogin from '../../hooks/useSocialLogin'
import { setUserData } from '../../utils/dataHandler'
import { T_AND_C } from '../../config/constant'
let platformType = Platform.OS === 'android' ? 2 : 1;

const Login = ({navigation}) => {
    
    const [isloading, setisLoading] = useState(false)
    const [mobileNumber, setmobileNumber] = useState("")
    const [showGif, setshowGif] = useState(false)

    const userData = useSelector(state => state.authUser.authUser);

    const {googleLogin} = useSocialLogin();

    const login = async () => {
        try {
          let device_token = await AsyncStorage.getItem('fcmToken');
          if (!device_token) {
            const fcmToken = await getFcmToken();
            device_token = fcmToken;
          }
          const validatedNumber = await validateNumber.validate(number?.toString());
          setisLoading(true);
          const loginDetail = await loginUserApi({
            mobile: validatedNumber,
            platformType: platformType,
            deviceType: platformType.toString(),
            deviceToken: device_token || '1234',
            loginType: DEVICE_TYPE,
          });
          setisLoading(false);
          navigation.navigate(navigationString.VERIFY_OTP, {loginDetail});
        } catch (error) {
            setisLoading(false);
            showError(error.message);
        }
      };

      const guestLogin = async () => {
        await setUserData({guest: true});
        dispatch(updateAuthUserData({guest: true}));
      };

      const createProfile = async (googleData) => {
        try {
          const formData = new FormData();
          formData.append('email', googleData.user.email);
          formData.append('firstName', googleData.user.givenName);
          googleData.user.familyName && formData.append('lastName', googleData.user.familyName);
          const update = await updateProfile(formData);
          setisLoading(false);
          let x = await AsyncStorage.getItem('userData');
          x = JSON.parse(x);
          dispatch(updateAuthUserData({...update, accessToken: x?.accessToken}));
        } catch (error) {
          setisLoading(false);
          showError((error).message);
        }
      };

      const onPressGoogleLogin = async () => {
        try {
          let device_token = await AsyncStorage.getItem('fcmToken');
          if (!device_token) {
            const fcmToken = await getFcmToken();
            device_token = fcmToken;
          }
          const googleData = await googleLogin();
          setisLoading(true);
          const loginDetail = await loginUserApi({
            socialMediaId: googleData.user.id,
            loginType: 'google',
            platformType: platformType,
            deviceType: platformType.toString(),
            deviceToken: device_token || '1234',
          });
          setisLoading(false);
          if (loginDetail?.firstName) {
            let x = await AsyncStorage.getItem('userData');
            x = JSON.parse(x);
            dispatch(updateAuthUserData({...loginDetail, accessToken: x?.accessToken}));
          } else {
            createProfile(googleData);
          }
        } catch (error) {
          console.log('errorerror', (error).message);
          setisLoading(false);
        }
      };
    

      const createProfileApple = async (appleUser) => {
        try {
          const formData = new FormData();
          formData.append('email', appleUser.email);
          formData.append('firstName', appleUser.firstName);
          appleUser.lastName && formData.append('lastName', appleUser.lastName);
          const update = await updateProfile(formData);
          setisLoading(false);
          let x = await AsyncStorage.getItem('userData');
          x = JSON.parse(x);
          dispatch(updateAuthUserData({...update, accessToken: x?.accessToken}));
        } catch (error) {
          setisLoading(false);
          showError(error.message);
        }
      };
    
      const appleLogin = async () => {
        let device_token = await AsyncStorage.getItem('fcmToken');
    
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
    
          const {email, identityToken, realUserStatus /* etc */} = appleAuthRequestResponse;
    
          if (identityToken) {
            console.log('appleAuthRequestResponse', JSON.stringify(appleAuthRequestResponse));
    
            if (!device_token) {
              const fcmToken = await getFcmToken();
              device_token = fcmToken;
            }
    
            // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
    
            const loginDetail = await loginUserApi({
              socialMediaId: appleAuthRequestResponse?.user,
              loginType: 'apple',
              platformType: platformType,
              deviceType: platformType.toString(),
              deviceToken: device_token || '1234',
            });
    
            if (loginDetail?.firstName) {
              let x = await AsyncStorage.getItem('userData');
              x = JSON.parse(x);
              dispatch(updateAuthUserData({...loginDetail, accessToken: x?.accessToken}));
            } else {
              let appleLoginApple = {
                id: appleAuthRequestResponse.user,
                email: email || '',
                firstName: appleAuthRequestResponse?.fullName?.givenName || '',
                lastName: appleAuthRequestResponse?.fullName?.familyName || '',
                profileStatus: '1',
              };
              createProfileApple(appleLoginApple);
              return;
            }
          } else {
          }
    
          if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
            console.log("I'm a real person!");
          }
        } catch (error) {
          if (error === appleAuth.Error.CANCELED) {
            console.warn('User canceled Apple Sign in.');
          } else {
            console.error(error);
          }
        }
      };

      const navigationToPolicy = (link) => {
        navigation.navigate(navigationString.WEBVIEW_SCREEN, {link});
      };

    useEffect(() => {
        if (mobileNumber?.length === 10 && !showGif) {
            setshowGif(true);
          } else if (showGif && mobileNumber?.length < 10) {
            setshowGif(false);
          }
    }, [mobileNumber,showGif])

    
  const SocialButton = ({btnText, icon, onPress}) => {
    return (
      <Pressable onPress={onPress} style={styles.socialBtContainer}>
        <Image style={styles.imageStyle} source={icon} />
        <Text style={styles.socialTextStyle}>{btnText}</Text>
      </Pressable>
    );
  };    
    

  return (
    <WrapperContainer isLoading={isloading} >
      <View style={{padding:20, flex:1}}>
        {!!userData?.guest && <BackButton/>}
        <Text style={{...commonStyles.fontBold24, marginTop: moderateScaleVertical(50)}}>{strings.let_start}</Text>
        <Text style={{...commonStyles.fontSize14, color: colors.grey_95, marginTop: moderateScaleVertical(10)}}>{strings.to_continue_phone_number}</Text>
        <View style={{marginTop: moderateScaleVertical(100)}}>
        <TextInputCustom returnKeyType="done" keyboardType={'numeric'} onChangeText={setmobileNumber} placeHolderString={strings.enter_phone_number} />

        <FlexSBContainer
        containerStyle={{
            marginTop: moderateScaleVertical(10),
          }}
        >
        <Image source={imagePath.fi_lock}/>
        <Text style={{...commonStyles.fontSize13}}>
              {strings.your_information} <Text style={{color: colors.themeColor}}>{'privacy policy'}</Text>
            </Text>
            <FastImage style={{width: 20, height: 20}} source={showGif ? imagePath.success : ''} />
        </FlexSBContainer>

        <MainButton
        onPress={() => {
            login();
          }}
          btnText={strings.continue}
          btnStyle={{marginTop: moderateScaleVertical(40)}}
        />
        <Text style={styles.tappingDetail}>
            {strings.tapping_to_continue}
            <Text onPress={() => navigationToPolicy(T_AND_C)} style={{fontFamily: fontFamily.bold, color: colors.light_black}}>
              {' Terms of Use'}
              <Text style={{fontFamily: fontFamily.regular}}>
                {' and '}
                <Text onPress={() => navigationToPolicy(T_AND_C)} style={{fontFamily: fontFamily.bold}}>
                  {'Privacy Policy'}
                </Text>
              </Text>
            </Text>
          </Text>
        </View>
        <View style={styles.socialContainer}>
        {
        Platform.OS === 'ios' &&
         <SocialButton onPress={appleLogin} icon={imagePath.apple} btnText={strings.continue_with_apple} />}
          <SocialButton onPress={onPressGoogleLogin} icon={imagePath.google} btnText={strings.continue_to_google} />
          {!userData?.guest && (
            <Text onPress={guestLogin} style={styles.guestText}>
              {strings.continue_to_guest}
            </Text>
          )}
        </View>
      </View>
    </WrapperContainer>
  )
}

export default Login
