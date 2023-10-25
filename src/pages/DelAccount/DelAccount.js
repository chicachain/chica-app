/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import { Container, Button, Image, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi } from '@components';
import { removeAccount } from '../../api/member/userInfo';
import { handleError } from '../../common/utils/HandleError';

export default React.memo(function DelAccount(props) {
  const [modalShow, setModalShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const history = useHistory();
  const modalOpen = () => {
    setModalShow(true);
  };
  const remove = async () => {
    try {
      await removeAccount();
    } catch (error) {
      handleError(error);
    }
    setTimeout(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('mb_id');
      history.push({ pathname: `/` });
    }, 1000);
  };

  return (
    <main id="del-account">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <h6>탈퇴하기</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="wr-body">
          <p className="del-text">
            탈퇴시 , CHICA 플랫폼에서 예약한 내역, 관심 정보 , 미사용 쿠폰 등이
            모두 삭제되며 이후 복구가 불가능합니다.
          </p>
          <p className="del-text">
            작성된 리뷰는 삭제되니 않으며, 원치 않을 경우에는 작성한 리뷰를 모두
            삭제 후에 탈퇴해 주세요
          </p>
          <p className="del-text">
            서비스 탈퇴 후 ,결제 정보는 전자상거래 소비스 보호 법령에 의거 5년간
            보관됩니다.
          </p>
          <div className="checked-box ">
            <Form.Check
              type="checkbox"
              id="agress3-checkbox"
              label="위 사실을 확인하였습니다."
              onChange={() => setIsChecked(!isChecked)}
            />
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom auth-btnarea">
        <Button
          size="lg"
          onClick={() => {
            if (window.confirm('탈퇴하시겠습니까?')) {
              modalOpen();
              remove();
            }
          }}
          disabled={isChecked === false}
          style={{ opacity: 1 }}
        >
          서비스 탈퇴하기
        </Button>
      </div>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="del-account-modal"
        backdropClassName="del-account-back-drop"
      >
        <Modal.Body>
          <Image src={images.IcInfo} />
          <p className="body-text">회원탈퇴가 완료되었습니다.</p>
        </Modal.Body>
      </Modal>
    </main>
  );
});
