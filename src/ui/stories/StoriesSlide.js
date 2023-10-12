
import * as React from 'react';
import {Platform, View} from 'react-native';
import {width} from '../../theme/responsiveSize';
// import CubeNavigationHorizontal from './navigationAnimation/CubicNavigationHorizontal';
// import AndroidCubeEffect from './navigationAnimation/AndroidCubeEffect';
// import StoryListItem from './StoryListItem';
import {isNullOrWhitespace} from '../../utils/dataHandler';
import StoryListItem from './StoryListItem';
import {FILE_BASE_URL} from '../../config/constant';
import ModalBox from './ModalBox';
import colors from '../../theme/colors';
import AndroidCubeEffect from './navigationAnimation/AndroidCubeEffect';
import CubeNavigationHorizontal from './navigationAnimation/CubicNavigationHorizontal';
// import colors from '../../theme/colors';
// import ModalBox from './ModalBox';


const StoriesSlide = React.forwardRef((props, ref) => {
    
  const {data, refreshList} = props;
  const [dataState, setDataState] = React.useState(data);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedData, setSelectedData] = React.useState([]);
  const cube = React.useRef();

  React.useEffect(() => {
    setDataState(data);
  }, [data]);

  function onStoryFinish(state) {
    if (!isNullOrWhitespace(state)) {
      if (state === 'next') {
        const newPage = currentPage + 1;
        if (newPage < selectedData.length) {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        } else {
          setIsModalOpen(false);
          setCurrentPage(0);
          
        }
      } else if (state == 'previous') {
        const newPage = currentPage - 1;
        if (newPage < 0) {
          setIsModalOpen(false);
          setCurrentPage(0);
        } else {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        }
      }
    }
  }

  React.useImperativeHandle(ref, () => {
    return {
      _handleStoryItemPress,
    };
  });

  const _handleStoryItemPress = (index) => {
    const newData = dataState?.slice(index);
    setCurrentPage(0);
    setSelectedData(newData);
    setIsModalOpen(true);
  };

  const renderStoryList = () =>
    selectedData.map((x, i) => {
      return (
        <StoryListItem
          duration={5 * 1000}
          key={i}
          profileName={x?.firstName + ' ' + x?.lastName}
          profileImage={FILE_BASE_URL + x.profilePic}
          userId={x?.id}
          stories={x?.user_post}
          currentPage={currentPage}
          onFinish={onStoryFinish}
          swipeText={''}
          onClosePress={() => {
            setIsModalOpen(false);
            refreshList && refreshList();
          }}
          index={i}
        />
      );
    });

  const renderCube = () => {
    if (Platform.OS === 'ios') {
      return (
        <CubeNavigationHorizontal
          ref={cube}
          callBackAfterSwipe={(x) => {
            if (x !== currentPage) {
              setCurrentPage(parseInt(x, 10));
            }
          }}>
          {renderStoryList()}
        </CubeNavigationHorizontal>
      );
    } else {
      return (
        <AndroidCubeEffect
          ref={cube}
          callBackAfterSwipe={(x) => {
            if (x !== currentPage) {
              setCurrentPage(parseInt(x, 10));
            }
          }}>
          {renderStoryList()}
        </AndroidCubeEffect>
      );
    }
  };

  return (
    <View>
      <ModalBox
        style={{
          flex: 1,
          height: 100,
          width: width,
          backgroundColor: colors.black,
        }}
        isOpen={isModalOpen}
        position="top"
        swipeToClose
        swipeArea={250}
        backButtonClose={false}
        coverScreen={true}>
        {renderCube()}
      </ModalBox>
    </View>
  );
});

export default StoriesSlide;
