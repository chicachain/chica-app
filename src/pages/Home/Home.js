/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { toast } from 'react-toastify';
import 'swiper/swiper-bundle.css';

// API
import {
  getShopListByRecommend,
  getShopListByLocation,
  getShopListByReservation,
} from '@api/home/home';

// Custom Component
import { Navi } from '@components';
import SikaContent from './SikaContent';
import RankingContent from './RankingContent';
import NearbyContent from './NearbyContent';

// Util
import { getCurrentGeoLocation } from '../../common/utils/GeoLocationUtil';

// Constant
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';

// 카테이고리 타입
const CATEGORY_TYPE = {
  WAX: 'Waxing',
  NAIL: 'Nail',
  HAIR: 'Hair',
  SKIN: 'SKIN',
  SALE: 'SALE',
  POP: 'POP',
  BENEFIT: 'BENEFIT',
  ADD: 'ADD',
};

// 탭 타입
const TAB_TYPE = {
  NEARBY: 'Nearby',
  SIKA: 'Sika',
  RANKING: 'Ranking',
};

// 위경도 데이터 객체
const initialGeoLocation = {
  latitude: '',
  longitude: '',
};

// ===================================================================
// [ 홈 ]
// ===================================================================
export default React.memo(function Home(props) {
  const history = useHistory();

  const customGeoLocation = history.location.state || initialGeoLocation;

  // ===================================================================
  // [ state ]
  // ===================================================================

  const [geoLocation, setGeoLocation] = useState({
    latitude: customGeoLocation.lat,
    longitude: customGeoLocation.lng,
  });

  const [activeCategory, setActiveCategory] = useState(CATEGORY_TYPE.WAX); // 카테고리
  const [activeTab, setActiveTab] = useState(TAB_TYPE.NEARBY); // 탭

  const [hotShops, setHotShops] = useState([]); // 핫 매장 리스트
  const [newShops, setNewShops] = useState([]); // 새로 오픈한 매장 리스트
  const [pickShops, setPickShops] = useState([]); // 시카 추천
  const [reResvShops, setReResvShops] = useState([]); // 재예약 많은 매장 리스트
  const [topShops, setTopShops] = useState([]); // 랭킹 123
  const [noticeList, setNoticeList] = useState([]); // 공지사항 배너

  const [nearbyShops, setNearbyShops] = useState([]); // 주변 플레이스
  const [availableShops, setAvailableShops] = useState([]); // 예약 가능 플레이스

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [isLast, setIsLast] = useState(false);

  // ===================================================================
  // [ util ]
  // ===================================================================

  // 카테고리 선택
  const handleCategoryClick = type => {
    // TODO ::: 준비중 메뉴
    if (type !== CATEGORY_TYPE.WAX) {
      alert('준비중입니다.');
    } else {
      setActiveCategory(type);
    }
  };

  // 탭 선택
  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };

  // 현재 위경도 불러오기
  const getLocationInfo = async () => {
    try {
      const locationData = await getCurrentGeoLocation();
      if (locationData) setGeoLocation(locationData);
    } catch (error) {
      handleError(error);
    }
  };

  // 지역설정 페이지
  const moveHomeMap = () => {
    history.push({
      pathname: RouterPath.homeMap,
      state: { lat: geoLocation.latitude, lng: geoLocation.longitude },
    });
  };

  // 플레이스 상세 페이지
  const movePlaceDetail = (shopId, shopNm) => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${shopId}`,
      state: { shopNm },
    });
  };

  // 공지사항 상세 페이지
  const moveNoticeDetail = noticeId => {
    history.push({
      pathname: `${RouterPath.noticedetail}/${noticeId}`,
      state: noticeId,
    });
  };

  // ===================================================================
  // [ API ] 메인 화면 플레이스 및 게시글 조회
  // ===================================================================
  const getRecommendedShopList = async () => {
    try {
      const { data } = await getShopListByRecommend(activeCategory);
      if (data.code === 200) {
        const { data: info } = data;

        setHotShops([...info.hotShops]);
        setNewShops([...info.newShops]);
        setPickShops([...info.pickShops]);
        setReResvShops([...info.reResvShops]);
        setTopShops([...info.topShops]);
        setNoticeList([...info.notice]);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // ===================================================================
  // [ API ] 주변 플레이스 조회
  // ===================================================================
  const getNearbyShopList = async () => {
    try {
      // JSON 파라미터 ( 위도, 경도, 예약타입, 샵타입 )
      const param = {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        orderType: 'DISTANCE_ASC',
        shopType: activeCategory,
      };

      const { data } = await getShopListByLocation(param);
      if (data.code === 200) {
        const { data: list } = data;

        setNearbyShops([...list]);
      }
    } catch (error) {
      handleError(error);
      console.log(error);
    }
  };

  // ===================================================================
  // [ API ] 예약 가능한 플레이스 조회
  // ===================================================================
  const getAvailableShopList = async () => {
    try {
      // JSON 파라미터 ( 위도, 경도, 예약타입, 샵타입 )
      const param = {
        page,
        size,
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        orderType: 'DISTANCE_ASC',
        shopType: activeCategory,
      };

      const { data } = await getShopListByReservation(param);
      if (data.code === 200) {
        setIsLast(data.data.isLast);
        if (page === 1) {
          setAvailableShops([data.data.list]);
        } else {
          setAvailableShops(prev => [...prev, ...data.data.list]);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // 현재 위경도 조회
  useEffect(() => {
    getLocationInfo();
  }, []);

  // 주변 매장 검색
  useEffect(() => {
    if (geoLocation.latitude && geoLocation.longitude) {
      getNearbyShopList();
    }
  }, [geoLocation]);

  // 카테고리 조회 ( 왁싱 Only )
  useEffect(() => {
    if (activeCategory === CATEGORY_TYPE.WAX) {
      getRecommendedShopList();
    }
  }, [activeCategory]);

  useEffect(() => {
    if (geoLocation.latitude && geoLocation.longitude) {
      getAvailableShopList();
    }
  }, [geoLocation, page]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="mainhome">
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="beautymain">
          {/* 헤더 */}
          <header>
            <Container>
              <div className="header-flex">
                <Image src={images.logoHeader} />
              </div>
              <div className="header-menu">
                {/* <Image src={images.icBell} /> */}
                <Image
                  src={images.IcSearchlinear}
                  onClick={() => history.push({ pathname: `/search` })}
                />
              </div>
            </Container>
          </header>

          {/* 페이지 타이틀 */}
          <h2>
            나만의 뷰티 플레이스를
            <br />
            찾아보세요!
          </h2>

          {/* 카테고리 선택 */}
          <div className="mt-3">
            <div className="menu-grid">
              <Button
                className={activeCategory === CATEGORY_TYPE.WAX ? 'active' : ''}
                onClick={() => handleCategoryClick(CATEGORY_TYPE.WAX)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.WAX
                      ? images.icWax
                      : images.icWaxGray
                  }
                />
                왁싱
              </Button>
              <Button
                className={
                  activeCategory === CATEGORY_TYPE.NAIL ? 'active' : ''
                }
                onClick={() => handleCategoryClick(CATEGORY_TYPE.NAIL)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.NAIL
                      ? images.icNail
                      : images.icNailGray
                  }
                />
                네일
              </Button>
              <Button
                className={
                  activeCategory === CATEGORY_TYPE.HAIR ? 'active' : ''
                }
                onClick={() => handleCategoryClick(CATEGORY_TYPE.HAIR)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.HAIR
                      ? images.icHair
                      : images.icHairGray
                  }
                />
                헤어
              </Button>
              <Button
                className={
                  activeCategory === CATEGORY_TYPE.SKIN ? 'active' : ''
                }
                onClick={() => handleCategoryClick(CATEGORY_TYPE.SKIN)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.SKIN
                      ? images.icSkin
                      : images.icSkinGray
                  }
                />
                피부관리
              </Button>
            </div>
            <div className="menu-grid mt-4">
              <Button
                className={
                  activeCategory === CATEGORY_TYPE.SALE ? 'active' : ''
                }
                onClick={() => handleCategoryClick(CATEGORY_TYPE.SALE)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.SALE
                      ? images.icSaleBlack
                      : images.icSale
                  }
                />
                첫방문할인
              </Button>
              <Button
                className={activeCategory === CATEGORY_TYPE.POP ? 'active' : ''}
                onClick={() => handleCategoryClick(CATEGORY_TYPE.POP)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.POP
                      ? images.icPopularBlack
                      : images.icPopular
                  }
                />
                인기플레이스
              </Button>
              <Button
                className={
                  activeCategory === CATEGORY_TYPE.BENEFIT ? 'active' : ''
                }
                onClick={() => handleCategoryClick(CATEGORY_TYPE.BENEFIT)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.BENEFIT
                      ? images.icbenefitBlack
                      : images.icbenefit
                  }
                />
                오늘의 혜택
              </Button>
              <Button
                className={activeCategory === CATEGORY_TYPE.ADD ? 'active' : ''}
                onClick={() => handleCategoryClick(CATEGORY_TYPE.ADD)}
              >
                <Image
                  src={
                    activeCategory === CATEGORY_TYPE.ADD
                      ? images.icChannelBlack
                      : images.icChannel
                  }
                />
                채널추가
              </Button>
            </div>
          </div>
        </div>

        {/* 탭 헤더 */}
        <div className="tab-menu">
          <Button
            onClick={() => handleTabClick(TAB_TYPE.NEARBY)}
            className={activeTab === TAB_TYPE.NEARBY ? 'active' : ''}
          >
            내 주변
          </Button>
          <Button
            onClick={() => handleTabClick(TAB_TYPE.SIKA)}
            className={activeTab === TAB_TYPE.SIKA ? 'active' : ''}
          >
            시카 추천
          </Button>
          <Button
            onClick={() => handleTabClick(TAB_TYPE.RANKING)}
            className={activeTab === TAB_TYPE.RANKING ? 'active' : ''}
          >
            랭킹123
          </Button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="tab-content">
          {activeTab === TAB_TYPE.NEARBY && (
            <NearbyContent
              newShops={newShops}
              hotShops={hotShops}
              nearbyShops={nearbyShops}
              reResvShops={reResvShops}
              availableShops={availableShops}
              noticeList={noticeList}
              moveHomeMap={moveHomeMap}
              movePlaceDetail={movePlaceDetail}
              moveNoticeDetail={moveNoticeDetail}
              geoLocation={geoLocation}
              setPage={setPage}
              isLast={isLast}
            />
          )}
          {activeTab === TAB_TYPE.SIKA && (
            <SikaContent
              pickShops={pickShops}
              geoLocation={geoLocation}
              movePlaceDetail={movePlaceDetail}
            />
          )}
          {activeTab === TAB_TYPE.RANKING && (
            <RankingContent
              topShops={topShops}
              geoLocation={geoLocation}
              movePlaceDetail={movePlaceDetail}
            />
          )}
        </div>

        {/* 하단 공지 */}
        {noticeList.length > 0 && (
          <div className="notice-bell">
            <div className="notice-flexline">
              <p className="notice-title">공지</p>
              <p className="notice-text">{noticeList[0].title}</p>
            </div>
            <i
              className="material-icons"
              onClick={() => moveNoticeDetail(noticeList[0].noticeId)}
            >
              arrow_forward_ios
            </i>
          </div>
        )}

        {/* 하단 정보 */}
        <div className="termsbox">
          <div className="mt-3 flex-center division-box">
            <p onClick={() => history.push(RouterPath.terms)}>이용약관</p>
            <p onClick={() => history.push(RouterPath.privacypolish)}>
              개인정보처리방침
            </p>
            <p onClick={() => history.push(RouterPath.chicaterms)}>광고안내</p>
            <p onClick={() => history.push(RouterPath.license)}>라이센스</p>
          </div>
          <p className="terms-text">
            ㈜엠제이부티끄는 통신 판매 중개자로서 시카 뷰티버스의 거래 당사자가
            아니며, 입점 판매자가 등록한 상품정보 및 거래에 대해 책임을 지지
            않습니다.
          </p>
          <p className="footerlogo">© CHICA </p>
        </div>
      </Container>

      {/* 푸터 */}
      <Navi />
    </main>
  );
});
