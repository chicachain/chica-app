/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';

// Custom Component
import { Header } from '@components';
import { toast } from 'react-toastify';
import { Utils } from '../../common';

// API

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function SignUpName(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  // const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const history = useHistory();
  const state = history.location.state || {};
  const [userInfo, setUserInfo] = useState({ ...state });
  const [birthday, setBirthday] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // ===================================================================
  // [ Util ]
  // ===================================================================
  const handleAuthNumberChange = event => {
    const newBirthday = event.target.value;

    const birthdayRegex = /^\d{8}$/;
    const isBirthdayValid = birthdayRegex.test(newBirthday);

    if (newBirthday.length <= 8) {
      setBirthday(newBirthday);
      setIsButtonDisabled(!isBirthdayValid);
    }
  };

  const nextStep = () => {
    if (Utils.validDate(userInfo.birthday)) {
      history.push({ pathname: `/auth/signup-check`, state: { ...userInfo } });
    } else {
      toast('올바른 생년월일을 입력해주세요');
    }
  };

  const backCheck = () => {
    if (userInfo.loginType !== 'EMAIL') {
      history.push('/signin');
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      birthday,
    }));
  }, [birthday]);

  useEffect(() => {
    if (localStorage.getItem('loginKey')) {
      const loginKey = localStorage.getItem('loginKey');
      const loginId = localStorage.getItem('loginId');
      const loginType = localStorage.getItem('loginType');
      const mbNm = localStorage.getItem('mbNm');

      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        ...state,
        password: '',
        loginKey,
        loginId,
        loginType,
        mbNm,
      }));

      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (userInfo.loginType !== 'EMAIL') {
      const handleBack = () => {
        history.push('/signin');
      };

      window.addEventListener('popstate', handleBack);
    }
  }, [userInfo]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="sign-up">
      {/* 헤더 */}
      <Header title="회원가입" onClickBtn={backCheck} />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>생년월일</span>을<br />{' '}
            입력해주세요.
          </p>
          <p className="auth-text letter">
            회원님 본인의 생년월일을 입력해주세요. 입력하신 생년월일은 다른
            사용자에게 노출되지 않습니다.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="생년월일을 입력해주세요. (YYYYMMDD)"
              type="number"
              value={birthday || ''}
              onChange={handleAuthNumberChange}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep();
                }
              }}
            />
            <p className="under-text">
              생년월일은 계정 보안 및 개인화 서비스를 위해 필요한 정보입니다.
              로그인 후 개인정보 설정 메뉴에서 생년월일 정보를 다시 확인할 수
              있습니다.
            </p>
          </Form.Group>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={isButtonDisabled}
            onClick={nextStep}
          >
            다음
          </Button>
        </div>
      </Container>
    </main>
  );
});
