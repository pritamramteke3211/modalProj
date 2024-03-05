import * as React from 'react';
import {Text, View, StyleSheet, Image, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FlexSBContainer from '../../components/FlexSBContainer';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {feedDislike, feedLike} from '../../redux/actions/home';
import {setModalVisibility} from '../../redux/reducer/MarkAsSold/markAsSoldSlice';
import {openMobileAlert} from '../../redux/reducer/MobileNumberSlice/mobileNumberSlice';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {rspW, rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import NavigationService from '../../service/NavigationService';
import {authSliceSelector} from '../../redux/reducer/AuthSlice/authSlice';
import {showError} from '../../utils/showMsg';
import {useDispatch, useSelector} from 'react-redux';

const buttonText = {
  1: 'Help',
  2: "i'm here",
  3: 'Completed',
};

const ButtonAndLikeContainer = props => {
  const {item} = props;

  // const navigation = useNavigation();
  const [likeDislikeCount, setLikeDislikeCount] = React.useState({
    likeCount: item?.likeCount ?? 0,
    dislikeCount: item?.dislikeCount ?? 0,
  });
  const [isLikedPost, setIsLikedPost] = React.useState(item?.likestatus);
  const [isDisLikePost, setDisLikePost] = React.useState(item?.dislikestatus);
  const userData = useSelector(state => state.audio.authUser);
  const myId = item?.user?.id === userData?.id;
  const isCompleted = item?.status ? 'Completed' : 'Mark as complete';
  const dispatch = useDispatch();
  const Join = item?.isAdmin === 1 && item?.isJoin === 0 && item?.url;

  React.useEffect(() => {
    setLikeDislikeCount({
      likeCount: item?.likeCount ?? 0,
      dislikeCount: item?.dislikeCount ?? 0,
    });
    setIsLikedPost(item?.likestatus);
    setDisLikePost(item?.dislikestatus);
  }, [item]);

  const openMarkAsComplete = () => {
    !item?.default &&
      dispatch(setModalVisibility({postId: item?.id, isModalVisible: true}));
  };

  const onPressHelp = () => {
    if (item?.isAdmin === 1 && item?.isJoin !== 0) {
      return;
    }

    if (item?.isAdmin === 1) {
      NavigationService.navigate(navigationString.WEBVIEW_PERMOTION, {
        url: item?.url,
        id: userData?.id,
      });
      return;
    }

    if (myId) {
      isCompleted !== 'Completed' && openMarkAsComplete();
      return;
    }
    if (item?.status === 1) {
      return;
    }

    if (userData?.guest) {
      NavigationService.navigate(navigationString.MESSAGE);
      return;
    }

    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({isOpen: true}));
      return;
    }
    NavigationService.navigate(navigationString.CHAT, {
      item: {...item, postId: item?.id},
    });
  };

  const updateState = data =>
    setLikeDislikeCount({...likeDislikeCount, ...data});

  const likePost = async () => {
    if (userData?.guest) {
      return;
    }
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({isOpen: true}));
      return;
    }
    try {
      if (isLikedPost) {
        updateState({likeCount: likeDislikeCount.likeCount - 1});
        setIsLikedPost(false);
      } else {
        if (isDisLikePost) {
          updateState({
            likeCount: likeDislikeCount.likeCount + 1,
            dislikeCount: likeDislikeCount.dislikeCount - 1,
          });
        } else {
          updateState({likeCount: likeDislikeCount.likeCount + 1});
        }
        setIsLikedPost(true);
      }
      setDisLikePost(false);
      await feedLike({id: item?.id?.toString()});
    } catch (error) {
      showError(error.message);
    }
  };

  const dislikePost = async () => {
    if (userData?.guest) {
      return;
    }
    try {
      if (isDisLikePost) {
        updateState({dislikeCount: likeDislikeCount.dislikeCount - 1});
        setDisLikePost(false);
      } else {
        if (isLikedPost) {
          updateState({
            dislikeCount: likeDislikeCount.dislikeCount + 1,
            likeCount: likeDislikeCount.likeCount - 1,
          });
        } else {
          updateState({dislikeCount: likeDislikeCount.dislikeCount + 1});
        }
        setDisLikePost(true);
      }
      setIsLikedPost(false);
      await feedDislike({id: item?.id?.toString()});
    } catch (error) {
      showError(error.message);
    }
  };

  // item?.isAdmin === 1 && console.log('item?.isAdmin', item?.isAdmin, item?.isJoin, item?.url);

  if (item?.isAdmin === 1 && !item?.url) {
    return;
  }

  return (
    <View style={styles.container}>
      <FlexSBContainer containerStyle={{marginTop: rspH(2)}}>
        <TouchableOpacity onPress={onPressHelp} style={[styles.button]}>
          <Text
            onPress={onPressHelp}
            style={{
              ...commonStyles.fontSize12,
              fontFamily: fontFamily.bold,
              color: colors.white,
            }}>
            {myId
              ? isCompleted
              : item?.status === 1
              ? 'Completed'
              : buttonText[item?.type]
              ? buttonText[item?.type]
              : Join
              ? 'Join'
              : 'Joined'}
          </Text>
        </TouchableOpacity>
        {item?.isAdmin !== 1 && (
          <FlexSBContainer>
            <Pressable onPress={likePost}>
              <Image
                style={{
                  tintColor: isLikedPost ? colors.themeColor : colors.grey,
                }}
                source={imagePath.ic_like}
              />
            </Pressable>
            <Text
              style={{...commonStyles.fontSize14, marginHorizontal: rspW(2.6)}}>
              {likeDislikeCount?.likeCount}
            </Text>
            <Pressable onPress={dislikePost}>
              <Image
                style={{tintColor: isDisLikePost ? colors.error : colors.grey}}
                source={imagePath.Union}
              />
            </Pressable>
            <Text
              style={{...commonStyles.fontSize14, marginHorizontal: rspW(2.6)}}>
              {likeDislikeCount?.dislikeCount}
            </Text>
          </FlexSBContainer>
        )}
      </FlexSBContainer>
    </View>
  );
};

export default React.memo(ButtonAndLikeContainer);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: colors.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
