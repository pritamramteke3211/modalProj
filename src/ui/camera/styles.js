import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {height, rspW, rspH, rspF, width} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  camera: {flex: 1},
  captureImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginHorizontal: rspW(2.6),
    marginVertical: rspH(1),
  },
});

export default styles;
