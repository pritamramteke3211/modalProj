import {showMessage} from 'react-native-flash-message';

export const showError = message => {
  showMessage({type: 'danger', message});
};

export const showSuccess = message => {
  console.log('here4');

  showMessage({type: 'success', message});
};
