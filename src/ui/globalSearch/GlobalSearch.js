import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlexSBContainer from '../../components/FlexSBContainer';
import WrapperContainer from '../../components/WrapperContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import {globalSearch} from '../../redux/actions/home';
import colors from '../../theme/colors';
import {rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';

const GlobalSearch = _ => {
  const {navigation} = _;
  const handler = React.useRef();
  const [searchData, setSearchData] = React.useState({
    users: [],
    feeds: [],
  });
  const [loading, setLoading] = React.useState(false);

  const renderItem = React.useCallback(({item, index}) => {
    return (
      <View style={{backgroundColor: colors.offWhite}}>
        <FeedItem ref={handler} item={item} index={index} />
      </View>
    );
  }, []);

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      setLoading(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  const search = async text => {
    try {
      const response = await globalSearch(text);
      setSearchData({
        users: response?.dataUsers?.rows,
        feeds: response?.datafeeds?.rows,
      });
      setLoading(false);
      //   setData(response);
    } catch (error) {
      setLoading(false);
      //   setPreSearchList([]);
      console.log('Error', error.message);
    }
  };

  const handleOnSearch = debounce(text => {
    search(text);
  }, 1000);

  const ItemSeparatorComponent = React.useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const listEmptyComponent = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        {loading ? (
          <ActivityIndicator color={'red'} size={40} />
        ) : (
          <Text style={{...commonStyles.fontBold18, alignSelf: 'center'}}>
            {'No Feed found'}
          </Text>
        )}
      </View>
    );
  };

  const navigateToProfile = item => {
    navigation.navigate(navigationString.OTHER_USER_PROFILE, {
      user: {
        user: item,
      },
    });
  };

  return (
    <WrapperContainer>
      <FlexSBContainer containerStyle={{padding: 10}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={styles.imageStyle} source={imagePath.back} />
        </Pressable>
        <TextInput
          onChangeText={handleOnSearch}
          style={{flex: 1, ...commonStyles.fontBold16}}
          placeholder={'Search'}
          placeholderTextColor={colors.grey}
        />
      </FlexSBContainer>
      <View style={styles.scrollContainer}>
        <View style={styles.containerStyle}>
          <Text style={{...commonStyles.fontBold16}}>{'Recent'}</Text>
          <ScrollView style={{marginTop: rspH(2.5)}} horizontal>
            {searchData?.users.map((item, index) => {
              return (
                <Pressable
                  onPress={() => navigateToProfile(item)}
                  key={index}
                  style={{marginEnd: 20}}>
                  <FastImage
                    style={styles.fastImageStyle}
                    source={
                      item?.profilePic
                        ? {uri: FILE_BASE_URL + item?.profilePic}
                        : imagePath.placeholder
                    }
                  />
                  <Text style={{...commonStyles.fontBold16}}>
                    {item?.firstName + ' ' + item?.lastName}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        <FlatList
          data={searchData.feeds}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{flexGrow: 1}}
          extraData={searchData.feeds}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
    </WrapperContainer>
  );
};

export default GlobalSearch;

const styles = StyleSheet.create({
  container: {},
  imageStyle: {width: 20, height: 20, resizeMode: 'contain'},
  scrollContainer: {flex: 1, marginTop: 5, backgroundColor: colors.offWhite},
  fastImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
  },
  containerStyle: {padding: 10, backgroundColor: colors.white},
});
