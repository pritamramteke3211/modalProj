import {NavigationActions, StackActions} from 'react-navigation';
import {createRef} from 'react';

// let _navigator = useRef();

export const _navigator = createRef();
export const isReadyRef = createRef();

const setTopLevelNavigator = navigatorRef => {
  _navigator.current = navigatorRef;
};

const navigate = (routeName, params) => {
  _navigator.current?.navigate(routeName, params);
};

const goBack = () => {
  _navigator?.current?.dispatch(NavigationActions.back());
};

const resetNavigation = (routeName = 'loginScreen') => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})],
  });
  _navigator?.current?.dispatch(resetAction);
};

export default {
  navigate,
  setTopLevelNavigator,
  resetNavigation,
  goBack,
};
