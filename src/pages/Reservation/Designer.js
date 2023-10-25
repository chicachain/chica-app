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
import { Navi, MainHeader, CustomModal } from '@components';
import 'swiper/swiper-bundle.css';

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getShopStaffList } from '../../api/shop/place';
import { getMyInfo } from '../../api/member/userInfo';
import { handleError } from '../../common/utils/HandleError';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function Designer(props) {
  const history = useHistory();
  const { shopId } = useParams();
  const [isSelected, setIsSelected] = useState(0);
  const [selectStaff, setSelectStaff] = useState();
  const [staffList, setStaffList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, isFetching] = useState(false);

  const skinmenu = () => {
    history.push({
      pathname: `/reservation/skinmenu/${shopId}`,
      state: {
        staff: selectStaff,
        staffId: isSelected,
      },
    });
  };

  const getStaffList = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
      };
      const { data } = await getShopStaffList(shopId, params);
      setHasMore(!data.data.isLast);
      setStaffList(staffList.concat(data.data.list));
      setPage(pageNo);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  const getUser = async () => {
    const { data } = await getMyInfo();
    setUserInfo(data.data);
  };

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    if (fetching === false) {
      getStaffList(page);
      setHasMore(true);
    }
  }, [page]);
  return (
    <main id="designer">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div style={{ padding: '1rem' }}>
          <h2 className="designer-title">
            <span>{userInfo.nickname}</span>님
            <br /> 빠른 예약 도와드리겠습니다.
          </h2>
          <div className="art-line">
            <div
              className="menu-box"
              onClick={() => {
                setIsSelected(null);
                setSelectStaff(null);
              }}
            >
              <div className="select-designer">
                <input
                  type="radio"
                  checked={isSelected === null}
                  className="form-check-input"
                  readOnly
                />
                <Image
                  src={images.site}
                  className={`image ${isSelected === null ? 'selected' : ''}`}
                />
              </div>
              <div className="menu-fontbox" style={{ alignSelf: 'baseline' }}>
                <p className="menu-title" style={{ marginTop: '10px' }}>
                  현장지정
                </p>
              </div>
            </div>
            <InfiniteScroll
              dataLength={staffList.length}
              next={() => {
                setPage(page + 1);
              }}
              hasMore={hasMore && !fetching}
              scrollableTarget="scrollableDiv"
            >
              {staffList &&
                staffList.length > 0 &&
                staffList.map((menuItem, index) => (
                  <div
                    className="menu-box"
                    key={menuItem.staffId}
                    onClick={() => {
                      setIsSelected(menuItem.staffId);
                      setSelectStaff(menuItem.staffNm);
                    }}
                  >
                    <div className="select-designer">
                      <Form.Check
                        type="radio"
                        id={`default${index}-radio`}
                        name="designer"
                        checked={isSelected === menuItem.staffId}
                        readOnly
                      />
                      <Image
                        src={menuItem.fileUrl}
                        className={`image ${
                          isSelected === menuItem.staffId ? 'selected' : ''
                        }`}
                        onClick={() => {
                          setIsSelected(menuItem.staffId);
                          setSelectStaff(menuItem.staffNm);
                        }}
                      />
                    </div>
                    <div className="menu-fontbox">
                      <p className="menu-title">{menuItem.staffNm} 디자이너</p>
                      <p className="art-text">{menuItem.summary}</p>
                      <div className="reviewstar-box">
                        {menuItem.favCnt !== null ? (
                          <>
                            <p>
                              평점
                              <span style={{ paddingLeft: '3px' }}>
                                {menuItem.favCnt}
                              </span>
                            </p>
                            <div className="center-line" />
                          </>
                        ) : (
                          <div />
                        )}
                        <p>
                          리뷰
                          <span style={{ paddingLeft: '3px' }}>
                            {menuItem.reviewCnt !== null
                              ? menuItem.reviewCnt
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <div className="flex-pay">
          <p className="all-acount">
            총 결제금액 <span className="pay">0</span> 원
          </p>
          <Button onClick={skinmenu} disabled={isSelected === 0}>
            다음 →
          </Button>
        </div>
      </div>
      {/* 푸터 */}
    </main>
  );
});
