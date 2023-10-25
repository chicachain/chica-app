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
import classNames from 'classnames';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import { getEventList } from '../../api/shop/place';
import PROGRESS_STATUS from '../../common/constants/ProgressStatuses';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function ArtTabMenu(props) {
  const history = useHistory();
  const { shopId } = useParams();
  /**
   * state
   */
  const state = history.location.state || {};
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const [events, setEvents] = useState([]);

  /**
   * api
   */
  const getEvents = async () => {
    try {
      const params = { shopId, page, size };
      const { data } = await getEventList(params);
      setEvents(prev => [...prev, ...data.data.list]);
      setHasMore(!data.data.isLast);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */
  const goEventdetail = eventId => {
    history.push({
      pathname: `${RouterPath.eventdetail}/${eventId}`,
      state: { shopNm: state.shopNm },
    });
  };

  const goHometab = () => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${shopId}`,
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
  const goArttab = () => {
    history.push({
      pathname: `${RouterPath.placeArtTab}/${shopId}`,
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
  const goEventtab = () => {
    history.push({
      pathname: `${RouterPath.placeEventTab}/${shopId}`,
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
    getEvents();
  }, [page]);

  return (
    <main id="event-tabmenu">
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
              <Button onClick={goArttab}>아티스트</Button>
              <Button onClick={goReviewtab}>리뷰</Button>
              <Button onClick={goMaptab}>지도</Button>
              <Button
                className="active"
                onClick={() => {
                  return false;
                }}
              >
                이벤트
              </Button>
              <Button onClick={goAroundtab}>주변</Button>
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container id="scrollableDiv" className="container-custom">
        <div style={{ padding: '1rem' }}>
          <div className="event-line">
            <InfiniteScroll
              dataLength={events.length}
              next={() => {
                setTimeout(() => {
                  setPage(prev => prev + 1);
                }, 0);
              }}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
            >
              {events && events.length > 0 ? (
                events.map((item, index) => {
                  return (
                    <div
                      className="menu-box"
                      onClick={() => {
                        goEventdetail(item.eventId);
                      }}
                      key={index}
                    >
                      <Image src={item.fileUrl} />
                      <div className="menu-fontbox">
                        {item.status && (
                          <span
                            className={classNames('label', {
                              way:
                                PROGRESS_STATUS[item.status].type ===
                                PROGRESS_STATUS.PROGRESS.type,
                              end:
                                PROGRESS_STATUS[item.status].type ===
                                PROGRESS_STATUS.COMPLETE.type,
                            })}
                          >
                            {PROGRESS_STATUS[item.status].name}
                          </span>
                        )}
                        <p className="menu-title">{item.eventNm}</p>
                        <p className="daytime">
                          {item.startDate && (
                            <Moment
                              date={item.startDate}
                              format="YYYY.MM.DD"
                              interval={0}
                            />
                          )}{' '}
                          ~{' '}
                          {item.endDate && (
                            <Moment
                              date={item.endDate}
                              format="YYYY.MM.DD"
                              interval={0}
                            />
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="d-flex justify-content-center">
                  <p>이벤트가 존재하지 않습니다.</p>
                </div>
              )}
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
