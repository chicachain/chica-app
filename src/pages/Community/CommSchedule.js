/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
// Custom Component
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import Moment from 'react-moment';
import { handleError } from '../../common/utils/HandleError';
import { completeReservation } from '../../api/reservation/reservations';
import 'moment/locale/ko';
import SHOP_TYPES from '../../common/constants/ShopTypes';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function CommSchedule(props) {
  const history = useHistory();
  const [fetching, isFetching] = useState(false);
  const [searchResults, setSearchResult] = useState([]);

  const writeReview = e => {
    history.push({
      pathname: `/community/revcreate`,
      state: {
        category: e.category,
        resvId: e.resvId,
        shopNm: e.shopNm,
      },
    });
  };
  const backPage = () => {
    history.push({ pathname: `/community` });
  };
  const compareCategory = e => {
    return e === SHOP_TYPES[e].type ? SHOP_TYPES[e].name : '';
  };

  /**
   * api
   */
  const getSearchResult = async () => {
    isFetching(true);
    try {
      const { data } = await completeReservation();
      setSearchResult(searchResults.concat(data.data.list));
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };
  /**
   * useEffect
   */
  useEffect(() => {
    if (fetching === false) {
      getSearchResult();
    }
  }, []);

  return (
    <main id="community-schedule">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons pointer" onClick={backPage}>
              arrow_back
            </i>
            <h6>리뷰</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="service-line">
          <h6 className="service-h6">
            {searchResults.length <= 0
              ? '이용한 스케쥴이 없습니다.'
              : '이용완료된 스케쥴을 선택해주세요.'}
          </h6>
          {searchResults &&
            searchResults.length > 0 &&
            searchResults.map((result, index) => (
              <div className="board-box" key={index}>
                <div className="label-title">
                  <p className="label">{result.tags}</p>
                  <p className="label-check">이용완료</p>
                </div>
                <p className="board-title">{result.shopNm}</p>
                <div className="mt-2">
                  <div className="board-grid">
                    <p className="grid-frist">일정</p>
                    <p className="grid-two">
                      <Moment
                        date={result.resvDate}
                        format="YYYY-MM-DD (ddd) A hh:mm"
                      />
                      {` / ${result.resvCnt}번째 방문`}
                    </p>
                  </div>
                  <div
                    className="board-grid"
                    style={{ paddingTop: '0.2rem', paddingBottom: '0.2rem' }}
                  >
                    <p className="grid-frist">아티스트</p>
                    <p className="grid-two">{`${result.staffNm} 디자이너`}</p>
                  </div>
                  <div className="board-grid">
                    <p className="grid-frist">서비스</p>
                    <p className="grid-two">
                      {compareCategory(result.category)}
                    </p>
                  </div>
                </div>
                <Button
                  className="board-btn"
                  onClick={() => writeReview(result)}
                >
                  리뷰 쓰기
                </Button>
              </div>
            ))}
        </div>
      </Container>
    </main>
  );
});
