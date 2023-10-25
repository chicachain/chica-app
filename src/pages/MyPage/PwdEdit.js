/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';

// Custom Component
import { Header, CustomModal } from '@components';
import { images } from '@assets';
import { modifyPassword } from '../../api/member/userInfo';
import { handleError } from '../../common/utils/HandleError';

// ===================================================================
// [ 비밀번호 재설정 ]
// ===================================================================
export default React.memo(function PwdEdit(props) {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [changePassword, setChangePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showPW, setShowPW] = useState(false);
  const [showChangePW, setShowChangePW] = useState(false);
  const [showConfirmPW, setShowConfirmPW] = useState(false);

  const handlePasswordChange = event => {
    const newPassword = event.target.value;
    setChangePassword(newPassword);
    checkIfButtonShouldBeEnabled(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = event => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    checkIfButtonShouldBeEnabled(changePassword, newConfirmPassword);
  };

  const checkIfButtonShouldBeEnabled = (pwd, confirmPwd) => {
    if (pwd.length >= 6 && confirmPwd.length >= 6 && pwd === confirmPwd) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };
  const handleConfirmClick = async () => {
    if (!isButtonDisabled) {
      try {
        const params = {
          prevPw: password,
          newPw: changePassword,
        };
        const { data } = await modifyPassword(params);
      } catch (error) {
        handleError(error);
      }
      setModalShow(true); // 모달 표시 여부 업데이트
    }
  };
  const modalClose = () => {
    setModalShow(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mb_id');
    history.push({ pathname: `/` });
  };
  return (
    <main id="pwd-edit">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              close
            </i>
            <h6>비밀번호 변경</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-between">
        <Form className="scroll" style={{ marginTop: '1rem' }}>
          <p className="pw-text">
            보안을 위해 6자 이상의 문자와 숫자를 조합하여 비밀번호를
            만들어주세요.
          </p>
          <Form.Group className="pwd-control">
            <Form.Label className="label-t">현재 비밀번호</Form.Label>
            <Form.Control
              className="control-css"
              placeholder="비밀번호를 입력해주세요."
              type={showPW === false ? 'password' : 'text'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Image
              src={
                showPW === false ? images.icEyeOffBlack : images.icEyeOnBlack
              }
              onClick={() => setShowPW(!showPW)}
            />
          </Form.Group>
          <Form.Group className="pwd-control mt-3">
            <Form.Label className="label-t">새 비밀번호 확인</Form.Label>
            <Form.Control
              className="control-css"
              type={showChangePW === false ? 'password' : 'text'}
              placeholder="새 비밀번호를 입력해주세요."
              value={changePassword}
              onChange={handlePasswordChange}
            />
            <Image
              src={
                showChangePW === false
                  ? images.icEyeOffBlack
                  : images.icEyeOnBlack
              }
              onClick={() => setShowChangePW(!showChangePW)}
            />
          </Form.Group>
          <Form.Group className="pwd-control mt-3">
            <Form.Label className="label-t">새 비밀번호 다시입력</Form.Label>
            <Form.Control
              className="control-css"
              type={showConfirmPW === false ? 'password' : 'text'}
              placeholder="새 비밀번호를 다시 입력해주세요."
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <Image
              src={
                showConfirmPW === false
                  ? images.icEyeOffBlack
                  : images.icEyeOnBlack
              }
              onClick={() => setShowConfirmPW(!showConfirmPW)}
            />
          </Form.Group>
          <p className="pwd-reset">
            비밀번호를 잊은 경우에는 <span>비밀번호 찾기로 재설정</span> 하실 수
            있습니다.
          </p>
        </Form>

        {/* 비밀번호 재설정 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            size="lg"
            disabled={
              !password ||
              !changePassword ||
              !confirmPassword ||
              isButtonDisabled
            }
            onClick={handleConfirmClick}
          >
            비밀번호 변경
          </Button>
        </div>
        {/** pwd 변경 */}
        <Modal
          size="sm"
          show={modalShow}
          onHide={() => setModalShow(false)}
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
