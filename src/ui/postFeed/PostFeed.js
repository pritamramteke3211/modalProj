/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import Modal from 'react-native-modalbox';
import {
  height,
  rspW,
  rspH,
  rspF,
  width,
  scrn_height,
} from '../../theme/responsiveSize';
import FlexSBContainer from '../../components/FlexSBContainer';
import commonStyles from '../../utils/commonStyles';
import colors from '../../theme/colors';
import imagePath from '../../config/imagePath';
import navigationString from '../../config/navigationString';
import styles from './styles';
import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import fontFamily from '../../theme/fontFamily';
import CaptureMediaList from './CaptureMediaList';
import {useDispatch, useSelector} from 'react-redux';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {openMobileAlert} from '../../redux/reducer/MobileNumberSlice/mobileNumberSlice';
import Permission, {PERMISSIONS, request} from 'react-native-permissions';
import {createFeed, getCausesList} from '../../redux/actions/home';
import FastImage from 'react-native-fast-image';
import {check} from 'react-native-permissions';
import {openSettings} from 'react-native-permissions';
import MobilePhoneUpdateModal from '../../components/MobilePhoneUpdateModal';
import {
  AuthorizationResult,
  GeoPosition,
} from 'react-native-geolocation-service';
import {StackActions} from '@react-navigation/native';
import {
  capturePhotos,
  recordedVideo,
} from '../../redux/reducer/AudioVideoList/audioVideoList';
import {getAudioPermission} from '../../utils/audioPermission';
import {getCurrentLocation, locationPermission} from '../../utils/location';
import {showError, showSuccess} from '../../utils/showMsg';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);
const PostFeed = props => {
  const name = props?.route?.params?.type;
  const [postMessage, setPostMessage] = React.useState();
  const bottomSheetRef = React.useRef(null);
  const [recordedAudio, setRecordedAudio] = React.useState('');
  const photos = useSelector(state => state.audioVideoList.photos);
  const video = useSelector(state => state.audioVideoList.video);
  const isRecordingStart = React.useRef();
  const userData = useSelector(state => state.authUser.authUser);
  const dispatch = useDispatch();
  const snapPoints = React.useMemo(() => ['20%', '38%'], []);
  const [causes, setCauses] = React.useState([]);
  const [startRecording, setStartRecording] = React.useState(false);
  const [tags, setTags] = React.useState(name ?? '');
  const [isLoading, setLoading] = React.useState(false);
  const helpOrDonate = props?.route?.params?.helpOrDonate;

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  React.useEffect(() => {
    (async () => {
      const x = await getCausesList();
      setCauses(x?.listing);
    })();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      await Permission.request(PERMISSIONS.ANDROID.CAMERA);
    } else {
      try {
        const iosCamera = await request(PERMISSIONS.IOS.CAMERA);
        console.log('iosCameraiosCamera', iosCamera);
      } catch (error) {
        console.log('iosCameraiosCamera', error);
      }
    }
  };

  const handleSheetChanges = React.useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const openCamera = async clickPictureOnly => {
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({isOpen: true}));
      return;
    }

    if (Platform.OS === 'ios') {
      const isPermission = await check(PERMISSIONS.IOS.CAMERA);
      if (isPermission === 'granted') {
        props?.navigation.navigate(navigationString.VISION_CAMERA, {
          clickPictureOnly,
        });
      } else {
        openSettings();
      }
    } else {
      const isPermission = await check(PERMISSIONS.ANDROID.CAMERA);
      if (isPermission === 'denied') {
        await Permission.request(PERMISSIONS.ANDROID.CAMERA);
      }
      if (isPermission === 'granted') {
        props?.navigation.navigate(navigationString.VISION_CAMERA, {
          clickPictureOnly,
        });
      } else {
        openSettings();
      }
    }
  };

  const onStartRecording = async () => {
    if (!userData?.mobile || userData?.isMobileVerify === 0) {
      dispatch(openMobileAlert({isOpen: true}));
      return;
    }
    if (isRecordingStart.current) {
      onStopRecord();
      return;
    }
    if (Platform.OS === 'android') {
      try {
        await getAudioPermission();
      } catch (error) {}
    }
    setStartRecording(true);
    try {
      await audioRecorderPlayer.startRecorder(undefined, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      });
      isRecordingStart.current = true;
    } catch (error) {
      console.log('errorerrorerror', error);
    }
  };

  const onStopRecord = async () => {
    setStartRecording(false);
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordedAudio(result);
    isRecordingStart.current = false;
  };

  const isButtonEnable = React.useMemo(() => {
    return photos.length > 0 || video || postMessage || recordedAudio;
  }, [photos, video, postMessage, recordedAudio]);

  const onGoBack = () => props?.navigation.goBack();

  const onPostFeed = async () => {
    if (!isButtonEnable) {
      return;
    }

    let locationPermissionStatus = 'denied';
    try {
      locationPermissionStatus = await locationPermission();
    } catch (error) {
      showError('Please enable location permission before uploading any post.');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      if (locationPermissionStatus === 'granted') {
        var location = await getCurrentLocation();
        form.append('latitude', location?.coords.latitude);
        form.append('longitude', location?.coords.longitude);
      }
      form.append('title', 'User');
      postMessage && form.append('description', postMessage);
      photos.forEach(photo => {
        form.append('images[]', {
          uri: photo,
          type: 'images/jpeg',
          name: 'image.jpg',
        });
      });
      if (video) {
        form.append('videos[]', {
          uri: video,
          type: 'video/mp4',
          name: 'video.mp4',
        });
      }
      if (recordedAudio) {
        form.append('audios[]', {
          uri: recordedAudio,
          type: 'audio/mp3',
          name: 'audio.mp3',
        });
      }

      if (tags && tags?.length > 0 && tags.split(' ')?.every()) {
        form.append('tags', tags);
      }
      form.append('type', helpOrDonate);
      const x = await createFeed(form);
      setLoading(false);
      showSuccess('Post uploaded successfully');
      video && dispatch(recordedVideo(''));
      photos?.length > 0 && dispatch(capturePhotos(''));
      props?.navigation.dispatch(StackActions.pop());
      props?.navigation.dispatch(
        StackActions.replace(navigationString.TAB_ROUTES),
      );
      DeviceEventEmitter.emit('addOwnPost', x);
    } catch (error) {
      setLoading(false);
      showError(error?.message);
    }
  };

  return (
    <WrapperContainer isLoading={isLoading}>
      <Modal
        backdropPressToClose={false}
        isOpen={true}
        onClosed={() => {}}
        position={'bottom'}
        entry={'bottom'}
        animationDuration={1000}
        coverScreen={false}
        swipeToClose={false}
        style={{height: scrn_height, width: scrn_width}}>
        <View style={styles.container}>
          <FlexSBContainer containerStyle={{padding: 20}}>
            <FlexSBContainer containerStyle={styles.container}>
              <FlexSBContainer
                onPress={onGoBack}
                containerStyle={{justifyContent: 'flex-start'}}>
                <Image
                  style={{tintColor: colors.black, marginEnd: rspW(2.6)}}
                  source={imagePath.closex}
                />
                <Text
                  style={{
                    ...commonStyles.fontSize16,
                    color: colors.grey_black,
                  }}>
                  {'Add Post'}
                </Text>
              </FlexSBContainer>
              <Pressable
                onPress={onPostFeed}
                style={{
                  ...styles.continueButton,
                  backgroundColor: isButtonEnable
                    ? colors.themeColor
                    : colors.dim_theme_color,
                }}>
                <Text style={{...commonStyles.fontSize14, color: colors.white}}>
                  {'Post'}
                </Text>
              </Pressable>
            </FlexSBContainer>
          </FlexSBContainer>
        </View>
        <ScrollView bounces={false} style={{flex: 1, backgroundColor: 'red '}}>
          <TextInput
            value={postMessage}
            placeholderTextColor={colors.grey}
            placeholder="Tab to type..."
            style={{
              ...styles.textInput,
              flex: video || recordedAudio ? 0.2 : 1,
              fontFamily: fontFamily.bold,
              fontSize: rspF(
                photos.length > 0 || video || recordedAudio ? 15 : 24,
              ),
              maxHeight: photos.length > 0 ? 100 : 500,
              lineHeight: 30,
            }}
            numberOfLines={5}
            multiline
            returnKeyType={'done'}
            onChangeText={setPostMessage}
          />
          <CaptureMediaList
            setRecordedAudio={setRecordedAudio}
            recordedAudio={recordedAudio}
          />
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          style={styles.sheetContainer}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}>
          <View style={{padding: 20}}>
            <Image
              style={{
                marginEnd: rspW(2.6),
                position: 'absolute',
                end: 10,
                top: 36,
              }}
              source={imagePath.i_help_circle}
            />
            <BottomSheetTextInput
              onChangeText={e => setTags(e)}
              value={tags}
              focusable={false}
              placeholderTextColor={colors.grey}
              placeholder="Tags"
              style={{
                ...commonStyles.fontSize14,
                borderBottomWidth: 1,
                borderBottomColor: colors.blue_light,
                paddingEnd: 25,
              }}
            />
            <Text style={{...commonStyles.fontSize13, marginVertical: rspH(1)}}>
              {'Suggested:'}{' '}
              {causes.map(item => {
                return (
                  <Text
                    onPress={() => {
                      const s = tags;
                      if (s.includes(item?.name)) {
                        return;
                      }
                      setTags(s.concat(` ${item?.name}`));
                    }}
                    key={item?.id}
                    style={{
                      ...commonStyles.fontSize13,
                      color: colors.themeColor,
                    }}>
                    {item?.name + ' '}
                  </Text>
                );
              })}{' '}
            </Text>

            <Text style={{...commonStyles.fontSize13, marginVertical: rspH(1)}}>
              {'Live photo, video and audio'}
            </Text>
            <FlexSBContainer containerStyle={{justifyContent: 'flex-start'}}>
              <Pressable onPress={() => !video && openCamera(true)}>
                <Image
                  style={{width: 50, height: 50, opacity: video ? 0.2 : 1}}
                  source={imagePath.camera}
                />
              </Pressable>
              <Pressable
                onPress={() => photos.length === 0 && openCamera(false)}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    opacity: photos.length !== 0 ? 0.2 : 1,
                  }}
                  source={imagePath.video}
                />
              </Pressable>
              <Pressable onPress={onStartRecording}>
                <FastImage
                  style={{width: 50, height: 50}}
                  source={startRecording ? imagePath.mic_gif : imagePath.mic}
                />
              </Pressable>
            </FlexSBContainer>
          </View>
        </BottomSheet>

        <MobilePhoneUpdateModal />
      </Modal>
    </WrapperContainer>
  );
};

export default PostFeed;
