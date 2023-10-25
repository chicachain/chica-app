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
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { Header, HtmlModal } from '@components';
import { UserInfoContext } from '../../router/UserInfoContext';
import { sendMailCode } from '../../api/auth/auth';
import { handleError } from '../../common/utils/HandleError';
import EMAIL_CHECK_TYPES from '../../common/constants/EmailCheckTypes';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function EmailCheck(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const pageType = history.location?.state?.type;
  const [userInfo, setUserInfo] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // ===================================================================
  // [ UTIL ]
  // ===================================================================
  const handleAuthNumberChange = event => {
    const newLoginId = event.target.value;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(newLoginId);

    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      loginId: newLoginId,
    }));
  };

  const disabledCheck = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(userInfo.loginId);

    return !isEmailValid;
  };

  // ===================================================================
  // [ API ]
  // ===================================================================
  const signUpCheck = async e => {
    const { target } = e;
    target.disabled = true;

    try {
      const param = {
        certType: EMAIL_CHECK_TYPES.JOIN,
        address: userInfo.loginId,
      };

      const { data } = await sendMailCode(param);

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.certCodeCheck,
          state: {
            ...userInfo,
            loginType: 'EMAIL',
            type: EMAIL_CHECK_TYPES.JOIN,
            certId: data.data.certId,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  const findIdCheck = async e => {
    const { target } = e;
    target.disabled = true;

    try {
      const param = {
        address: userInfo.loginId,
        certType: EMAIL_CHECK_TYPES.FIND_ID,
      };

      const { data } = await sendMailCode(param);

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.certCodeCheck,
          state: {
            loginId: userInfo.loginId,
            type: EMAIL_CHECK_TYPES.FIND_ID,
            certId: data.data.certId,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  const findPwCheck = async e => {
    const { target } = e;
    target.disabled = true;

    try {
      const param = {
        address: userInfo.loginId,
        certType: EMAIL_CHECK_TYPES.MODIFY_PW,
      };

      const { data } = await sendMailCode(param);

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.certCodeCheck,
          state: {
            loginId: userInfo.loginId,
            type: EMAIL_CHECK_TYPES.MODIFY_PW,
            certId: data.data.certId,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  const reservationCheck = async e => {
    const { target } = e;
    target.disabled = true;

    try {
      const param = {
        address: userInfo.loginId,
        certType: EMAIL_CHECK_TYPES.MODIFY_PW,
      };

      const { data } = await sendMailCode(param);

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.certCodeCheck,
          state: {
            loginId: userInfo.loginId,
            type: EMAIL_CHECK_TYPES.RESERVATION,
            certId: data.data.certId,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  const nextStep = async e => {
    setIsButtonDisabled(true);
    switch (pageType) {
      case EMAIL_CHECK_TYPES.JOIN: {
        await signUpCheck(e);
        break;
      }
      case EMAIL_CHECK_TYPES.FIND_ID: {
        await findIdCheck(e);
        break;
      }
      case EMAIL_CHECK_TYPES.MODIFY_PW: {
        await findPwCheck(e);
        break;
      }
      case EMAIL_CHECK_TYPES.RESERVATION: {
        await reservationCheck(e);
        break;
      }

      default:
        break;
    }
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      loginId: '',
    }));
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="sign-up">
      {/* 헤더 */}
      {pageType === EMAIL_CHECK_TYPES.JOIN && <Header title="회원가입" />}
      {pageType === EMAIL_CHECK_TYPES.FIND_ID && <Header title="아이디 찾기" />}
      {pageType === EMAIL_CHECK_TYPES.MODIFY_PW && (
        <Header title="비밀번호 찾기" />
      )}
      {pageType === EMAIL_CHECK_TYPES.RESERVATION && (
        <Header title="예약하기" />
      )}

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>본인확인 이메일 주소</span>를
            <br /> 입력해주세요.
          </p>
          <p className="auth-text">
            아이디, 비밀번호, 찾기, 로그인이 안되는 경우 등 본인확인이 필요한
            경우 사용합니다.
            <br />
            비상 시 사용할 이메일 정보이니 정확하게 입력해 주세요. 입력하신
            이메일 주소는 다른 사용자에게 노출되지 않습니다.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="이메일 주소를 입력해주세요."
              type="text"
              value={userInfo.loginId || ''}
              onChange={handleAuthNumberChange}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep(e);
                }
              }}
            />
          </Form.Group>
          <p className="small-explain">
            계정 보안 및 서비스 이용을 위해 시카 뷰티버스에서 발송하는
            인증메일을 수신할 수 있습니다.
          </p>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={disabledCheck() || isButtonDisabled}
            onClick={nextStep}
          >
            다음
          </Button>
        </div>
      </Container>
    </main>
  );
});
