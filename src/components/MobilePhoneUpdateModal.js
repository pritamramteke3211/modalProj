import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable, Platform} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';
import TextInputCustom from './TextInputCustom';
import CodeFiledInput from './../ui/otpVerification/CodeFieldInput';
import {rspH} from '../theme/responsiveSize';
import MainButton from './MainButton';
import {useDispatch, useSelector} from 'react-redux';
import imagePath from '../config/imagePath';
import {openMobileAlert} from '../redux/reducer/MobileNumberSlice/mobileNumberSlice';
import Loader from './Loader';
import {loginUserApi, updateProfile, verifyOtpApi} from '../redux/actions/auth';
import {DEVICE_TYPE} from '../config/constant';
import {updateAuthUserData} from '../redux/reducer/AuthSlice/authSlice';
import {setUserData} from '../utils/dataHandler';
import {showError, showSuccess} from '../utils/showMsg';
import {OtpSchema} from '../validation/validation';

const MobilePhoneUpdateModal = _ => {
  const handler = React.useRef();
  const enterOtp = React.useRef();
  const [number, setNumber] = React.useState();
  const [status, setStatus] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const {isOpen} = useSelector(state => state.mobileNumber.openReportSheet);
  const userData = useSelector(state => state.authUser.authUser);

  const dispatch = useDispatch();

  let platformType = Platform.OS === 'android' ? 2 : 1;

  React.useImperativeHandle(handler, () => ({
    getValue: otp => {
      enterOtp.current = otp;
    },
  }));

  const onPress = () => {
    status === 0 ? resendOtp() : verifyOtp();
  };

  const isSocialLogin = async () => {
    try {
      setLoading(true);
      await updateProfile({
        mobile: number,
      });
      setStatus(1);
      setLoading(false);
      showSuccess('Otp sent successfully');
    } catch (error) {
      showError(error.message);
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      if (userData?.loginType === 'google' || userData?.loginType === 'apple') {
        isSocialLogin();
        return;
      }
      setLoading(true);
      await loginUserApi({
        mobile: number,
        socialMediaId: userData?.socialMediaId,
        platformType: platformType,
        deviceType: platformType?.toString(),
        deviceToken: 'l',
        loginType: DEVICE_TYPE,
      });
      setStatus(1);
      setLoading(false);
      showSuccess('Otp sent successfully');
    } catch (error) {
      setStatus(0);
      setLoading(false);
      showError(error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const otpValidate = await OtpSchema.validate({
        otp: enterOtp.current,
        mobile: number,
      });
      setLoading(true);
      await verifyOtpApi(otpValidate);
      setLoading(false);
      dispatch(
        updateAuthUserData({...userData, mobile: number, isMobileVerify: 1}),
      );
      setUserData({...userData, mobile: number});
      dispatch(openMobileAlert({isOpen: false}));
    } catch (error) {
      setLoading(false);
      showError(error?.message);
    }
  };

  return (
    <Modal isVisible={isOpen}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            setStatus(0);
            dispatch(openMobileAlert({isOpen: false}));
          }}>
          <Image style={styles.image} source={imagePath.closex} />
        </Pressable>
        <Text style={commonStyles.fontBold16}>
          {'Mobile number is mandatory for this action.'}
        </Text>
        <TextInputCustom
          onChangeText={setNumber}
          maxLength={10}
          keyboardType="numeric"
          placeHolderString="Enter mobile number"
        />
        {status === 1 && (
          <View style={{marginVertical: rspH(1)}}>
            <Text style={commonStyles.fontBold16}>{'Enter OTP'}</Text>
            <CodeFiledInput containerStyle={{marginTop: 5}} ref={handler} />
          </View>
        )}
        <MainButton
          onPress={onPress}
          btnStyle={{marginTop: rspH(1)}}
          btnText={`${status === 0 ? 'Save' : 'Done'}`}
        />
        <Loader isLoading={isLoading} />
      </View>
    </Modal>
  );
};

export default MobilePhoneUpdateModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  image: {tintColor: colors.black, alignSelf: 'flex-end'},
});
