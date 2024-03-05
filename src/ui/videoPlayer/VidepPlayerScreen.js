import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import colors from '../../theme/colors';
import {
  height,
  scrn_height,
  scrn_width,
  width,
} from '../../theme/responsiveSize';
import fontFamily from '../../theme/fontFamily';
import commonStyles from '../../utils/commonStyles';
import WrapperContainer from '../../components/WrapperContainer';

const BUFFER_TIME = 1000 * 60;

const VideoPlayerScreen = props => {
  const url = props?.route?.params?.url;
  const proxyUrl = convertToProxyURL(url);
  const [loading, setLoading] = React.useState(true);
  const [buffering, setBuffering] = React.useState(true);
  const videoRef = React.useRef(null);
  const videoData = React.useRef();

  const onLoadStart = () => {
    setLoading(true);
  };

  const loadVideo = () => {
    if (true) {
      if (videoData.current === undefined) return;
      setLoading(false);
      setBuffering(false);
    }
  };

  const onBuffer = data => {
    setBuffering(data.isBuffering);
  };

  return (
    <WrapperContainer>
      {proxyUrl && (
        <Video
          ref={videoRef}
          playWhenInactive={false}
          resizeMode="cover"
          paused={loading}
          controls={true}
          repeat={false}
          source={{
            uri: proxyUrl,
          }}
          playInBackground={false}
          fullscreen={true}
          onError={_error => {
            setLoading(false);
          }}
          style={styles.video}
          // bufferConfig={{
          //   minBufferMs: BUFFER_TIME,
          //   bufferForPlaybackMs: BUFFER_TIME,
          //   bufferForPlaybackAfterRebufferMs: BUFFER_TIME,
          // }}
          onBuffer={onBuffer}
          onLoadStart={onLoadStart}
          onLoad={item => {
            videoData.current = item;
            Platform.OS !== 'ios' && loadVideo();
          }}
          onReadyForDisplay={loadVideo}
        />
      )}
      <Text
        onPress={() => props?.navigation?.goBack()}
        style={{
          ...commonStyles.fontBold32,
          position: 'absolute',
          color: colors.white,
          padding: 30,
        }}>
        {'x'}
      </Text>
      {(loading || buffering) && (
        <ActivityIndicator
          animating
          pointerEvents="none"
          color={colors.error}
          size="small"
          style={styles.loaderView}
          // {...props?.sourceIndicatorProps}
        />
      )}
    </WrapperContainer>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({
  video: {
    width: scrn_width,
    height: scrn_height,
    // marginVertical: 10,
    flex: 1,
  },
  container: {
    width: scrn_width,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playContainer: {
    backgroundColor: colors.white,
    borderRadius: 50,
    overflow: 'hidden',
  },
  img: {backgroundColor: colors.white, width: 100, height: 100},
  contentVideoView: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  loaderView: {
    flex: 1,
    position: 'absolute',
    top: '50%',
    left: '45%',
  },
});
