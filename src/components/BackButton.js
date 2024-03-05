import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, Image} from 'react-native';
import imagePath from '../config/imagePath';
import colors from '../theme/colors';
import fontFamily from '../theme/fontFamily';
import commonStyles from '../utils/commonStyles';
import FlexSBContainer from './FlexSBContainer';

const BackButton = _ => {
  const {onCustomPress} = _;
  const navigation = useNavigation();
  return (
    <FlexSBContainer
      onPress={() => {
        onCustomPress && onCustomPress();
        !onCustomPress && navigation.goBack();
      }}
      containerStyle={{justifyContent: 'flex-start'}}>
      <Image
        style={{width: 20, height: 20, resizeMode: 'contain'}}
        source={imagePath.back}
      />
      <Text
        style={{
          ...commonStyles.fontSize14,
          fontFamily: fontFamily.bold,
          color: colors.black,
        }}>
        {'Back'}
      </Text>
    </FlexSBContainer>
  );
};

export default BackButton;
