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

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function SignUpAdd(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const signupday = () => {
    history.push({ pathname: `/auth/signup-day` });
  };
  return (
    <main id="sign-up">
      {/* 헤더 */}
      <Header title="회원가입" />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>로그인 정보</span>를<br />{' '}
            저장하시겠어요?
          </p>
          <p className="auth-text letter">
            로그인 정보를 저장하시면 다음 로그인 시 정보를 다시 입력하지 않고
            간편하게 로그인을 할 수 있습니다.
          </p>
          <Button className="w-100" variant="outline-primary">
            다음에하기
          </Button>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button className="w-100" onClick={signupday}>
            저장
          </Button>
        </div>
      </Container>
    </main>
  );
});
