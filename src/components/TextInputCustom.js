import * as React from 'react';
import { TextInput } from 'react-native';
import colors from '../theme/colors';
import commonStyles from '../utils/commonStyles';

const TextInputCustom = (props) => {
  const {textInputStyle, placeHolderString, onChangeText, ...rest} = props;

  return <TextInput placeholderTextColor={colors.grey} placeholder={placeHolderString} onChangeText={onChangeText} style={[{...commonStyles.fontSize16, borderBottomWidth: 0.7}, textInputStyle]} {...rest} />
};

export default TextInputCustom;
