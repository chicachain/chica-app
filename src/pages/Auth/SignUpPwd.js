/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';
import { images } from '@assets';
import { UserInfoContext } from '../../router/UserInfoContext';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function SignUpPwd(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const state = history.location.state || {};
  const [userInfo, setUserInfo] = useState({ ...state });
  const [passwordType, setPasswordType] = useState('password');

  // ===================================================================
  // [ Util ]
  // ===================================================================
  const handleAuthNumberChange = event => {
    const newPassword = event.target.value;

    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      password: newPassword,
    }));
  };

  const disabledCheck = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=!]*$/;
    let isPasswordValid = passwordRegex.test(userInfo.password);
    if (!userInfo.password || userInfo.password.length < 6) {
      isPasswordValid = false;
    }
    return !isPasswordValid;
  };

  const handleTogglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  const nextStep = () => {
    history.push({ pathname: RouterPath.signupBirth, state: { ...userInfo } });
  };

  useEffect(() => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      ...state,
      password: '',
    }));
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="sign-up">
      {/* 헤더 */}
      <Header title="회원가입" />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>비밀번호</span>를<br />{' '}
            입력해주세요.
          </p>
          <p className="auth-text">
            보안을 위해 6자 이상의 문자와 숫자를 조합하여 비밀번호를
            만들어주세요.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="비밀번호를 입력해주세요."
              type={passwordType}
              value={userInfo.password || ''}
              onChange={handleAuthNumberChange}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep();
                }
              }}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
            />
            <Image
              src={
                passwordType === 'password'
                  ? images.icEyeOffBlack
                  : images.icEyeOnBlack
              }
              onClick={handleTogglePassword}
            />
          </Form.Group>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={disabledCheck()}
            onClick={nextStep}
          >
            저장
          </Button>
        </div>
      </Container>
    </main>
  );
});
