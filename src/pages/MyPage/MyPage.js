/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi } from '@components';
import classNames from 'classnames';
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import { getMyInfo } from '../../api/member/userInfo';
import { Utils } from '../../common';

export default React.memo(function MyPage(props) {
  const history = useHistory();

  /**
   * state
   */
  // 초기 이미지 상태 설정
  const [isCouImage, setIsCouImage] = useState(true);
  const [isChatImage, setIsChatImage] = useState(true);
  const [userDetail, setUserDetail] = useState({});

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

  /**
   * event
   */
  // 이미지를 토글하는 함수
  const toggleDayImage = () => {
    history.push({ pathname: RouterPath.order });
  };
  const toggleCouImage = () => {
    setIsCouImage(!isCouImage);
  };
  const toggleChatImage = () => {
    setIsChatImage(!isChatImage);
  };
  const setting = () => {
    history.push({ pathname: RouterPath.setting });
  };
  const myedit = () => {
    history.push({ pathname: RouterPath.mypageedit });
  };
  const watchPlace = () => {
    history.push({ pathname: RouterPath.watchplace });
  };
  const watchExpert = () => {
    history.push({ pathname: RouterPath.watchexpert });
  };
  const watchReview = () => {
    history.push({ pathname: RouterPath.watchreview });
  };
  const watchManage = () => {
    history.push({ pathname: RouterPath.watchset });
  };
  const qnapage = () => {
    history.push({ pathname: RouterPath.qnapage });
  };
  const notice = () => {
    history.push({ pathname: RouterPath.notice });
  };
  const chicaterms = () => {
    history.push({ pathname: RouterPath.chicaterms });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getMyDetail();
  }, []);

  return (
    <main id="mypage">
      <header>
        <Container>
          <div className="header-flex">
            <h6>MY PAGE</h6>
            <p onClick={setting}>설정</p>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="profile-grid">
          {userDetail.profileUrl ? (
            <Image src={userDetail.profileUrl} className="profile-img" />
          ) : (
            <Image src={images.ProfileImg} className="profile-img" />
          )}
          <div className="profile-box">
            <div className="profile-title-line">
              <p>{userDetail.loginId}</p>
              <Button variant="outline-primary" onClick={myedit}>
                프로필 수정
              </Button>
            </div>
            <div className="profile-count-line">
              <div className="countbox" style={{ justifySelf: 'start' }}>
                <p className="countbox-title">리뷰</p>
                <p className="countbox-count">
                  {Utils.changeNumberComma(userDetail.reviewCnt || '0')}
                </p>
              </div>
              <div className="center-line" />
              <div className="countbox" style={{ justifySelf: 'start' }}>
                <p className="countbox-title">포인트</p>
                <p className="countbox-count">
                  {Utils.changeNumberComma(userDetail.point || '0')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="menubox-line">
          <div />
          <Button
            className={classNames('menubox-btn', {
              active: userDetail.resvCnt && userDetail.resvCnt > 0,
            })}
            onClick={toggleDayImage}
          >
            {userDetail.resvCnt && userDetail.resvCnt > 0 ? (
              <Image src={images.MyPageDay} />
            ) : (
              <Image src={images.MyPageDayOff} />
            )}
            <p>
              예약
              <span>{Utils.changeNumberComma(userDetail.resvCnt || '0')}</span>
            </p>
          </Button>
          {/* <Button className="menubox-btn" onClick={toggleCouImage}> */}
          {/*  {isCouImage ? ( */}
          {/*    <Image src={images.MyPageCoUOff} /> */}
          {/*  ) : ( */}
          {/*    <Image src={images.MyPageCoU} /> */}
          {/*  )} */}
          {/*  <p> */}
          {/*    쿠폰<span>0</span> */}
          {/*  </p> */}
          {/* </Button> */}
          {/* <Button className="menubox-btn" onClick={toggleChatImage}> */}
          {/*  {isChatImage ? ( */}
          {/*    <Image src={images.MyPageChatOff} /> */}
          {/*  ) : ( */}
          {/*    <Image src={images.MyPageChat} /> */}
          {/*  )} */}
          {/*  <p> */}
          {/*    채팅<span>0</span> */}
          {/*  </p> */}
          {/* </Button> */}
        </div>
        <div className="banner-box">
          <Image src={images.sliderimg1} />
        </div>
        <div className="interest-box">
          <h6>나의 관심</h6>
          <div className="interest-line" onClick={watchPlace}>
            <p>관심 플레이스</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="interest-line" onClick={watchExpert}>
            <p>관심 전문가</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="interest-line" onClick={watchReview}>
            <p>관심 리뷰</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="interest-line" onClick={watchManage}>
            <p>관심 목록 관리</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
        </div>
        <div className="qna-box">
          <h6>고객센터</h6>
          <div className="qna-line" onClick={notice}>
            <p>공지사항</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="qna-line" onClick={qnapage}>
            <p>도움말</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
        </div>
        <div className="qna-box">
          <h6>CHICA 스토리</h6>
          <div className="qna-line" onClick={chicaterms}>
            <p>CHICA 플랫폼 소개</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
        </div>
      </Container>
      {/* 푸터 */}
      <Navi />
    </main>
  );
});
