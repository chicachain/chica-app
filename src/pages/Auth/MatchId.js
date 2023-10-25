/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { Container, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// Custom Component
import { Header, CustomModal } from '@components';
import { handleError } from '../../common/utils/HandleError';
import { findId } from '../../api/auth/auth';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 아이디 찾기 결과 페이지 ]
// ===================================================================
export default React.memo(function FindId(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const state = history.location.state || {};
  const [loginId, setLoginId] = useState('');

  const getUserId = async () => {
    try {
      const param = {
        email: state.loginId,
      };
      const { data } = await findId(param);
      setLoginId(data.data.loginId);
    } catch (error) {
      handleError(error);
    }
  };

  const emailMasking = email => {
    if (!email) return '';
    const [userPart, domainPart] = email.split('@');

    let userPartMasked;
    if (userPart.length <= 3) {
      userPartMasked = userPart[0] + '*'.repeat(userPart.length - 1);
    } else {
      userPartMasked = userPart[0] + '*'.repeat(3) + userPart.slice(3);
    }

    return `${userPartMasked}@${domainPart}`;
  };

  useEffect(() => {
    getUserId();
  }, []);

  return (
    <main id="matchid">
      {/* 헤더 */}
      <Header title="아이디 찾기" />

      {/* 컨텐츠 */}
      <Container className="container-between">
        {/* 계정 정보 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>아이디 찾기</span>를<br />{' '}
            성공하였습니다.
          </p>
          <div>
            <p className="id-check-text">고객님의 아이디는 다음과 같습니다.</p>
            <p className="id-name">아이디</p>
            <div className="id-name-box">
              <p>{emailMasking(loginId)}</p>
            </div>
          </div>
        </Form>

        <div className="btn-area fix-bottom auth-btnarea">
          {/* 로그인 페이지 이동 */}
          <Button
            onClick={() => {
              history.push({ pathname: RouterPath.slash });
            }}
          >
            로그인
          </Button>
        </div>
      </Container>
    </main>
  );
});
