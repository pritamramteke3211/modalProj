import {StyleSheet} from 'react-native';
import colors from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import {rspF} from '../theme/responsiveSize';

export const hitSlopProp = {
  top: 12,
  right: 12,
  left: 12,
  bottom: 12,
};
export default StyleSheet.create({
  fontSize10: {
    fontSize: rspF(1.56),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize12: {
    // fontSize: rspF(12),
    fontSize: rspF(1.8),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize13: {
    fontSize: rspF(1.88),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize13Italic: {
    fontSize: rspF(1.88),
    color: colors.black,
    fontFamily: fontFamily.italic,
  },

  fontSize15: {
    fontSize: rspF(2.1),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize15Medium: {
    fontSize: rspF(2.1),
    color: colors.black,
    fontFamily: fontFamily.medium,
  },

  fontSize14: {
    fontSize: rspF(2.1),
    color: colors.grey,
    fontFamily: fontFamily.regular,
  },

  fontSize14Black: {
    fontSize: rspF(2.1),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontSize15Blue: {
    fontSize: rspF(2.1),
    color: colors.blue_light,
    fontFamily: fontFamily.regular,
  },

  fontSize15BlueBold: {
    fontSize: rspF(2.1),
    color: colors.themeColor,
    fontFamily: fontFamily.bold,
  },

  fontSize16: {
    fontSize: rspF(2.34),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },

  fontBold28: {
    fontSize: rspF(3.9),
    color: colors.light_black,
    fontFamily: fontFamily.bold,
  },
  fontBold32: {
    fontSize: rspF(32),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize18: {
    fontSize: rspF(2.7),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize20: {
    fontSize: rspF(20),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold20: {
    fontSize: rspF(20),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize24: {
    fontSize: rspF(3.6),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize25: {
    fontSize: rspF(25),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize26: {
    fontSize: rspF(26),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold16: {
    fontSize: rspF(2.34),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold18: {
    fontSize: rspF(2.7),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold24: {
    fontSize: rspF(3.6),
    color: colors.light_black,
    fontFamily: fontFamily.bold,
  },
  fontBold36: {
    fontSize: rspF(36),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontBold38: {
    fontSize: rspF(38),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSize35: {
    fontSize: rspF(35),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontSize38: {
    fontSize: rspF(38),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
  fontBold21: {
    fontSize: rspF(21),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  fontSemiBold15: {
    fontSize: rspF(2.1),
    color: colors.black,
    fontFamily: fontFamily.semibold,
  },
  fontSemiBold16: {
    fontSize: rspF(2.34),
    color: colors.black,
    fontFamily: fontFamily.semibold,
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clip: {
    fontFamily: fontFamily.regular,
    marginEnd: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    overflow: 'hidden',
    color: colors.textColor,
    backgroundColor: colors.clipBg,
    fontSize: rspF(1.88),
  },
  flexGrowContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    flex: 1,
  },
});
