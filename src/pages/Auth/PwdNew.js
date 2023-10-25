/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';

// Custom Component
import { Header, CustomModal } from '@components';
import { images } from '@assets';
import { handleError } from '../../common/utils/HandleError';
import { modifyPassword } from '../../api/auth/auth';
import RouterPath from '../../common/constants/RouterPath';
// API

// ===================================================================
// [ 비밀번호 재설정 ]
// ===================================================================
export default React.memo(function PwdNew(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [passwordType, setPasswordType] = useState('password');
  const [passwordNewType, setPasswordNewType] = useState('password');

  function maskEmail(email) {
    const [username, domain] = email.split('@');
    const usernameLength = username.length;
    const maskedPart = `${username.slice(0, usernameLength - 3)}***`;
    return `${maskedPart}`;
  }

  const handlePasswordChange = event => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    checkIfButtonShouldBeEnabled(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = event => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    checkIfButtonShouldBeEnabled(password, newConfirmPassword);
  };

  const checkIfButtonShouldBeEnabled = (pwd, confirmPwd) => {
    if (pwd.length >= 6 && confirmPwd.length >= 6 && pwd === confirmPwd) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleConfirmClick = async () => {
    try {
      const params = {
        loginId: state.loginId,
        certCode: state.certCode,
        newPw: password,
      };
      const { data } = await modifyPassword(params);
      if (!isButtonDisabled) {
        setModalShow(true); // 모달 표시 여부 업데이트
      }
    } catch (error) {
      handleError(error);
    }
  };
  const modalClose = () => {
    setModalShow(false);
    history.push({ pathname: RouterPath.slash });
  };

  const handleTogglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  const handleTogglePasswordNew = () => {
    if (passwordNewType === 'password') {
      setPasswordNewType('text');
    } else {
      setPasswordNewType('password');
    }
  };
  return (
    <main id="pwdnew">
      {/* 헤더 */}
      <Header title="비밀번호 찾기" />

      {/* 컨텐츠 */}
      <Container className="container-between">
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>비밀번호</span>를<br />{' '}
            재설정해주세요.
          </p>
          <p className="pw-text">
            <span style={{ fontWeight: 'bold', color: '#bd7ebb' }}>
              {maskEmail(state.loginId)}
            </span>
            님의 비밀번호를 재설정합니다.
          </p>
          <Form.Group className="pwd-control">
            <Form.Label className="label-t">새 비밀번호</Form.Label>
            <Form.Control
              className="control-css"
              placeholder="6자 이상의 문자와 숫자를 조합해주세요."
              type={passwordType}
              value={password}
              onChange={handlePasswordChange}
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
          <Form.Group className="pwd-control mt-3">
            <Form.Label className="label-t">새 비밀번호 확인</Form.Label>
            <Form.Control
              className="control-css"
              type={passwordNewType}
              placeholder="6자 이상의 문자와 숫자를 조합해주세요."
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
            />
            <Image
              src={
                passwordNewType === 'password'
                  ? images.icEyeOffBlack
                  : images.icEyeOnBlack
              }
              onClick={handleTogglePasswordNew}
            />
          </Form.Group>
        </Form>

        {/* 비밀번호 재설정 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            size="lg"
            disabled={!password || !confirmPassword || isButtonDisabled}
            onClick={handleConfirmClick}
          >
            확인
          </Button>
        </div>
        {/** pwd 변경 */}
        <Modal
          size="sm"
          show={modalShow}
          onHide={() => {
            modalClose();
          }}
          aria-labelledby="example-modal-sizes-title-sm"
          id="pwdnew-modal"
        >
          <Modal.Body>
            <h6 style={{ textAlign: 'center' }} className="faild-title">
              비밀번호 변경 완료
            </h6>
            <p className="body-text">
              비밀번호가 정상적으로 변경되었습니다. <br />새 비밀번호로
              로그인해주세요.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button className="modal-btn" onClick={modalClose}>
              로그인
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
});
