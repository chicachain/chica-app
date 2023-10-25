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
export default React.memo(function SignUpId(props) {
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
  const loginsave = () => {
    history.push({ pathname: `/auth/signup-check` });
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
            <span style={{ fontWeight: '500' }}>아이디</span>를<br />{' '}
            입력해주세요.
          </p>
          <p className="auth-text">
            추천 아이디를 사용하시거나 직접 아이디를 입력해주세요. 아이디는
            언제든 변경할 수 있습니다.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="아이디를 입력해주세요."
              type="text"
              value={textInput}
              onChange={handleAuthNumberChange}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
            />
            <Image src={images.icCheckInput} />
          </Form.Group>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={isButtonDisabled}
            onClick={loginsave}
          >
            다음
          </Button>
        </div>
      </Container>
    </main>
  );
});
