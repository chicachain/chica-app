/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { images } from '@assets';
import InfiniteScroll from 'react-infinite-scroll-component';

// Util
import Utils from '../../common/utils/Utils';

// Const
import ORDER_TYPES from '../../common/constants/OrderTypes';
import TAB_TYPES from '../../common/constants/TabTypes';

// ===================================================================
// [ 홈 > 검색 > 리뷰 리스트 ]
// ===================================================================
export default React.memo(function SearchShop({
  shopList = [],
  orderChangeHandler = () => null,
  placeOrderType = ORDER_TYPES.REG_DATE_DESC,
  pageChangeHandler = () => null,
  isLast = false,
}) {
  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <div className="result-div">
      {/* 필터 */}
      <div className="top-selectbox">
        <Button
          className={`${
            placeOrderType === ORDER_TYPES.REG_DATE_DESC ? 'active' : ''
          }`}
          onClick={() =>
            orderChangeHandler({
              tabValue: TAB_TYPES.SEARCH.SHOP,
              orderType: ORDER_TYPES.REG_DATE_DESC,
            })
          }
        >
          최신순
        </Button>
        <Button
          className={`${
            placeOrderType === ORDER_TYPES.DISTANCE_ASC ? 'active' : ''
          }`}
          onClick={() =>
            orderChangeHandler({
              tabValue: TAB_TYPES.SEARCH.SHOP,
              orderType: ORDER_TYPES.DISTANCE_ASC,
            })
          }
        >
          거리순
        </Button>
        <Button
          className={`${
            placeOrderType === ORDER_TYPES.RATING_DESC ? 'active' : ''
          }`}
          onClick={() =>
            orderChangeHandler({
              tabValue: TAB_TYPES.SEARCH.SHOP,
              orderType: ORDER_TYPES.RATING_DESC,
            })
          }
        >
          별점순
        </Button>
        <Button
          className={`${
            placeOrderType === ORDER_TYPES.REVIEW_CNT_DESC ? 'active' : ''
          }`}
          onClick={() =>
            orderChangeHandler({
              tabValue: TAB_TYPES.SEARCH.SHOP,
              orderType: ORDER_TYPES.REVIEW_CNT_DESC,
            })
          }
        >
          리뷰순
        </Button>
      </div>

      {/* 스크롤 리스트 */}
      {shopList.length > 0 && (
        <InfiniteScroll
          dataLength={shopList.length}
          next={pageChangeHandler}
          hasMore={!isLast}
          scrollableTarget="scroll-container"
        >
          {shopList.map((shop, index) => (
            <div className="resultbox" key={`result-box-${index}`}>
              <Image
                src={shop.fileUrl || images.hotplaceimg1}
                className="result-img"
              />
              <div className="result-info">
                <p className="info-tag">
                  <span>{shop.tags}</span>
                </p>
                <p className="result-title">{shop.shopNm || ' '}</p>
                <p className="result-summary">{shop.summary || ' '}</p>
                <div className="info-botitlebox">
                  <div className="load-box">
                    <p>{Utils.convertDistance(shop.distance)}</p>
                    <Image src={shop.locationIcon || images.icLocationSmB} />
                  </div>
                  <div className="center-line" />
                  <p>
                    리뷰
                    <span style={{ paddingLeft: '3px' }}>
                      {shop.reviewCnt || 0}
                    </span>
                  </p>
                  <div className="center-line" />
                  <p>
                    별점
                    <span style={{ paddingLeft: '3px' }}>
                      {shop.avgRating || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
});
