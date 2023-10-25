/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';

// Custom Component
import { Navi } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import {
  getReservationDataByCategory,
  getReservationList,
  removeReservation,
} from '../../api/reservation/reservations';
import { handleError } from '../../common/utils/HandleError';
import { getMyInfo } from '../../api/member/userInfo';
import { Utils } from '../../common';
import RouterPath from '../../common/constants/RouterPath';
import REQUEST_STATUS from '../../common/constants/RequestStatus';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
export default React.memo(function Order(props) {
  const history = useHistory();

  /**
   * state
   */
  const [activeTab, setActiveTab] = useState('rez');

  /**
   * event
   */

  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };

  return (
    <main id="order">
      <header>
        <Container>
          <div className="header-flex">
            <h6>예약･주문</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container id="scrollableDiv" className="container-custom">
        <div className="tab-menu">
          <Button
            onClick={() => handleTabClick('rez')}
            className={activeTab === 'rez' ? 'active' : ''}
          >
            예약
          </Button>
          <Button
            onClick={() => handleTabClick('order')}
            className={activeTab === 'order' ? 'active' : ''}
            disabled
          >
            주문
          </Button>
          <Button
            onClick={() => handleTabClick('time')}
            className={activeTab === 'time' ? 'active' : ''}
            disabled
          >
            타임라인
          </Button>
        </div>
        <div className="tab-content">
          {activeTab === 'rez' && <RezContent />}
          {activeTab === 'order' && <OrderContent />}
          {activeTab === 'time' && <TimeContent />}
        </div>
      </Container>
      {/* 푸터 */}
      <Navi />
    </main>
  );
});

function RezContent() {
  const history = useHistory();
  /**
   * state
   */
  const [selectedShopCategory, setSelectedShopCategory] = useState(
    SHOP_TYPES.Waxing.type,
  );
  const [userDetail, setUserDetail] = useState({});
  const [reservationDetail, setReservationDetail] = useState({});
  const [selectedReservationStatus, setSelectedReservationStatus] = useState();

  const [resvPage, setResvPage] = useState(1);
  const [resvSize, setResvSize] = useState(30);
  const [resvHasMore, setResvHasMore] = useState(true);
  const [resvList, setResvList] = useState([]);
  const [resvListRefresh, setResvListRefresh] = useState(false);
  const [resvCnt, setResvCnt] = useState(0); // 예약중 카운트
  const [finishCnt, setFinishCnt] = useState(0); // 방문 카운트
  const [cancelCnt, setCancelCnt] = useState(0); // 예약취소 카운트

  /**
   * api
   */
  const getMyDetail = async () => {
    try {
      const { data } = await getMyInfo();
      setUserDetail(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const getReservationInfo = async category => {
    try {
      const { data } = await getReservationDataByCategory(category);
      setReservationDetail(data.data);
      // 예약중, 방문, 예약취소 카운트
      if (data.data.statusList) {
        setResvCnt(data.data.statusList[REQUEST_STATUS.CONFIRM.type]);
        setFinishCnt(data.data.statusList[REQUEST_STATUS.FINISH.type]);
        const cancleTypes = [
          REQUEST_STATUS.REJECT.type,
          REQUEST_STATUS.CANCEL.type,
          REQUEST_STATUS.CANCEL_WAIT.type,
          REQUEST_STATUS.CANCEL_FIN.type,
        ];
        let cancelCount = 0;
        for (const type of cancleTypes) {
          if (data.data.statusList[type])
            cancelCount += data.data.statusList[type];
        }
        setCancelCnt(cancelCount);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getReservationHistories = async init => {
    try {
      const params = {
        page: resvPage,
        size: resvSize,
        category: selectedShopCategory,
        resvStatus: selectedReservationStatus,
      };
      const { data } = await getReservationList(params);
      if (init) {
        setResvList(prev => [...data.data.list]);
      } else {
        setResvList(prev => [...prev, ...data.data.list]);
      }
      setResvHasMore(!data.data.isLast);
    } catch (error) {
      handleError(error);
    }
  };

  const removeResvHistory = async id => {
    try {
      const { data } = await removeReservation(id);
      toast('삭제되었습니다.');
      refreshResvList();
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */

  const handleButtonClick = buttonKey => {
    setResvPage(1);
    setSelectedShopCategory(buttonKey);
  };

  const handleSelectStatus = status => {
    setResvPage(1);
    if (selectedReservationStatus === status) {
      setSelectedReservationStatus(null);
      refreshResvList();
    } else {
      setSelectedReservationStatus(status);
    }
  };

  const refreshResvList = () => {
    setResvPage(1);
    setResvListRefresh(prev => !prev);
  };

  const checkRemoveResvHistory = id => {
    if (window.confirm('해당 예약 기록을 삭제하시겠습니까?')) {
      removeResvHistory(id);
    }
  };

  const getImageSource = buttonKey => {
    return selectedShopCategory === buttonKey
      ? images[`ic${buttonKey}`]
      : images[`ic${buttonKey}Gray`];
  };

  const goResvDetail = resvId => {
    history.push({ pathname: `${RouterPath.orderdetail}/${resvId}` });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getMyDetail();
  }, []);

  // 예약 정보 전체 갱신
  useEffect(() => {
    if (selectedShopCategory) {
      getReservationInfo(selectedShopCategory);
      setSelectedReservationStatus(null);
      getReservationHistories(true);
    }
  }, [selectedShopCategory, resvListRefresh]);

  // 예약 리스트 갱신
  useEffect(() => {
    if (selectedReservationStatus) {
      getReservationHistories(true);
    }
  }, [selectedReservationStatus]);

  useEffect(() => {
    if (resvPage > 1) {
      getReservationHistories();
    }
  }, [resvPage]);

  return (
    <div className="rez-div">
      <div className="rez-box">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={4}
          onSwiper={swiper => {
            // console.log(swiper);
          }}
        >
          {Object.values(SHOP_TYPES).map((item, index) => {
            return (
              item.type && (
                <SwiperSlide key={index}>
                  <Button
                    className={
                      selectedShopCategory === item.type ? 'active' : ''
                    }
                    variant="outline-primary"
                    onClick={() => handleButtonClick(item.type)}
                  >
                    <Image src={getImageSource(item.type)} />
                    {item.name}
                  </Button>
                </SwiperSlide>
              )
            );
          })}

          <SwiperSlide>
            <Button
              variant="outline-primary"
              onClick={() => handleButtonClick('Barber')}
            >
              <Image src={getImageSource('Barber')} />
              바버
            </Button>
          </SwiperSlide>
        </Swiper>
        {userDetail.resvCnt > 0 ? (
          <div>
            <div className="rez-text-line">
              <h6>
                <span>{userDetail.mbNm}</span>님은{' '}
                <span>
                  {Utils.changeNumberComma(reservationDetail.resvCnt || '0')}회
                </span>{' '}
                이용,
                <br />{' '}
                <span>
                  {Utils.changeNumberComma(reservationDetail.totalPrice)}원
                </span>{' '}
                결제하셨습니다.
              </h6>
              {reservationDetail &&
                reservationDetail.shopList &&
                reservationDetail.shopList.length > 0 &&
                reservationDetail.shopList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="rez-rating-box"
                      onClick={() => {
                        history.push({
                          pathname: `${RouterPath.placeDetail}/${item.shopId}`,
                          state: {
                            goBack: true,
                          },
                        });
                      }}
                    >
                      <div className="rez-rating-line">
                        <div className="rez-counting">
                          <p className="number">{index + 1}</p>
                          <p className="title">{item.shopNm}</p>
                        </div>
                        <p className="counting">
                          {Utils.changeNumberComma(item.resvCnt)}회
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="card-box">
              <div className="top-selectbox">
                <Button
                  className={
                    selectedReservationStatus === REQUEST_STATUS.CONFIRM.type
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    handleSelectStatus(REQUEST_STATUS.CONFIRM.type)
                  }
                >
                  예약중
                  <span>{Utils.changeNumberComma(resvCnt) || '0'}</span>
                </Button>
                <Button
                  className={
                    selectedReservationStatus === REQUEST_STATUS.FINISH.type
                      ? 'active'
                      : ''
                  }
                  onClick={() => handleSelectStatus(REQUEST_STATUS.FINISH.type)}
                >
                  방문
                  <span>{Utils.changeNumberComma(finishCnt) || '0'}</span>
                </Button>
                <Button
                  className={
                    selectedReservationStatus === REQUEST_STATUS.CANCEL.type
                      ? 'active'
                      : ''
                  }
                  onClick={() => handleSelectStatus(REQUEST_STATUS.CANCEL.type)}
                >
                  예약취소
                  <span>{Utils.changeNumberComma(cancelCnt) || '0'}</span>
                </Button>
              </div>
              <InfiniteScroll
                dataLength={resvList.length}
                next={() => {
                  setTimeout(() => {
                    setResvPage(prev => prev + 1);
                  }, 0);
                }}
                hasMore={resvHasMore}
                scrollableTarget="scrollableDiv"
              >
                {resvList && resvList.length > 0 ? (
                  resvList.map((item, index) => {
                    return (
                      <div
                        className={classNames('plancard', {
                          purple:
                            item.resvStatus === REQUEST_STATUS.CONFIRM.type,
                          stay: item.resvStatus === REQUEST_STATUS.FINISH.type,
                          cancle:
                            item.resvStatus === REQUEST_STATUS.CANCEL.type ||
                            item.resvStatus === REQUEST_STATUS.REJECT.type ||
                            item.resvStatus ===
                              REQUEST_STATUS.CANCEL_WAIT.type ||
                            item.resvStatus === REQUEST_STATUS.CANCEL_FIN.type,
                        })}
                        key={index}
                        onClick={e => {
                          goResvDetail(item.resvId);
                        }}
                      >
                        <div className="card-color " />
                        <div className="card-info">
                          <p className="title">{item.shopNm}</p>
                          <p className="daydate">
                            <Moment
                              date={item.resvDate}
                              format="YYYY-MM-DD (ddd) A hh:mm"
                            />
                          </p>
                          <p className="label">
                            {REQUEST_STATUS[item.resvStatus].name}
                          </p>
                        </div>
                        <div className="stroke" />
                        <div className="card-item">
                          <div>
                            <p>{item.staffNm}</p>
                            <p>{item.menuNm}</p>
                          </div>
                          {item.resvStatus !== REQUEST_STATUS.CONFIRM.type && (
                            <Image
                              src={images.IcDeleteTrash}
                              onClick={e => {
                                checkRemoveResvHistory(item.resvId);
                                e.stopPropagation();
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center">
                    <p>내역이 없습니다.</p>
                  </div>
                )}
              </InfiniteScroll>
            </div>
          </div>
        ) : (
          <div className="no-databox">
            <Image src={images.IcRez} />
            <p>예약내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
function OrderContent() {
  return (
    <div className="rez-div">
      <div className="no-databox">
        <Image src={images.IcOrder} />
        <p>주문내역이 없습니다.</p>
      </div>
    </div>
  );
}
function TimeContent() {
  return (
    <div className="rez-div">
      <div className="no-databox">
        <Image src={images.IcOrder} />
        <p>예약･주문 관련 타임라인 활동이 없습니다.</p>
      </div>
    </div>
  );
}
