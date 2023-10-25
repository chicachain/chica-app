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
import { Navi, MainHeader, CustomModal } from '@components';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import { handleError } from '../../common/utils/HandleError';
import { getShopDetail } from '../../api/shop/place';
import CustomMap from '../../components/CustomMap';

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function MapTabMenu(props, marker) {
  const history = useHistory();
  const { shopId } = useParams();
  const [modalShow, setModalShow] = useState(true);
  const [searchResults, setSearchResult] = useState([]);
  const [geolocation, setGeolocation] = useState();
  const [activeId, setActiveId] = useState(shopId);

  const clickmodal = e => {
    setModalShow(true);
    setActiveId(e.target.value);
  };
  const modalClose = () => {
    setModalShow(false);
    setActiveId('');
  };

  const getShopInfo = async () => {
    try {
      const { data } = await getShopDetail(shopId);
      setSearchResult(data.data);
      setGeolocation({
        lat: data.data.latitude,
        lng: data.data.longitude,
      });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getShopInfo();
  }, []);
  return (
    <main id="map-tabmenu">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <p className="page-title">{searchResults.shopNm}</p>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="map-box">
          {geolocation && searchResults && (
            <CustomMap
              clickmodal={clickmodal}
              height="100%"
              width="100%"
              geolocation={geolocation}
              searchResults={[
                {
                  latitude: geolocation.lat,
                  longitude: geolocation.lng,
                  shopId: searchResults.shopId,
                  shopNm: searchResults.shopNm,
                  fileUrl: searchResults?.files[0]?.fileUrl,
                },
              ]}
              activeId={0}
            />
          )}
        </div>
      </Container>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => {
          modalClose();
        }}
        aria-labelledby="example-modal-sizes-title-sm"
        id="map-modal"
        backdrop
        backdropClassName="place-modal-back-drop"
      >
        <Modal.Body>
          {
            // eslint-disable-next-line eqeqeq
            activeId == searchResults.shopId && (
              <div className="resultbox">
                <div className="info-botitlebox">
                  <Image src={images.icLocationBiG} className="big-location" />
                  <div>
                    <p className="result-title">{searchResults.shopNm}</p>
                    <p className="map-foot-address">{searchResults.address}</p>
                  </div>
                </div>
              </div>
            )
          }
        </Modal.Body>
      </Modal>
      {/* 푸터 */}
    </main>
  );
});
