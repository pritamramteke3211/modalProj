import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import FlexSBContainer from '../../components/FlexSBContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {getUserStories} from '../../redux/actions/home';
import colors from '../../theme/colors';
import {rspW, rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import StoriesSlide from '../stories/StoriesSlide';

const ProfileDetailHeader = React.forwardRef((_, ref) => {
  const {detail} = _;
  const userData = useSelector(state => state.authUser.authUser);
  const navigation = useNavigation();
  const editProfile = () => navigation.navigate(navigationString.EDIT_PROFILE);
  const statusRef = React.useRef();
  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getMyStories();
  }, []);

  React.useImperativeHandle(ref, () => {
    return {
      getMyStories,
    };
  });

  const getMyStories = async () => {
    try {
      const {listing} = await getUserStories(userData?.id);
      if (listing.length > 0) {
        const generateEmergencyData = [
          {
            user_post: listing,
            firstName: userData?.firstName + ' ' + userData?.lastName,
            lastName: '',
            profilePic:
              userData?.profilePic.split(FILE_BASE_URL)[
                userData?.profilePic.split(FILE_BASE_URL).length - 1
              ],
          },
        ];
        setStories(generateEmergencyData);
      } else {
        setStories([]);
      }
    } catch (error) {}
  };

  const PostNeedDoneOther = ({
    title,
    titleValue,
    descriptionValue,
    color,
    completed,
  }) => {
    return (
      <View
        style={{
          borderEndWidth: title === 'Help others' ? 0 : 1,
          borderEndColor: colors.lineGrey,
          paddingEnd: 20,
        }}>
        <Text style={{...commonStyles.fontSize12, color: colors.grey_072}}>
          {title}
        </Text>
        <Text style={{...commonStyles.fontBold20, marginTop: rspH(1)}}>
          {titleValue}{' '}
          {completed != null && (
            <Text
              style={{
                ...commonStyles.fontSize12,
              }}>{`/ ${completed} completed`}</Text>
          )}
        </Text>
        <Text
          style={{
            ...commonStyles.fontSize12,
            color: colors.grey_95,
            marginTop: rspH(1),
          }}>
          <Text style={{color: color}}>{`+${descriptionValue}`}</Text>{' '}
          {' in week'}
        </Text>
      </View>
    );
  };

  const onPressImage = () => {
    stories?.length && statusRef.current?._handleStoryItemPress(0);
  };

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate(navigationString.SETTING)}>
          <Image source={imagePath.fi_settings} />
        </Pressable>
        <View style={{marginTop: rspH(6)}}>
          <Pressable onPress={onPressImage} style={styles.profileContainer}>
            <FastImage
              style={{
                ...styles.profile,
                borderWidth: stories?.length > 0 ? 4 : 0,
                borderColor: colors.themeColor,
              }}
              source={
                userData?.profilePic
                  ? {uri: userData?.profilePic}
                  : imagePath.placeholder
              }
            />
            <Image style={styles.emergency} source={imagePath.emergency} />
          </Pressable>
          <FlexSBContainer containerStyle={{justifyContent: 'center'}}>
            <Text
              style={
                commonStyles.fontBold20
              }>{`${userData?.firstName} ${userData?.lastName}`}</Text>
            <Image style={styles.male} source={imagePath.male} />
          </FlexSBContainer>
          <Pressable onPress={editProfile}>
            <Image style={styles.frame} source={imagePath.Frame} />
          </Pressable>
          <View style={{marginTop: rspH(4.4)}}>
            <Text
              style={{...commonStyles.fontBold16, color: colors.grey_black}}>
              {'Profile Insights'}
            </Text>
            <Text style={{...commonStyles.fontSize12, color: colors.grey_95}}>
              {'Visible to anyone on or off helper'}
            </Text>
          </View>
          <FlexSBContainer containerStyle={{marginTop: rspH(26)}}>
            <PostNeedDoneOther
              title="Post as needy"
              titleValue={detail?.postNeedy}
              completed={detail?.postNeedyCompleted}
              descriptionValue={detail?.postNeedyweak ?? '0'}
              color={colors.green}
            />
            <PostNeedDoneOther
              title="Post as donar"
              titleValue={detail?.postdoner}
              completed={detail?.postdonerCompleted}
              descriptionValue={detail?.postdonerweak ?? '0'}
              color={colors.green}
            />
            <PostNeedDoneOther
              title="Help others"
              titleValue={detail?.helpother}
              descriptionValue={detail?.helpotherweak ?? '0'}
              color={colors.error}
            />
          </FlexSBContainer>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.postTextContainer}>
        <Text style={{...commonStyles.fontBold16, color: colors.grey_black}}>
          {'Post'}
        </Text>
        <Text style={{...commonStyles.fontSize12, color: colors.grey_95}}>
          {'Visible to anyone on or off helper'}
        </Text>
      </View>
      <StoriesSlide refreshList={getMyStories} data={stories} ref={statusRef} />
    </View>
  );
});

export default ProfileDetailHeader;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 1,
  },
  profileContainer: {width: 110, height: 110, alignSelf: 'center'},
  emergency: {position: 'absolute', bottom: 0, end: 0},
  line: {height: 10, backgroundColor: colors.e5},
  male: {width: 20, height: 20, marginStart: rspW(2.6)},
  frame: {alignSelf: 'center', marginTop: rspH(2.5)},
  postTextContainer: {marginTop: rspH(1), padding: 20},
});
