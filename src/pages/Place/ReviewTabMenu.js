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
import Moment from 'react-moment';
import 'moment/locale/ko'; // 한국어 로케일 파일 import
import InfiniteScroll from 'react-infinite-scroll-component';
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import { getReviewImageList, getShopReviewList } from '../../api/shop/place';
import { Utils } from '../../common';

// 초기 페이징 정보
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function ReviewTabMenu(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const { shopId } = useParams();

  /**
   * state
   */
  const [imgPage, setImgPage] = useState(1);
  const [imageSize, setImageSize] = useState(30);
  const [reviewImgs, setReviewImgs] = useState([]);
  const [imgHasMore, setImgHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [reviews, setReviews] = useState([]);
  const [reviewCnt, setReviewCnt] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  /**
   * api
   */
  const getRivewImgs = async () => {
    if (!imgHasMore) return;
    try {
      const params = {
        page: imgPage,
        size: imageSize,
      };
      const { data } = await getReviewImageList(shopId, params);
      setReviewImgs(prev => [...prev, ...data.data.list]);
      setImgHasMore(!data.data.isLast);
    } catch (error) {
      handleError(error);
    }
  };
  const getReivews = async () => {
    try {
      const params = {
        page,
        size,
        shopId,
      };
      const { data } = await getShopReviewList(params);
      setReviews(prev => [...prev, ...data.data.list]);
      setHasMore(!data.data.isLast);
      setReviewCnt(data.data.totalCnt);
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

  const goReviewDetail = feedId => {
    history.push({
      pathname: `${RouterPath.placeReviewdetail}/${feedId}`,
    });
  };
  const reservation = () => {
    history.push({ pathname: `${RouterPath.designer}/${shopId}` });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getReivews();
  }, [page]);

  useEffect(() => {
    getRivewImgs();
  }, [imgPage]);

  return (
    <main id="review-tabmenu">
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
              <Button
                className="active"
                onClick={() => {
                  return false;
                }}
              >
                리뷰
              </Button>
              <Button onClick={goMaptab}>지도</Button>
              <Button onClick={goEventtab}>이벤트</Button>
              <Button onClick={goAroundtab}>주변</Button>
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div className="review-line">
          <div className="review-sliderbox">
            <h5>
              리뷰 <span>{Utils.changeNumberComma(reviewCnt)}</span>
            </h5>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={3}
              onSwiper={swiper => {
                // console.log(swiper);
              }}
              onReachEnd={() => {
                setTimeout(() => {
                  setImgPage(imgPage + 1);
                }, 0);
              }}
            >
              {reviewImgs &&
                reviewImgs.length > 0 &&
                reviewImgs.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Image src={item.fileUrl} className="review-img" />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
          <InfiniteScroll
            dataLength={reviews.length}
            next={() => {
              setTimeout(() => {
                setPage(prev => prev + 1);
              }, 0);
            }}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
          >
            {reviews &&
              reviews.length > 0 &&
              reviews.map((item, index) => (
                <div
                  key={index}
                  className="reviewbox"
                  onClick={() => {
                    goReviewDetail(item.feedId);
                  }}
                >
                  <p className="review-title">
                    {item.title} <span>#{item.staffNm} 디자이너</span>
                  </p>
                  <div className="reviewstar-box">
                    {item.rating && (
                      <div className="star-text">
                        <Image src={images.starsolid} />
                        <p>{item.rating.toFixed(1)}</p>
                      </div>
                    )}
                    <div className="center-line" />
                    <p style={{ color: '#28282B', fontWeight: 'bold' }}>
                      {item.staffId}
                    </p>
                    <div className="center-line" />
                    <p>
                      <Moment fromNow interval={0} date={item.regDate} />
                    </p>
                    {item.resvCnt && (
                      <>
                        <div className="center-line" />
                        <p>{Utils.changeNumberComma(item.resvCnt)}째 예약</p>
                      </>
                    )}
                  </div>
                  <p className="review-bodytext">{item.comment}</p>
                  {item.files && item.files.length > 0 && (
                    <div className="reviews-img">
                      {item.files.map((file, i) => {
                        return <Image src={file.fileUrl} key={i} />;
                      })}
                    </div>
                  )}
                </div>
              ))}
          </InfiniteScroll>
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
