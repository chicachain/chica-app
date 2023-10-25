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
import RouterPath from '../../common/constants/RouterPath';

export default React.memo(function Setting(props) {
  const history = useHistory();
  const terms = () => {
    history.push({ pathname: `/terms` });
  };
  const chicaterms = () => {
    history.push({ pathname: `/terms/chicaterms` });
  };
  const license = () => {
    history.push({ pathname: `/terms/license` });
  };
  const privacypolish = () => {
    history.push({ pathname: `/terms/privacypolish` });
  };
  const delac = () => {
    history.push({ pathname: `/delaccount` });
  };

  const logout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('mb_id');
      history.push(RouterPath.homebefor);
    }
  };
  return (
    <main id="setting">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <h6>설정</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="qna-box">
          <div className="qna-line" onClick={terms}>
            <p>이용 약관</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="qna-line" onClick={privacypolish}>
            <p>개인정보 처리방침</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="qna-line" onClick={chicaterms}>
            <p>CHICA 광고 안내</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div
            className="qna-line"
            style={{ borderBottom: 'none' }}
            onClick={license}
          >
            <p>오픈소스 라이센스</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
        </div>
        <div className="hr-line" />
        <div className="login-box">
          <div className="login-line" onClick={logout}>
            <p>로그아웃</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
          <div className="login-line" onClick={delac}>
            <p>탈퇴하기</p>
            <i className="material-icons">arrow_forward_ios</i>
          </div>
        </div>
      </Container>
    </main>
  );
});
