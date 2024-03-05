import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Camera, useCameraDevice, sortFormats } from 'react-native-vision-camera';
import colors from '../../theme/colors';
import { rspH, rspW, scrn_height, scrn_width } from '../../theme/responsiveSize';
import { SafeAreaView } from 'react-navigation';
import { Image as CompImage } from "react-native-compressor";
import FastImage from "react-native-fast-image";
import IoIcon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import ADIcon from "react-native-vector-icons/AntDesign"
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { useIsForeground } from '../../hooks/useForground';
import { useDispatch, useSelector } from 'react-redux';
import { MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from '../../config/constant';
import { capturePhotos, recordedVideo } from '../../redux/reducer/AudioVideoList/audioVideoList';
import { PinchGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import { CaptureButton } from './CaptureButton';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;


const VisionCamera = ({navigation, route}) => {

  const clickPictureOnly = route?.params.clickPictureOnly ?? false;
  const emergencyPost = route?.params?.emergencyPost ?? false;

  const dispatch = useDispatch();

  const cameraRef = useRef(null);
  // const devices = useCameraDevices();

  // const device = useCameraDevice('back')


  const [devicec, setdevicec] = useState("back");
  // const device = devices['front'];
  const device = useCameraDevice(devicec)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

   // check if camera page is active
   const isFocussed = useIsFocused();
   const isForeground = useIsForeground();
   const isActive = isFocussed && isForeground;

  const [cameraActive, setcameraActive] = useState(true);

  const [hasCameraPermission, sethasCameraPermission] = useState(false);
  const [flash, setflash] = useState("off");
  const [loading, setloading] = useState(false);  

  
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [photsAndVideoList, setPhotosAndVideoList] = useState([]);
  const photos = useSelector(state => state.audioVideoList.photos);

  // camera format settings
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

  const supportsCameraFlipping = useMemo(
    () => device.back != null && device.front != null,
    [device.back, device.front],
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
      f?.frameRateRanges?.some(r => frameRateIncluded(r, fps)),
    );

    console.log("formatResult",formatResult)

    return {
      ...formatResult,
      photoWidth: 100,
      photoHeight: 100,
      videoWidth: 200,
      videoHeight: 200,
    };
    // return formatResult as CameraDeviceFormat;
  }, [formats, fps]);




  // Check Camera Permission
  const checkCameraPer = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();

    if (newCameraPermission == "granted") {
      sethasCameraPermission(true);
    } else {
      sethasCameraPermission(false);
    }
  };

  const checkMicroPhonePer = async ()=>{
    Camera.getMicrophonePermissionStatus()
    .then(status => {
      console.log("mic status",status)
      setHasMicrophonePermission(status === 'authorized')})
    .catch(error => {
      console.log('errorerrorerror', error);
    });
  }

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onFlipCameraPressed = useCallback(() => {
    setdevicec(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  // Camera callbacks
  const onError = useCallback((error) => {
      console.error('aaaaa', error.name)
      
      if (error.name === 'permission/camera-permission-denied') {
        checkCameraPer();
      }
  }, []);
  

  const onMediaCaptured = useCallback(
    (media) => {
      if (clickPictureOnly) {
        console.log("media",media)
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

    //#region Tap Gesture
    const onDoubleTap = useCallback(() => {
      onFlipCameraPressed();
    }, [onFlipCameraPressed]);

    //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {

      console.log('onActive',"context",context)
      
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      console.log("scale",scale)
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });

  if (device != null && format != null) {
    console.log(`Re-rendering camera page with ${isActive ? 'active' : 'inactive'} camera. ` + `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`);
  } else {
    console.log('re-rendering camera page without active camera');
  }

  const onFrameProcessorSuggestionAvailable = useCallback((suggestion) => {
    console.log(`Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`);
  }, []);

  const onPressCross = useCallback(
    (captureFile) => {
      setPhotosAndVideoList(photsAndVideoList.filter(x => x !== captureFile));
    },
    [photsAndVideoList],
  );

  const CaptureImageOrVideo = useCallback(
    ({item}) => {
      return (
        <View key={item}>
          <FastImage style={styles.captureImage} resizeMode={'cover'} source={{uri: item}} />
          <Pressable style={styles.close} onPress={() => onPressCross(item)}>
            <Image style={{tintColor: colors.black}} source={imagePath.closex} />
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


  const neutralZoom = device?.neutralZoom ?? 1;

  useEffect(() => {
    console.log("sortFormats",sortFormats)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useFocusEffect(
    React.useCallback(() => {
      setcameraActive(isActive)
      checkCameraPer();
      checkMicroPhonePer()

      return () => {
        // close camera after capture image
        setcameraActive(false);
      };
    }, [])
  );


  

  return (
    <>

<View style={styles.container}>
{device != null && (
  <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
  <Reanimated.View style={StyleSheet.absoluteFill}>
    <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
      <ReanimatedCamera
        ref={cameraRef}
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
        onFrameProcessorPerformanceSuggestionAvailable={onFrameProcessorSuggestionAvailable}
      />
    </TapGestureHandler>
  </Reanimated.View>
</PinchGestureHandler>
)}

<CaptureButton
        style={styles.captureButton}
        camera={cameraRef}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
        clickPictureOnly={clickPictureOnly}
      />

  </View>

    </>
  )
}

export default VisionCamera

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
})