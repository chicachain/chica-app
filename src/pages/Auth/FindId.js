/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// Custom Component
import { Header, CustomModal } from '@components';
import { images } from '@assets';
// API
import { handleError } from '../../common/utils/HandleError';
import { findId } from '../../api/auth/auth';
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/EmailCheckTypes';

// ===================================================================
// [ 아이디 찾기 ]
// ===================================================================
export default React.memo(function FindId(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();

  const completeFindId = async () => {
    try {
      history.push({
        pathname: RouterPath.emailCheck,
        state: { type: EMAIL_CHECK_TYPES.FIND_ID },
      });
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <main id="find-id">
      {/* 헤더 */}
      <Header title="아이디 찾기" />

      {/* 컨텐츠 */}
      <Container className="container-between">
        <Form className="scroll">
          {/* 안내 */}
          <p className="id-check">아이디가 기억나지 않으세요?</p>
          <p className="idauth-text">
            본인인증을 통해 <br />
            아이디를 확인하실 수 있습니다.
          </p>
          <div className="id-img">
            <Image src={images.IdImg} />
          </div>
        </Form>

        {/* 확인 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button size="lg" onClick={completeFindId}>
            본인인증
          </Button>
        </div>
      </Container>
    </main>
  );
});
