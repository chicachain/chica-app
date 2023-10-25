/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import { Navi } from '@components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Utils from '@common/utils/Utils';
import { getShopList } from '../../api/shop/place';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import ORDER_TYPES from '../../common/constants/OrderTypes';
import { handleError } from '../../common/utils/HandleError';
import RouterPath from '../../common/constants/RouterPath';
import { getCurrentGeoLocation } from '../../common/utils/GeoLocationUtil';

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function Place(props) {
  const history = useHistory();
  /**
   * state
   */
  const sortTypes = {
    newest: {
      type: ORDER_TYPES.REG_DATE_DESC,
      name: '최신',
      disabled: false,
    },
    distance: {
      type: ORDER_TYPES.DISTANCE_ASC,
      name: '거리',
      disabled: false,
    },
    point: {
      type: ORDER_TYPES.RATING_DESC,
      name: '별점',
      disabled: false,
    },
    review: {
      type: ORDER_TYPES.REVIEW_CNT_DESC,
      name: '리뷰',
      disabled: false,
    },
  };
  const state = history.location.state || {};
  const [geolocation, setGeolocation] = useState();
  const [activeTab, setActiveTab] = useState(
    state.shopType ? state.shopType : SHOP_TYPES.ALL.type,
  );
  const [activeTabName, setActiveTabName] = useState(
    state.shopTypeName ? state.shopTypeName : SHOP_TYPES.ALL.name,
  );
  const [activeSort, setActiveSort] = useState(sortTypes.newest.type);
  const [searchResults, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, isFetching] = useState(false);
  const [totalCnt, setTotalCnt] = useState();

  /**
   * api
   */

  const getSearchResult = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
        keyword: '',
        searchType: 'TITLE',
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        orderType: activeSort,
        shopType: activeTab,
      };
      const { data } = await getShopList(params);
      setTotalCnt(data.data.totalCnt);
      setHasMore(!data.data.isLast);
      setSearchResult(searchResults.concat(data.data.list));
      setPage(pageNo);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  /**
   * event
   */
  const mappage = () => {
    history.push({
      pathname: RouterPath.placeMap,
      state: {
        // latitude: geolocation.latitude,
        // longitude: geolocation.longitude,
        // shopType: activeTab,
        totalCnt,
        shopType: activeTab,
        shopTypeName: activeTabName,
        searchResults,
      },
    });
  };

  // 현재 위경도 불러오기
  const getLocationInfo = async () => {
    try {
      const locationData = await getCurrentGeoLocation();
      if (locationData) {
        setGeolocation({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getLocationInfo();
  }, []);
  useEffect(() => {
    if (geolocation && fetching === false) {
      getSearchResult(1);
      setHasMore(true);
    }
  }, [activeSort, activeTab, geolocation]);

  return (
    <main id="place">
      <header>
        <Container>
          <div className="header-grid">
            <div className="header-flex">
              <Image src={images.logoHeader} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', overflow: 'auto' }}>
            <div className="tab-menu">
              {Object.keys(SHOP_TYPES).map((key, index) => (
                <Button
                  key={key}
                  className={activeTab === SHOP_TYPES[key].type ? 'active' : ''}
                  disabled={
                    SHOP_TYPES.ALL.type !== SHOP_TYPES[key].type &&
                    SHOP_TYPES.Waxing.type !== SHOP_TYPES[key].type
                  }
                  onClick={() => {
                    setActiveTab(SHOP_TYPES[key].type);
                    setActiveTabName(SHOP_TYPES[key].name);
                    setPage(1);
                    if (activeTab !== SHOP_TYPES[key].type) {
                      setActiveSort(sortTypes.newest.type);
                      setSearchResult([]);
                    }
                  }}
                >
                  {SHOP_TYPES[key].name}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div className="result-div">
          <div className="top-selectbox">
            {Object.keys(sortTypes).map((key, index) => (
              <Button
                key={index}
                className={activeSort === sortTypes[key].type ? 'active' : ''}
                disabled={sortTypes[key].disabled}
                onClick={() => {
                  setActiveSort(sortTypes[key].type);
                  setPage(1);
                  if (activeSort !== sortTypes[key].type) setSearchResult([]);
                }}
              >
                {sortTypes[key].name}
              </Button>
            ))}
          </div>
          <InfiniteScroll
            dataLength={searchResults.length}
            next={() => {
              getSearchResult(page + 1);
            }}
            hasMore={hasMore && !fetching}
            scrollableTarget="scrollableDiv"
          >
            {searchResults &&
              searchResults.length > 0 &&
              searchResults.map((result, index) => (
                <div
                  className="resultbox"
                  key={index}
                  onClick={() => {
                    history.push(`${RouterPath.placeDetail}/${result.shopId}`);
                  }}
                >
                  <Image src={result.fileUrl} className={`result-img `} />
                  <div className="result-info">
                    <p className="info-tag">
                      <span>{result.tags}</span>
                    </p>
                    <p className="result-title">{result.shopNm}</p>
                    <div className="info-botitlebox bot-color">
                      <div className="load-box">
                        <p>{result.location}</p>
                        <p>{Utils.convertDistance(result.distance)}</p>
                        <Image src={images.icLocationSmB} />
                      </div>
                      <div className="center-line" />
                      <p>
                        리뷰
                        <span style={{ paddingLeft: '3px' }}>
                          {result.reviewCnt !== null
                            ? Utils.changeNumberComma(
                                `${result.reviewCnt}` || 0,
                              )
                            : 0}
                        </span>
                      </p>

                      {result.avgRating !== null ? (
                        <>
                          <div className="center-line" />
                          <p>
                            별점
                            <span style={{ paddingLeft: '3px' }}>
                              {result.avgRating
                                ? result.avgRating.toFixed(1)
                                : '-'}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </InfiniteScroll>
        </div>
        <Image src={images.IcMap} className="icon-map" onClick={mappage} />
      </Container>
      {/* 푸터 */}
      <Navi />
    </main>
  );
});
