import { Text, View,Pressable, Animated} from 'react-native';
import React from 'react';
import WrapperContainer from '../../components/WrapperContainer';
import FlexSBContainer from '../../components/FlexSBContainer';
import { moderateScale } from '../../theme/responsiveSize';
import styles from './styles';
import imagePath from '../../config/imagePath';
import commonStyles from '../../utils/commonStyles';
import { StackActions } from '@react-navigation/native';
import navigationString from '../../config/navigationString';

const OnBoarding = ({navigation}) => {
 
  const [currentPosition, setPosition] = React.useState(0);
  
  const TEXT = React.useMemo(() => {
    return {
      0: 'Swipe left',
      1: 'Swipe right or left',
      2: 'Swipe right or left',
    };
  }, []);


  return (
    <WrapperContainer>
      <View style={styles.dotStyle}>
        <FlexSBContainer>
          <Pressable onPress={() => 
          {
            
          }
          }>
            {currentPosition == 0 ? (
              <Animated.Image
                style={{marginStart: moderateScale(20),}}
                source={imagePath.backward}
              />
            ) : (
              <View style={{flex: 1, width: 100}} />
            )}
          </Pressable>
          <Animated.Text style={commonStyles.fontSize14}>
            {TEXT[currentPosition]}
          </Animated.Text>
          <Pressable onPress={() => 
          {
            navigation.dispatch(StackActions.replace(navigationString.REGISTER))
          }
          }>
            <Animated.Image
              style={{marginEnd: moderateScale(20)}}
              source={imagePath.forward}
            />
          </Pressable>
        </FlexSBContainer>
      </View>
    </WrapperContainer>
  );
};

export default OnBoarding;


