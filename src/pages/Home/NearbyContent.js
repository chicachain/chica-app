/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { images } from '@assets';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

// Util
import Utils from '../../common/utils/Utils';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

const TEXT_NO_PLACE = '설정한 지역에 매장이 없습니다.';
const TEXT_NO_GEO_INFO = '위치 정보를 읽는 중입니다.';

// ===================================================================
// [ 홈 > 내주변샵 & 인기샵 & 오픈샵 & 배너 ]
// ===================================================================
export default React.memo(function NearbyContent({
  newShops = [],
  hotShops = [],
  nearbyShops = [],
  reResvShops = [],
  availableShops = [],
  noticeList = [],
  moveHomeMap = () => null,
  movePlaceDetail = () => null,
  moveNoticeDetail = () => null,
  geoLocation = { latitude: '', longitude: '' },
  setPage,
  isLast,
}) {
  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <div>
      {/** 내 주변 */}
      <div className="my-place">
        <div>
          {/* 내 주변 > 헤더 */}
          <div className="anoplace">
            <p>
              <span>다른 지역</span>으로 바꾸시려면 ?
            </p>
            <Button variant="outline-primary" onClick={moveHomeMap}>
              지역설정
            </Button>
          </div>

          {/* 내 주변 > 리스트 */}
          {nearbyShops.length > 0 ? (
            nearbyShops.map((shop, index) => (
              <div
                className="place-info"
                key={`nearby-shops-${index}`}
                onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
              >
                <Image src={shop.fileUrl || images.hotplaceimg1} />
                <div>
                  <div className="info-titlebox hot-title">
                    <p className="info-title">
                      {shop.shopNm}
                      <span className="hash">{shop.tags}</span>
                    </p>
                  </div>
                  <p className="info-subtitle">{shop.summary}</p>
                  <div className="info-botitlebox hot-info">
                    <p className="riview">
                      리뷰{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {shop.reviewCnt}
                      </span>
                    </p>
                    <div className="center-line" />
                    <div className="load-box">
                      <p>{Utils.convertDistance(shop.distance)}</p>
                      <Image src={images.icLocationSm} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Container className="not-found">
              <p>
                {geoLocation.latitude && geoLocation.longitude
                  ? TEXT_NO_PLACE
                  : TEXT_NO_GEO_INFO}
              </p>
            </Container>
          )}
        </div>

        {/* 지금 Hot한 뷰티 플레이스 */}
        <div className="hotplace">
          <h2 className="list-title">
            <span>지금 Hot</span>한 뷰티 플레이스 추천
          </h2>
          {hotShops.length > 0 ? (
            hotShops.map((shop, index) => (
              <div
                className="place-info"
                key={`hot-shops-${index}`}
                onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
              >
                <Image src={shop.fileUrl || images.hotplaceimg1} />
                <div>
                  <div className="info-titlebox hot-title">
                    <p className="info-title">
                      {shop.shopNm}
                      <span className="hash">{shop.tags}</span>
                    </p>
                  </div>
                  <p className="info-subtitle">{shop.summary}</p>
                  <div className="info-botitlebox hot-info">
                    <p className="riview">
                      리뷰 <span>{shop.reviewCnt || 0}</span>
                    </p>
                    <div className="center-line" />
                    <div className="load-box">
                      <p>{Utils.convertDistance(shop.distance)}</p>
                      <Image src={images.icLocationSmB} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Container className="not-found">
              <p>
                {geoLocation.latitude && geoLocation.longitude
                  ? TEXT_NO_PLACE
                  : TEXT_NO_GEO_INFO}
              </p>
            </Container>
          )}
        </div>

        {/* 배너 리스트 */}
        <div className="bannerbox mt-4">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={swiper => {
              // console.log(swiper);
            }}
            pagination={{ clickable: true }}
          >
            {noticeList.length > 0 ? (
              noticeList.map((notice, index) => {
                return (
                  <SwiperSlide
                    key={`banner-slide-${index}`}
                    onClick={() => moveNoticeDetail(notice.noticeId)}
                  >
                    <Image
                      src={notice.bannerUrl || images.sliderimg1}
                      className="banner-img"
                    />
                  </SwiperSlide>
                );
              })
            ) : (
              <SwiperSlide>
                <Image src={images.sliderimg1} className="banner-img" />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        {/* 재 예약 많은 플레이스 */}
        <div className="bannerbox mt-5">
          <h2 className="list-title">
            <span>재 예약 많은 </span>플레이스
          </h2>
          <Swiper
            className="mt-3"
            spaceBetween={16}
            slidesPerView={2}
            onSwiper={swiper => {
              // console.log(swiper);
            }}
            onSlideChange={swiper => {
              // console.log(swiper);
            }}
          >
            {reResvShops.length > 0 ? (
              reResvShops.map((shop, index) => {
                return (
                  <SwiperSlide
                    style={{ marginRight: '16px' }}
                    key={`available-shops-${index}`}
                    onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
                  >
                    <Image
                      src={shop.fileUrl || images.placeSliderImg1}
                      className="replace-img"
                    />
                    <p className="img-text">{shop.shopNm}</p>
                  </SwiperSlide>
                );
              })
            ) : (
              <Container className="not-found">
                <p>
                  {geoLocation.latitude && geoLocation.longitude
                    ? TEXT_NO_PLACE
                    : TEXT_NO_GEO_INFO}
                </p>
              </Container>
            )}
          </Swiper>
        </div>

        {/* 새로 오픈한 플레이스 */}
        <div className="newplace">
          <h2 className="list-title">
            <span>새로 오픈한 </span>플레이스 추천
          </h2>
          {newShops.length > 0 ? (
            newShops.map((shop, index) => (
              <div
                className="place-info"
                key={`new-shops-${index}`}
                onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
              >
                <Image src={shop.fileUrl || images.hotplaceimg1} />
                <div>
                  <div className="info-titlebox hot-title">
                    <p className="info-title">
                      {shop.shopNm}
                      <span className="hash">{shop.tags}</span>
                    </p>
                  </div>
                  <p className="info-subtitle">{shop.summary}</p>
                  <div className="info-botitlebox hot-info">
                    <p className="riview">
                      리뷰 <span>{shop.reviewCnt || 0}</span>
                    </p>
                    <div className="center-line" />
                    <div className="load-box">
                      <p>{Utils.convertDistance(shop.distance)}</p>
                      <Image src={images.icLocationSmB} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Container className="not-found">
              <p>
                {geoLocation.latitude && geoLocation.longitude
                  ? TEXT_NO_PLACE
                  : TEXT_NO_GEO_INFO}
              </p>
            </Container>
          )}
        </div>

        {/* 예약 가능한 플레이스 */}
        <div className="bannerbox mt-5">
          <h2 className="list-title">
            <span>예약 가능한 </span>플레이스
          </h2>
          <Swiper
            className="mt-3"
            spaceBetween={16}
            slidesPerView={2}
            onSwiper={swiper => {
              // console.log(swiper);
            }}
            onSlideChange={swiper => {
              // console.log(swiper);
            }}
            onReachEnd={() => {
              if (setPage) {
                setTimeout(() => {
                  if (!isLast) {
                    setPage(prev => prev + 1);
                  }
                }, 0);
              }
            }}
          >
            {availableShops.length > 0 ? (
              availableShops.map((shop, index) => {
                return (
                  <SwiperSlide
                    style={{ marginRight: '16px' }}
                    key={`available-shops-${index}`}
                    onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
                  >
                    <Image
                      src={shop.fileUrl || images.placeSliderImg1}
                      className="replace-img"
                    />
                    <p className="img-text">{shop.shopNm}</p>
                  </SwiperSlide>
                );
              })
            ) : (
              <Container className="not-found">
                <p>
                  {geoLocation.latitude && geoLocation.longitude
                    ? TEXT_NO_PLACE
                    : TEXT_NO_GEO_INFO}
                </p>
              </Container>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
});
