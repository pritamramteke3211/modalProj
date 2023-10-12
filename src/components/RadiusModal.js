import * as React from 'react';
import {Modal, BackHandler} from 'react-native';
// import Modal from 'react-native-modalbox';
import RoundRadius from '../ui/radius/RoundRadius';


const RadiusModal = React.forwardRef((props, ref) => {
  
  const [visibleRadiusView, setVisibleRadiusView] = React.useState(false);

  const openCloseAction = (action) => setVisibleRadiusView(action);

  React.useImperativeHandle(ref, () => {
    return {
      openCloseAction,
    };
  });

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setVisibleRadiusView(false);
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const exit = () => {
    setVisibleRadiusView(false);
  };

  return (
    <Modal visible={visibleRadiusView}>
      {/* <RoundRadius exit={exit} /> */}
    </Modal>
  );
});

export default RadiusModal;
