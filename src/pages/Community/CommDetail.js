/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import 'moment/locale/ko'; // 한국어 로케일 파일 import

// Swiper
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// API
import {
  getFeedDetail,
  getCommentList,
  removeFeed,
  saveComment,
  removeComment,
} from '@api/community/feed';

// Custom Component
import InfiniteScroll from 'react-infinite-scroll-component';
import { handleError } from '../../common/utils/HandleError';

// Constant
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/ComplainTypes';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import { saveLiked } from '../../api/community/feed';
import { Utils } from '../../common';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// 초기 게시물 상세 정보
const initialFeedDetail = {
  category: '',
  comment: '',
  commentCnt: '',
  feedId: '',
  files: [],
  likeCnt: 0,
  mbId: '',
  mbNm: '',
  menuNm: '',
  profileNm: '',
  profileUrl: '',
  rating: 0,
  regDate: '',
  resvCnt: 0,
  resvId: '',
  reviewCnt: 0,
  shopId: '',
  shopNm: '',
  staffId: '',
  staffNm: '',
  title: '',
  viewCnt: 0,
  resvDate: '',
};

// 초기 댓글 상세 정보
const initialCommentDetail = {
  comment: '',
  commentId: '',
  feedId: '',
  mbId: '',
  nickname: '',
  profileNm: '',
  profileUrl: '',
  regDate: '',
  updDate: '',
};

// ===================================================================
// [ 커뮤니티 > 상세 & 댓글 ]
// ===================================================================
export default React.memo(function CommDetail(props) {
  const history = useHistory();

  const mbId = localStorage.getItem('mb_id'); // 회원 Idx
  const feedId = history.location.state; // Feed Idx

  // ===================================================================
  // [ State ]
  // ===================================================================

  // 게시물
  const [feedDetail, setFeedDetail] = useState(initialFeedDetail); // 상세
  const [isMyFeed, setIsMyFeed] = useState(false); // 내 피드

  const [feedModalDisplay, setFeedModalDisplay] = useState(false); // 모달

  // 댓글
  const [commentList, setCommentList] = useState([]); // 리스트
  const [commentPage, setCommentPage] = useState(1); // 페이지
  const [commentCnt, setCommentCnt] = useState(0); // 총 수
  const [isLastComment, setIsLastComment] = useState(false); // 마지막 코멘트
  const [targetComment, setTargetComment] = useState(initialCommentDetail); // 선택된 코멘트 ( 더보기 )
  const [isMyComment, setIsMyComment] = useState(false); // 내 등록 댓글

  const [commentModalDisplay, setCommentModalDisplay] = useState(false); // 모달 - 더보기

  const [commentInput, setCommentInput] = useState(''); // 댓글 입력

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // 신고하기 페이지 이동
  const moveComplainPage = ({ type, idx }) => {
    history.push({
      pathname: RouterPath.report,
      state: { type, idx, url: window.location.href },
    });
  };

  // Open 피드 더보기
  const openFeedMore = () => {
    setFeedModalDisplay(true);
  };

  // Close 피드 더보기
  const closeFeedMore = () => {
    setFeedModalDisplay(false);
  };

  // 피드 수정 페이지 이동
  const moveEditPage = () => {
    history.push({
      pathname: feedDetail.resvId
        ? `${RouterPath.commrevmodify}/${feedDetail.feedId}` // 리뷰
        : `${RouterPath.commbasmodify}/${feedDetail.feedId}`, // 일반
    });
  };

  // Open 댓글 더보기
  const openCommentMore = comment => {
    if (+mbId === +comment.mbId) setIsMyComment(true);
    else setIsMyComment(false);

    setTargetComment(comment);
    setCommentModalDisplay(true);
  };

  // Close 댓글 더보기
  const closeCommentMore = () => {
    setTargetComment(initialCommentDetail);
    setCommentModalDisplay(false);
  };

  // 댓글 수정 페이지 이동
  const moveCommentEditPage = () => {
    history.push({
      pathname: RouterPath.commre,
      state: {
        idx: targetComment.commentId,
        comment: targetComment.comment,
        feedIdx: feedId,
      },
    });
  };

  const handleLike = async e => {
    if (feedDetail.isLiked) {
      await registLiked();
      toast('공감 취소되었습니다.');
    } else {
      await registLiked();
      toast('공감되었습니다.');
    }
  };

  // ===================================================================
  // [ API ] 게시물 '상세' 정보 가져오기
  // ===================================================================
  const getFeedInfo = async idx => {
    try {
      const { data } = await getFeedDetail(idx);

      if (data.code === 200) {
        const { data: feedInfo } = data;
        setFeedDetail(feedInfo);
        if (+mbId === +feedInfo.mbId) setIsMyFeed(true);
        else setIsMyFeed(false);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // ===================================================================
  // [ API ] 게시물 '댓글' 정보 가져오기
  // ===================================================================
  const getComments = async idx => {
    try {
      const { data } = await getCommentList({
        feedId: idx,
        page: commentPage,
        size: 3,
      });

      if (data.code === 200) {
        const { data: commentInfo } = data;
        setCommentCnt(commentInfo.totalCnt);
        setIsLastComment(commentInfo.isLast);

        if (commentPage === 1) setCommentList([...commentInfo.list]);
        else setCommentList([...commentList, ...commentInfo.list]);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // ===================================================================
  // [ API ] 피드 삭제
  // ===================================================================
  const removeMyReview = async () => {
    try {
      // 메뉴
      const { data } = await removeFeed(feedDetail.feedId);

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.community,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 공감하기 등록
  // ===================================================================
  const registLiked = async () => {
    try {
      const { data } = await saveLiked(feedId);
      setFeedDetail(prev => {
        return { ...prev, isLiked: !prev.isLiked };
      });
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 관심 리뷰 등록/취소
  // ===================================================================
  // TODO

  // ===================================================================
  // [ API ] 댓글 등록
  // ===================================================================
  const saveNewComment = async () => {
    if (!commentInput) {
      toast('댓글이 입력되지 않았습니다.');
      return;
    }
    try {
      const { data } = await saveComment({
        feedId,
        comment: commentInput,
      });

      if (data.code === 200) {
        window.location.reload();
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 댓글 삭제
  // ===================================================================
  const removeMyComment = async () => {
    try {
      const { data } = await removeComment(targetComment.commentId);

      if (data.code === 200) {
        toast('댓글이 삭제되었습니다.');

        const filteredList = commentList.filter(
          comment => comment.commentId !== targetComment.commentId,
        );
        setCommentList(filteredList);

        closeCommentMore();
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  useEffect(() => {
    // 잘못된 접근 ( feedId == Null )
    if (!feedId) {
      history.go(-1);
    }
    // 게시물 & 댓글 정보 가져오기
    else {
      getFeedInfo(feedId);
      getComments(feedId);
    }
  }, []);

  useEffect(() => {
    if (commentPage > 1) getComments(feedId);
  }, [commentPage]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="community-detail">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons"
              onClick={() => history.push(RouterPath.community)}
            >
              arrow_back
            </i>
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container id="scroll-container" className="container-custom">
        <div className="commdetail-box">
          {/* 등록자 프로필 */}
          <div className="reviewbox">
            <div className="review-profile">
              <div className="profile">
                {/* 프로필 이미지 */}
                <Image
                  src={
                    feedDetail.profileUrl !== null
                      ? feedDetail.profileUrl
                      : images.ProfileImg
                  }
                />
                {/* 등록 정보 - 이름, 리뷰 수, 등록일, 예약 수 */}
                <div className="profile-info">
                  <p className="username">{feedDetail.mbNm}</p>
                  <div className="profile-timezone">
                    <p>리뷰 {feedDetail.reviewCnt || 1}</p>
                    <div className="center-line" />
                    <p>
                      <Moment fromNow date={feedDetail.regDate} interval={0} />
                    </p>
                    <div className="center-line" />
                    <p>{`${feedDetail.resvCnt || 0}번째 예약`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 피드 파일 리스트 */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            onSwiper={swiper => {
              // console.log(swiper);
            }}
            navigation={feedDetail.files?.length > 1}
          >
            {feedDetail.files &&
              feedDetail.files.length > 0 &&
              feedDetail.files.map((file, index) => {
                return (
                  <SwiperSlide key={`feed-image-${index}`}>
                    <Image src={file.fileUrl} className="detailmain-img" />
                  </SwiperSlide>
                );
              })}
          </Swiper>

          {/* 본문 */}
          <div className="detailbox-body">
            {/* 타이틀 */}
            <div className="detailbox-title">
              <p className="review-text">{feedDetail.title || ''}</p>
              <i className="material-icons" onClick={openFeedMore}>
                more_horiz
              </i>
            </div>

            {/* 리뷰 > 예약 정보 */}
            {feedDetail.resvId && (
              <div className="detailbox-detail">
                <div className="grid-detail">
                  <p className="grid-detail-frist">일정</p>
                  <p className="grid-detail-two">
                    {`${feedDetail.resvDate} / ${
                      feedDetail.resvCnt || 0
                    }번째 방문`}
                  </p>
                </div>
                <div className="grid-detail">
                  <p className="grid-detail-frist">아티스트</p>
                  <p className="grid-detail-two">{feedDetail.staffNm}</p>
                </div>
                <div className="grid-detail">
                  <p className="grid-detail-frist">서비스</p>
                  <p className="grid-detail-two">{feedDetail.menuNm}</p>
                </div>
              </div>
            )}

            {/* 일반 > 카테고리 */}
            {!feedDetail.resvId && (
              <div className="detailbox-detail">
                <div className="grid-detail">
                  <p className="grid-detail-frist">카테고리</p>
                  <p className="grid-detail-two">
                    {feedDetail.category
                      ? SHOP_TYPES[feedDetail.category].name
                      : ''}
                  </p>
                </div>
              </div>
            )}

            {/* 상세 */}
            <p className="body-text pre-line">{feedDetail.comment}</p>

            {/* 뷰 카운트 */}
            <div className="viewbox">
              <Image src={images.IcView} />
              <p>{`${Utils.changeNumberComma(
                feedDetail.viewCnt || '0',
              )}명이 봤어요`}</p>
            </div>

            {/* 공감하기 - 다른 사람 피드 Only */}
            {!isMyFeed && (
              <Button
                className="good-btn"
                onClick={e => {
                  handleLike(e);
                }}
              >
                <Image
                  className={feedDetail.isLiked ? 'active' : ''}
                  src={images.IcGood}
                />
                공감하기
              </Button>
            )}
          </div>
        </div>

        {/* 댓글 */}
        <div className="comment-box">
          {/* 댓글 수 */}
          <h6 className="comment-count">{`댓글 ${Utils.changeNumberComma(
            commentCnt,
          )}`}</h6>
          {/* 댓글 리스트 */}
          {commentList.length > 0 && (
            <InfiniteScroll
              dataLength={commentList.length}
              next={() => setCommentPage(commentPage + 1)}
              hasMore={!isLastComment}
              scrollableTarget="scroll-container"
            >
              {commentList.map((comment, index) => {
                return (
                  <div className="comment" key={`comment-${index}`}>
                    <div className="comment-profile">
                      <Image src={comment.profileUrl || images.ProfileImg} />
                      <div className="profile">
                        <div className="profile-info">
                          <p className="username">{comment.nickname}</p>
                          <div className="comment-timezone">
                            <p>{`리뷰 ${index + 1}`}</p>
                            <div className="center-line" />
                            <p>
                              <Moment
                                fromNow
                                date={comment.regDate}
                                interval={0}
                              />
                            </p>
                          </div>
                          <p className="comment-text">{comment.comment}</p>
                        </div>
                      </div>
                      <div className="followbox">
                        <i
                          className="material-icons"
                          onClick={() => openCommentMore(comment)}
                        >
                          more_horiz
                        </i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          )}
        </div>

        {/* 댓글 입력 */}
        <div className="comment-footbtn d-flex">
          <Form.Control
            type="text"
            placeholder="댓글을 입력해주세요."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
          />
          <div className="ms-1 m-auto" onClick={saveNewComment}>
            <i
              className="material-icons fs-1"
              style={{ color: !commentInput ? '#e0e0e7' : '#2DB400' }}
            >
              check_circle_outline
            </i>
          </div>
        </div>
      </Container>

      {/* 모달 > 피드 더보기 > 신고 or 수정/삭제 */}
      <Modal
        size="sm"
        show={feedModalDisplay}
        onHide={closeFeedMore}
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
                    moveComplainPage({
                      type: EMAIL_CHECK_TYPES.FEED.type,
                      idx: feedId,
                    })
                  }
                >
                  리뷰/게시글 신고
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button
                  className="modal-btn"
                  onClick={() =>
                    moveComplainPage({
                      type: EMAIL_CHECK_TYPES.MEMBER.type,
                      idx: feedId,
                    })
                  }
                >
                  리뷰어 신고
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button className="modal-btn" onClick={closeFeedMore}>
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
                  onClick={() => {
                    if (window.confirm('게시글을 삭제하시겠습니까?')) {
                      removeMyReview();
                    }
                  }}
                >
                  삭제
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer />
      </Modal>

      {/* 모달 > 댓글 더보기 > 수정/삭제 */}
      <Modal
        size="sm"
        show={commentModalDisplay}
        onHide={closeCommentMore}
        aria-labelledby="example-modal-sizes-title-sm"
        id="comm-modal"
      >
        <Modal.Body>
          {/* 다른 계정 댓글 - 신고 */}
          {!isMyComment && (
            <>
              <div className="modal-body-gridline">
                <Button
                  className="modal-btn"
                  onClick={() =>
                    moveComplainPage({
                      type: EMAIL_CHECK_TYPES.COMMENT.type,
                      idx: targetComment.commentId,
                    })
                  }
                >
                  댓글 신고
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button className="modal-btn" onClick={closeCommentMore}>
                  취소
                </Button>
              </div>
            </>
          )}
          {/* 내 댓글 - 수정/삭제 */}
          {isMyComment && (
            <>
              <div className="modal-body-gridline">
                <Button className="modal-btn" onClick={moveCommentEditPage}>
                  수정
                </Button>
              </div>
              <div className="modal-body-gridline">
                <Button
                  style={{ color: '#FF0000', fontWeight: '400 ' }}
                  className="modal-btn"
                  onClick={() => {
                    if (window.confirm('댓글을 삭제하시겠습니까?')) {
                      removeMyComment();
                    }
                  }}
                >
                  삭제
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </main>
  );
});
