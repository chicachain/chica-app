/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Moment from 'react-moment';
import 'moment/locale/ko'; // 한국어 로케일 파일 import
import { toast } from 'react-toastify';
import moment from 'moment';
import { handleError } from '../../common/utils/HandleError';
import { getReviewImageList, getShopDetail } from '../../api/shop/place';
import RouterPath from '../../common/constants/RouterPath';
import CustomMap from '../../components/CustomMap';
import {
  removeFavoriteShop,
  saveFavoriteShop,
} from '../../api/member/favorite';
import { Utils } from '../../common';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// 초기 페이징 정보

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function PlaceDetail(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const { shopId } = useParams();

  /**
   * state
   */
  const [modalShow, setModalShow] = useState(false);
  const [placeDetail, setPlaceDetail] = useState({});
  const [menuImgPage, setMenuImgPage] = useState(1);
  const [menuImgSize, setMenuImgSize] = useState(30);
  const [menuImgList, setMenuImgList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [geolocation, setGeolocation] = useState();
  const [renderMap, setRenderMap] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  /**
   * api
   */
  const getDetail = async () => {
    try {
      const { data } = await getShopDetail(shopId);
      checkWorkingTime(data.data.workSchedules);
      setPlaceDetail(data.data);
      setGeolocation({
        lat: data.data.latitude,
        lng: data.data.longitude,
      });
    } catch (error) {
      handleError(error);
    }
  };

  const getReviewImages = async () => {
    if (!hasMore) return;
    try {
      const params = { page: menuImgPage, size: menuImgSize };
      const { data } = await getReviewImageList(shopId, params);
      setMenuImgList(prevMenuImgList => [
        ...prevMenuImgList,
        ...data.data.list,
      ]);
      setHasMore(!data.data.isLast);
    } catch (error) {
      handleError(error);
    }
  };

  const registFav = async () => {
    try {
      const { data } = await saveFavoriteShop(shopId);
      setPlaceDetail(prev => {
        return { ...prev, liked: !prev.liked };
      });
    } catch (error) {
      handleError(error);
    }
  };
  const cancleFav = async () => {
    try {
      const { data } = await removeFavoriteShop(shopId);
      setPlaceDetail(prev => {
        return { ...prev, liked: !prev.liked };
      });
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */
  const handleCall = () => {
    window.open(`tel:${placeDetail.shopTel}`, '_self');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '공유하기',
          text: '공유',
          url: window.location.href,
        });
      } catch (error) {
        console.log('error', error.code);
        if (error.code !== 20) {
          alert(`Error sharing: ${error}`);
        }
      }
    } else {
      alert('해당 기기는 공유하기 기능을 지원하지 않습니다.');
    }
  };

  const [favButtonDisabled, setFavButtonDisabled] = useState(false);
  const handleFav = async e => {
    if (favButtonDisabled) return;
    setFavButtonDisabled(true);
    if (placeDetail.liked) {
      await cancleFav();
    } else {
      await registFav();
    }
    setTimeout(() => {
      setFavButtonDisabled(false);
    }, 0);
  };

  const clickmodal = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };
  const modalClose = () => {
    setModalShow(false);
  };
  const eventDetail = eventId => {
    history.push({
      pathname: `${RouterPath.eventdetail}/${eventId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const reviewDetail = feedId => {
    history.push({
      pathname: `${RouterPath.placeReviewdetail}/${feedId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };

  const goPlaceDetail = id => {
    window.location.href = `${RouterPath.placeDetail}/${id}`;
  };

  const goMaptab = () => {
    history.push({
      pathname: `${RouterPath.placeMapTab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const goMenutab = () => {
    history.push({
      pathname: `${RouterPath.placeMenutab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const goArttab = () => {
    history.push({
      pathname: `${RouterPath.placeArtTab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const goReviewtab = () => {
    history.push({
      pathname: `${RouterPath.placeReviewtab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const goAroundtab = () => {
    history.push({
      pathname: `${RouterPath.placeAroundtab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const goEventab = () => {
    history.push({
      pathname: `${RouterPath.placeEventTab}/${shopId}`,
      state: { shopNm: placeDetail.shopNm },
    });
  };
  const copyAddress = async address => {
    try {
      await navigator.clipboard.writeText(address);
      toast('주소가 복사되었습니다.');
    } catch (error) {
      toast('주소를 복사하지 못했습니다.');
    }
  };

  const reservation = () => {
    history.push({ pathname: `${RouterPath.designer}/${shopId}` });
  };

  const goHistoryList = () => {
    history.push(RouterPath.place);
  };

  /**
   * help function
   */
  const checkWorkingTime = schedules => {
    if (schedules && schedules.length > 0) {
      const date = moment(new Date());
      const day = date.format('ddd');
      const schedule = schedules.find(item => {
        // eslint-disable-next-line no-param-reassign
        return (item.weekNm = day);
      });
      if (schedule) {
        const currentTime = moment();
        const startTime = moment(schedule.openTime, 'HH:mm:ss');
        const endTime = moment(schedule.closeTime, 'HH:mm:ss');
        const isWithinRange = currentTime.isBetween(startTime, endTime);
        setIsWorking(isWithinRange);
      }
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getDetail();
  }, [shopId]);

  useEffect(() => {
    getReviewImages();
  }, [menuImgPage]);

  return (
    <main id="place-detail">
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="slidebox">
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
                {/* <i className="material-icons">more_horiz</i> */}
              </div>
            </Container>
          </header>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={swiper => {
              // console.log(swiper);
            }}
            pagination={{ clickable: true }}
          >
            {placeDetail.files &&
              placeDetail.files.length > 0 &&
              placeDetail.files.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Image src={item.fileUrl} className="banner-img" />
                  </SwiperSlide>
                );
              })}
          </Swiper>
          <div className="slider-info">
            <h5 className="slider-info-title">{placeDetail.shopNm}</h5>
            <div className="info-botitlebox">
              <div className="reviewstar-box">
                <p>
                  리뷰
                  <span>
                    {placeDetail.reviewCnt
                      ? Utils.changeNumberComma(placeDetail.reviewCnt || 0)
                      : '0'}
                  </span>
                </p>

                <div className="center-line" />
                <p className="star-text">
                  <Image src={images.starsolid} />
                  <span>
                    {placeDetail.avgRating
                      ? placeDetail.avgRating.toFixed(1)
                      : '-'}
                  </span>
                </p>

                {placeDetail.tags && (
                  <>
                    <div className="center-line" />
                    <p>
                      <span>{placeDetail.tags}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="icon-line">
            <div className="icon-box" onClick={handleCall}>
              <Image src={images.IconCall} />
              <p>전화</p>
            </div>
            <div
              className="icon-box"
              onClick={e => {
                handleFav(e);
              }}
            >
              {placeDetail.liked ? (
                <Image src={images.icHeartSolid} />
              ) : (
                <Image src={images.IconHeart} />
              )}
              <p>저장</p>
            </div>
            <div className="icon-box" onClick={goMaptab}>
              <Image src={images.IconMap} />
              <p>지도</p>
            </div>
            <div className="icon-box" onClick={clickmodal}>
              <Image src={images.IconShare} />
              <p>공유</p>
            </div>
          </div>
        </div>

        <div className="tab-menu">
          <Button
            onClick={() => {
              return false;
            }}
            className="active"
          >
            홈
          </Button>
          <Button onClick={goMenutab}>메뉴</Button>
          <Button onClick={goArttab}>아티스트</Button>
          <Button onClick={goReviewtab}>리뷰</Button>
          <Button onClick={goMaptab}>지도</Button>
          <Button onClick={goEventab}>이벤트</Button>
          <Button onClick={goAroundtab}>주변</Button>
        </div>

        {placeDetail.events && placeDetail.events.length > 0 && (
          <div className="event-line">
            {placeDetail.events.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Image
                    src={item.fileUrl}
                    onClick={() => {
                      eventDetail(item.eventId);
                    }}
                  />
                  <div
                    className="event-text"
                    onClick={() => {
                      eventDetail(item.eventId);
                    }}
                  >
                    <p className="event-title">{item.contents}</p>
                    <p className="event-day">
                      {item.startDate && (
                        <Moment
                          date={item.startDate}
                          format="YYYY.MM.DD"
                          interval={0}
                        />
                      )}{' '}
                      ~{' '}
                      {item.endDate && (
                        <Moment
                          date={item.endDate}
                          format="YYYY.MM.DD"
                          interval={0}
                        />
                      )}
                    </p>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
        {placeDetail.eventCnt > 1 && (
          <div className="menu-addall-wrap">
            <Button className="menu-addall" onClick={goEventab}>
              이벤트 전체 보기 →
            </Button>
          </div>
        )}
        <div className="address-line">
          <p>주소 : {placeDetail.address}</p>
        </div>
        <div className="daytime-line">
          <div className="daytime-box">
            <p className="daytime-title">영업시간</p>
            <p className="daying">{isWorking ? '영업중' : '영업종료'}</p>
          </div>
          {placeDetail.workSchedules &&
            placeDetail.workSchedules.length > 0 &&
            placeDetail.workSchedules.map((item, index) => {
              return (
                <div className="daytime-box" key={index}>
                  <p className="daytime-title">{item.weekNm}</p>
                  <p className="time-text">
                    {item.openTime && item.openTime.slice(0, 5)} ~{' '}
                    {item.closeTime && item.closeTime.slice(0, 5)}
                  </p>
                </div>
              );
            })}
          {placeDetail.offDays && (
            <div className="daytime-box">
              <p className="daytime-title">{placeDetail.offDays}</p>
            </div>
          )}
        </div>
        <div className="info-body">
          <p className="info-text">
            <span className="info-title">시설정보:</span> {placeDetail.summary}
          </p>
          <p className="info-text">
            <span className="info-title">홈페이지:</span>{' '}
            <span className="info-web">{placeDetail.homepage}</span>
          </p>
          <p className="info-text">
            <span className="info-title">업체 소개:</span>{' '}
            {placeDetail.description}
          </p>
          <div className="menu-line">
            <h5>
              메뉴 <span>{Utils.changeNumberComma(placeDetail.menuCnt)}</span>
            </h5>
            {placeDetail.menus &&
              placeDetail.menus.length > 0 &&
              placeDetail.menus.map((menuItem, index) => (
                // eslint-disable-next-line react/jsx-no-duplicate-props
                <div className="menu-box" key={index}>
                  <Image src={menuItem.fileUrl} />
                  <div className="menu-fontbox">
                    <p className="menu-title">{menuItem.menuNm}</p>
                    <p className="menu-sale">
                      {Utils.changeNumberComma(
                        window.parseInt(
                          menuItem.price * (1 - menuItem.saleRate),
                        ),
                      )}{' '}
                      {menuItem.saleRate > 0 && (
                        <>
                          <span className="cost">
                            {Utils.changeNumberComma(menuItem.price)}
                          </span>
                          <span className="discount">
                            {menuItem.saleRate * 100}%
                          </span>
                        </>
                      )}
                    </p>
                    <p className="menu-time">{menuItem.summary}</p>
                  </div>
                </div>
              ))}
          </div>
          <Button
            className="menu-addall"
            onClick={() => {
              goMenutab();
            }}
          >
            메뉴 전체 보기 →
          </Button>
        </div>
        <div className="art-line">
          <h5>
            아티스트{' '}
            <span>{Utils.changeNumberComma(placeDetail.staffCnt)}</span>
          </h5>
          {placeDetail.staffs &&
            placeDetail.staffs.length > 0 &&
            placeDetail.staffs.map((menuItem, index) => (
              // eslint-disable-next-line react/jsx-no-duplicate-props
              <div className="menu-box" key={index}>
                <Image src={menuItem.fileUrl} />
                <div className="menu-fontbox">
                  <p className="menu-title">{menuItem.staffNm}</p>
                  <p className="art-text">{menuItem.summary}</p>
                  <div className="reviewstar-box">
                    <p>
                      좋아요
                      <span style={{ paddingLeft: '3px' }}>
                        {Utils.changeNumberComma(menuItem.favCnt || '0')}
                      </span>
                    </p>
                    <div className="center-line" />
                    <p>
                      리뷰
                      <span style={{ paddingLeft: '3px' }}>
                        {Utils.changeNumberComma(menuItem.reviewCnt || '0')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          <Button
            className="menu-addall"
            onClick={() => {
              goArttab();
            }}
          >
            아티스트 전체 보기 →
          </Button>
        </div>
        <div className="review-line">
          <div className="review-sliderbox">
            <h5>
              리뷰{' '}
              <span>
                {Utils.changeNumberComma(placeDetail.reviewCnt || '0')}
              </span>
            </h5>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={3}
              onSwiper={swiper => {
                // console.log(swiper);
              }}
              onReachEnd={() => {
                setTimeout(() => {
                  setMenuImgPage(menuImgPage + 1);
                }, 0);
              }}
            >
              {menuImgList &&
                menuImgList.length > 0 &&
                menuImgList.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Image src={item.fileUrl} className="review-img" />
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
          {placeDetail.reviews &&
            placeDetail.reviews.length > 0 &&
            placeDetail.reviews.map((review, index) => (
              <div
                // key={review.id}
                className="reviewbox"
                // eslint-disable-next-line react/jsx-no-duplicate-props
                key={index}
                onClick={() => {
                  reviewDetail(review.feedId);
                }}
              >
                <p className="review-title">
                  {review.title} <span>{review.staffNm}</span>
                </p>
                <div className="reviewstar-box">
                  {review.rating && (
                    <div className="star-text">
                      <Image src={images.starsolid} />
                      <p>{review.rating}</p>
                    </div>
                  )}
                  {review.staffId && (
                    <>
                      <div className="center-line" />
                      <p style={{ color: '#28282B', fontWeight: 'bold' }}>
                        {review.staffId}
                      </p>
                    </>
                  )}
                  {review.regDate && (
                    <>
                      <div className="center-line" />
                      <p>
                        <Moment fromNow date={review.regDate} interval={0} />
                      </p>
                    </>
                  )}
                  {review.resvCnt != null && (
                    <>
                      <div className="center-line" />
                      <p>{Utils.changeNumberComma(review.resvCnt)}번째 예약</p>
                    </>
                  )}
                </div>
                <p className="review-bodytext">{review.comment}</p>
              </div>
            ))}
          <div className="menu-addall-wrap">
            <Button
              className="menu-addall"
              onClick={() => {
                goReviewtab();
              }}
            >
              리뷰 전체 보기 →
            </Button>
          </div>
        </div>
        <div className="smoll-mapbox">
          <div className="smoll-maptitle">
            <p className="map-title">지도</p>
            <div
              className="maptitle-imgflex"
              onClick={() => {
                setRenderMap(false);
                setGeolocation({
                  lat: placeDetail.latitude,
                  lng: placeDetail.longitude,
                });
                setTimeout(() => {
                  setRenderMap(true);
                }, 0);
              }}
            >
              <Image src={images.locationWhite} /> <p>업체 위치</p>
            </div>
          </div>
          <div className="smoll-map" style={{ overflow: 'hidden' }}>
            {renderMap && geolocation && placeDetail && (
              <CustomMap
                height="100%"
                width="100%"
                geolocation={geolocation}
                searchResults={[
                  {
                    latitude: geolocation.lat,
                    longitude: geolocation.lng,
                    shopId: placeDetail.shopId,
                    shopNm: placeDetail.shopNm,
                    fileUrl: placeDetail?.files[0]?.fileUrl,
                  },
                ]}
                activeId={0}
              />
            )}
            {/* <Button className="map-label"> */}
            {/*  <Image src={images.ReviewProfile} /> */}
            {/*  시카고뷰티랩 월드타워점 */}
            {/* </Button> */}
          </div>
          <div className="map-address">
            <div className="mapaddress-flex">
              <Image src={images.icLocationSmB} />
              <p>{placeDetail.address}</p>
            </div>
            <div className="map-streetcopy">
              {/* <div className="street-flex"> */}
              {/*  <Image src={images.IcChange} /> */}
              {/*  <p>지번</p> */}
              {/* </div> */}
              <div
                className="copy-flex"
                onClick={() => {
                  copyAddress(placeDetail.address);
                }}
              >
                <Image src={images.IcCopy} />
                <p>복사</p>
              </div>
            </div>
          </div>
          <div className="around-box">
            <h5>주변</h5>
            {placeDetail.nearByShops &&
              placeDetail.nearByShops.length > 0 &&
              placeDetail.nearByShops.map((result, index) => (
                <div
                  className="resultbox"
                  key={index}
                  onClick={() => {
                    goPlaceDetail(result.shopId);
                  }}
                >
                  {result.fileUrl ? (
                    <Image src={result.fileUrl} className="result-img" />
                  ) : (
                    <div
                      className="result-img"
                      style={{ background: 'lightGray' }}
                    />
                  )}
                  <div className="result-info">
                    <p className="info-tag tag-color">
                      <span>{result.tags}</span>
                    </p>
                    <p className="result-title title-color">{result.shopNm}</p>
                    <div className="info-botitlebox bot-color">
                      <div className="load-box">
                        <p>{result.location}</p>
                        <p>{Utils.convertDistance(result.distance)}</p>
                        <Image src={images.icLocationSmB} />
                      </div>

                      <div className="center-line" />
                      <p>
                        리뷰
                        <span style={{ paddingLeft: '3px' }}>
                          {result.reviewCnt
                            ? Utils.changeNumberComma(result.reviewCnt || '0')
                            : '0'}
                        </span>
                      </p>

                      <div className="center-line" />
                      <p>
                        별점
                        <span style={{ paddingLeft: '3px' }}>
                          {result.avgRating ? result.avgRating.toFixed(1) : '-'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <Button style={{ marginTop: '0' }} onClick={reservation}>
          <Image
            src={images.ReservationWhite}
            style={{ paddingRight: '3px', width: '24px', height: '24px' }}
          />
          예약하기
        </Button>
      </div>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="share-modal"
      >
        <Modal.Body>
          <div className="modal-body-gridline" onClick={handleShare}>
            <Button className="modal-btn">공유하기</Button>
          </div>
          <div className="modal-body-gridline">
            <Button className="modal-btn" onClick={modalClose}>
              취소
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </main>
  );
});
