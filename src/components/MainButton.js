import * as React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle, Text} from 'react-native';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';


const MainButton = (props) => {
  const {btnText, btnStyle, onPress, ...rest} = props;
  return (
    <TouchableOpacity onPress={onPress}  mode="contained" style={[styles.container, btnStyle]} {...rest}>
      <Text
      style={styles.labelStyle}
      >{btnText}</Text>
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.themeColor,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
  },
  labelStyle: {...commonStyles.fontBold18, color: colors.white, 
    textAlignVertical: 'center',
    textAlign:'center',
},
});
