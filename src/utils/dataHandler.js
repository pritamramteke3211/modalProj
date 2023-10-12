import AsyncStorage from "@react-native-async-storage/async-storage";


//LANGUAGE SET IN AUTH SCREEN FUNCTION CHOOSELANGUAGE
export function setLanguage(data) {
    return AsyncStorage.setItem('chooseLanguage', JSON.stringify(data));
  }
  export function getLanguage() {
    return new Promise(resolve => {
      AsyncStorage.getItem('chooseLanguage').then((data) => {
        resolve(JSON.parse(data));
      });
    });
  }

  export async function getChooseLanguage() {
    let language = await AsyncStorage.getItem('chooseLanguage');
    if (language) {
      return JSON.parse(language);
    }
    return {};
  }

  //GOT A MATCH
  export function setMatch(data) {
    return AsyncStorage.setItem('isMatched', JSON.stringify(data));
  }
  
  export function getMatch() {
    return new Promise(resolve => {
      AsyncStorage.getItem('isMatched').then((data) => {
        resolve(JSON.parse(data));
        console.log(JSON.parse(data), 'newMatchAsyncValue');
      });
    });
  }
  
  export function setItem(key, data) {
    data = JSON.stringify(data);
    return AsyncStorage.setItem(key, data);
  }
  export function getItem(key) {
    return new Promise(resolve => {
      AsyncStorage.getItem(key).then((data) => {
        resolve(JSON.parse(data));
      });
    });
  }

export function removeItem(key) {
    return AsyncStorage.removeItem(key);
  }
  export function clearAsyncStorage() {
    return AsyncStorage.clear();
  }
  
  export function setUserData(data) {
    data = JSON.stringify(data);
    return AsyncStorage.setItem('userData', data);
  }
  
  export async function getUserData() {
    return new Promise(resolve => {
      AsyncStorage.getItem('userData').then((data) => {
        resolve(JSON.parse(data));
      });
    });
  }
  
  export function setFirstTime(data) {
    data = JSON.stringify(data);
    return AsyncStorage.setItem('isFirstTime', data);
  }
  
  export async function getFirstTime() {
    return new Promise(resolve => {
      AsyncStorage.getItem('isFirstTime').then((data) => {
        resolve(JSON.parse(data));
      });
    });
  }
  
  export async function clearUserData() {
    console.log('ASYNC_storage_empty');
    return AsyncStorage.removeItem('userData');
  }

  export function isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) {
      return true;
    }  
    return input.toString().replace(/\s/g, '').length < 1;
  }
  