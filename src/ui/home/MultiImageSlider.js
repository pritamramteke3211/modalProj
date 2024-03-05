import * as React from 'react';
import {View, StyleSheet, FlatList, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {FILE_BASE_URL} from '../../config/constant';
import colors from '../../theme/colors';
import {rspH, scrn_width, width} from '../../theme/responsiveSize';
import AudioMediaHandler from './AudioMediaHandler';
import VideoItem from './VideoItem';

const ImageHandler = ({name}) => {
  return (
    <FastImage
      style={styles.normalImage}
      resizeMode={Platform.OS === 'ios' ? 'cover' : 'center'}
      source={{uri: `${FILE_BASE_URL}${name}`}}
    />
  );
};

const MultiImageSlider = _ => {
  const {data, outerIndex} = _;
  const ImageHandlerMemo = React.memo(ImageHandler);
  const AudioHandler = React.memo(AudioMediaHandler);
  let onlyPhotos = [];
  const isVideoPost =
    data.length > 1 ? '' : data.find(item => item?.mediaType === 'videos');
  const isAudioPost = data.find(item => item?.mediaType === 'audios');

  if (data.length >= 1) {
    onlyPhotos = data.filter(item => item?.mediaType === 'image');
  }

  const RenderItem = React.useMemo(() => {
    return {
      audios: audio => {
        return <AudioHandler audio={audio} outerIndex={outerIndex} />;
      },
      image: image => {
        return <ImageHandlerMemo name={image} />;
      },
    };
  }, [AudioHandler, ImageHandlerMemo, outerIndex]);

  const renderMultiImage = React.useCallback(({item}) => {
    return <>{item?.mediaType && RenderItem[item?.mediaType](item?.name)}</>;
  }, []);

  if (isVideoPost) {
    return <VideoItem uri={isVideoPost?.name} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        initialNumToRender={2}
        pagingEnabled
        renderItem={renderMultiImage}
        data={onlyPhotos}
        decelerationRate={'fast'}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={{marginTop: rspH(2.5)}}>
        {!!isAudioPost && (
          <AudioHandler audio={isAudioPost?.name} outerIndex={outerIndex} />
        )}
      </View>
    </View>
  );
};

export default React.memo(MultiImageSlider);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  normalImage: {width: scrn_width, height: 320, backgroundColor: colors.e5},
});
