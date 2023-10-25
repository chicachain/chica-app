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
// import Utils from '../../common/utils/Utils';

// const DEFAULT_PROFILE = 'http://via.placeholder.com/640x480';

// ===================================================================
// [ 홈 > 검색 > 리뷰 리스트 ]
// ===================================================================
export default React.memo(function SearchStaff({
  staffList = [],
  pageChangeHandler = () => null,
  isLast = false,
}) {
  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <div className="designer-line">
      {/* 스테프 리스트 */}
      {staffList.length > 0 && (
        <InfiniteScroll
          dataLength={staffList.length}
          next={pageChangeHandler}
          hasMore={!isLast}
          scrollableTarget="scroll-container"
        >
          {staffList.map((staff, index) => (
            <div className="designer-box" key={`designer-box-${index}`}>
              <div className="designer-item">
                <Image
                  src={staff.fileUrl || images.designer1}
                  // onClick={handleImageClick}
                />
              </div>
              <div className="designer-fontbox">
                <p className="designer-title">{staff.staffNm}</p>
                <p className="designer-summary">{staff.summary}</p>
                <div className="reviewstar-box">
                  <p>
                    평점
                    <span style={{ paddingLeft: '3px' }}>
                      {staff.favCnt || 0}
                    </span>
                  </p>
                  <div className="center-line" />
                  <p>
                    리뷰
                    <span style={{ paddingLeft: '3px' }}>
                      {staff.reviewCnt || 0}
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
