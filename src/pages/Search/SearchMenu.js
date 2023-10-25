/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Image } from 'react-bootstrap';
import { images } from '@assets';
import InfiniteScroll from 'react-infinite-scroll-component';

// Util
import Utils from '../../common/utils/Utils';

// ===================================================================
// [ 홈 > 검색 > 메뉴 리스트 ]
// ===================================================================
export default React.memo(function SearchMenu({
  menuList = [],
  pageChangeHandler = () => null,
  isLast = false,
}) {
  // 할인가 계산
  const calCurPrice = (orgPrice, saleRate) => {
    return Utils.numberComma(orgPrice * (1 - saleRate));
  };

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <div className="menu-line">
      {menuList.length > 0 && (
        <InfiniteScroll
          dataLength={menuList.length}
          next={pageChangeHandler}
          hasMore={!isLast}
          scrollableTarget="scroll-container"
        >
          {/* 메뉴 리스트 */}
          {menuList.map((menu, index) => (
            <div className="menu-box" key={`menu-box-${index}`}>
              <Image src={menu.fileUrl || images.detailThumb} />
              <div className="menu-fontbox">
                <p className="menu-title">{menu.menuNm}</p>
                <p className="menu-sale">
                  {calCurPrice(menu.price, menu.saleRate)}
                  {+menu.saleRate !== 0 && (
                    <>
                      <span className="cost">
                        {Utils.numberComma(menu.price)}
                      </span>
                      <span className="discount">{`${
                        menu.saleRate * 100
                      }% 할인`}</span>
                    </>
                  )}
                </p>
                <p className="menu-time">{menu.summary}</p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
});
