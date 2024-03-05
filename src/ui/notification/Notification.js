/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
import * as React from 'react';
import {Text, View, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RefreshControl, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import FlexSBContainer from '../../components/FlexSBContainer';
import WrapperContainer from '../../components/WrapperContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {notificationApi} from '../../redux/actions/home';
import {notificationTabCount} from '../../redux/reducer/DotSlice/dotSlice';
import colors from '../../theme/colors';
import {rspW} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import MessageShimmer from '../message/MessageShimmer';
import styles from './styles';
dayjs.extend(relativeTime);

const Notification = _ => {
  const {navigation} = _;
  const [notificationsList, setNotificationList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getNotificationListing();
  }, []);

  React.useEffect(() => {
    navigation?.addListener('focus', async () => {
      await AsyncStorage.setItem('notificationCount', 'false');
      dispatch(notificationTabCount({notificationTabCount: 0}));
    });
  }, []);

  const getNotificationListing = async () => {
    try {
      setLoading(true);
      const notifications = await notificationApi();
      setNotificationList(notifications?.listing);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onPressNotification = item => {
    let {post, type} = item;
    if (type === 3) {
      navigation?.navigate(navigationString.CHAT, {
        item: {...post, status: 1, roomId: item.room},
      });
    } else {
      navigation.navigate(navigationString.SINGLE_POST, {
        postData: [{...post, hideBottom: true, post_info: {id: post?.id}}],
      });
    }
  };

  const renderNotification = ({item, _}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressNotification(item)}
        style={styles.notificationItemContainer}>
        <FlexSBContainer containerStyle={{justifyContent: 'flex-start'}}>
          <FastImage
            style={styles.userImage}
            source={
              item?.otherUser?.profilePic
                ? {uri: FILE_BASE_URL + item?.otherUser?.profilePic}
                : imagePath.placeholder
            }
          />
          <View
            style={{
              flex: 1,
              marginStart: rspW(2),
            }}>
            <Text style={{...commonStyles.fontSize13}}>
              {item?.otherUser?.firstName + ' ' + item?.otherUser?.lastName}
            </Text>
            <Text style={{...commonStyles.fontSize13}}>
              {item?.description}
            </Text>
          </View>
          <Text style={{...commonStyles.fontSize12, color: colors.grey_95}}>
            {dayjs().to(item?.updatedAt)}
          </Text>
        </FlexSBContainer>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = React.useCallback(() => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={commonStyles.fontBold16}>{'No Notification found '}</Text>
      </View>
    );
  }, []);

  const Header = React.useCallback(() => {
    return (
      <>
        <View style={styles.notificationTextContainer}>
          <Text style={commonStyles.fontBold24}>{'Notification'}</Text>
        </View>
      </>
    );
  }, []);

  if (isLoading) {
    return (
      <WrapperContainer>
        <Header />
        <MessageShimmer />
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer bodyColor={colors.e5}>
      <Header />
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={notificationsList}
        style={{flexGrow: 1}}
        renderItem={renderNotification}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={getNotificationListing}
          />
        }
      />
    </WrapperContainer>
  );
};

export default Notification;
