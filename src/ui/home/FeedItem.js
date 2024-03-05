import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlexSBContainer from '../../components/FlexSBContainer';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import colors from '../../theme/colors';
import fontFamily from '../../theme/fontFamily';
import {rspW, rspH} from '../../theme/responsiveSize';
import commonStyles from '../../utils/commonStyles';
import ButtonAndLikeContainer from './ButtonAndLikeContainer';
import FeedMenu from './FeedMenu';
import MultiImageSlider from './MultiImageSlider';
import NavigationService from '../../service/NavigationService';
dayjs.extend(relativeTime);

const FeedItem = React.forwardRef((props, homeFunRef) => {
  const {item, index} = props;

  const navigationToOtherProfile = () => {
    item?.isAdmin !== 1 &&
      NavigationService.navigate(navigationString.OTHER_USER_PROFILE, {
        user: item,
      });
  };

  return (
    <View key={item?.id}>
      <View style={styles.container}>
        <FlexSBContainer>
          <FlexSBContainer onPress={navigationToOtherProfile}>
            <FastImage
              style={styles.userImage}
              source={
                item?.user?.profilePic
                  ? {
                      uri: `${item?.user?.baseUrl}${item?.user?.profilePic}`,
                      cache: 'immutable',
                      priority: FastImage.priority.high,
                    }
                  : imagePath.placeholder
              }
            />
            <View style={styles.userDetailContainer}>
              <Text
                style={{
                  ...commonStyles.fontSize13,
                  color: colors.light_black,
                  fontFamily: fontFamily.bold,
                }}>{`${item?.user?.firstName} ${item?.user?.lastName}`}</Text>
              {
                <Text
                  style={{...commonStyles.fontSize10, color: colors.grey_95}}>
                  {item?.isAdmin !== 1 ? dayjs()?.to(item?.updatedAt) : 'Help'}
                </Text>
              }
            </View>
          </FlexSBContainer>
          {item?.isAdmin !== 1 && <FeedMenu ref={homeFunRef} item={item} />}
        </FlexSBContainer>
      </View>
      {item?.description !== 'undefined' && (
        <Text
          style={{
            ...commonStyles.fontSize13,
            marginStart: rspW(2.6),
            paddingVertical: rspH(1),
          }}>
          {item?.description ?? ''}
        </Text>
      )}

      {item?.feed_medias?.length > 0 && (
        <MultiImageSlider data={item?.feed_medias} outerIndex={index} />
      )}
      {
        // !item?.hideBottom &&
        <ButtonAndLikeContainer item={item} />
      }
    </View>
  );
});

export default FeedItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  userImage: {width: 40, height: 40, borderRadius: 10, borderWidth: 1},
  userDetailContainer: {marginStart: rspW(2.6)},
});
