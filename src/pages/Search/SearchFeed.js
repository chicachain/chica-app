/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import { Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';

import InfiniteScroll from 'react-infinite-scroll-component';

// API
import { removeFeed } from '@api/community/feed';

// Custom Component
import { handleError } from '../../common/utils/HandleError';

// Util
import Utils from '../../common/utils/Utils';

// Constant
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/ComplainTypes';

const DEFAULT_PROFILE_URL =
  'data:image/png;base64,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';
const DEFAULT_CONTENT_URL = '/static/media/review-img.cbf46dac81e5474a470d.png';

// ===================================================================
// [ 홈 > 검색 > 리뷰 리스트 ]
// ===================================================================
export default React.memo(function SearchFeed({
  reviewList = [],
  pageChangeHandler = () => null,
  isLast = false,
  removeOneReviewById = () => null,
}) {
  const history = useHistory();

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [modalDisplay, setModalDisplay] = useState(false);
  const [isMyFeed, setIsMyFeed] = useState(false);
  const [targetFeedIdx, setTargetFeedIdx] = useState('');

  // TODO ::: 필요데이터 - 피드 해시테그, 샵 주소, 프로필 이미지
  // TODO ::: 컨텐츠 파일 슬라이드

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // Open 모달
  const openModal = ({ loginUserIdx, feedUserIdx, feedIdx }) => {
    if (loginUserIdx === feedUserIdx) setIsMyFeed(true);
    else setIsMyFeed(false);

    setModalDisplay(true);
    setTargetFeedIdx(feedIdx);
  };

  // Close 모달
  const closeModal = () => {
    setTargetFeedIdx('');
    setModalDisplay(false);
  };

  // 신고 페이지 이동
  const moveComplainPage = ({ type }) => {
    history.push({
      pathname: RouterPath.report,
      state: {
        type,
        idx: targetFeedIdx,
        url: window.location.href,
      },
    });
  };

  // 수정 페이지 이동
  const moveEditPage = () => {
    history.push({
      pathname: RouterPath.commbascreate,
      state: { feedIdx: targetFeedIdx },
    });
  };

  // ===================================================================
  // [ API ] 리뷰 삭제
  // ===================================================================
  const removeMyReview = async () => {
    try {
      // 메뉴
      const { data } = await removeFeed(targetFeedIdx);

      if (data.code === 200) {
        toast('게시글이 삭제되었습니다.');
        removeOneReviewById(targetFeedIdx);
        closeModal();
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <>
      {/* 스크롤 리스트 */}
      <div className="review-content">
        {reviewList.length > 0 && (
          <InfiniteScroll
            dataLength={reviewList.length}
            next={pageChangeHandler}
            hasMore={!isLast}
            scrollableTarget="scroll-container"
          >
            {reviewList.map((review, index) => (
              <div className="reviewbox" key={index}>
                <div className="review-profile">
                  <div className="profile">
                    {/* <Image src={review.profileImage} /> */}
                    <Image src={DEFAULT_PROFILE_URL} />
                    <div className="profile-info">
                      <p className="username">{review.mbNm || '유저명 Null'}</p>
                      <div className="profile-timezone">
                        <p>{Utils.calculatePassedTime(review.regDate)}</p>
                        <div className="center-line" />
                        <p>{`${review.resvCnt || 0} 번째 예약`}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="followbox"
                    onClick={() =>
                      openModal({
                        loginUserIdx: localStorage.getItem('mb_id'),
                        feedUserIdx: review.mbId,
                        feedIdx: review.feedId,
                      })
                    }
                  >
                    {/* <Button>{review.buttonText || '팔로우'}</Button> */}
                    <i className="material-icons">more_horiz</i>
                  </div>
                </div>
                <div className="review-img">
                  <Image src={DEFAULT_CONTENT_URL} />
                </div>
                <div className="review-body">
                  <p className="review-title">{review.title}</p>
                  <p className="review-text">{review.comment}</p>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>

      {/* Modal > 더보기 */}
      <Modal
        size="sm"
        show={modalDisplay}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-sm"
        id="comm-modal"
      >
        <Modal.Body>
          {/* 다른 계정 피드 - 신고 */}
          {!isMyFeed && (
            <>
              <div className="modal-body-gridline">
                <Button
                  className="modal-btn"
                  onClick={() =>
                    moveComplainPage({ type: EMAIL_CHECK_TYPES.FEED.type })
                  }
                >
                  리뷰/게시글 신고
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button
                  className="modal-btn"
                  onClick={() =>
                    moveComplainPage({ type: EMAIL_CHECK_TYPES.MEBMER.type })
                  }
                >
                  리뷰어 신고
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button className="modal-btn" onClick={closeModal}>
                  취소
                </Button>
              </div>
            </>
          )}
          {/* 내 피드 - 수정/삭제 */}
          {isMyFeed && (
            <>
              <div className="modal-body-gridline">
                <Button className="modal-btn" onClick={moveEditPage}>
                  수정
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button
                  className="modal-btn btn-danger"
                  style={{ color: '#FF0000', fontWeight: '400 ' }}
                  onClick={removeMyReview}
                >
                  삭제
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
});
