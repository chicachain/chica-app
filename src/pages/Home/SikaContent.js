/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Container, Image } from 'react-bootstrap';
import { images } from '@assets';

// Util
import Utils from '../../common/utils/Utils';

// ===================================================================
// [ 홈 > 시카 추천 ]
// ===================================================================
export default React.memo(function SikaContent({
  pickShops = [],
  movePlaceDetail = () => null,
}) {
  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <div className="my-place">
      <div className="hotplace">
        {pickShops.length > 0 ? (
          pickShops.map((shop, index) => (
            <div
              className="place-info"
              key={`sika-shops-${index}`}
              onClick={() => movePlaceDetail(shop.shopId, shop.shopNm)}
            >
              <Image src={shop.fileUrl || images.hotplaceimg1} />
              <div>
                {/* 가게명 & 태그 */}
                <div
                  className={`info-titlebox ${
                    index === 0 || index === 0 ? 'hot-title' : ''
                  }`}
                >
                  <p className="info-title">
                    {shop.shopNm}
                    <span className="hash">{shop.tags}</span>
                  </p>
                </div>
                {/* 상세 */}
                <p className="info-subtitle">{shop.summary}</p>
                {/* 리뷰 & 거리 */}
                <div
                  className={`info-botitlebox ${
                    index === 0 || index === 0 ? 'hot-info' : ''
                  }`}
                >
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
            <p>설정한 지역에 매장이 없습니다.</p>
          </Container>
        )}
      </div>
    </div>
  );
});
