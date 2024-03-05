import * as React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import WebView from 'react-native-webview';
import BackButton from '../../components/BackButton';
import colors from '../../theme/colors';

const WebPermotion = props => {
  const {url, id} = props?.route?.params;

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <BackButton />
      </View>
      <WebView
        useWebView2
        allowFileAccess={true}
        allowsInlineMediaPlayback
        sharedCookiesEnabled={true}
        javaScriptEnabled
        mixedContentMode="compatibility"
        mediaPlaybackRequiresUserAction={false}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        originWhitelist={['*']}
        mediaCapturePermissionGrantType="prompt"
        onLoad={e => {
          if (e.nativeEvent.canGoBack) {
            setTimeout(() => {
              props?.navigation.goBack();
            }, 2000);
          }
        }}
        source={{uri: url + '?userId=' + id}}
      />
    </View>
  );
};

export default WebPermotion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backContainer: {
    backgroundColor: colors.white,
    height: Platform.OS === 'ios' ? 80 : 30,
    justifyContent: 'center',
    paddingStart: 10,
  },
});
