/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, {useEffect, useRef, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';
import { images } from '@assets';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function KeywordProFile(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const state = history.location.state || {};
  const [modalShow, setModalShow] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const isNextButtonDisabled = nickname === '';

  const imageRef = useRef();

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = event => {
        setSelectedImage(event.target.result);
        setProfileImage(e.target.files[0]);
        e.target.value = null;
      };

      reader.readAsDataURL(e.target.files[0]);
    }
    modalClose();
  };

  const handleNicknameChange = event => {
    setNickname(event.target.value);
  };
  const clickmodal = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };
  const modalClose = () => {
    setModalShow(false);
  };
  const nextmenu = () => {
    history.push({
      pathname: RouterPath.keywordGender,
      state: {
        ...state,
        nickname,
        profileImage,
      },
    });
  };
  return (
    <main id="keyword">
      {/* 헤더 */}
      <Header />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form
          className="scroll"
          style={{ paddingTop: '16px' }}
          onSubmit={e => {
            e.preventDefault();
            return false;
          }}
        >
          <p className="keyword-title">
            회원님의 <br />
            <span>프로필</span>을 만들어보세요.
          </p>
          <div className="profile-imgbox">
            <Image
              src={selectedImage || images.ProfileImg}
              className="profile-img"
            />
            <Image
              src={images.icPlusBtn}
              className="plus-btn"
              onClick={clickmodal}
            />
          </div>
          <Form.Group className="mt-3">
            <Form.Label className="nickname">닉네임</Form.Label>
            <Form.Control
              placaeholder="이름, 별명, 비즈니스명 등으로 자신을 표현해주세요."
              type="text"
              onChange={handleNicknameChange}
              value={nickname || ''}
            />
          </Form.Group>
        </Form>
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            style={{ marginTop: '0' }}
            className="keyword-nextbtn"
            disabled={isNextButtonDisabled}
            onClick={nextmenu}
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
              <Button
                className="modal-btn"
                onClick={() => {
                  imageRef.current?.click();
                }}
              >
                앨범에서 선택
              </Button>
              <Form.Control
                ref={imageRef}
                className="d-none"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
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
