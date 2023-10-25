/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi, CustomSelect } from '@components';

export default React.memo(function MyFollower(props) {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('follower');

  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };
  return (
    <main id="my-follower">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons">arrow_back</i>
            <h6>USER-NAME</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="tab-menu">
          <Button
            onClick={() => handleTabClick('follower')}
            className={activeTab === 'follower' ? 'active' : ''}
          >
            팔로워 <span>123</span>
          </Button>
          <Button
            onClick={() => handleTabClick('following')}
            className={activeTab === 'following' ? 'active' : ''}
          >
            팔로잉 <span>123</span>
          </Button>
        </div>
        <div className="tab-content">
          {activeTab === 'follower' && <FollowerContent />}
          {activeTab === 'following' && <FollowingContent />}
        </div>
      </Container>
    </main>
  );
});
function FollowerContent() {
  return (
    <div className="follower-box">
      <div className="follower-search">
        <Image src={images.IcSerachBlack} />
        <Form.Control type="text" placeholder="검색" />
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <p className="user-name">user-name</p>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
          <Image src={images.IcTrashWatch} className="trash" />
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <p className="user-name">user-name</p>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
          <Image src={images.IcTrashWatch} className="trash" />
        </div>
      </div>
      {/** 추천 css */}
      <div className="push-line-box">
        <h6>회원님을 위한 추천</h6>
        <div className="follower-line">
          <div className="follower-flex-one">
            <Image src={images.ReviewProfile} className="profile" />
            <div>
              <p className="user-name">user-name</p>
              <p className="plce-name">플레이스명</p>
            </div>
          </div>
          <div className="follower-flex-two">
            <Button>팔로우</Button>
            <Image src={images.IcTrashWatch} className="trash" />
          </div>
        </div>
        <div className="follower-line">
          <div className="follower-flex-one">
            <Image src={images.ReviewProfile} className="profile" />
            <div>
              <p className="user-name">user-name</p>
              <p className="plce-name">플레이스명</p>
            </div>
          </div>
          <div className="follower-flex-two">
            <Button>팔로우</Button>
            <Image src={images.IcTrashWatch} className="trash" />
          </div>
        </div>
      </div>
    </div>
  );
}
function FollowingContent() {
  const [modalShow, setModalShow] = useState(false);
  const [Standard, setStandard] = useState({
    value: '기본',
    label: '기본',
  });
  const handleStandardChange = e => {
    setStandard({
      value: e.target.value,
      label: e.target.value,
    });
  };
  const clickmodal = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };
  const modalClose = () => {
    setModalShow(false);
  };
  return (
    <>
      <div className="follower-box">
        <div className="follower-search following">
          <Image src={images.IcSerachBlack} />
          <Form.Control type="text" placeholder="검색" />
          <div className="select-position">
            <CustomSelect
              options={options}
              selectedValue={Standard}
              onSelect={handleStandardChange}
              className="select-standard"
              placeholder="정렬기준"
            />
            <p className="standard-text">정렬기준 :</p>
          </div>
        </div>
        <div className="follower-line">
          <div className="follower-flex-one">
            <Image src={images.ReviewProfile} className="profile" />
            <p className="user-name">user-name</p>
          </div>
          <div className="follower-flex-two">
            <Button variant="outline-primary">팔로잉</Button>
            <i className="material-icons" onClick={clickmodal}>
              more_horiz
            </i>
          </div>
        </div>
        <div className="follower-line">
          <div className="follower-flex-one">
            <Image src={images.ReviewProfile} className="profile" />
            <p className="user-name">user-name</p>
          </div>
          <div className="follower-flex-two">
            <Button variant="outline-primary">팔로잉</Button>
            <i className="material-icons">more_horiz</i>
          </div>
        </div>
        {/** 추천 css */}
        <div className="push-line-box">
          <h6>회원님을 위한 추천</h6>
          <div className="follower-line">
            <div className="follower-flex-one">
              <Image src={images.ReviewProfile} className="profile" />
              <div>
                <p className="user-name">user-name</p>
                <p className="plce-name">플레이스명</p>
              </div>
            </div>
            <div className="follower-flex-two">
              <Button>팔로우</Button>
              <Image src={images.IcTrashWatch} className="trash" />
            </div>
          </div>
          <div className="follower-line">
            <div className="follower-flex-one">
              <Image src={images.ReviewProfile} className="profile" />
              <div>
                <p className="user-name">user-name</p>
                <p className="plce-name">플레이스명</p>
              </div>
            </div>
            <div className="follower-flex-two">
              <Button>팔로우</Button>
              <Image src={images.IcTrashWatch} className="trash" />
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="user-modal"
      >
        <Modal.Body>
          <div className="modal-body-profile">
            <Image src={images.ReviewProfile} />
            <p>user-name</p>
          </div>
          <div className="modal-body-gridline">
            <Button className="modal-btn">숨기기</Button>
          </div>
          <div className="modal-body-gridline">
            <Button className="modal-btn" onClick={modalClose}>
              취소
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}
const options = [
  { value: '기본', label: '기본' },
  { value: '친구', label: '친구' },
  // 다른 옵션들도 추가할 수 있음
];
