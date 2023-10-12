
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Animated, Image, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, View, Platform, SafeAreaView, TextInput, KeyboardAvoidingView, Keyboard, Pressable, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import GestureRecognizer from 'react-native-swipe-gestures';
import {usePrevious} from '../../hooks/usePrevious';
import colors from '../../theme/colors';
import {isNullOrWhitespace} from '../../utils/dataHandler';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import commonStyles from '../../utils/commonStyles';
import {FILE_BASE_URL} from '../../config/constant';
const {width, height} = Dimensions.get('window');
import {deleteEmergencyPost, reportEmpergencyPost, sendMessage} from '../../redux/actions/home';
// import {Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger} from 'react-native-popup-menu';
import imagePath from '../../config/imagePath';
import {TouchableOpacity as TouchableOpacityGesture} from 'react-native-gesture-handler';
import AudioStoryPlayer from './AudioStoryPlayer';
import { showSuccess } from '../../utils/showMsg';



export const StoryListItem = (props) => {
  const stories = props.stories;
  const userId = props.userId;
  const [load, setLoad] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [txtMessage, setMessage] = useState('');
  const [content, setContent] = useState(
    stories?.map(x => {
      return {
        type: x?.feed_medias && x?.feed_medias?.length > 0 ? x.feed_medias[0]?.mediaType?.toLocaleUpperCase() : 'TEXT',
        image: x?.feed_medias && x?.feed_medias?.length > 0 ? x.feed_medias[0]?.name : '',
        text: x?.description,
        backgroundColor: randomColorGenerator(),
        _id: x?.id,
        finish: 0,
      };
    }),
  );

  const [current, setCurrent] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const prevCurrentPage = usePrevious(props.currentPage);

  React.useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', () => {
      progress.stopAnimation();
      setPressed(true);
    });

    const keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setPressed(false);
      startAnimation();
    });
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    let isPrevious = prevCurrentPage > props.currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(0);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          x.finish = 0;
        }
      } else {
        x.finish = 0;
      }
    });
    setContent(data);
    start();
  }, [props.currentPage]);

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (current > prevCurrent && content[current - 1].image === content[current].image) {
        start();
      } else if (current < prevCurrent && content[current + 1].image === content[current].image) {
        start();
      }
    }
  }, [current]);

  function start(duration) {
    setLoad(false);
    progress.setValue(0);
    startAnimation(duration);
  }

  function startAnimation(duration) {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration ? duration : props.duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        next();
      }
    });
  }

  function onSwipeUp() {
    if (props.onClosePress) {
      props.onClosePress();
    }
    if (content[current].onPress) {
      content[current].onPress();
    }
  }

  function onSwipeDown() {
    props?.onClosePress();
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function randomColorGenerator() {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  }

  function next() {
    // check if the next content is not empty
    setLoad(true);
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      // the next content is empty
      close('next');
    }
  }

  function previous() {
    // checking if the previous content is not empty
    setLoad(true);
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
    } else {
      // the previous content is empty
      close('previous');
    }
  }

  function close(state) {
    let data = [...content];
    data.map(x => (x.finish = 0));
    setContent(data);
    progress.setValue(0);
    if (props?.currentPage == props.index) {
      if (props.onFinish) {
        props.onFinish(state);
      }
    }
  }


  function onTimedMetadata(_) {}

  const onPressSend = async () => {
    try {
      txtMessage &&
        (await sendMessage({
          receiverId: userId,
          postId: content[current]._id,
          message: txtMessage,
        }));
      Keyboard.dismiss();
      setMessage('');
    } catch (error) {
      console.log((error)?.message);
    }
  };

  const deletePost = async () => {
    try {
      await deleteEmergencyPost({id: content[current]._id.toString()});
      onSwipeDown();
    } catch (error) {
      console.log('errro', error);
    }
  };

  const onPressMenu = async () => {
    try {
      await reportEmpergencyPost({type: 1, postId: content[current]._id.toString(), description: 'test'});
      showSuccess('Empergency post successfully reported');
      onSwipeDown();
    } catch (error) {
      console.log((error)?.message);
    }
  };

  const StoryMenu = useCallback(() => {
    return (
      <Menu onClose={() => startAnimation()} onOpen={() => progress.stopAnimation()}>
        <MenuTrigger style={{marginTop: 15, marginStart: 20}}>
          <Image style={styles.icon} source={imagePath.fi_more_vertical} />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <MenuOption>
            {userId && (
              <TouchableOpacityGesture onPress={onPressMenu}>
                <Text style={commonStyles.fontBold16}>{'Report'}</Text>
              </TouchableOpacityGesture>
            )}
            {!userId && (
              <TouchableOpacity onPress={deletePost}>
                <Text style={commonStyles.fontBold16}>{'Delete'}</Text>
              </TouchableOpacity>
            )}
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  }, [progress, userId]);

  return (
    // <MenuProvider skipInstanceCheck>
      <GestureRecognizer
        onSwipeUp={onSwipeUp}
        onSwipeDown={onSwipeDown}
        config={config}
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}>
        <SafeAreaView>
          <View style={styles.backgroundContainer}>
            {content[current].type === 'VIDEOS' && (
              <Video
                repeat={false}
                style={{width: width, height: height}}
                source={{uri: convertToProxyURL(FILE_BASE_URL + content[current].image), shouldCache: true}}
                maxBitRate={2000000}
                useTextureView={false}
                // onVideoLoad={() => start()}
                onLoad={(event) => {
                  start(event?.duration * 1000);
                }}
                onBuffer={(event) => {
                  event?.isBuffering && progress.stopAnimation();
                  setLoad(event?.isBuffering);
                }}
                resizeMode="contain"
              />
            )}
            {content[current].type === 'IMAGE' && <FastImage onLoadEnd={() => start()} source={{uri: FILE_BASE_URL + content[current].image}} style={styles.image} />}
            {content[current].type === 'TEXT' && (
              <View
                onLayout={() => {
                  start(3000);
                }}
                style={{backgroundColor: content[current].backgroundColor, width: width, height: height, justifyContent: 'center'}}>
                <Text style={{...commonStyles.fontBold20, color: colors.white, alignSelf: 'center'}}>{content[current].text}</Text>
              </View>
            )}

            {content[current].type === 'AUDIOS' && (    
            <AudioStoryPlayer playAnimation={startAnimation} stopAnimation={() => progress.stopAnimation()} audio={content[current].image} setLoad={setLoad} start={start} />
            )}
          </View>
        </SafeAreaView>

        <View style={{flexDirection: 'column', flex: 1, marginTop: 30}}>
          <View style={styles.animationBarContainer}>
            {content.map((index, key) => {
              return (
                <View key={key} style={styles.animationBackground}>
                  <Animated.View
                    style={{
                      flex: current === key ? progress : content[key].finish,
                      height: 2,
                      backgroundColor: 'white',
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.userContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image style={styles.avatarImage} source={{uri: props.profileImage}} />
              <Text style={styles.avatarText}>{props.profileName}</Text>
            </View>
            <View style={styles.userContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (props.onClosePress) {
                    props.onClosePress();
                  }
                }}>
                <View style={styles.closeIconContainer}>{props.customCloseComponent ? props.customCloseComponent : <Text style={{color: 'white'}}>X</Text>}</View>
              </TouchableOpacity>
              <StoryMenu />
            </View>
          </View>
          <View style={styles.pressContainer}>
            <TouchableWithoutFeedback
              onPressIn={() => {
                Keyboard.dismiss();
                progress.stopAnimation();
              }}
              onLongPress={() => setPressed(true)}
              onPressOut={() => {
                setPressed(false);
                startAnimation();
              }}
              onPress={() => {
                if (!pressed && !load) {
                  previous();
                }
              }}>
              <View style={{flex: 0.5, marginEnd: 30}} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPressIn={() => {
                Keyboard.dismiss();
                progress.stopAnimation();
              }}
              onLongPress={() => setPressed(true)}
              onPressOut={() => {
                setPressed(false);
                startAnimation();
              }}
              onPress={() => {
                if (!pressed && !load) {
                  next();
                }
              }}>
              <View style={{flex: 0.5, marginStart: 30}} />
            </TouchableWithoutFeedback>
          </View>
        </View>

        <KeyboardAvoidingView behavior="position">
          <View
            style={{
              backgroundColor: colors.white,
              position: 'absolute',
              width: '90%',
              borderRadius: 10,
              bottom: 40,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: Platform.OS === 'ios' ? 10 : 0,
            }}>
            <TextInput value={txtMessage} onChangeText={setMessage} style={{...commonStyles.fontSize13, paddingStart: 15, flex: 1}} placeholderTextColor={colors.grey_072} placeholder="Send Message" />
            <TouchableOpacity style={{justifyContent: 'center'}} onPress={onPressSend}>
              <Text style={{...commonStyles.fontBold16, textAlignVertical: 'center', marginEnd: 20, color: colors.themeColor}}>{'Send'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {load && content[current].type !== 'TEXT' && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={'white'} />
          </View>
        )}
      </GestureRecognizer>
    // </MenuProvider>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  spinnerContainer: {
    // zIndex: -100,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    width: width,
    top: 0,
    bottom: 0,
  },
  animationBarContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  animationBackground: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
  },
  userContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  avatarImage: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
  avatarText: {
    ...commonStyles.fontBold16,
    color: 'white',
    paddingLeft: 10,
  },
  closeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 15,
  },
  pressContainer: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  swipeUpBtn: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
    bottom: Platform.OS == 'ios' ? 20 : 50,
  },
});
