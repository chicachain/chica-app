/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import { Navi, MainHeader, CustomModal, CustomSelect } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import InfiniteScroll from 'react-infinite-scroll-component';
import Moment from 'react-moment';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import { handleError } from '../../common/utils/HandleError';
import { getFeedList } from '../../api/community/feed';
import utils from '../../common/utils/Utils';
import 'moment/locale/ko';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function Community(props) {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchResults, setSearchResults] = useState([]);
  const [isMore, setIsMore] = useState(true);
  const [fetching, isFetching] = useState(false);
  const [tabBtnActive, isTabBtnActive] = useState(false);
  const [selectBtnActive, isSelectBtnActive] = useState(true);
  const [options, setOptions] = useState();

  const writeReview = () => {
    history.push({ pathname: `/community/schedule` });
  };
  const writeBasic = () => {
    history.push({ pathname: `/community/bascreate` });
  };
  const clickModal = () => {
    setIsWriting(true);
    setModalShow(true);
  };

  const closeEditor = () => {
    setIsWriting(false);
    setModalShow(false);
  };
  const initialOptions = () => {
    setOptions(
      Object.values(SHOP_TYPES)
        .filter(item => {
          return item.type !== '';
        })
        .map(value => ({
          value: value.type,
          label: value.name,
        })),
    );
  };
  const [selectedLocation, setSelectedLocation] = useState({
    value: SHOP_TYPES.Waxing.type,
    label: SHOP_TYPES.Waxing.name,
  });
  const handleLocationChange = e => {
    setSelectedLocation({
      value: e.value,
      label: e.label,
    });
    setSearchResults([]);
  };

  /**
   * api
   */
  const getSearchResult = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
        category: selectedLocation.value,
        review: selectBtnActive,
        following: tabBtnActive,
      };
      const { data } = await getFeedList(params);
      setIsMore(!data.data.isLast);
      setSearchResults(searchResults.concat(data.data.list));
      setPage(page);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  /**
   * useEffect
   */
  useEffect(() => {
    initialOptions();
    if (fetching === false) {
      getSearchResult(1);
      // setIsMore(true);
    }
  }, [selectBtnActive, tabBtnActive, selectedLocation]);

  return (
    <main id="community">
      <header>
        <Container>
          <div className="header-flex">
            <h6>커뮤니티</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div className="tab-menu">
          <Button
            onClick={() => {
              isTabBtnActive(false);
              tabBtnActive === false ? '' : setSearchResults([]);
            }}
            className={tabBtnActive === false ? 'active' : ''}
          >
            전체
          </Button>
          <Button
            onClick={() => {
              isTabBtnActive(true);
              tabBtnActive === true ? '' : setSearchResults([]);
            }}
            className={tabBtnActive === true ? 'active' : ''}
            disabled
          >
            팔로잉
          </Button>
        </div>
        <div className="community-form">
          <div className="top-menu">
            <div className="top-selectbox">
              <Button
                onClick={() => {
                  isSelectBtnActive(true);
                  selectBtnActive === true ? '' : setSearchResults([]);
                }}
                className={selectBtnActive === true ? 'active' : ''}
              >
                리뷰
              </Button>
              <Button
                onClick={() => {
                  isSelectBtnActive(false);
                  selectBtnActive === false ? '' : setSearchResults([]);
                }}
                className={selectBtnActive === false ? 'active' : ''}
              >
                일반
              </Button>
            </div>
            <div className="center-line" />
            <div className="top-selectbox">
              <CustomSelect
                options={options}
                selectedValue={selectedLocation} // 변경된 객체 형태로 전달
                onSelect={handleLocationChange}
                className="select-menu"
              />
            </div>
          </div>
          <InfiniteScroll
            dataLength={searchResults.length}
            next={() => {
              getSearchResult(page + 1);
            }}
            hasMore={isMore && !fetching}
            scrollableTarget="scrollableDiv"
          >
            {searchResults &&
              searchResults.length > 0 &&
              searchResults.map((result, index) => (
                <div
                  className="postbox"
                  key={index}
                  onClick={() =>
                    history.push({
                      pathname: `/community/detail`,
                      state: result.feedId,
                    })
                  }
                >
                  <div className="postbox-form">
                    <div className="postbox-flexline">
                      <div className="postbox-body">
                        <p className="title">{result.title}</p>
                        <p className="text">{result.comment}</p>
                      </div>
                    </div>
                    <img
                      src={images.placereview}
                      alt="Review"
                      className="preview"
                    />
                  </div>
                  <div className="postbox-foot">
                    <div className="postbox-foot-textline">
                      <p>
                        리뷰{' '}
                        {utils.changeNumberComma(`${result.reviewCnt}`)
                          ? utils.changeNumberComma(
                              `${result.reviewCnt}` || '0',
                            )
                          : 0}
                      </p>
                      <div className="center-line" />
                      <p>
                        <Moment fromNow date={result.regDate} interval={0} />
                      </p>
                      <div className="center-line" />
                      <p>
                        조회{' '}
                        {utils.changeNumberComma(`${result.viewCnt}`)
                          ? utils.changeNumberComma(`${result.viewCnt}` || '0')
                          : 0}
                      </p>
                    </div>
                    <div className="postbox-foot-addon">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <img src={images.IcGood} alt="Likes" />
                        <p>{result.likeCnt}</p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <img src={images.IcComment} alt="Comments" />
                        <p>{result.commentCnt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </InfiniteScroll>
        </div>
        {isWriting ? (
          <Button className="comm-closebtn" onClick={closeEditor}>
            <i className="material-icons">close</i>
          </Button>
        ) : (
          <Button className="writer-btn" onClick={clickModal}>
            <i className="material-icons">add</i>글쓰기
          </Button>
        )}
      </Container>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => closeEditor(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="writer-modal"
      >
        <Modal.Body>
          <div className="modal-body-gridline">
            <Button className="modal-btn" onClick={writeBasic}>
              <i className="material-icons">edit</i>
              일반
            </Button>
          </div>
          <div className="modal-body-gridline">
            <Button className="modal-btn" onClick={writeReview}>
              <i className="material-icons">rate_review</i> 리뷰
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
      <Navi />
    </main>
  );
});
