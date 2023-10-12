import * as React from 'react';
import {Platform, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import WrapperContainer from '../../components/WrapperContainer';
import BackButton from '../../components/BackButton';
import commonStyles from '../../utils/commonStyles'
import { moderateScaleVertical } from '../../theme/responsiveSize';
import colors from '../../theme/colors';
import { loginUserApi, verifyOtpApi } from '../../redux/actions/auth';
import { showError, showSuccess } from '../../utils/showMsg';
import CodeFieldInput from './CodeFieldInput';
import Counter from './Counter';
import MainButton from '../../components/MainButton';
import styles from './styles';
import { OtpSchema } from '../../validation/validation';
import { updateAuthUserData } from '../../redux/reducer/AuthSlice/authSlice';
import SuccessMessageModal from './SuccessMesasageModal';

const OtpVerification = (props) => {
  const {navigation, route} = props;
  const {loginDetail} = route?.params ?? {};
  const enterOtp = React.useRef();
  const handler = React.useRef();
  const [isLoading, setLoading] = React.useState(false);
  const [sendCode, setSendCode] = React.useState(false);
  const successModalRef = React.useRef();
  const dispatch = useDispatch();
  let platformType = Platform.OS === 'android' ? 2 : 1;
  // const {hash, otp, message, timeoutError, stopListener, startListener} = useOtpVerify({numberOfDigits: 6});


  React.useImperativeHandle(handler, () => ({
    getValue: (otp) => {
      enterOtp.current = otp;
    },
    timeStop: () => {
      setSendCode(true);
    },
  }));

  const resendOtp = async () => {
    try {
      setLoading(true);
      await loginUserApi({
        mobile: loginDetail?.mobile,
        platformType: platformType,
        deviceType: platformType?.toString(),
        deviceToken: 'l',
        loginType: DEVICE_TYPE,
      });
      setLoading(false);
      setSendCode(false);
      showSuccess('Otp sent successfully');
    } catch (error) {
      setLoading(false);
      showError((error).message);
    }
  };

  const verifyOtp = async () => {
    try {
      const otpValidate = await OtpSchema.validate({otp: enterOtp.current, mobile: loginDetail?.mobile});
      setLoading(true);
      const result = await verifyOtpApi(otpValidate);
      setLoading(false);
      successModalRef.current?.setVisibleModal();
      setTimeout(() => {
        if (!result?.firstName) {
          navigation?.navigate(navigationString.REGISTER);
        } else {
          dispatch(updateAuthUserData({...loginDetail, otpVerified: true}));
        }
        successModalRef.current?.setCloseModal();
      }, 4000);
    } catch (error) {
      setLoading(false);
      showError(error?.message);
    }
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <View style={{flex: 1, padding: 15}}>
        <BackButton />
        <Text style={{...commonStyles.fontBold28, marginTop: moderateScaleVertical(40)}}>{'Enter the phone\nverification code'}</Text>
        <Text onPress={resendOtp} style={{...commonStyles.fontSize16, color: colors.grey, marginTop: moderateScaleVertical(10)}}>
          {`We sent a code to (+91) ${loginDetail?.mobile}. \n Didn't receive the code?`}
          {sendCode && <Text style={{...commonStyles.fontSize15BlueBold}}>{' Send again'}</Text>}
        </Text>
        <View style={{marginTop: moderateScaleVertical(60)}}>
          <CodeFieldInput ref={handler} />
          <Counter start={sendCode} ref={handler} />
        </View>
    </View>
      <View style={styles.btnContainer}>
        <MainButton onPress={verifyOtp} btnText="Verify" />
      </View>
      <SuccessMessageModal  ref={successModalRef} />
    </WrapperContainer>
  );
};

export default OtpVerification;
