import * as React from 'react';
import {StatusBar, View} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import colors from '../../theme/colors';
import {useUpdateLocation} from '../../hooks/useUpdateLocation';
import EmergencyStatus from './EmergencyStatus';
import FeedList from './FeedList';
// import MobilePhoneUpdateModal from '../../components/MobilePhoneUpdateModal';

const Home = _ => {
  useUpdateLocation();

  return (
    <WrapperContainer
      removeBottomInsetActual={true}
      statusBarColor={colors.white}>
      <View style={{flex: 1}}>
        <EmergencyStatus />
        <FeedList />
      </View>
      {/* <MobilePhoneUpdateModal /> */}
    </WrapperContainer>
  );
};

export default Home;
