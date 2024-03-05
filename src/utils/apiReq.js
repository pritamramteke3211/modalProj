import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const getHeaders = async () => {
  let userData = await AsyncStorage.getItem('userData');
  if (userData) {
    userData = JSON.parse(userData);
    return {
      authorization: `${userData?.accessToken}`,
    };
  }
  return {};
};

export const apiReq = async (
  endPoint,
  data = {},
  method,
  headers,
  requestOptions = {},
) => {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();

    headers = {
      ...getTokenHeader,
      ...headers,
    };

    if (method === 'get') {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }

    if (method === 'delete') {
      axios
        .delete(endPoint, {
          data: data,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          //  {headers: any}
        })
        .then(result => {
          const {data: resultData} = result;
          if (data.status === false) {
            return rej(data);
          }
          return res(resultData?.data);
        })
        .catch(error => {
          console.log('apiReq', error);
          console.log(error && error.response, 'the error respne');
          if (error && error.response && error.response.status === 401) {
            // clearUserData();
            // dispatch(updateClearReduxData())
            // NavigationService.resetNavigation();
            // notAuth();
            // dispat(updateClearReduxData({}));
            // dispatch({
            //   type: types.NO_INTERNET,
            //   payload: {internetConnection: true},
            // });
          }
          if (error && error.response && error.response.data) {
            if (!error.response.data.message) {
              return rej({
                ...error.response.data,
                msg: error.response.data.message || 'Network Error',
              });
            }
            return rej(error.response.data);
          } else {
            return rej({message: 'Network Error', msg: 'Network Error'});
          }
          // return rej(error);
        });

      return;
    }

    axios[method](endPoint, data, {headers})
      .then(result => {
        const {data: resultData} = result;
        if (data.status === false) {
          return rej(data);
        }
        return res(resultData?.data);
      })
      .catch(error => {
        console.log('endPoint err', endPoint, error);
        // console.log("api rq2",error);
        console.log(
          'api rq3',
          error && error?.response?.data,
          'the error respne',
        );
        if (error && error.response && error.response.status === 401) {
          // clearUserData();
          // NavigationServices.resetNavigation();
          // NavigationServices.navigate('loginUsingEmailScreen');
          // dispat(updateClearReduxData({}));
          // dispatch({
          //   type: types.NO_INTERNET,
          //   payload: {internetConnection: true},
          // });
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({message: 'Network Error', msg: 'Network Error'});
        }
        // return rej(error);
      });
  });
};

export const apiPost = (endPoint, data, headers = {}) => {
  return apiReq(endPoint, data, 'post', headers);
};
export const apiDelete = (endPoint, data, headers = {}) => {
  return apiReq(endPoint, data, 'delete', headers);
};
export const apiGet = (endPoint, data, headers = {}, requestOptions) => {
  return apiReq(endPoint, data, 'get', headers, requestOptions);
};
export const apiPut = (endPoint, data, headers = {}) => {
  return apiReq(endPoint, data, 'put', headers);
};
