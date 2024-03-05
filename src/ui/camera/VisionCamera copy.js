import * as React from 'react';
import {useRef, useState, useMemo, useCallback} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraDeviceFormat,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  PhotoFile,
  sortFormats,
  useCameraDevices,
  VideoFile,
  frameRateIncluded,
  Camera,
} from 'react-native-vision-camera';
import {
  CONTENT_SPACING,
  MAX_ZOOM_FACTOR,
  SAFE_AREA_PADDING,
} from './../../config/constant';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {CaptureButton} from './CaptureButton';
import {useIsForeground} from '../../hooks/useForground';
import imagePath from '../../config/imagePath';
import FastImage from 'react-native-fast-image';
import {rspW, rspH} from '../../theme/responsiveSize';
import colors from '../../theme/colors';
import {useDispatch, useSelector} from 'react-redux';
import commonStyles from '../../utils/commonStyles';
import {
  capturePhotos,
  recordedVideo,
} from '../../redux/reducer/AudioVideoList/audioVideoList';
import {openSettings} from 'react-native-permissions';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

const VisionCamera = ({navigation, route}) => {
  const clickPictureOnly = route?.params.clickPictureOnly ?? false;
  const emergencyPost = route?.params?.emergencyPost ?? false;

  const camera = useRef(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState('back');
  const [flash, setFlash] = useState('off');
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [photsAndVideoList, setPhotosAndVideoList] = useState([]);
  const photos = useSelector(state => state.audioVideoList.photos);

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const dispatch = useDispatch();
  const formats = useMemo(() => {
    if (device?.formats == null) {
      return [];
    }
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  //#region Memos
  const fps = useMemo(() => {
    return 30;
  }, []);

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );
  const supportsFlash = device?.hasFlash ?? false;
  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  //#endregion

  const format = useMemo(() => {
    let result = formats;

    // find the first format that includes the given FPS
    const formatResult = result.find(f =>
      f.frameRateRanges.some(r => frameRateIncluded(r, fps)),
    );
    return {
      ...formatResult,
      photoWidth: 100,
      photoHeight: 100,
      videoWidth: 200,
      videoHeight: 200,
    };
    // return formatResult as CameraDeviceFormat;
  }, [formats, fps]);

  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  //#region Callbacks
  const setIsPressingButton = useCallback(
    _isPressingButton => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );

  const permissionAlert = () =>
    Alert.alert('Camera Permission', 'App want to access your camera', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => openSettings()},
    ]);

  // Camera callbacks
  const onError = useCallback(error => {
    // console.error('aaaaa', error.name === 'permission/camera-permission-denied');
    if (error.name === 'permission/camera-permission-denied') {
      permissionAlert();
    }
  }, []);

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);

  const onMediaCaptured = useCallback(
    media => {
      if (clickPictureOnly) {
        const newCapture = [...photsAndVideoList];
        newCapture.push('file://' + media.path.trim());
        setPhotosAndVideoList(newCapture);
        if (emergencyPost) {
          dispatch(capturePhotos(newCapture));
          navigation.goBack();
        }
        return;
      }
      dispatch(recordedVideo(media.path));
      navigation.goBack();
    },
    [photsAndVideoList, clickPictureOnly, navigation, dispatch, emergencyPost],
  );

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  const neutralZoom = device?.neutralZoom ?? 1;

  useEffect(() => {
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus()
      .then(status => setHasMicrophonePermission(status === 'authorized'))
      .catch(error => {
        console.log('errorerrorerror', error);
      });
  }, []);

  const onPinchGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? 'active' : 'inactive'
      } camera. ` +
        `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  const onFrameProcessorSuggestionAvailable = useCallback(suggestion => {
    console.log(
      `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`,
    );
  }, []);

  const onPressCross = useCallback(
    captureFile => {
      setPhotosAndVideoList(photsAndVideoList.filter(x => x !== captureFile));
    },
    [photsAndVideoList],
  );

  const CaptureImageOrVideo = useCallback(
    ({item}) => {
      return (
        <View key={item}>
          <FastImage
            style={styles.captureImage}
            resizeMode={'cover'}
            source={{uri: item}}
          />
          <Pressable style={styles.close} onPress={() => onPressCross(item)}>
            <Image
              style={{tintColor: colors.black}}
              source={imagePath.closex}
            />
          </Pressable>
        </View>
      );
    },
    [onPressCross],
  );

  const onPressDone = useCallback(() => {
    dispatch(capturePhotos([...photsAndVideoList, ...photos]));
    navigation.goBack();
  }, [dispatch, photsAndVideoList, navigation, photos]);

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                // fps={fps}
                hdr={false}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                video={true}
                audio={hasMicrophonePermission}
                orientation="portrait"
                frameProcessorFps={1}
                onFrameProcessorPerformanceSuggestionAvailable={
                  onFrameProcessorSuggestionAvailable
                }
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
        clickPictureOnly={clickPictureOnly}
      />

      <StatusBar translucent backgroundColor={'transparent'} />
      {photsAndVideoList?.length > 0 && (
        <View style={styles.leftDoneButton}>
          <Text
            onPress={onPressDone}
            style={{...commonStyles.fontBold16, color: colors.white}}>
            {'Done'}
          </Text>
        </View>
      )}

      <View style={{...styles.leftDoneButton, marginTop: rspH(6)}}>
        <Text
          onPress={() => navigation.goBack()}
          style={{...commonStyles.fontBold16, color: colors.white}}>
          {'Close'}
        </Text>
      </View>

      <View style={styles.rightButtonRow}>
        {supportsCameraFlipping && (
          <Pressable style={styles.button} onPress={onFlipCameraPressed}>
            <Image source={imagePath.fi_camera} />
          </Pressable>
        )}
        {supportsFlash && (
          <Pressable style={[styles.button]} onPress={onFlashPressed}>
            <Image source={imagePath.fi_zap} />
            {flash === 'off' && <View style={styles.flashContainer} />}
          </Pressable>
        )}
      </View>

      {photsAndVideoList?.length > 0 && (
        <View style={styles.listContainer}>
          <FlatList
            horizontal
            data={photsAndVideoList}
            renderItem={CaptureImageOrVideo}
            keyExtractor={(k, _) => k.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default VisionCamera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    left: 20,
    top: 30 + 40,
  },

  leftDoneButton: {
    position: 'absolute',
    // right: SAFE_AREA_PADDING.paddingRight,
    right: 20,
    top: 30,
    // top: SAFE_AREA_PADDING.paddingTop + 40,
    backgroundColor: colors.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    end: 0,
    backgroundColor: colors.white,
    tintColor: colors.black,
    borderRadius: 15,
  },
  listContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.blackWithOpacityFive,
    bottom: 100,
  },
  captureImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginHorizontal: rspW(2.6),
    marginVertical: rspH(1),
  },

  flashContainer: {
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    height: 30,
    transform: [
      {
        rotate: '140deg',
      },
    ],
  },
});
