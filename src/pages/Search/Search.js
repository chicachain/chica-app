/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';

// API
import { searchShop } from '@api/home/home';

// Route Path
import RouterPath from '../../common/constants/RouterPath';

// Custom Component
import { handleError } from '../../common/utils/HandleError';
import SearchShop from './SearchShop';
import SearchStaff from './SearchStaff';
import SearchMenu from './SearchMenu';
import SearchFeed from './SearchFeed';

// Constant
import ORDER_TYPES from '../../common/constants/OrderTypes';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import TAB_TYPES from '../../common/constants/TabTypes';

// Redux Util
import { getCurrentGeoLocation } from '../../common/utils/GeoLocationUtil';

const SEARCH_HISTORY = 'search_history';
const PAGE_SIZE = 10;

// 위경도 데이터 객체
const initialGeolocation = {
  latitude: '',
  longitude: '',
};

// ===================================================================
// [ 홈 > 내주변샵 & 인기샵 & 오픈샵 & 배너 ]
// ===================================================================
export default React.memo(function Search(props) {
  const history = useHistory();

  // ===================================================================
  // [ state ]
  // ===================================================================

  const [geoLocation, setGeoLocation] = useState(initialGeolocation);

  const [searchText, setSearchText] = useState(''); // 검색어 상태 - 입력중
  const [searchTextConfirmed, setSearchTextConfirmed] = useState(''); // 검색어 상태 - 완료
  const [searchHistory, setSearchHistory] = useState([]); // 검색 이력 상태
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 활성화 상태
  const [modalShow, setModalShow] = useState(false);

  // 선택된 탭
  const [selectedTab, setSelectedTab] = useState(TAB_TYPES.SEARCH.SHOP);

  // 플레이스 리스트
  const [placeCnt, setPlaceCnt] = useState(0);
  const [placeList, setPlaceList] = useState([]);
  const [placePage, setPlacePage] = useState(1);
  const [isLastPlacePage, setIsLastPlacePage] = useState(false);
  const [placeOrderType, setPlaceOrderType] = useState(
    ORDER_TYPES.REG_DATE_DESC,
  );

  // 전문가 리스트
  const [staffCnt, setStaffCnt] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [staffPage, setStaffPage] = useState(1);
  const [isLastStaffPage, setIsLastStaffPage] = useState(false);

  // 메뉴 리스트
  const [menuCnt, setMenuCnt] = useState(0);
  const [menuList, setMenuList] = useState([]);
  const [menuPage, setMenuPage] = useState(1);
  const [isLastMenuPage, setIsLastMenuPage] = useState(false);

  // 리뷰 리스트
  const [reviewCnt, setReviewCnt] = useState(0);
  const [reviewList, setReviewList] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [isLastReviewPage, setIsLastReviewPage] = useState(false);

  // ===================================================================
  // [ util ]
  // ===================================================================

  // 현재 위경도 불러오기
  const getLocationInfo = async () => {
    const locationData = await getCurrentGeoLocation();
    if (locationData) setGeoLocation(locationData);
  };

  // 검색 이벤트
  const handleSearchSubmit = (keyword = searchText) => {
    if (keyword.trim() !== '') {
      // 최근 검색어 가져오기 ( <- LocalStorage )
      const keywordHistory = JSON.parse(
        localStorage.getItem(SEARCH_HISTORY) || JSON.stringify([]),
      );

      // 최근 검색어 등록 ( 중복 검사 )
      if (!keywordHistory.includes(keyword)) {
        localStorage.setItem(
          SEARCH_HISTORY,
          JSON.stringify([...keywordHistory, keyword]),
        );

        setSearchHistory([...keywordHistory, keyword]);
      }
    }

    setSearchTextConfirmed(keyword); // 검색어 정보 갱신
    setIsSearchActive(true); // 검색 결과 Flag
  };

  // 검색 이력 삭제 - 전체
  const handleDeleteSearchHistoryAll = () => {
    setSearchHistory([]);
    localStorage.setItem(SEARCH_HISTORY, JSON.stringify([]));
    setModalShow(false);
  };

  // 검색 이력 삭제 - 선택
  const handleDeleteSearchHistoryOne = index => {
    const updatedSearchHistory = [...searchHistory];
    updatedSearchHistory.splice(index, 1);
    setSearchHistory(updatedSearchHistory);
    localStorage.setItem(SEARCH_HISTORY, JSON.stringify(updatedSearchHistory));
  };

  // Enter 이벤트
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Tab 변경 이벤트
  const handleTabChange = tabValue => {
    setSelectedTab(tabValue);
  };

  // 정렬 기준 변경 이벤트
  const orderChangeHandler = ({ tabValue, orderType }) => {
    switch (tabValue) {
      // 플레이스
      case TAB_TYPES.SEARCH.SHOP: {
        setPlaceOrderType(orderType);
        initPlacePage({ type: TAB_TYPES.SEARCH.SHOP });
        break;
      }
      default:
        break;
    }
  };

  // 페이지 정보 초기화
  const initPlacePage = ({ type }) => {
    switch (type) {
      case TAB_TYPES.SEARCH.SHOP: {
        setPlacePage(1);
        break;
      }
      case TAB_TYPES.SEARCH.STAFF: {
        setStaffPage(1);
        break;
      }
      case TAB_TYPES.SEARCH.MENU: {
        setMenuPage(1);
        break;
      }
      case TAB_TYPES.SEARCH.FEED: {
        setFeedPage(1);
        break;
      }
      default:
        break;
    }
  };

  // 리뷰 삭제 ( 리스트에서 필터 )
  const removeOneReviewById = feedId => {
    const filteredList = reviewList.filter(review => review.feedId !== feedId);
    setReviewList(filteredList);
  };

  // ===================================================================
  // [ API ] 검색 리스트 ( 플레이스 )
  // ===================================================================
  const getPlaceList = async ({ isNextPage = false }) => {
    try {
      // 플레이스
      const { data: placeData } = await searchShop({
        searchType: TAB_TYPES.SEARCH.SHOP,
        shopType: SHOP_TYPES.Waxing.type, // 왁싱 고정
        orderType: placeOrderType,
        // keyword: searchTextConfirmed,
        page: placePage,
        size: PAGE_SIZE,
        longitude: geoLocation.longitude,
        latitude: geoLocation.latitude,
      });

      if (placeData.code === 200) {
        setPlaceCnt(placeData.data.totalCnt);
        setIsLastPlacePage(placeData.data.isLast);

        if (isNextPage) setPlaceList([...placeList, ...placeData.data.list]);
        else setPlaceList([...placeData.data.list]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ====================== =============================================
  // [ API ] 검색 리스트 ( 전문가 )
  // ===================================================================
  const getStaffList = async ({ isNextPage = false }) => {
    try {
      // 전문가
      const { data: staffData } = await searchShop({
        searchType: TAB_TYPES.SEARCH.STAFF,
        keyword: searchTextConfirmed,
        page: staffPage,
        size: PAGE_SIZE,
      });

      if (staffData.code === 200) {
        setStaffCnt(staffData.data.totalCnt);
        setIsLastStaffPage(staffData.data.isLast);

        if (isNextPage) setStaffList([...staffList, ...staffData.data.list]);
        else setStaffList([...staffData.data.list]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 검색 리스트 ( 메뉴 )
  // ===================================================================
  const getMenuList = async ({ isNextPage = false }) => {
    try {
      // 메뉴
      const { data: menuData } = await searchShop({
        searchType: TAB_TYPES.SEARCH.MENU,
        keyword: searchTextConfirmed,
        page: menuPage,
        size: PAGE_SIZE,
      });

      if (menuData.code === 200) {
        setMenuCnt(menuData.data.totalCnt);
        setIsLastMenuPage(menuData.data.isLast);

        if (isNextPage) setMenuList([...menuList, ...menuData.data.list]);
        else setMenuList([...menuData.data.list]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 검색 리스트 ( 리뷰 )
  // ===================================================================
  const getReviewList = async ({ isNextPage = false }) => {
    try {
      // 리뷰
      const { data: reviewData } = await searchShop({
        searchType: TAB_TYPES.SEARCH.FEED,
        keyword: searchTextConfirmed,
        page: reviewPage,
        size: PAGE_SIZE,
      });

      if (reviewData.code === 200) {
        setReviewCnt(reviewData.data.totalCnt);
        setIsLastReviewPage(reviewData.data.isLast);

        if (isNextPage) setReviewList([...reviewList, ...reviewData.data.list]);
        else setReviewList([...reviewData.data.list]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // '최근 검색어' & '현재 위경도' 불러오기
  useEffect(() => {
    getLocationInfo();

    if (localStorage.getItem(SEARCH_HISTORY)) {
      setSearchHistory(JSON.parse(localStorage.getItem(SEARCH_HISTORY)));
    }
  }, []);

  // '검색' 완료 - 플레이스
  useEffect(() => {
    if (isSearchActive && geoLocation.latitude) {
      getPlaceList({ isNextPage: false });
    }
  }, [searchTextConfirmed, geoLocation]);

  // '검색' 완료 - 전문가, 메뉴, 리뷰
  useEffect(() => {
    if (isSearchActive) {
      getStaffList({ isNextPage: false });
      getMenuList({ isNextPage: false });
      getReviewList({ isNextPage: false });
    }
  }, [searchTextConfirmed]);

  // -------------------------------------------------------------------
  // [ 필터 변경 ]
  // -------------------------------------------------------------------

  // '플레이스 필터' 변경
  useEffect(() => {
    if (geoLocation.latitude) {
      if (placePage === 1) getPlaceList({ isNextPage: false });
      else initPlacePage({ type: TAB_TYPES.SEARCH.SHOP });
    }
  }, [placeOrderType, geoLocation]);

  // -------------------------------------------------------------------
  // [ 페이지 변경 ]
  // -------------------------------------------------------------------

  // '플레이스 페이지' 변경
  useEffect(() => {
    if (geoLocation.latitude) {
      if (placePage === 1) getPlaceList({ isNextPage: false });
      else getPlaceList({ isNextPage: true });
    }
  }, [placePage, geoLocation]);

  // '스테프 페이지' 변경
  useEffect(() => {
    if (staffPage === 1) getStaffList({ isNextPage: false });
    else getStaffList({ isNextPage: true });
  }, [staffPage]);

  // 메뉴 페이지 변경
  useEffect(() => {
    if (placePage === 1) getMenuList({ isNextPage: false });
    else getMenuList({ isNextPage: true });
  }, [menuPage]);

  // 리뷰 페이지 변경
  useEffect(() => {
    if (placePage === 1) getReviewList({ isNextPage: false });
    else getReviewList({ isNextPage: true });
  }, [reviewPage]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="search-page">
      {/* 헤더 - 검색어 & 탭 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            {/* 뒤로가기 */}
            <i
              className="material-icons"
              onClick={() => {
                history.push(RouterPath.home);
              }}
            >
              arrow_back
            </i>
            {/* 검색어 */}
            <Form.Group className="header-search">
              <Image src={images.IcSerachBlack} />
              <Form.Control
                placeholder="뷰티 플레이스, 전문가를 검색하세요"
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress} // Enter 키 이벤트 핸들러
              />
            </Form.Group>
          </div>

          {/* 탭 헤더 */}
          <div style={{ marginTop: '0.5rem' }}>
            {isSearchActive && (
              <div className="tab-menu">
                <Button
                  className={
                    selectedTab === TAB_TYPES.SEARCH.SHOP ? 'active' : ''
                  }
                  onClick={() => handleTabChange(TAB_TYPES.SEARCH.SHOP)}
                >
                  플레이스<p>{placeCnt}</p>
                </Button>
                <Button
                  className={
                    selectedTab === TAB_TYPES.SEARCH.STAFF ? 'active' : ''
                  }
                  onClick={() => handleTabChange(TAB_TYPES.SEARCH.STAFF)}
                >
                  전문가<p>{staffCnt}</p>
                </Button>
                <Button
                  className={
                    selectedTab === TAB_TYPES.SEARCH.MENU ? 'active' : ''
                  }
                  onClick={() => handleTabChange(TAB_TYPES.SEARCH.MENU)}
                >
                  메뉴<p>{menuCnt}</p>
                </Button>
                <Button
                  className={
                    selectedTab === TAB_TYPES.SEARCH.FEED ? 'active' : ''
                  }
                  onClick={() => handleTabChange(TAB_TYPES.SEARCH.FEED)}
                >
                  리뷰<p>{reviewCnt}</p>
                </Button>
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* 바디 - 플레이스, 전문가, 메뉴 || 리뷰 */}
      <Container
        id="scroll-container"
        className="container-custom search-field"
      >
        {/* 검색 전 */}
        {!isSearchActive && (
          <div className="search-padding">
            {/* 최근 검색 & 전체 삭제 */}
            <div className="search-recent">
              <h6>최근 검색</h6>
              {searchHistory.length > 0 && (
                <p className="all-delete" onClick={() => setModalShow(true)}>
                  전체 삭제
                </p>
              )}
            </div>

            {/* 검색 이력 - History 탐색 */}
            {searchHistory.length === 0 ? (
              <div className="no-searchdata">
                <Image src={images.IcSearchNo} />
                <p>검색 이력이 없습니다.</p>
              </div>
            ) : (
              <div className="search-record">
                {searchHistory.map((keyword, index) => (
                  <div className="recordbox" key={index}>
                    {/* 검색어 */}
                    <p
                      onClick={() => {
                        handleSearchSubmit(keyword);
                      }}
                    >
                      {keyword}
                    </p>
                    {/* 삭제 */}
                    <i
                      className="material-icons"
                      onClick={() => {
                        handleDeleteSearchHistoryOne(index);
                      }}
                    >
                      close
                    </i>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 검색 후 */}
        {isSearchActive && (
          <>
            {/* 플레이스 */}
            {selectedTab === TAB_TYPES.SEARCH.SHOP && (
              <SearchShop
                shopList={placeList}
                orderChangeHandler={orderChangeHandler}
                placeOrderType={placeOrderType}
                pageChangeHandler={() => setPlacePage(placePage + 1)}
                isLast={isLastPlacePage}
              />
            )}
            {/* 전문가 */}
            {selectedTab === TAB_TYPES.SEARCH.STAFF && (
              <SearchStaff
                staffList={staffList}
                pageChangeHandler={() => setStaffPage(staffPage + 1)}
                isLast={isLastStaffPage}
              />
            )}
            {/* 메뉴 */}
            {selectedTab === TAB_TYPES.SEARCH.MENU && (
              <SearchMenu
                menuList={menuList}
                pageChangeHandler={() => setMenuPage(menuPage + 1)}
                isLast={isLastMenuPage}
              />
            )}
            {/* 리뷰 */}
            {selectedTab === TAB_TYPES.SEARCH.FEED && (
              <SearchFeed
                reviewList={reviewList}
                pageChangeHandler={() => setReviewPage(reviewPage + 1)}
                isLast={isLastReviewPage}
                removeOneReviewById={removeOneReviewById}
              />
            )}
          </>
        )}
      </Container>

      {/* 최근 검색어 전체 삭제 Modal */}
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="del-modal"
      >
        <Modal.Body>
          <div className="modal-body-gridline">
            <Image src={images.IcTrash} />
            <p>최근 검색기록을 모두 삭제할까요?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="modal-btn"
            onClick={() => setModalShow(false)}
            variant="outline-primary"
          >
            취소
          </Button>
          <Button className="modal-btn" onClick={handleDeleteSearchHistoryAll}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
});
