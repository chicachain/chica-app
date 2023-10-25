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
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { format } from 'date-fns';
import Utils from '../../common/utils/Utils';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function Complete(props) {
  const history = useHistory();
  const location = useLocation();

  const home = () => {
    history.push({ pathname: `/` });
  };
  const reservationCheck = () => {
    history.push({ pathname: `/mypage/order` });
  };

  return (
    <main id="complate">
      <header>
        <Container>
          <div className="header-flex">
            <h6>예약완료</h6>
            <i className="material-icons" onClick={home}>
              close
            </i>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="complate-form">
          <div className="complage-imgform">
            <Image src={images.IcComplate} />
            <h6>
              <span>예약</span>이 <br />
              완료되었습니다
            </h6>
          </div>
          <div className="grid-form">
            <div
              className="grid-box"
              style={{
                borderBottomColor: '#4D4D53',
                borderTop: '1px solid #e0e0e7',
              }}
            >
              <p className="grid-title">예약번호</p>
              <p className="grid-subnumber">{location.state.resvId}</p>
            </div>
            <div className="grid-box">
              <p className="grid-title">날짜/시간</p>
              <p className="grid-subtitle">
                {format(location.state.resvDate, 'yyyy년 M월 d일 HH:mm')}
              </p>
            </div>
            <div className="grid-box">
              <p className="grid-title">매장/담당</p>
              <p className="grid-subtitle">
                {location.state.shopNm} -{' '}
                {location.state.staffNm === null
                  ? '현장지정'
                  : location.state.staffNm}
              </p>
            </div>
            <div className="grid-box">
              <p className="grid-title">선택 메뉴</p>
              <p className="grid-subtitle">{location.state.menuNm}</p>
            </div>
            <div className="grid-box">
              <p className="grid-title">결제수단</p>
              <p className="grid-subtitle">
                {location.state.payType === 'CREDIT_CARD'
                  ? '일반 신용카드'
                  : location.state.payType === 'CHICA_POINT'
                  ? '포인트 결제'
                  : 'CHICA 토큰'}
              </p>
            </div>
            <div className="grid-box">
              <p className="grid-title">결제금액</p>
              <p className="grid-subtitle">
                {Utils.changeNumberComma(`${location.state.price}` || 0)}원
              </p>
            </div>
          </div>
          <div className="bottom-btn">
            <Button
              variant="outline-primary"
              className="home-btn"
              onClick={home}
            >
              홈으로
            </Button>
            <Button className="check-btn" onClick={reservationCheck}>
              예약조회
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
});
