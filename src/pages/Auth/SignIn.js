/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image, Modal } from 'react-bootstrap';

// Custom Component
import { CustomModal } from '@components';

// API
import { images } from '@assets';
import { useHistory } from 'react-router-dom';
import { getSnsLoginUrl, login, oauthLogin } from '../../api/auth/auth';
import { handleError } from '../../common/utils/HandleError';
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/EmailCheckTypes';
// 로그인 초기 객체
const initialLoginInput = {
  id: '',
  pw: '',
};

// ===================================================================
// [ 로그인 ]
// ===================================================================
export default React.memo(function SignIn(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  // 로그인
  const history = useHistory();
  const state = history.location.state || {};
  const [loginInput, setLoginInput] = useState({ ...initialLoginInput });
  const loginInputRefs = useRef([]);
  const loginType = {
    apple: 'apple',
    google: 'google',
  };

  const [passwordInputType, setPasswordInputType] = useState('password');

  // 모달
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('');

  // ===================================================================
  // [ Modal ]
  // ===================================================================

  // 모달 출력
  const openModal = ({ text }) => {
    setModalText(text);
    setModalShow(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalShow(false);
  };

  // ===================================================================
  // [ Util ]
  // ===================================================================
  // ID, PW 입력
  const loginInputHandler = (type, value) => {
    switch (type) {
      case 'ID':
        loginInput.id = value;
        break;
      case 'PW':
        loginInput.pw = value;
        break;
      default:
        break;
    }

    setLoginInput({ ...loginInput });
  };

  // ===================================================================
  // [ API ] 로그인
  // ===================================================================
  const submitSignIn = async () => {
    // ID, PW 검증

    // JSON Param
    const params = {
      loginId: loginInput.id,
      password: loginInput.pw,
    };

    // Axios
    try {
      const { data } = await login(params); // Axios Post Request

      if (data.code === 200) {
        // 토큰 저장
        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        localStorage.setItem('mb_id', data.data.mbId);

        // Home 이동
        props.history.push(state.goUrl || RouterPath.home);
      }
    } catch (error) {
      if (error.message && error.message.includes('1101')) {
        openModal({
          text: '아이디 또는 패스워드를 확인해주시기 바랍니다.',
        });
      } else {
        openModal({
          text: '서비스 이용 관련 불편 신고는 고객센터(help@chicachain.sale) 문의 해주시길 바랍니다.',
        });
      }
    }
  };
  const [isChecked, setIsChecked] = useState(false);

  // 체크박스 상태 변경 시 호출되는 이벤트 핸들러
  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked);
  };

  const snsLogin = async (type, e) => {
    if (type === loginType.apple) {
      openModal({
        text: '준비중입니다...',
      });
    } else {
      const { target } = e;
      target.disabled = true;
      try {
        const { data } = await getSnsLoginUrl(type);
        if (data.code === 200) {
          window.location.href = data.data.loginUrl;
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================
  useEffect(async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!location.search) return;
    // eslint-disable-next-line no-restricted-globals
    const searchParams = new URLSearchParams(location.search);
    let registrationId;
    const code = searchParams.get('code');
    const scope = searchParams.get('scope');

    if (scope.includes('google')) {
      registrationId = 'google';
    }

    if (code) {
      try {
        const { data } = await oauthLogin(registrationId, code);
        if (data.code === 200) {
          if (data.data.isFirst) {
            localStorage.setItem('loginId', data.data.loginId);
            localStorage.setItem('loginKey', data.data.loginKey);
            localStorage.setItem('loginType', data.data.loginType);
            localStorage.setItem('mbNm', data.data.mbNm);

            props.history.push(RouterPath.signupDay);
          } else {
            localStorage.setItem('access_token', data.data.accessToken);
            localStorage.setItem('refresh_token', data.data.refreshToken);
            localStorage.setItem('mb_id', data.data.mbId);

            props.history.push(RouterPath.home);
          }
        }
      } catch (error) {
        handleError(error);
      }
    }
  }, []);

  const [eyeIconClicked, setEyeIconClicked] = useState(false);
  const faildClose = () => setFaildShow(false);
  const [faildShow, setFaildShow] = useState(false); // 인증완료

  const isValidEmail = email => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isValidPassword = password => {
    // 최소 6자 이상, 대소문자 및 숫자 조합
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  };

  const eyeIconClickHandler = () => {
    if (passwordInputType === 'password') {
      setPasswordInputType('text');
    } else {
      setPasswordInputType('password');
    }
  };

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="sign-in" className="blank">
      <div className="blur-mask" />
      <Container>
        <div className="login">
          <div className="login-body">
            {/* 타이틀 */}
            <Image
              src={images.chica}
              style={{ width: '82px', height: '140px' }}
            />

            {/* 폼 */}
            <Form className="mt-4">
              {/* 아이디 입력 */}
              <Form.Group className="id-control">
                <Form.Control
                  className="control-css"
                  type="email"
                  data-label="아이디"
                  name="id"
                  ref={el => (loginInputRefs.current[0] = el)}
                  value={loginInput.id || ''}
                  onChange={e => loginInputHandler('ID', e.target.value)}
                  placeholder="아이디"
                  onKeyUp={e => {
                    if (e.key === 'Enter') {
                      loginInputRefs.current[1].focus();
                    }
                  }}
                  maxLength={30}
                  required
                  onBlur={() => {
                    if (!isValidEmail(loginInput.id)) {
                      loginInputRefs.current[0].setCustomValidity(
                        '올바른 아이디를 입력하세요.',
                      );
                    } else {
                      loginInputRefs.current[0].setCustomValidity(''); // 유효한 경우에는 피드백을 지움
                    }
                  }}
                  autoCapitalize="none"
                />
                {loginInput.id && (
                  <Image
                    src={images.inputCancle}
                    onClick={() => {
                      setLoginInput({ ...loginInput, id: '' });
                    }}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  올바른 아이디를 입력하세요.
                </Form.Control.Feedback>
              </Form.Group>

              {/* 비밀번호 입력 */}
              <Form.Group className="mt-3 pwd-control">
                <Form.Control
                  className="control-css"
                  type={passwordInputType}
                  data-label="비밀번호"
                  name="pw"
                  ref={el => (loginInputRefs.current[1] = el)}
                  value={loginInput.pw || ''}
                  onChange={e => loginInputHandler('PW', e.target.value)}
                  placeholder="비밀번호"
                  maxLength={30}
                  required
                  onBlur={() => {
                    if (!isValidPassword(loginInput.pw)) {
                      // 비밀번호 유효성이 검사되지 않은 경우 피드백을 보여줌
                      loginInputRefs.current[1].setCustomValidity(
                        '6자 이상의 문자와 숫자를 조합해서 비밀번호를 입력해주세요.',
                      );
                    } else {
                      loginInputRefs.current[1].setCustomValidity(''); // 유효한 경우에는 피드백을 지움
                    }
                  }}
                  onFocus={() => {
                    if (loginInput.pw && isValidPassword(loginInput.pw)) {
                      // 이미지가 보이도록 설정
                      loginInputRefs.current[1].focus(); // 이미지가 보이게 되면 포커스를 다시 설정하여 이벤트가 멈추지 않도록 함
                    }
                  }}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                />
                {loginInput.pw && (
                  <Image
                    src={
                      passwordInputType === 'text'
                        ? images.icEyeOn
                        : images.icEyeOff
                    }
                    onClick={() => {
                      eyeIconClickHandler();
                    }}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  6자 이상의 문자와 숫자를 조합해서 비밀번호를 입력해주세요.
                </Form.Control.Feedback>
              </Form.Group>
              {/* 로그인 */}
              <div className="btn-area column" style={{ marginTop: '1rem' }}>
                <Button
                  size="lg"
                  disabled={!loginInput.id || !loginInput.pw}
                  onClick={submitSignIn}
                >
                  로그인
                </Button>
              </div>
              {/* 아이디, 비밀번호 찾기 & 회원가입 */}
              <div className="mt-3 flex-center division-box">
                <p
                  onClick={() => props.history.push('/auth/findId')}
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  아이디 찾기
                </p>
                <p
                  onClick={() => props.history.push('/auth/findPwd')}
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  비밀번호 찾기
                </p>
              </div>
              {/* 회원가입 */}
              <div className="google-btnbox">
                <Button onClick={e => snsLogin(loginType.google, e)}>
                  <Image src={images.google} />
                  구글 로그인
                </Button>
              </div>
              <div className="apple-btnbox">
                <Button onClick={() => snsLogin(loginType.apple)}>
                  <Image src={images.apple} />
                  Apple로 로그인
                </Button>
              </div>
              <p className="Reg-text">
                아직 계정이 없으신가요?
                <span
                  onClick={() =>
                    props.history.push({
                      pathname: RouterPath.emailCheck,
                      state: { type: EMAIL_CHECK_TYPES.JOIN },
                    })
                  }
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    paddingLeft: '0.5rem',
                  }}
                >
                  회원가입
                </span>
              </p>
              {/* <Button onClick={setFaildShow}>로그인불가임시버튼</Button> */}
            </Form>
          </div>
        </div>
      </Container>

      {/* 모달 */}
      <CustomModal
        contentText={modalText}
        headerDisplay={false}
        display={modalShow}
        onHide={closeModal}
      />
      {/** 로그인불가 */}
      <Modal
        size="sm"
        show={faildShow}
        onHide={() => setFaildShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="signin-modal"
      >
        <Modal.Body>
          <h6 style={{ textAlign: 'center' }} className="faild-title">
            로그인 불가
          </h6>
          <p className="body-text">
            서비스 이용 관련 불편 신고는 고객센터(help@chicachain.sale) 문의
            해주시길 바랍니다.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-btn" onClick={faildClose}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
});
