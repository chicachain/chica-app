/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { toast } from 'react-toastify';

// API
import {
  getShopListByRecommend,
  getShopListByLocation,
  getShopListByReservation,
} from '@api/home/home';

// Custom Component
import { Navi } from '@components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// Constant
import RouterPath from '../../common/constants/RouterPath';

SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 홈 ]
// ===================================================================
export default React.memo(function HomeBefor(props) {
  const history = useHistory();
  const [isWishOn, setIsWishOn] = useState(false);

  const login = () => {
    history.push(RouterPath.signIn);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mb_id');
    history.push(``);
  };
  const search = () => {
    history.push({
      pathname: RouterPath.signIn,
      state: {
        goUrl: RouterPath.search,
      },
    });
  };
  const community = () => {
    history.push({
      pathname: RouterPath.signIn,
      state: {
        goUrl: RouterPath.community,
      },
    });
  };
  const home = () => {
    history.push({
      pathname: RouterPath.signIn,
      state: {
        goUrl: RouterPath.home,
      },
    });
  };

  const waiting = () => {
    alert('준비중입니다.');
  };

  // 이미지를 클릭했을 때 상태를 토글하는 함수입니다.
  const toggleWish = () => {
    setIsWishOn(prevState => !prevState);
  };
  return (
    <main id="mainhome-befor">
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="beautymain">
          {/* 헤더 */}
          <header>
            <Container style={{ padding: '0' }}>
              <div className="header-flex">
                <Image src={images.mainChicaWhite} />
              </div>
              <div className="header-menu">
                {/* <Image src={images.icBell} /> */}
                <div className="img-p-box" onClick={login}>
                  <Image src={images.mainlogOut} />
                  <p>Login</p>
                </div>
                <div className="img-p-box" onClick={search}>
                  <Image src={images.mainSearch} />
                  <p>Search</p>
                </div>
              </div>
            </Container>
          </header>

          {/* 페이지 타이틀 */}
          <h2>
            Welcome
            <br />
            to the CHICA world
          </h2>
          <div className="search-box">
            <div className="search-flex-box">
              <Image src={images.IcSearchGray} />
              <Form.Control placeholder="What do you need ?" disabled />
            </div>
            <Image src={images.retangle} onClick={waiting} />
          </div>
          <div className="shop-box">
            <div className="shop-img-box" onClick={community}>
              <Image src={images.commMain} />
              <p>Community</p>
            </div>
            <div className="shop-img-box" onClick={waiting}>
              <Image src={images.beautyShop} />
              <p>Beauty SHOP</p>
            </div>
            <div className="shop-img-box">
              <Image src={images.ticket} onClick={waiting} />
              <p>Ticket SHOP</p>
            </div>
          </div>
          <div className="place-sale-box">
            <h6 className="place-beauty">CHICA Beauty Place</h6>
            <Image
              src={images.Maskgroup}
              className="maskgroup"
              onClick={home}
            />
          </div>
        </div>
        {/* <div className="arrivals-box"> */}
        {/*  <h6>New Arrivals</h6> */}

        {/*  <Swiper */}
        {/*    modules={[Navigation, Pagination]} */}
        {/*    slidesPerView={4} */}
        {/*    onSwiper={swiper => console.log(swiper)} */}
        {/*  > */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box" onClick={toggleWish}> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box"> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box"> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box"> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box"> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*    <SwiperSlide> */}
        {/*      <div className="scroll-img-box"> */}
        {/*        <Image src={images.mainscrollimg} className="arr-img" /> */}
        {/*        <Image */}
        {/*          src={isWishOn ? images.wishOn : images.wishOff} */}
        {/*          className="wish-img" */}
        {/*        /> */}
        {/*      </div> */}
        {/*      <p className="arr-text">Sugaring Special Kit</p> */}
        {/*    </SwiperSlide> */}
        {/*  </Swiper> */}
        {/* </div> */}
      </Container>
      {/* 푸터 */}
      <Navi />
    </main>
  );
});
