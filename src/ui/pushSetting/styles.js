import {StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import {rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const styles = StyleSheet.create({
  settingText: {
    ...commonStyles.fontBold24,
    marginTop: rspH(4.4),
  },
  chooseText: {
    ...commonStyles.fontSize14,
    marginTop: rspH(1),
  },
});

export default styles;
