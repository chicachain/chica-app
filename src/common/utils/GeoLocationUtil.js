/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import { geoLocationActions } from '../../reducers/geoLocationSlice';
import store from '../../reducers/index';

// 현재 위치 정보 갱신
export const getCurrentGeo = () => {
  // Redux 데이터 조회
  const { geoLocation } = store.getState();

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      res => {
        resolve({
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        });
      },
      error => {
        if (process.env.REACT_APP_ENV_NAME === 'local') {
          // eslint-disable-next-line default-case
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              alert('An unknown error occurred.');
              break;
          }
          console.log(error);
          reject(error);
        } else {
          resolve(geoLocation);
        }
      },
      {
        enableHighAccuracy: true,
      },
    );
  });
};

// 저장된 현재 위치 정보 조회
export const getCurrentGeoLocation = () => {
  // Redux 데이터 조회
  const { geoLocation } = store.getState();

  // 마지막 갱신 시각 비교
  const now = new Date();
  const lastUpdateTime = new Date(geoLocation.updateTime);

  // Null 체크 & 갱신 시각 계산
  const isEmpty = !(geoLocation.latitude && geoLocation.longitude);
  // const isExpired = now.getTime() - lastUpdateTime.getTime() > 30000;

  // 데이터 Null or 30초 초과 - 갱신 정보 반환
  // if (isEmpty || isExpired) {
  if (isEmpty) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        res => {
          // Redux 갱신
          store.dispatch(
            geoLocationActions.setGeoLocation({
              latitude: res.coords.latitude,
              longitude: res.coords.longitude,
              updateTime: now.toString(),
            }),
          );

          resolve({
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            updateTime: now.toString(),
          });
        },
        error => {
          if (process.env.REACT_APP_ENV_NAME === 'local') {
            // eslint-disable-next-line default-case
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert('User denied the request for Geolocation.');
                break;
              case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
              case error.UNKNOWN_ERROR:
                alert('An unknown error occurred.');
                break;
            }
            console.log(error);
            reject(error);
          } else {
            // 서울 위경도로 설정
            store.dispatch(
              geoLocationActions.setGeoLocation({
                latitude: 37.56682870765463,
                longitude: 126.97865225753738,
                updateTime: now.toString(),
              }),
            );

            resolve({
              latitude: 37.56682870765463,
              longitude: 126.97865225753738,
              updateTime: now.toString(),
            });
          }
        },
        {
          enableHighAccuracy: true,
        },
      );
    });
  }

  return Promise.resolve(geoLocation);
};
