import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {
  height,
  rspW,
  rspH,
  rspF,
  width,
  scrn_width,
  scrn_height,
} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  flexContainerBack: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: rspH(2.5),
  },
  postImage: {width: 60, height: 60, borderRadius: 10, borderWidth: 1},
  flexContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingBottom: rspH(2.5),
  },
  input: {
    // backgroundColor: colors.grey,
    flex: 1,
    // marginLeft: rspW(-0),
    marginBottom: rspH(-0),
    paddingLeft: rspW(2.6),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  sendContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  sendText: {
    ...commonStyles.fontBold18,
    marginEnd: rspW(2.6),
    marginBottom: rspH(6),
    color: colors.themeColor,
    borderWidth: 0,
  },
  inputContainer: {
    maxHeight: 200,
    marginBottom: rspH(1),
    marginHorizontal: 10,
    borderRadius: 40,
    backgroundColor: 'white',
    elevation: 1,
  },

  micIcon: {
    width: 28,
    height: 28,
    marginEnd: 10,
    marginBottom: 7,
  },

  customInputContainer: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    flex: 1,
    marginHorizontal: rspH(1),
  },

  userImage: {
    width: 20,
    height: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  time: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fontFamily.medium,
    padding: 2,
  },

  messageText: {
    color: colors.white,
    fontSize: rspF(14),
    fontFamily: fontFamily.medium,
    padding: 5,
  },

  bubbleContainer: {marginBottom: 20, paddingBottom: 20},

  backgroundImageContainer: {
    width: scrn_width,
    height: scrn_height,
    position: 'absolute',
  },

  markAsComplete: {
    backgroundColor: colors.themeColor,
    width: 120,
    padding: 4,
    borderRadius: 4,
    ...commonStyles.fontSize13,
    textAlign: 'center',
    color: colors.white,
    marginTop: rspH(1),
    overflow: 'hidden',
  },

  reportBtn: {
    ...commonStyles.fontBold16,
    borderWidth: 1,
    paddingVertical: 15,
    flex: 1,
    marginHorizontal: rspW(2.6),
    textAlign: 'center',
    borderRadius: 10,
    borderColor: colors.grey_95,
    color: colors.grey_black,
  },

  acceptBtn: {
    ...commonStyles.fontBold16,
    paddingVertical: 15,
    flex: 1,
    marginHorizontal: rspW(2.6),
    textAlign: 'center',
    borderRadius: 10,
    color: colors.white,
    backgroundColor: colors.themeColor,
  },

  acceptContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    padding: 10,
    width: '100%',
  },
  flexContainerAccept: {marginTop: rspH(30), justifyContent: 'flex-start'},
  userDetailItemContainer: {
    backgroundColor: colors.dim_grey,
    width: 180,
    height: 180,
    borderRadius: 100,
    alignSelf: 'center',
  },
  userDetailContainer: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  frame: {alignSelf: 'center', marginTop: rspH(2.5)},
  gender: {width: 20, height: 20, resizeMode: 'contain'},
  user: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: rspH(1.84),
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderSendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailParentContainer: {
    flex: 0.5,
    width: '100%',
    position: 'absolute',
    height: 200,
  },
});

export default styles;
