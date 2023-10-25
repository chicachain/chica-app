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
import { Container, Form, Button, Modal } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';
import { toast } from 'react-toastify';

// API
import { confirmMailCode, sendMailCode } from '../../api/auth/auth';
import { handleError } from '../../common/utils/HandleError';
import RouterPath from '../../common/constants/RouterPath';
import EMAIL_CHECK_TYPES from '../../common/constants/EmailCheckTypes';

// ===================================================================
// [ 인증번호 확인 ]
// ===================================================================
export default React.memo(function CertCodeCheck(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const history = useHistory();
  const pageType = history.location?.state?.type;
  const state = history.location.state || {};
  const [userInfo, setUserInfo] = useState({ ...state });
  const [modalShow, setModalShow] = useState(false);

  // ===================================================================
  // [ Util ]
  // ===================================================================
  const handleAuthNumberChange = event => {
    const newAuthNumber = event.target.value;

    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      certCode: newAuthNumber,
    }));
  };
  const disabledCheck = () => {
    return !userInfo.certCode;
  };

  const modalOpen = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };

  const modalClose = () => {
    setModalShow(false);
  };

  const goHome = () => {
    history.push(RouterPath.slash);
  };

  // ===================================================================
  // [ API ] Next Step
  // ===================================================================
  const nextStep = async e => {
    const { target } = e;
    target.disabled = true;
    setIsButtonDisabled(true);
    try {
      const param = {
        address: userInfo.loginId,
        certId: state.certId,
        certCode: userInfo.certCode,
        certMethod: 'EMAIL',
        certType: pageType,
      };

      const { data } = await confirmMailCode(param);

      if (data.code === 200) {
        let url = '';
        switch (pageType) {
          case EMAIL_CHECK_TYPES.JOIN: {
            url = RouterPath.signupPwd;
            break;
          }
          case EMAIL_CHECK_TYPES.FIND_ID: {
            url = RouterPath.matchid;
            break;
          }
          case EMAIL_CHECK_TYPES.MODIFY_PW: {
            url = RouterPath.pwdnew;
            break;
          }
          // TODO :: 이동 페이지 확인 필요
          case EMAIL_CHECK_TYPES.RESERVATION: {
            url = RouterPath.complete;
            break;
          }
          default:
            break;
        }
        history.push({
          pathname: url,
          state: {
            ...userInfo,
            isConfirmed: 'Y',
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
    setIsButtonDisabled(false);
  };

  // ===================================================================
  // [ API ] Code Resend
  // ===================================================================
  const codeResend = async () => {
    modalClose();
    try {
      const param = {
        certType: pageType,
        address: userInfo.loginId,
      };

      const { data } = await sendMailCode(param);

      if (data.code === 200) {
        toast('인증번호를 재전송하였습니다.');

        history.replace({
          pathname: RouterPath.certCodeCheck,
          state: {
            ...state,
            type: pageType,
            certId: data.data.certId,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      ...state,
      certCode: '',
      isConfirmed: 'N',
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
            <span style={{ fontWeight: '500' }}>인증번호</span>를<br />{' '}
            입력해주세요.
          </p>
          <p className="auth-text">
            본인인증을 위해
            <span style={{ color: '#4D4D53', fontWeight: 'bold' }}>
              &nbsp; {userInfo.loginId} &nbsp;
            </span>
            으로 전송된 6자리 인증번호를 입력해주세요.
          </p>
          <Form.Group className="auth-control">
            <Form.Control
              className="control-css"
              placeholder="인증번호를 입력해주세요."
              type="number"
              value={userInfo.certCode || ''}
              onChange={handleAuthNumberChange}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep(e);
                }
              }}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
            />
            <Button
              className="authnumber-btn"
              variant="outline-primary"
              onClick={modalOpen}
            >
              인증번호를 받지 못했습니다.
            </Button>
          </Form.Group>
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
        <Modal
          size="sm"
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
          id="authnumber-modal"
        >
          <Modal.Body>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={codeResend}>
                인증번호 재전송
              </Button>
            </div>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={goHome}>
                다른 계정으로 로그인
              </Button>
            </div>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={modalClose}>
                취소
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      </Container>
    </main>
  );
});
