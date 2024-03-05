import * as urls from '../../config/urls';
import {apiGet, apiPost, apiPut} from '../../utils/apiReq';
import {setUserData} from '../../utils/dataHandler';
import {showError} from '../../utils/showMsg';

export function loginUserApi(data) {
  return new Promise((resolve, reject) => {
    apiPost(urls.LOGIN, data)
      .then(res => {
        setUserData({
          ...res,
          firstName: data?.loginType !== 'mobile' ? res?.firstName : '',
        }).then(suc => {
          resolve(res);
        });
      })
      .catch(error => {
        !data?.social_key && showError(error?.message);
        reject(error);
        console.log('err', error);
      });
  });
}

export function splashLogo() {
  return new Promise((resolve, reject) => {
    apiGet(urls.SPLASH_LOGO)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function verifyOtpApi(data) {
  return new Promise((resolve, reject) => {
    apiPost(urls.OTP_VERIFICATION, data)
      .then(res => {
        setUserData(res).then(suc => {
          resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateProfile(data) {
  return new Promise((resolve, reject) => {
    apiPut(urls.EDIT_PROFILE, data, {
      'Content-Type': 'multipart/form-data',
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function isSocialIdExist(socialId, loginType) {
  return new Promise((resolve, reject) => {
    apiGet(
      urls.SOCIAL_USER_CHECK +
        '?socialMediaId=' +
        socialId +
        '&loginType=' +
        loginType,
    )
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function socialLogin(data) {
  return new Promise((resolve, reject) => {
    apiGet(urls.SOCIAL_USER_CHECK)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
