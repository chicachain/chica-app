/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Custom Component
import { Navi } from '@components';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import RouterPath from '../../common/constants/RouterPath';
import utils from '../../common/utils/Utils';
import {
  getFavoriteCount,
  getFavoriteFeedList,
  removeFavoriteFeed,
} from '../../api/member/favorite';
import { handleError } from '../../common/utils/HandleError';
import { getFeedDetail, removeFeed } from '../../api/community/feed';
import EMAIL_CHECK_TYPES from '../../common/constants/ComplainTypes';
import SHOP_TYPES from '../../common/constants/ShopTypes';

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

export default React.memo(function WatchExpert(props) {
  const history = useHistory();

  const mbId = localStorage.getItem('mb_id');

  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [searchResult, setSearchResult] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [favCount, setFavCount] = useState([]);
  const [fetching, isFetching] = useState(false);

  const [feedDetail, setFeedDetail] = useState(initialFeedDetail);
  const [isMyFeed, setIsMyFeed] = useState(false);
  const [feedModalDisplay, setFeedModalDisplay] = useState(false);

  // 신고하기 페이지 이동
  const moveComplainPage = ({ type, idx }) => {
    history.push({
      pathname: RouterPath.report,
      state: { type, idx, url: window.location.href },
    });
  };

  // 피드 수정 페이지 이동
  const moveEditPage = () => {
    history.push({
      pathname: feedDetail.resvId
        ? RouterPath.commrevmodify // 리뷰
        : RouterPath.commbasmodify, // 일반
      state: { feedId: feedDetail.feedId },
    });
  };

  const openFeedMore = feedId => {
    setFeedModalDisplay(true);
    getFeedInfo(feedId);
  };

  const closeFeedMore = () => {
    setFeedModalDisplay(false);
  };

  /**
   * api
   */
  const getFavCount = async () => {
    isFetching(true);
    try {
      const { data } = await getFavoriteCount();
      setFavCount(data.data);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  const getSearchResult = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
      };
      const { data } = await getFavoriteFeedList(params);
      setHasMore(!data.data.isLast);
      setSearchResult(searchResult.concat(data.data.list));
      setPage(pageNo);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  const getFeedInfo = async id => {
    try {
      const { data } = await getFeedDetail(id);

      if (data.code === 200) {
        const { data: feedInfo } = data;
        setFeedDetail(feedInfo);

        if (+mbId === +feedInfo.mbId) setIsMyFeed(true);
        else setIsMyFeed(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const removeFavReview = async () => {
    try {
      // 메뉴
      const { data } = await removeFavoriteFeed(feedDetail.feedId);

      if (data.code === 200) {
        window.location.reload();
      }
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getFavCount();
  }, []);

  useEffect(() => {
    if (fetching === false) {
      getSearchResult(1);
      setHasMore(true);
    }
  }, [page]);

  const mypage = () => {
    history.push({ pathname: RouterPath.mypage });
  };
  const place = () => {
    history.push({ pathname: RouterPath.watchplace });
  };
  const expert = () => {
    history.push({ pathname: RouterPath.watchexpert });
  };
  const review = () => {
    history.push({ pathname: RouterPath.watchreview });
  };
  const setp = () => {
    history.push({ pathname: RouterPath.watchset });
  };
  return (
    <main id="watch-review">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={mypage}>
              arrow_back
            </i>
            <h6>관심 목록</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div className="tab-menu">
          <Button onClick={place}>
            플레이스{' '}
            <span>{utils.changeNumberComma(favCount.totalShopCnt || '0')}</span>
          </Button>
          <Button onClick={expert}>
            전문가{' '}
            <span>
              {utils.changeNumberComma(favCount.totalStaffCnt || '0')}
            </span>
          </Button>
          <Button className="active" onClick={review}>
            리뷰{' '}
            <span>
              {utils.changeNumberComma(favCount.totalReviewCnt || '0')}
            </span>
          </Button>
          <Button onClick={setp}>
            관리{' '}
            <span>{utils.changeNumberComma(favCount.totalMenuCnt || '0')}</span>
          </Button>
        </div>
        <div className="review-content">
          <InfiniteScroll
            dataLength={searchResult.length}
            next={() => {
              getSearchResult(page + 1);
            }}
            hasMore={hasMore && !fetching}
            scrollableTarget="scrollableDiv"
          >
            {searchResult &&
              searchResult.length > 0 &&
              searchResult.map((result, index) => (
                <div className="reviewbox" key={index}>
                  <div className="review-profile">
                    <div className="profile">
                      <Image
                        src={
                          result.profileUrl !== null
                            ? result.profileUrl
                            : images.ProfileImg
                        }
                      />
                      <div className="profile-info">
                        <p className="username">{result.mbNm}</p>
                        <div className="profile-timezone">
                          <p>
                            <Moment
                              fromNow
                              date={result.regDate}
                              interval={0}
                            />
                          </p>
                          <div className="center-line" />
                          <p>{result.resvCnt}번째 예약</p>
                        </div>
                      </div>
                    </div>
                    <div className="followbox">
                      <i
                        className="material-icons"
                        onClick={() => openFeedMore(result.feedId)}
                      >
                        more_horiz
                      </i>
                    </div>
                  </div>
                  {result.files && result.files.length > 0 ? (
                    <div className="review-img">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        onSwiper={swiper => {
                          // console.log(swiper);
                        }}
                        navigation
                      >
                        {result.files.map(item => (
                          <SwiperSlide>
                            <Image src={item.fileUrl} className="review-img" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="review-body">
                    <p className="review-title">{result.title}</p>
                    <p className="review-text">{result.comment}</p>
                  </div>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      </Container>

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
                <Button
                  className="modal-btn btn-danger"
                  style={{ color: '#FF0000', fontWeight: '400 ' }}
                  onClick={removeFavReview}
                >
                  삭제
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
                    if (window.confirm('관심 목록에서 삭제하시겠습니까?')) {
                      removeFavReview;
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
