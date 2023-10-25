/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import { Navi, MainHeader, CustomModal } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import { getShopStaffList } from '../../api/shop/place';
import { Utils } from '../../common';

// 초기 페이징 정보
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function ArtTabMenu(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const { shopId } = useParams();

  /**
   * state
   */
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [artists, setArtists] = useState([]);
  const [artistCnt, setArtistCnt] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  /**
   * api
   */

  const getArtists = async () => {
    try {
      const params = {
        page,
        size,
      };
      const { data } = await getShopStaffList(shopId, params);
      setHasMore(!data.data.isLast);
      setArtistCnt(data.data.totalCnt);
      setArtists(prev => [...prev, ...data.data.list]);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */
  const goHometab = () => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goEventtab = () => {
    history.push({
      pathname: `${RouterPath.placeEventTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goArttab = () => {
    history.push({
      pathname: `${RouterPath.placeArtTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goMaptab = () => {
    history.push({
      pathname: `${RouterPath.placeMapTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goMenutab = () => {
    history.push({
      pathname: `${RouterPath.placeMenutab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goReviewtab = () => {
    history.push({
      pathname: `${RouterPath.placeReviewtab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goAroundtab = () => {
    history.push({
      pathname: `${RouterPath.placeAroundtab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const reservation = () => {
    history.push({ pathname: `${RouterPath.designer}/${shopId}` });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getArtists();
  }, [page]);
  return (
    <main id="art-tabmenu">
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons"
              onClick={() => {
                history.goBack();
              }}
            >
              arrow_back
            </i>
            <p className="page-title ">{state.shopNm}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="tab-menu">
              <Button onClick={goHometab}>홈</Button>
              <Button onClick={goMenutab}>메뉴</Button>
              <Button
                className="active"
                onClick={() => {
                  return false;
                }}
              >
                아티스트
              </Button>
              <Button onClick={goReviewtab}>리뷰</Button>
              <Button onClick={goMaptab}>지도</Button>
              <Button onClick={goEventtab}>이벤트</Button>
              <Button onClick={goAroundtab}>주변</Button>
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container id="scrollableDiv" className="container-custom">
        <div style={{ padding: '1rem' }}>
          <div className="art-line">
            <h5>
              아티스트 <span>{Utils.changeNumberComma(artistCnt)}</span>
            </h5>
            <InfiniteScroll
              dataLength={artists.length}
              next={() => {
                setTimeout(() => {
                  setPage(prev => prev + 1);
                }, 0);
              }}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
            >
              {artists &&
                artists.length > 0 &&
                artists.map(menuItem => (
                  <div className="menu-box" key={menuItem.staffId}>
                    <Image src={menuItem.fileUrl} />
                    <div className="menu-fontbox">
                      <p className="menu-title">{menuItem.staffNm}</p>
                      <p className="art-text">{menuItem.summary}</p>
                      <div className="reviewstar-box">
                        <p>
                          좋아요
                          <span style={{ paddingLeft: '3px' }}>
                            {Utils.changeNumberComma(menuItem.favCnt || '0')}
                          </span>
                        </p>
                        <div className="center-line" />
                        <p>
                          리뷰
                          <span style={{ paddingLeft: '3px' }}>
                            {Utils.changeNumberComma(menuItem.reviewCnt || '0')}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
      {/* 푸터 */}
      <div className="btn-area fix-bottom place-footerbtn">
        <Button style={{ marginTop: '0' }} onClick={reservation}>
          <Image
            src={images.ReservationWhite}
            style={{ paddingRight: '3px', width: '24px', height: '24px' }}
          />
          예약하기
        </Button>
      </div>
    </main>
  );
});
const artItems = [
  {
    id: 1,
    title: '김연아 디자이너',
    text: '15년 경력의 피부 에스테틱 전문가',
    addonNumber: '1,234',
    reviewNumber: '23',
    imageSrc: images.detailThumb,
  },
  {
    id: 1,
    title: '김연아 디자이너',
    text: '15년 경력의 피부 에스테틱 전문가',
    addonNumber: '1,234',
    reviewNumber: '23',
    imageSrc: images.detailThumb,
  },
  {
    id: 1,
    title: '김연아 디자이너',
    text: '15년 경력의 피부 에스테틱 전문가',
    addonNumber: '1,234',
    reviewNumber: '23',
    imageSrc: images.detailThumb,
  },
];
