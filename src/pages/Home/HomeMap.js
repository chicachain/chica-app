/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { toast } from 'react-toastify';

// Custom Component
import { Navi } from '@components';
import { useDispatch } from 'react-redux';
import CustomMap from '../../components/CustomMap';

// Constant
import RouterPath from '../../common/constants/RouterPath';

// Util
import {
  getCurrentGeo,
  getCurrentGeoLocation,
} from '../../common/utils/GeoLocationUtil';
import { geoLocationActions } from '../../reducers/geoLocationSlice';

const { kakao } = window;

// 초기 위경도 데이터
const initialGeolocation = {
  lat: '',
  lng: '',
};

// ===================================================================
// [ 홈 > 지역변경 ]
// ===================================================================
export default React.memo(function HomeMap(props) {
  const history = useHistory();

  const dispatch = useDispatch();

  const myLocation = history.location.state || initialGeolocation;

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [geoLocation, setGeoLocation] = useState({
    lat: myLocation.lat,
    lng: myLocation.lng,
  }); // 위경도
  const [mapRender, setMapRender] = useState(true); // Kakao Map 랜더
  const [mapMarker, setMapMarker] = useState({
    lat: myLocation.lat,
    lng: myLocation.lng,
  }); // Kakao Map 마커
  const [currentLocation, setCurrentLocation] = useState({
    lat: myLocation.lat,
    lng: myLocation.lng,
  });

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // 내 현재 위치 보기
  const viewMyLocation = () => {
    setMapRender(false);
    setGeoLocation(currentLocation);
    setMapMarker(currentLocation);
    setTimeout(() => {
      setMapRender(true);
    }, 0);
  };

  // 현재 위경도 불러오기
  const getLocationInfo = async () => {
    const locationData = await getCurrentGeoLocation();
    if (locationData) {
      setGeoLocation({
        lat: locationData.latitude,
        lng: locationData.longitude,
      });
    }
  };

  // Map 클릭 이벤트
  const mapClickHandler = (_t, e) => {
    setGeoLocation({ lat: e.latLng.getLat(), lng: e.latLng.getLng() });
    setMapMarker({ lat: e.latLng.getLat(), lng: e.latLng.getLng() });
  };

  // 홈으로 이동
  const moveHomePage = () => {
    dispatch(
      geoLocationActions.setGeoLocation({
        latitude: geoLocation.lat,
        longitude: geoLocation.lng,
        updateTime: new Date().toString(),
      }),
    );
    history.push({ pathname: RouterPath.home, state: geoLocation });
  };

  const getCurrentLocation = async () => {
    const location = await getCurrentGeo();
    setCurrentLocation(location);
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // 현재 위경도 데이터
  useEffect(() => {
    if (geoLocation.lat && geoLocation.lng) {
      getLocationInfo();
      getCurrentLocation();
    }
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="place-map">
      {/* 헤더 설정 */}
      <header>
        <Container onClick={() => history.go(-1)}>
          <div className="header-grid">
            <i
              className="material-icons pointer"
              onClick={() => {
                () => history.go(-1);
              }}
            >
              arrow_back
            </i>
            <h6>지역설정</h6>
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="map-box">
          {/* 맵 - 헤더 */}
          <div
            className="map-title w-100"
            style={{ position: 'absolute', zIndex: 2 }}
          >
            {/* 내위치 */}
            <Button
              variant="outline-primary"
              className="cross-btn"
              onClick={viewMyLocation}
            >
              <Image src={images.IcCrosshair} />
            </Button>

            {/* 지역설정 */}
            <Button
              variant="outline-primary"
              className="allplace-btn"
              onClick={moveHomePage}
            >
              내 위치 설정
            </Button>
          </div>

          {/* 맵 - 바디 */}
          {mapRender && geoLocation.lat && geoLocation.lng && (
            <CustomMap
              width="100%"
              height="100%"
              geolocation={geoLocation}
              onClick={mapClickHandler}
              marker={mapMarker}
            />
          )}
        </div>
      </Container>

      {/* 푸터 */}
      <Navi />
    </main>
  );
});
