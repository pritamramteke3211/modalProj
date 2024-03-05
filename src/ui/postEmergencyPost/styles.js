import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {rspH, rspW} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  container: {flex: 0, width: '100%'},
  textInput: {
    ...commonStyles.fontSize14,
    flex: 1,
    textAlignVertical: 'top',
    // color: colors.light_black,
    color: colors.light_black,
    padding: 20,
    lineHeight: 60,
  },
  continueButton: {
    backgroundColor: colors.themeColor,
    paddingHorizontal: rspW(2),
    paddingVertical: rspH(1),
    borderRadius: 10,
  },

  sheetContainer: {
    
    marginTop: -rspH(4),
    backgroundColor: 'green',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    // borderWidth:1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2122,
    // },
    // // shadowColor: colors.black,
    // shadowOpacity: 0.75,
    // shadowRadius: 16.0,
    // elevation: 24,

    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 3,
},
shadowOpacity: 0.27,
shadowRadius: 4.65,

elevation: 6,

  },
  videoContainer: {
    width: 400,
    height: 300,
    borderWidth: 1,
  },

  micIcon: {
    width: 50,
    height: 50,
    marginEnd: 10,
    marginBottom: 7,
  },
});

export default styles;
