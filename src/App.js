import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import Router from './router/Router';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentGeoLocation } from './common/utils/GeoLocationUtil';
import { Utils } from './common';

function App() {
  const { t, i18n } = useTranslation();

  // '현재 위경도' 저장 & 불러오기
  const getLocationInfo = async () => {
    await getCurrentGeoLocation();
  };

  useEffect(() => {
    getLocationInfo();
  }, []);

  return (
    <div className={`App ${t('mode')}`}>
      <Router />
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        autoClose={1000}
        closeButton={false}
        toastStyle={{ backgroundColor: 'black', color: 'white' }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
export default React.memo(App);
