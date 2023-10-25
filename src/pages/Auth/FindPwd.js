/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// Custom Component
import { Header, CustomModal } from '@components';
import { images } from '@assets';
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/EmailCheckTypes';
// API

// ===================================================================
// [ 아이디 찾기 ]
// ===================================================================
export default React.memo(function FindPwd(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();

  const completeFindPw = () => {
    history.push({
      pathname: RouterPath.emailCheck,
      state: { type: EMAIL_CHECK_TYPES.MODIFY_PW },
    });
  };
  return (
    <main id="find-pwd">
      {/* 헤더 */}
      <Header title="비밀번호 찾기" />

      {/* 컨텐츠 */}
      <Container className="container-between">
        <Form className="scroll">
          {/* 안내 */}
          <p className="id-check">비밀번호가 기억나지 않으세요?</p>
          <p className="idauth-text">
            본인인증을 통해 <br />
            비밀번호를 재설성 하실 수 있습니다.
          </p>
          <div className="id-img">
            <Image src={images.IdImg} />
          </div>
        </Form>

        {/* 확인 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button size="lg" onClick={completeFindPw}>
            본인인증
          </Button>
        </div>
      </Container>
    </main>
  );
});
