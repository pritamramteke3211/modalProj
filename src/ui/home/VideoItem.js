import * as React from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import Video from 'react-native-video';
import {FILE_BASE_URL} from '../../config/constant';
import convertToProxyURL from 'react-native-video-cache';
import {useIsFocused} from '@react-navigation/native';
import colors from '../../theme/colors';
import imagePath from '../../config/imagePath';
import {scrn_width, width} from '../../theme/responsiveSize';
import NavigationService from '../../service/NavigationService';
import navigationString from '../../config/navigationString';

const VideoItem = props => {
  const {uri} = props;

  const openModal = () => {
    NavigationService.navigate(navigationString.VIDEO_PLAYER_SCREEN, {
      url: FILE_BASE_URL + uri,
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Pressable style={styles.playContainer} onPress={openModal}>
          <Image style={styles.img} source={imagePath.play} />
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(VideoItem);

const styles = StyleSheet.create({
  video: {
    width: 400,
    height: 200,
    marginVertical: 10,
  },
  container: {
    backgroundColor: colors.black,
    width: scrn_width,
    alignSelf: 'center',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playContainer: {
    backgroundColor: colors.white,
    borderRadius: 50,
    overflow: 'hidden',
  },
  img: {backgroundColor: colors.white, width: 100, height: 100},
});
