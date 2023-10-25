/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { images } from '@assets';

// Custom Component
import { Navi } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';
import { handleError } from '../../common/utils/HandleError';
import {
  getReservationDetail,
  cancelReservation,
} from '../../api/reservation/reservations';
import CustomMap from '../../components/CustomMap';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
export default React.memo(function OrderDetail(props) {
  const history = useHistory();
  const { resvId } = useParams();

  /**
   * state
   */
  const [orderDetailData, setOrderDetailData] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isSellerBoxVisible, setIsSellerBoxVisible] = useState(false);
  const [isRezBoxVisible, setIsRezBoxVisible] = useState(false);
  const [geolocation, setGeolocation] = useState();

  /**
   * api
   */
  const orderDetail = async () => {
    try {
      const { data } = await getReservationDetail(resvId);

      setOrderDetailData(data.data);
      formattingInfo(data.data);
      setGeolocation({
        lat: data.data.latitude,
        lng: data.data.longitude,
      });
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */
  const toggleSellerBox = () => {
    setIsSellerBoxVisible(!isSellerBoxVisible);
  };
  const toggleRezBox = () => {
    setIsRezBoxVisible(!isRezBoxVisible);
  };
  const toggleMapVisibility = () => {
    setGeolocation(prevGeolocation => ({
      ...prevGeolocation,
      lat: orderDetailData?.latitude,
      lng: orderDetailData?.longitude,
    }));
    setIsMapVisible(!isMapVisible);
  };

  const handleCancelButtonClick = async () => {
    if (window.confirm('예약을 취소하시겠습니까?')) {
      const { data } = await cancelReservation(resvId);
      if (data.code === 200) {
        toast('예약이 취소되었습니다.');
        window.location.reload();
      }
    }
  };

  const handleReresvButtonClick = async () => {
    history.push({
      pathname: `/reservation/designer/${orderDetailData?.shopId}`,
    });
  };

  /**
   * util
   */

  const formattingInfo = data => {
    // resvId
    const resvIdPart1 = data.resvId.slice(0, 6); // 230927
    const resvIdPart2 = data.resvId.slice(6, 10); // 0001
    const resvIdPart3 = data.resvId.slice(10); // 0001

    const formattedResvId = `${resvIdPart1}-${resvIdPart2}-${resvIdPart3}`;

    // regDate
    const regDate = new Date(data.resvDate);
    const formattedResvDate = `${regDate.getFullYear()}-${String(
      regDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(regDate.getDate()).padStart(2, '0')}`;

    // resvDate
    const resvDate = new Date(data.resvDate);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[resvDate.getDay()];

    let hours = resvDate.getHours();
    const ampm = hours < 12 ? '오전' : '오후';
    hours = hours % 12 || 12;

    const formattedResvDateTime = `${resvDate.getFullYear()}-${String(
      resvDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(resvDate.getDate()).padStart(
      2,
      '0',
    )} (${dayOfWeek}) ${ampm} ${hours}:${String(resvDate.getMinutes()).padStart(
      2,
      '0',
    )}`;

    // price
    const formattedPrice = data.price.toLocaleString();

    // resvPhone
    const formattedPhoneNumber = data.resvPhone.replace(
      /(\d{3})(\d{4})(\d{4})/,
      '$1-$2-$3',
    );

    // shopTel
    let shopTelRegex;
    if (data.shopTel) {
      if (data.shopTel.startsWith('02')) {
        shopTelRegex = /(\d{2})(\d{3})(\d{4})/;
      } else if (data.shopTel.startsWith('010')) {
        shopTelRegex = /(\d{3})(\d{4})(\d{4})/;
      } else {
        shopTelRegex = /(\d{3})(\d{3})(\d{4})/;
      }
    }
    const formattedShopTel = data.shopTel.replace(shopTelRegex, '$1-$2-$3');

    setOrderDetailData(prevOrderDetailData => ({
      ...prevOrderDetailData,
      resvId: formattedResvId,
      resvPhone: formattedPhoneNumber,
      resvDate: formattedResvDate,
      resvDateTime: formattedResvDateTime,
      price: formattedPrice,
      shopTel: formattedShopTel,
    }));
  };

  const goOrderList = () => {
    history.push(`/mypage/order`);
  };

  /**
   * useEffect
   */
  useEffect(() => {
    orderDetail();
  }, []);

  return (
    <main id="order-detail">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => goOrderList()}>
              arrow_back
            </i>
            <h6>{orderDetailData?.shopNm}</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="rez-top-box">
          <div className="rez-title">
            {orderDetailData?.resvStatus === 'CANCEL' ||
            orderDetailData?.resvStatus === 'REJECT' ? (
              <p className="label cancle">예약취소</p>
            ) : orderDetailData?.resvStatus === 'WAIT' ||
              orderDetailData?.resvStatus === 'CONFIRM' ? (
              <p className="label purple">예약중</p>
            ) : orderDetailData?.resvStatus === 'FINISH' ? (
              <p className="label stay">
                방문 <span>( {orderDetailData?.resvDate} )</span>
              </p>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {orderDetailData?.resvStatus === 'CANCEL' ||
              orderDetailData?.resvStatus === 'REJECT' ||
              orderDetailData?.resvStatus === 'FINISH' ? (
                <Button
                  variant="outline-primary"
                  onClick={handleReresvButtonClick}
                >
                  다시 예약
                </Button>
              ) : orderDetailData?.resvStatus === 'WAIT' ||
                orderDetailData?.resvStatus === 'CONFIRM' ? (
                <Button
                  variant="outline-primary"
                  onClick={handleCancelButtonClick}
                >
                  예약 취소
                </Button>
              ) : null}
            </div>
          </div>
          <div className="rez-info-box">
            {orderDetailData?.resvStatus === 'CANCEL' ||
            orderDetailData?.resvStatus === 'REJECT' ? (
              <p className="info-number cancle">{orderDetailData?.resvId}</p>
            ) : (
              <p className="info-number purple">{orderDetailData?.resvId}</p>
            )}
            <h6 className="title">{orderDetailData?.shopNm}</h6>
            <div className="rez-info-detail">
              <div className="rez-grid">
                <p className="first">일정</p>
                <p className="sec">{orderDetailData?.resvDateTime} </p>
              </div>
              <div className="rez-grid">
                <p className="first">아티스트</p>
                <p className="sec">{orderDetailData?.staffNm || '현장지정'}</p>
              </div>
              <div className="rez-grid">
                <p className="first">서비스</p>
                <p className="sec">{orderDetailData?.menuNm} </p>
              </div>
              <div className="rez-grid">
                <p className="first">결제금액</p>
                <p className="sec">
                  {orderDetailData?.price} 원 <span>( 현장결제 )</span>
                </p>
              </div>
              {orderDetailData?.resvStatus === 'CANCEL' ||
              orderDetailData?.resvStatus === 'REJECT' ? (
                <div className="rez-grid">
                  <p className="first">취소금액</p>
                  <p className="sec" style={{ color: '#F94646' }}>
                    {orderDetailData?.price} 원
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="down-line-box" style={{ paddingTop: '0' }}>
          <div className="down-line" onClick={toggleMapVisibility}>
            <p>오시는길</p>
            <i
              className={`material-icons ${
                isMapVisible ? 'expand_less' : 'expand_more'
              }`}
            >
              {isMapVisible ? 'expand_less' : 'expand_more'}
            </i>
          </div>
          {isMapVisible && geolocation && orderDetailData && (
            <div className="smoll-mapbox">
              <div className="smoll-map" style={{ overflow: 'hidden' }}>
                <CustomMap
                  height="100%"
                  width="100%"
                  geolocation={geolocation}
                  searchResults={[
                    {
                      latitude: geolocation?.lat,
                      longitude: geolocation?.lng,
                      shopId: orderDetailData?.shopId,
                      shopNm: orderDetailData?.shopNm,
                      fileUrl: orderDetailData?.files[0]?.fileUrl,
                    },
                  ]}
                  activeId={0}
                />
              </div>
            </div>
          )}
          <div className="down-line" onClick={toggleSellerBox}>
            <p>판매자 연락처</p>
            <i
              className={`material-icons ${
                isSellerBoxVisible ? 'expand_less' : 'expand_more'
              }`}
            >
              {isSellerBoxVisible ? 'expand_less' : 'expand_more'}
            </i>
          </div>
          {isSellerBoxVisible && (
            <div className="seller-box">
              <div
                className="seller-line"
                style={{ borderTop: '1px solid #e0e0e7' }}
              >
                <p className="line-first">판매자</p>

                <p className="line-sec">{orderDetailData?.shopNm}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">대표자명</p>

                <p className="line-sec">{orderDetailData?.ceoNm}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">주소</p>

                <p className="line-sec">{orderDetailData?.address}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">연락처</p>
                <p className="line-sec">{orderDetailData?.shopTel}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">홈페이지</p>
                <p className="line-sec-purple">{orderDetailData?.homepage}</p>
              </div>
            </div>
          )}

          <div className="down-line" onClick={toggleRezBox}>
            <p>예약자 정보</p>
            <i
              className={`material-icons ${
                isRezBoxVisible ? 'expand_less' : 'expand_more'
              }`}
            >
              {isRezBoxVisible ? 'expand_less' : 'expand_more'}
            </i>
          </div>
          {isRezBoxVisible && (
            <div className="seller-box">
              <div
                className="seller-line"
                style={{ borderTop: '1px solid #e0e0e7' }}
              >
                <p className="line-first">예약자명</p>
                <p className="line-sec">{orderDetailData?.resvNm}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">연락처</p>

                <p className="line-sec">{orderDetailData?.resvPhone}</p>
              </div>
              <div className="seller-line">
                <p className="line-first">이메일</p>

                <p className="line-sec-purple">{orderDetailData?.mbEmail}</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
});
