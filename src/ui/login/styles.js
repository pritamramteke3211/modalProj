import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {rspW, rspH, rspF} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  socialBtContainer: {
    borderWidth: 0.5,
    borderColor: colors.d9,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginTop: rspH(1.84),
  },
  imageStyle: {width: 20, height: 20, marginStart: rspW(2)},

  socialTextStyle: {
    ...commonStyles.fontSize14,
    color: colors.light_black,
    fontFamily: fontFamily.medium,
    alignSelf: 'center',
    position: 'absolute',
    width: '90%',
    textAlign: 'center',
  },
  tappingDetail: {
    ...commonStyles.fontSize10,
    color: colors.grey_072,
    // marginTop: rspH(1.84),
    marginTop: rspH(1.84),

    // marginEnd: rspW(2),
    lineHeight: 20,
    fontSize: rspF(1.6),
  },
  socialContainer: {
    marginTop: rspH(4.4),
    // marginTop: rspH(1.1),
    justifyContent: 'center',
  },
  guestText: {
    ...commonStyles.fontSize14,
    color: colors.grey_072,
    alignSelf: 'center',
    marginTop: rspH(3.4),
  },
});

export default styles;
