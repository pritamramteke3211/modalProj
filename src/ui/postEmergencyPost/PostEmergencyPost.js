import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useRef, useState, useMemo, useCallback} from 'react';
import WrapperContainer from '../../components/WrapperContainer';
import {
  rspF,
  rspH,
  rspW,
  scrn_height,
  scrn_width,
} from '../../theme/responsiveSize';
import Modal from 'react-native-modalbox';
import colors from '../../theme/colors';
import styles from './styles';
import FlexSBContainer from '../../components/FlexSBContainer';
import imagePath from '../../config/imagePath';
import commonStyles from '../../utils/commonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {showSuccess} from '../../utils/showMsg';
import fontFamily from '../../theme/fontFamily';
import CaptureMediaList from '../postFeed/CaptureMediaList';
import BottomSheet from '@gorhom/bottom-sheet';
import navigationString from '../../config/navigationString';

const PostEmergencyPost = ({navigation}) => {
  const [postMessage, setPostMessage] = useState();
  const [isLoading, setLoading] = useState();
  const [isRecording, setRecording] = useState();
  const bottomSheetRef = useRef(null);
  const isContinue = useRef(false);
  const [recordedAudio, setRecordedAudio] = useState('');

  const photos = useSelector(state => state.audioVideoList.photos);
  const video = useSelector(state => state.audioVideoList.video);
  const isRecordingStart = useRef();
  const dispatch = useDispatch();

  const openCamera = clickPictureOnly => {
    navigation.navigate(navigationString.VISION_CAMERA, {
      clickPictureOnly,
      emergencyPost: true,
    });
  };

  const snapPoints = useMemo(
    () => (Platform.OS !== 'ios' ? ['20%', '20%'] : ['30%', '30%']),
    [],
  );

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const onStartRecording = async () => {
    if (isRecordingStart.current) {
      setRecording(false);
      onStopRecord();
      return;
    }
    if (Platform.OS === 'android') {
      try {
        await getAudioPermission();
      } catch (error) {}
    }
    try {
      setRecording(true);
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
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordedAudio(result);
    isRecordingStart.current = false;
  };

  const goToPostType = async () => {
    if (isContinue.current) {
      return;
    }
    console.log('here');

    if (!video && !recordedAudio && photos.length === 0 && !postMessage) {
      showSuccess('Please add some content');
      return;
    }
  };

  const isButtonEnable = React.useMemo(() => {
    return photos.length > 0 || video || postMessage || recordedAudio;
  }, [photos, video, postMessage, recordedAudio]);

  const onGoBack = () => navigation.goBack();

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
                  style={{tintColor: colors.black, marginEnd: rspW(4)}}
                  source={imagePath.closex}
                />
                <Text
                  style={{
                    ...commonStyles.fontSize16,
                    color: colors.grey_black,
                  }}>
                  {'Add Emergency Post'}
                </Text>
              </FlexSBContainer>

              <Pressable
                disabled={!!isButtonEnable === false}
                onPress={goToPostType}
                style={{
                  ...styles.continueButton,
                  backgroundColor: isButtonEnable
                    ? colors.themeColor
                    : colors.dim_theme_color,
                }}>
                <Text style={{...commonStyles.fontSize14, color: colors.white}}>
                  {'Continue'}
                </Text>
              </Pressable>
            </FlexSBContainer>
          </FlexSBContainer>
        </View>

        <ScrollView bounces={false} style={{flex: 1, backgroundColor:'white'}}>
          <TextInput
            value={postMessage}
            placeholderTextColor={colors.grey}
            placeholder="Tab to type..."
            style={{
              ...styles.textInput,
              backgroundColor:'red',
              flex: video || recordedAudio ? 0.2 : 1,
              fontFamily: fontFamily.bold,
              fontSize: rspF(
                photos.length > 0 || video || recordedAudio ? 2.4 : 3.4,
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
            <Text style={{...commonStyles.fontSize13, marginVertical: rspH(0)}}>
              {'Live photo, video and audio'}
            </Text>
            <FlexSBContainer containerStyle={{justifyContent: 'flex-start'}}>
              <Pressable onPress={() => !isButtonEnable && openCamera(true)}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isButtonEnable ? 0.2 : 1,
                  }}
                  source={imagePath.camera}
                />
              </Pressable>
              <Pressable onPress={() => !isButtonEnable && openCamera(false)}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    opacity: isButtonEnable ? 0.2 : 1,
                  }}
                  source={imagePath.video}
                />
              </Pressable>
              <Pressable onPress={() => !isButtonEnable && onStartRecording()}>
                {isRecording ? (
                  <FastImage
                    style={styles.micIcon}
                    source={imagePath.mic_gif}
                  />
                ) : (
                  <Image
                    source={isRecording ? imagePath.mic_gif : imagePath.mic}
                    style={styles.micIcon}
                    resizeMode={'contain'}
                  />
                )}
              </Pressable>
            </FlexSBContainer>
          </View>
        </BottomSheet>
      </Modal>
    </WrapperContainer>
  );
};

export default PostEmergencyPost;
