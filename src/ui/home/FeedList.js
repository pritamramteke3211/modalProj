import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ScrollView,
  AppState,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import FlexSBContainer from '../../components/FlexSBContainer';
import MainButton from '../../components/MainButton';
import {getCausesList, homeApi} from '../../redux/actions/home';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {rspW, rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import FeedItem from './FeedItem';
import HomeSkeltonView from './HomeSkeletonView';
import {updateProfile} from '../../redux/actions/auth';
import navigationString from '../../config/navigationString';
import FastImage from 'react-native-fast-image';
import {FILE_BASE_URL} from '../../config/constant';
import {ActivityIndicator} from 'react-native';
import {showError} from '../../utils/showMsg';
import {locationUpdateSliceSelector} from '../../redux/reducer/LocationUpdateSlice/locationUpdateSlice';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentLocation} from '../../utils/location';

const viabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const FeedHeaderComponent = ({causes, showOwnPost, navigation}) => {
  return (
    <View style={{}}>
      <View style={styles.containerI}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {causes.map((item, index) => {
            return (
              <FlexSBContainer
                onPress={() =>
                  navigation.navigate(navigationString.TAGS_FEED, {tag: item})
                }
                key={index}
                containerStyle={styles.categoryContainer}>
                <FastImage
                  style={styles.categoryImage}
                  source={{uri: FILE_BASE_URL + item?.image}}
                />
                <Text
                  style={{
                    ...commonStyles.fontSize12,
                    fontFamily: fontFamily.bold,
                    marginHorizontal: rspW(2.6),
                  }}>
                  {item?.name}
                </Text>
              </FlexSBContainer>
            );
          })}
        </ScrollView>
      </View>
      {showOwnPost && Object.keys(showOwnPost).length > 0 && (
        <FeedItem item={showOwnPost} index={0} />
      )}
    </View>
  );
};

const MemoFeedHeaderComponent = React.memo(FeedHeaderComponent);

const FeedList = _ => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = React.useState(false);
  const [homeListing, setHomeListing] = React.useState([]);
  const [causes, setCausesList] = React.useState([]);
  const handler = React.useRef();
  const locationUpdated = useSelector(locationUpdateSliceSelector);
  const dispatch = useDispatch();
  const [showOwnPost, setShowOwnPost] = React.useState();
  const onRefreshRef = React.useRef();
  const [onEndLoading, setOnEndLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [skip, setSkip] = React.useState(0);
  // const [videoPauseIndex, setVideoPauseIndex] = React.useState(-1);

  React.useImperativeHandle(handler, () => {
    return {
      apiCall,
    };
  });

  onRefreshRef.current = React.useCallback(async () => {
    if (skip !== 0) {
      const homeDetail = await homeApi(0, skip - 50);
      if (Array.isArray(homeDetail?.listing)) {
        setHomeListing(homeDetail?.listing);
      }
      const cList = await getCausesList();
      setCausesList(cList?.listing);
      setShowOwnPost({});
      DeviceEventEmitter.emit('emergencyPost');
    }
  }, [skip]);

  React.useEffect(() => {
    const appState = AppState.addEventListener('change', async listener => {
      if (!locationUpdated && listener === 'active') {
        try {
          const getLocation = await getCurrentLocation();
          console.log('Here');
          updateProfile({
            latitude: getLocation?.coords.latitude,
            longitude: getLocation?.coords.longitude,
          });
          await setItemF('LocationUpdated', true);
          alert('LocationUpdated');
          onRefreshRef.current();
          dispatch(updateLocation(true));
        } catch (error) {
          await setItemF('LocationUpdated', false);
        }
      }
    });
    return () => {
      appState?.remove();
    };
  }, [locationUpdated, dispatch]);

  React.useEffect(() => {
    apiCall();
    navigation.addListener('focus', () => onRefreshRef.current());
    return () => {
      navigation.removeListener('focus', () => onRefreshRef.current());
    };
  }, [navigation]);

  React.useEffect(() => {
    const addOwnPost = DeviceEventEmitter.addListener('addOwnPost', data => {
      if (data?.apiCall) {
        apiCall();
        return;
      }
      if (!data?.apiCall && data && Object.keys(data).length > 0) {
        setTimeout(() => {
          setShowOwnPost(data);
        }, 3000);
      }
    });
    return () => {
      addOwnPost.remove();
    };
  }, []);

  const apiCall = async () => {
    try {
      setLoading(true);
      const homeDetail = await homeApi(skip);

      if (Array.isArray(homeDetail?.listing)) {
        setHomeListing(previous => [...previous, ...homeDetail?.listing]);
        setSkip(next => next + 50);
      }
      const tagList = await getCausesList();
      setCausesList(tagList?.listing);
      setLoading(false);
    } catch (error) {
      showError(error?.message);
    }
  };

  const renderItem = React.useCallback(({item, index}) => {
    return <FeedItem ref={handler} item={item} index={index} />;
  }, []);

  const ItemSeparatorComponent = React.useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const listEmptyComponent = React.useCallback(() => {
    return (
      <View style={styles.locationContainer}>
        {!locationUpdated && (
          <>
            <Text
              style={[
                commonStyles.fontSize13,
                {textAlign: 'center', marginHorizontal: rspW(30)},
              ]}>
              {
                'By allowing location permission you are able to see nearby posts of who needs help or who wants to help'
              }
            </Text>
            <MainButton
              onPress={() => {
                Linking.openSettings();
              }}
              btnStyle={styles.enablePermission}
              btnText={'Enable location permission'}
            />
          </>
        )}
        {locationUpdated && (
          <Text style={styles.help}>
            {
              'We currently do not have any helper or needy at the near-by location try increasing the area'
            }
          </Text>
        )}
      </View>
    );
  }, [locationUpdated]);

  const headerComponent = React.useCallback(() => {
    return (
      <MemoFeedHeaderComponent
        causes={causes}
        navigation={navigation}
        showOwnPost={showOwnPost}
      />
    );
  }, [causes, navigation, showOwnPost]);

  if (isLoading) {
    return <HomeSkeltonView />;
  }

  const renderFooter = () => {
    if (!onEndLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.themeColor} />
      </View>
    );
  };

  const onEndReached = async () => {
    if (onEndLoading || !hasMore) {
      return;
    }
    try {
      setOnEndLoading(true);
      const homeDetail = await homeApi(skip);
      if (Array.isArray(homeDetail?.listing)) {
        setHomeListing(provious => [...provious, ...homeDetail?.listing]);
        setOnEndLoading(false);
        setSkip(next => next + 50);
        if (homeDetail?.listing?.length === 0) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setOnEndLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={homeListing}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderItem}
        extraData={homeListing}
        ListHeaderComponent={headerComponent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        viewabilityConfig={viabilityConfig}
        ListEmptyComponent={listEmptyComponent}
        getItemLayout={(data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            onRefresh={onRefreshRef.current}
            refreshing={false}
            colors={[colors.themeColor, colors.black]}
          />
        }
      />
    </View>
  );
};

export default FeedList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    marginEnd: rspW(2),
    // marginEnd: rspW(1),
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.grey_95,
  },
  uImage: {justifyContent: 'flex-start', marginStart: rspW(2.6)},
  separator: {
    backgroundColor: colors.light_purple,
    width: '100%',
    height: 8,
    marginVertical: 10,
  },
  containerI: {backgroundColor: colors.light_purple, padding: 15},
  categoryImage: {width: 20, height: 20},
  enablePermission: {width: '90%', marginTop: rspH(2.5)},
  locationContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  help: {
    ...commonStyles.fontSize13,
    marginHorizontal: rspW(30),
    textAlign: 'center',
  },
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
