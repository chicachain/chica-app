/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import { Navi, CustomSelect } from '@components';
import { toast } from 'react-toastify';
import { hi } from 'date-fns/locale';
import RouterPath from '../../common/constants/RouterPath';
import CustomMap from '../../components/CustomMap';
import { getCurrentGeoLocation } from '../../common/utils/GeoLocationUtil';
import { Utils } from '../../common';

const { kakao } = window;

// 초기 페이징 정보
const initialPagingInfo = {
  pageNo: 1,
  pageSize: 20,
};

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function PlaceMap(props) {
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory();
  const state = history.location.state || {};

  const [selectedLocation, setSelectedLocation] = useState({
    value: '서울시 송파구',
    label: '서울시 송파구',
  });

  const [mapRender, setMapRender] = useState(true);
  const [activeId, setActiveId] = useState('');

  const handleLocationChange = e => {
    setSelectedLocation({
      value: e.target.value,
      label: e.target.value,
    });
  };
  const clickCrossBtn = () => {
    setMapRender(false);
    setGeolocation({ ...geolocation });
    setTimeout(() => {
      setMapRender(true);
    }, 0);
  };
  const clickmodal = e => {
    setModalShow(true);
    setActiveId(e.target.value);
  };
  const modalClose = () => {
    setModalShow(false);
    setActiveId('');
  };
  const placeDetail = shopId => {
    history.push({ pathname: `/place/detail/${shopId}` });
  };
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });

  // 현재 위경도 불러오기
  const getLocationInfo = async () => {
    const locationData = await getCurrentGeoLocation();
    if (locationData) {
      setGeolocation({
        lat: locationData.latitude,
        lng: locationData.longitude,
      });
    }
  };

  useEffect(() => {
    getLocationInfo();
    return () => {
      setGeolocation(null);
      setMapRender(false);
      setActiveId(null);
    };
  }, []);

  return (
    <main id="place-map">
      <header>
        <Container onClick={modalClose}>
          <div className="header-grid">
            <i
              className="material-icons pointer"
              onClick={() => {
                history.push({
                  pathname: RouterPath.place,
                  state: {
                    shopType: state.shopType,
                    shopTypeName: state.shopTypeName,
                  },
                });
              }}
            >
              arrow_back
            </i>
            <h6>{state.shopTypeName}</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="map-box" style={{ overflow: 'hidden' }}>
          <div className="map-title">
            <Button
              variant="outline-primary"
              className="cross-btn"
              onClick={clickCrossBtn}
            >
              <Image src={images.IcCrosshair} />
            </Button>
            <Button
              variant="outline-primary"
              className="allplace-btn"
              onClick={() => {
                history.push(RouterPath.place);
              }}
            >
              전체 플레이스
            </Button>
          </div>
          {/* <Button className="map-label" onClick={clickmodal}>
            <Image src={images.ReviewProfile} />
            시카고뷰티랩 월드타워점
          </Button> */}
          <div style={{ position: 'absolute', zIndex: 0, top: 0 }}>
            {mapRender && geolocation && (
              <CustomMap
                clickmodal={clickmodal}
                geolocation={geolocation}
                activeId={activeId}
                searchResults={state.searchResults}
              />
            )}
          </div>
          <Button
            variant="outline-primary"
            className="allmenu-label"
            onClick={() => {
              history.push({
                pathname: RouterPath.place,
                state: {
                  shopType: state.shopType,
                  shopTypeName: state.shopTypeName,
                },
              });
            }}
          >
            전체목록 <span>{state.totalCnt}</span>
          </Button>
        </div>
      </Container>

      <Modal
        size="sm"
        show={modalShow}
        onHide={() => {
          modalClose();
        }}
        aria-labelledby="example-modal-sizes-title-sm"
        id="place-modal"
        backdrop
        backdropClassName="place-modal-back-drop"
      >
        <Modal.Body>
          {state.searchResults.map(
            (result, index) =>
              // eslint-disable-next-line eqeqeq
              activeId == result.shopId && (
                <div className="resultbox" key={index}>
                  <Image src={result.fileUrl} className="result-img" />
                  <div className="result-info">
                    <p className="info-tag">
                      <span>{result.tags}</span>
                      <i
                        className="material-icons pointer"
                        onClick={modalClose}
                      >
                        close
                      </i>
                    </p>
                    <p className="result-title">{result.shopNm}</p>
                    <div className="info-botitlebox">
                      <div className="reviewstar-box">
                        <p>
                          리뷰
                          <span style={{ paddingLeft: '3px' }}>
                            {result.reviewCnt
                              ? Utils.changeNumberComma(result.reviewCnt || '0')
                              : 0}
                          </span>
                        </p>

                        <div className="center-line" />
                        <p>
                          별점
                          <span style={{ paddingLeft: '3px' }}>
                            {result.avgRating
                              ? result.avgRating.toFixed(1)
                              : '-'}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => placeDetail(result.shopId)}
                      >
                        상세 조회
                      </Button>
                    </div>
                  </div>
                </div>
              ),
          )}
        </Modal.Body>
      </Modal>
      {/* 푸터 */}
      <Navi />
    </main>
  );
});
