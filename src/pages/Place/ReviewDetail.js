/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { useHistory, useLocation, useParams } from 'react-router-dom';
// Custom Component
import 'swiper/swiper-bundle.css';

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import { handleError } from '../../common/utils/HandleError';
import { getShopReviewDetail } from '../../api/shop/place';
import { Utils } from '../../common';
import 'moment/locale/ko';
import ShopTypes from '../../common/constants/ShopTypes';
import RouterPath from '../../common/constants/RouterPath';
import ComplainTypes from '../../common/constants/ComplainTypes';
import { removeFeed } from '../../api/community/feed';
import CustomSwal from '../../components/CustomSwal';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
// TODO :: 리뷰 한 사람에 대한 profile img 없음

export default React.memo(function ReviewDetail(props) {
  const history = useHistory();
  const { shopId, feedId } = useParams();
  const mbId = localStorage.getItem('mb_id');
  /**
   * state
   */
  const [modalShow, setModalShow] = useState(false);
  const [reviewDetail, setReviewDetail] = useState({});

  /**
   * api
   */
  const getReviewDetail = async () => {
    try {
      const { data } = await getShopReviewDetail(feedId);
      setReviewDetail(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const modifyFeed = async () => {
    history.push(`${RouterPath.commrevmodify}/${feedId}`);
  };

  const removeCheck = e => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      removeReview(e);
    }
  };

  const removeReview = async e => {
    const { target } = e;
    target.disabled = true;
    try {
      const { data } = await removeFeed(feedId);
      toast('삭제되었습니다.');
      history.goBack();
      modalClose();
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  /**
   * event
   */

  const clickmodal = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };
  const modalClose = () => {
    setModalShow(false);
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getReviewDetail();
  }, []);
  return (
    <main id="reviewtab-detail">
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
            <h6>{reviewDetail.shopNm}</h6>
            <p className="page-count" />
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="review-profile">
          <div className="profile">
            <Image src={reviewDetail.profileUrl} />
            <div className="profile-info">
              <p className="username">{reviewDetail.staffNm}</p>
              <div className="profile-timezone">
                <p>
                  리뷰 {Utils.changeNumberComma(reviewDetail.reviewCnt || '0')}
                </p>
                <div className="center-line" />
                <p>
                  <Moment fromNow interval={0} date={reviewDetail.regDate} />
                </p>
              </div>
            </div>
          </div>
          <div className="followbox">
            <i className="material-icons" onClick={clickmodal}>
              more_horiz
            </i>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          onSwiper={swiper => {
            // console.log(swiper);
          }}
          navigation
        >
          {reviewDetail.files &&
            reviewDetail.files.length > 0 &&
            reviewDetail.files.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Image src={item.fileUrl} className="detailmain-img" />
                </SwiperSlide>
              );
            })}
        </Swiper>
        <div className="reviewbox">
          <div className="detailbox-detail">
            <div className="grid-detail">
              <p className="grid-detail-frist">일정</p>
              <p className="grid-detail-two">
                <Moment
                  date={reviewDetail.regDate}
                  format="YYYY-MM-DD (ddd) A hh:mm"
                />
                &nbsp;/ {Utils.changeNumberComma(reviewDetail.resvCnt)}번째 방문
              </p>
            </div>
            <div className="grid-detail">
              <p className="grid-detail-frist">아티스트</p>
              <p className="grid-detail-two">{reviewDetail.staffNm}</p>
            </div>
            <div className="grid-detail">
              <p className="grid-detail-frist">서비스</p>
              <p className="grid-detail-two">
                {ShopTypes[reviewDetail.category]?.name}
              </p>
            </div>
          </div>
          <p className="review-text pre-line">{reviewDetail.comment}</p>
        </div>
      </Container>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="review-modal"
      >
        {String(mbId) !== String(reviewDetail.mbId) ? (
          <Modal.Body>
            <div className="modal-body-gridline">
              <Button
                className="modal-btn"
                onClick={() => {
                  history.push({
                    pathname: RouterPath.report,
                    state: {
                      type: ComplainTypes.FEED.type,
                      idx: reviewDetail.feedId,
                      url: window.location.href,
                    },
                  });
                }}
              >
                리뷰/게시글 신고
              </Button>
            </div>
            <div className="modal-body-gridline">
              <Button
                className="modal-btn"
                onClick={() => {
                  history.push({
                    pathname: RouterPath.report,
                    state: {
                      type: ComplainTypes.MEMBER.type,
                      idx: reviewDetail.feedId,
                      url: window.location.href,
                    },
                  });
                }}
              >
                리뷰어 신고
              </Button>
            </div>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={modalClose}>
                취소
              </Button>
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={modifyFeed}>
                수정
              </Button>
            </div>
            <div className="modal-body-gridline">
              <Button
                className="modal-btn btn-danger"
                style={{ color: '#FF0000', fontWeight: '400 ' }}
                onClick={removeCheck}
              >
                삭제
              </Button>
            </div>
          </Modal.Body>
        )}

        <Modal.Footer />
      </Modal>
      {/* 푸터 */}
    </main>
  );
});
