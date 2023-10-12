import * as React from 'react';
import {Image, View, StyleSheet, Pressable} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {useDispatch, useSelector} from 'react-redux';
import FlexSBContainer from '../../components/FlexSBContainer';
import {FILE_BASE_URL} from '../../config/constant';
import imagePath from '../../config/imagePath';
import {selectedIndexAudio} from '../../redux/reducer/AudioSlice/audioSlice';
import {moderateScale} from '../../theme/responsiveSize';

let audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer?.setSubscriptionDuration(0.09);

const AudioMediaHandler = ({audio, outerIndex}) => {
  // const customEqual = (oldValue, newValue) => outerIndex === newValue;
  const isSelected = useSelector(state => state?.audio.selectedIndex);
  const progressRef = React.useRef();
  const dispatch = useDispatch();
  const isPlaying = isSelected === outerIndex;

  const playAudio = async () => {
    audioRecorderPlayer.addPlayBackListener(placeBack => {
      progressRef?.current?.progress(parseInt(Math.abs((placeBack.currentPosition / placeBack.duration) * 100).toFixed(0), 10));
      if (placeBack.currentPosition === placeBack.duration) {
        dispatch(selectedIndexAudio(-1));
      }
    });
    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      dispatch(selectedIndexAudio(-1));
      return;
    }
    if (isSelected !== -1) {
      await audioRecorderPlayer.stopPlayer();
    }
    await audioRecorderPlayer.startPlayer(FILE_BASE_URL + audio);
    dispatch(selectedIndexAudio(outerIndex));
  };

  return (
    <View style={styles.container}>
      <FlexSBContainer containerStyle={{justifyContent: 'center'}}>
        <Image style={{marginHorizontal: moderateScale(10)}} source={imagePath.audioWave} />
        <Pressable onPress={playAudio}>
          <Image style={{marginHorizontal: moderateScale(20), width: 30, height: 30}} source={isPlaying ? imagePath.fi_pause_circle : imagePath.play} />
        </Pressable>
      </FlexSBContainer>
    </View>
  );
};

export default AudioMediaHandler;

const styles = StyleSheet.create({
  container: {},
});
