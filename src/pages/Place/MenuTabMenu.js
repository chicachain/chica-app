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
import { handleError } from '../../common/utils/HandleError';
import { getMenuImageList, getShopMenuList } from '../../api/shop/place';
import RouterPath from '../../common/constants/RouterPath';
import { Utils } from '../../common';

// 초기 페이징 정보
const initialPagingInfo = {
  pageNo: 1,
  pageSize: 20,
};
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function MenuTabMenu(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const { shopId } = useParams();

  /**
   * state
   */
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [menus, setMenus] = useState([]);
  const [menuCnt, setMenuCnt] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  /**
   * api
   */
  const getMenus = async () => {
    try {
      const params = {
        page,
        size,
      };
      const { data } = await getShopMenuList(shopId, params);
      setMenus(prev => [...prev, ...data.data.list]);
      setHasMore(!data.data.isLast);
      setMenuCnt(data.data.totalCnt);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */

  const hometab = () => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${shopId}`,
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
  const eventtab = () => {
    history.push({
      pathname: `${RouterPath.placeEventTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const reservation = () => {
    history.push({
      pathname: `${RouterPath.designer}/${shopId}`,
    });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getMenus();
  }, [page]);

  return (
    <main id="menu-tabmenu">
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
            <p className="page-title">{state.shopNm}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="tab-menu">
              <Button onClick={hometab}>홈</Button>
              <Button
                className="active"
                onClick={() => {
                  return false;
                }}
              >
                메뉴
              </Button>
              <Button onClick={goArttab}>아티스트</Button>
              <Button onClick={goReviewtab}>리뷰</Button>
              <Button onClick={eventtab}>이벤트</Button>
              <Button onClick={goMaptab}>지도</Button>
              <Button onClick={goAroundtab}>주변</Button>
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container id="scrollableDiv" className="container-custom">
        <div style={{ padding: '1rem' }}>
          <div className="menu-line">
            <h5>
              메뉴 <span>{Utils.changeNumberComma(menuCnt)}</span>
            </h5>
            <div className="mb-3">
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#818185',
                }}
              >
                *메뉴 항목과 가격은 각 매장의 사정에 따라 기재된 내용과 다를 수
                있습니다.
              </p>
            </div>
            <InfiniteScroll
              dataLength={menus.length}
              next={() => {
                setTimeout(() => {
                  setPage(prev => prev + 1);
                }, 0);
              }}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
            >
              {menus &&
                menus.length > 0 &&
                menus.map((menuTebItem, index) => (
                  <div className="menu-box" key={index}>
                    <Image src={menuTebItem.fileUrl} />
                    <div className="menu-fontbox">
                      <p className="menu-title">{menuTebItem.shopNm}</p>
                      <p className="menu-sale">
                        {Utils.changeNumberComma(
                          window.parseInt(
                            menuTebItem.price * (1 - menuTebItem.saleRate),
                          ),
                        )}{' '}
                        {menuTebItem.saleRate > 0 && (
                          <>
                            <span className="cost">
                              {Utils.changeNumberComma(menuTebItem.price)}
                            </span>
                            <span className="discount">
                              {menuTebItem.saleRate * 100}%
                            </span>
                          </>
                        )}
                      </p>
                      <p className="menu-time">{menuTebItem.summary}</p>
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
