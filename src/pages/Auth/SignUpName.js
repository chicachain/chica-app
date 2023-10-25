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
import { Container, Form, Button, Modal } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function SignUpName(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const [textInput, setTextInput] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleAuthNumberChange = event => {
    const newTextInput = event.target.value;
    setTextInput(newTextInput);
    setIsButtonDisabled(newTextInput === '');
  };
  const signupPwd = () => {
    history.push({ pathname: `/auth/signup-pwd` });
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
            <span style={{ fontWeight: '500' }}>이름</span>을<br />{' '}
            입력해주세요.
          </p>
          <p className="auth-text">
            회원님의 프로필에 노출되는 이름입니다. 이름, 별명, 비즈니스명 등으로
            자신을 표현해주세요.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="이름을 입력해주세요."
              type="text"
              value={textInput}
              onChange={handleAuthNumberChange}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
            />
          </Form.Group>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={isButtonDisabled}
            onClick={signupPwd}
          >
            다음
          </Button>
        </div>
      </Container>
    </main>
  );
});
