import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import BackButton from '../../components/BackButton';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../config/imagePath';
import colors from '../../theme/colors';
import commonStyles from '../../utils/commonStyles';
import MainButton from '../../components/MainButton';
import {rspH} from '../../theme/responsiveSize';
import {useDispatch, useSelector} from 'react-redux';

import navigationString from '../../config/navigationString';
import {ScrollView} from 'react-native-gesture-handler';
import {_navigator} from '../../service/NavigationService';
import {openMobileAlert} from '../../redux/reducer/MobileNumberSlice/mobileNumberSlice';
import MobilePhoneUpdateModal from '../../components/MobilePhoneUpdateModal';

const PostType = _ => {
  const {navigation} = _;
  const [helpOrDonate, setNeedHelpOrDonate] = React.useState(true);
  const userData = useSelector(state => state.authUser.authUser);

  const name = _.route?.params?.type;

  const dispatch = useDispatch();

  const goToPostType = () => {
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({isOpen: true}));
      return;
    }
    navigation.navigate(navigationString.POST_FEED, {
      helpOrDonate: helpOrDonate ? 1 : 2,
      type: name,
    });
  };

  return (
    <WrapperContainer>
      <ScrollView>
        <View style={{padding: 20}}>
          <BackButton />
          <Text
            style={{
              ...commonStyles.fontBold24,
              marginTop: rspH(4.4),
              marginBottom: rspH(1),
            }}>
            {'What is your purpose'}
          </Text>
          <Text
            style={{
              ...commonStyles.fontSize14,
              color: colors.grey,
              marginEnd: '30%',
              marginBottom: rspH(6),
            }}>
            {'Choose a mode depending onwhat you’re looking for.'}
          </Text>
          <Pressable
            onPress={() => setNeedHelpOrDonate(true)}
            style={{marginBottom: rspH(30)}}>
            <Image style={styles.imgView} source={imagePath.i_need_help_new} />
            {helpOrDonate && <View style={styles.helperView} />}
          </Pressable>
          <Pressable onPress={() => setNeedHelpOrDonate(false)}>
            <Image
              style={styles.imgView}
              source={imagePath.i_want_to_donate_new}
            />
            {!helpOrDonate && <View style={styles.helperView} />}
          </Pressable>
        </View>
        <MainButton
          onPress={goToPostType}
          btnStyle={styles.mainBtn}
          btnText="Continue"
        />
      </ScrollView>
      <MobilePhoneUpdateModal />
    </WrapperContainer>
  );
};

export default PostType;

const styles = StyleSheet.create({
  container: {},
  mainBtn: {marginHorizontal: 20, marginVertical: rspH(30)},
  helperView: {
    position: 'absolute',
    width: '100%',
    borderColor: colors.blue_light,
    borderWidth: 3,
    height: 190,
    borderRadius: 20,
  },
  imgView: {width: '100%', height: 190, resizeMode: 'stretch'},
});
