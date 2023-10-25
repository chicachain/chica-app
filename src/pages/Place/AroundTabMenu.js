/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import { getShopAroundList } from '../../api/shop/place';
import Utils from '../../common/utils/Utils';

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function AroundTabMenu(props) {
  const history = useHistory();

  /**
   * state
   */
  const state = history.location.state || {};
  const { shopId } = useParams();
  const [arounds, setArounds] = useState([]);

  /**
   * api
   */
  const getArroundList = async () => {
    try {
      const { data } = await getShopAroundList(shopId);
      setArounds(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */
  const goHometab = () => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };

  const goMaptab = () => {
    history.push({
      pathname: `${RouterPath.placeMapTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goMenutab = () => {
    history.push({
      pathname: `${RouterPath.placeMenutab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goArttab = () => {
    history.push({
      pathname: `${RouterPath.placeArtTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goReviewtab = () => {
    history.push({
      pathname: `${RouterPath.placeReviewtab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goAroundtab = () => {
    history.push({
      pathname: `${RouterPath.placeAroundtab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goEventtab = () => {
    history.push({
      pathname: `${RouterPath.placeEventTab}/${shopId}`,
      state: { shopNm: state.shopNm },
    });
  };
  const goPlaceDetail = id => {
    history.push({
      pathname: `${RouterPath.placeDetail}/${id}`,
      state: { shopNm: state.shopNm },
    });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getArroundList();
  }, []);
  return (
    <main id="around-tabmenu">
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons"
              onClick={() => {
                history.goBack();
              }}
            >
              arrow_back
            </i>
            <p className="page-title ">{state.shopNm}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="tab-menu">
              <Button onClick={goHometab}>홈</Button>
              <Button onClick={goMenutab}>메뉴</Button>
              <Button onClick={goArttab}>아티스트</Button>
              <Button onClick={goReviewtab}>리뷰</Button>
              <Button onClick={goMaptab}>지도</Button>
              <Button onClick={goEventtab}>이벤트</Button>
              <Button
                className="active"
                onClick={() => {
                  return false;
                }}
              >
                주변
              </Button>
            </div>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div style={{ padding: '1rem', marginTop: '2rem' }}>
          {arounds && arounds.length > 0 ? (
            arounds.map((around, index) => (
              <div
                className="resultbox"
                key={index}
                onClick={() => {
                  goPlaceDetail(around.shopId);
                }}
              >
                <Image src={around.fileUrl} className="result-img" />
                <div className="result-info">
                  <p className="info-tag tag-color">
                    <span>{around.tags}</span>
                  </p>
                  <p className="result-title title-color">{around.shopNm}</p>
                  <div className="info-botitlebox bot-color">
                    <div className="load-box">
                      <p>{Utils.convertDistance(around.distance)}</p>
                      <Image src={images.icLocationSmB} />
                    </div>
                    <div className="center-line" />
                    <p>
                      리뷰
                      <span style={{ paddingLeft: '3px' }}>
                        {around.reviewCnt
                          ? Utils.changeNumberComma(around.reviewCnt || '0')
                          : '0'}
                      </span>
                    </p>
                    {around.avgRating != null && (
                      <>
                        <div className="center-line" />
                        <p>
                          별점
                          <span style={{ paddingLeft: '3px' }}>
                            {around.avgRating
                              ? around.avgRating.toFixed(1)
                              : '-'}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex justify-content-center">
              <p>주변 매장 정보가 존재하지 않습니다.</p>
            </div>
          )}
        </div>
      </Container>
      {/* 푸터 */}
    </main>
  );
});
