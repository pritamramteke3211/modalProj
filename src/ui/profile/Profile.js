import * as React from 'react';
import {View, StyleSheet, FlatList, RefreshControl, Text} from 'react-native';
import {useSelector} from 'react-redux';
import MarkAsComplete from '../../components/MarkAsCompleteModal';
import WrapperContainer from '../../components/WrapperContainer';
import {profileDetailFeed, getWhoMessageMe} from '../../redux/actions/home';
import colors from '../../theme/colors';
import commonStyles from '../../utils/commonStyles';
import FeedItem from '../home/FeedItem';
import HomeSkeltonView from '../home/HomeSkeletonView';
import ProfileDetailHeader from './ProfileDetailHeader';
import EditTextModal from '../../components/EditTextModal';

const Profile = _ => {
  const [profileDetail, setProfileDetail] = React.useState();
  const [isLoading, setLoading] = React.useState(false);
  const handler = React.useRef();
  const markAsCompleteRef = React.useRef();
  const setModalState = useSelector(state => state?.markAsSold?.setModalState);
  const storiesRef = React.useRef();

  React.useImperativeHandle(handler, () => {
    return {
      getProfileDetail,
    };
  });

  React.useEffect(() => {
    getProfileDetail();
  }, []);

  React.useEffect(() => {
    getListOfHelpers();
  }, [setModalState]);

  const getListOfHelpers = async () => {
    try {
      setLoading(true);
      const {listing} = await getWhoMessageMe(setModalState?.postId);
      setLoading(false);
      if (Array.isArray(listing) && listing.length > 0) {
        markAsCompleteRef?.current?.setUsers(
          listing[0]?.request,
          setModalState?.postId,
        );
      } else {
        markAsCompleteRef?.current?.setUsers([], setModalState?.postId);
      }
      setModalState?.isModalVisible &&
        markAsCompleteRef?.current?.setVisibility(true);
    } catch (error) {
      setLoading(false);
    }
  };

  const getProfileDetail = async () => {
    try {
      setLoading(true);
      const detail = await profileDetailFeed();
      if (detail) {
        setProfileDetail(detail);
      }
      setLoading(false);
    } catch (error) {}
  };

  const onRefreshScreen = () => {
    getProfileDetail();
    storiesRef?.current?.getMyStories();
  };

  const renderPost = React.useCallback(({item, index}) => {
    return <FeedItem ref={handler} key={index} item={item} index={index} />;
  }, []);

  const ItemSeparatorComponent = React.useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const EmptyComponent = React.useCallback(() => {
    return isLoading ? (
      <HomeSkeltonView />
    ) : (
      <View style={styles.noPostContainer}>
        <Text style={styles.noPostStyle}>{'No Post found'}</Text>
      </View>
    );
  }, [isLoading]);

  return (
    <WrapperContainer>
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={EmptyComponent}
          data={profileDetail?.feeds}
          initialNumToRender={4}
          windowSize={10}
          collapsable={true}
          contentContainerStyle={{flexGrow: 1}}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderPost}
          keyExtractor={feed => feed.id.toString()}
          ListHeaderComponent={
            <ProfileDetailHeader ref={storiesRef} detail={profileDetail} />
          }
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={[colors.themeColor, colors.black]}
              onRefresh={onRefreshScreen}
            />
          }
        />
      </View>
      <MarkAsComplete onSubmit={onRefreshScreen} ref={markAsCompleteRef} />
      <EditTextModal onRefreshScreen={onRefreshScreen} />
    </WrapperContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {flex: 1},
  separator: {
    backgroundColor: colors.light_purple,
    width: '100%',
    height: 8,
    marginVertical: 10,
  },
  noPostStyle: {...commonStyles.fontBold16, textAlign: 'center'},
  noPostContainer: {flex: 1, justifyContent: 'center'},
});
