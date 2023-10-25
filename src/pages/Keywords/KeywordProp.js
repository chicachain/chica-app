/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';
import { images } from '@assets';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function KeywordProp(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const gender = () => {
    history.push({ pathname: RouterPath.keywordProfile });
  };
  const skip = () => {
    history.push({ pathname: RouterPath.home });
  };
  return (
    <main id="keyword">
      {/* 헤더 */}
      <Header />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ paddingTop: '16px' }}>
          <p className="title-member">회원님 안녕하세요</p>
          <p className="welcome-text">CHICA 뷰티버스에오신것을 환영합니다!</p>
          <div className="img-box">
            <Image src={images.Beauty} />
          </div>
          <p className="body-member-text">
            뷰티버스가 회원님께 맞는 뷰티정보를 추천해드립니다.
          </p>
        </Form>
        {/* 다음 */}
        <div className="next-box">
          <div className="next-bar" />
        </div>
        <div className="btn-area fix-bottom grid-btn">
          <Button
            variant="outline-primary"
            className="keyword-jumpbtn"
            onClick={skip}
          >
            건너뛰기
          </Button>
          <Button
            style={{ marginTop: '0' }}
            className="keyword-nextbtn"
            onClick={gender}
          >
            다음 →
          </Button>
        </div>
      </Container>
    </main>
  );
});
